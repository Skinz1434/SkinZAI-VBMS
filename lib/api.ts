/**
 * API Service for connecting to NOVA QBit Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

// Storage keys
const TOKEN_KEY = 'nova_access_token';
const USER_KEY = 'nova_user';

export interface User {
  user_id: string;
  username: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
}

export interface ChatMessage {
  content: string;
  user_id?: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  type: string;
  content: string;
  citations?: string[];
  suggestions?: string[];
  action?: {
    type: string;
    path?: string;
  };
  options?: string[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  data?: Record<string, any>;
}

class ApiService {
  private token: string | null = null;
  private user: User | null = null;
  private ws: WebSocket | null = null;
  private wsReconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private wsCallbacks: Map<string, (data: any) => void> = new Map();

  constructor() {
    // Load token and user from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch {}
      }
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user
    this.token = data.access_token;
    this.user = {
      user_id: data.user_id,
      username: data.username,
    };

    localStorage.setItem(TOKEN_KEY, this.token);
    localStorage.setItem(USER_KEY, JSON.stringify(this.user));

    // Connect WebSocket
    this.connectWebSocket();

    return data;
  }

  async logout(): Promise<void> {
    this.token = null;
    this.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify?token=${this.token}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Chat
  async sendChatMessage(message: string, context?: Record<string, any>): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        user_id: this.user?.user_id || 'anonymous',
        content: message,
        context: context || {},
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  // WebSocket
  connectWebSocket(sessionId?: string): void {
    if (!this.user) return;

    const wsSessionId = sessionId || `session_${Date.now()}`;
    const wsUrl = `${WS_BASE_URL}/api/chat/ws/${wsSessionId}${this.token ? `?token=${this.token}` : ''}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.wsReconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        if (data.type === 'notification') {
          this.handleNotification(data.notification);
        } else {
          // Notify all registered callbacks
          this.wsCallbacks.forEach(callback => callback(data));
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      
      // Attempt reconnection
      if (this.wsReconnectAttempts < this.maxReconnectAttempts) {
        this.wsReconnectAttempts++;
        setTimeout(() => {
          console.log(`Attempting WebSocket reconnection ${this.wsReconnectAttempts}/${this.maxReconnectAttempts}`);
          this.connectWebSocket(wsSessionId);
        }, 1000 * Math.pow(2, this.wsReconnectAttempts));
      }
    };
  }

  sendWebSocketMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onWebSocketMessage(callback: (data: any) => void): () => void {
    const id = Math.random().toString(36);
    this.wsCallbacks.set(id, callback);
    
    // Return unsubscribe function
    return () => {
      this.wsCallbacks.delete(id);
    };
  }

  // Notifications
  async getNotifications(status?: 'read' | 'unread'): Promise<{
    notifications: Notification[];
    total: number;
    unread_count: number;
  }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/api/notifications/${this.user?.user_id || 'anonymous'}?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  }

  async createNotification(notification: {
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        ...notification,
        user_id: this.user?.user_id || 'anonymous',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return response.json();
  }

  private handleNotification(notification: Notification): void {
    // Emit custom event for notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nova-notification', {
        detail: notification,
      }));
    }
  }

  // Knowledge Base
  async searchKnowledge(query: string): Promise<{
    query: string;
    results: Array<{
      source: string;
      section: string;
      title: string;
      content: string;
    }>;
    count: number;
  }> {
    const params = new URLSearchParams({ query });
    const response = await fetch(`${API_BASE_URL}/api/knowledge/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search knowledge base');
    }

    return response.json();
  }

  // Navigation
  async getNavigationAssist(current: string, destination: string): Promise<{
    from: string;
    to: string;
    instructions: string;
    path?: string;
    available_routes?: Record<string, string>;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/navigation/assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        current_page: current,
        destination: destination,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get navigation assistance');
    }

    return response.json();
  }

  // Agent Tasks
  async submitAgentTask(taskType: string, data: Record<string, any>): Promise<{
    agent: string;
    role: string;
    task_type: string;
    status: string;
    result: string;
    timestamp: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/agents/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        type: taskType,
        data: data,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit agent task');
    }

    return response.json();
  }

  // Health Check
  async healthCheck(): Promise<{
    status: string;
    service: string;
    version: string;
    timestamp: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }

    return response.json();
  }

  // Getters
  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Export singleton instance
export const api = new ApiService();

// Export types
export type { ApiService };