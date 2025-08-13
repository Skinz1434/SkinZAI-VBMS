"""
NOVA QBit Backend - Simplified version without external dependencies
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import Dict, Any, List, Optional
import json
import uuid
import asyncio
from datetime import datetime, timedelta
import jwt
import hashlib
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# In-memory storage (replaces Redis/PostgreSQL)
class InMemoryStorage:
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.notifications = {}
        self.chat_history = {}
        self.knowledge_base = self._init_knowledge_base()
    
    def _init_knowledge_base(self):
        """Initialize knowledge base with M21/CFR content"""
        return {
            "m21_1": {
                "part_iii_iv": {
                    "title": "M21-1 Part III - General Claims Process",
                    "sections": [
                        {
                            "id": "iii.i.1",
                            "title": "Service Connection",
                            "content": "Service connection requires: (1) Current disability, (2) In-service event/injury/illness, (3) Medical nexus linking the current disability to service."
                        },
                        {
                            "id": "iii.iv.4",
                            "title": "Disability Evaluations",
                            "content": "Disability evaluations are based on the average impairment of earning capacity. Ratings are determined by applying the criteria in the rating schedule."
                        }
                    ]
                }
            },
            "cfr_38": {
                "part_3": {
                    "title": "38 CFR Part 3 - Adjudication",
                    "sections": [
                        {
                            "id": "3.303",
                            "title": "Principles of Service Connection",
                            "content": "Service connection may be granted for disability resulting from disease or injury incurred in or aggravated by active military service."
                        },
                        {
                            "id": "3.307",
                            "title": "Presumptive Service Connection",
                            "content": "Certain chronic diseases are presumed to be service-connected if manifesting to a compensable degree within specified time periods."
                        }
                    ]
                }
            }
        }

storage = InMemoryStorage()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_sessions: Dict[str, str] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, session_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        self.user_sessions[session_id] = user_id
        logger.info(f"WebSocket connected", user_id=user_id, session_id=session_id)
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"WebSocket disconnected", user_id=user_id)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            message_text = json.dumps(message)
            for connection in self.active_connections[user_id]:
                await connection.send_text(message_text)

manager = ConnectionManager()

# Simple JWT authentication
SECRET_KEY = "nova-qbit-secret-key-for-demo-only-change-in-production"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

# QBit Chatbot service
class QBitService:
    def __init__(self, knowledge_base):
        self.knowledge_base = knowledge_base
        self.context_memory = {}
    
    async def process_message(self, user_id: str, message: str, context: dict = None):
        """Process user message and generate response"""
        
        # Simple intent detection
        intent = self._detect_intent(message.lower())
        
        # Generate response based on intent
        if intent == "service_connection":
            response = await self._handle_service_connection(message)
        elif intent == "disability_rating":
            response = await self._handle_disability_rating(message)
        elif intent == "navigation":
            response = await self._handle_navigation(message)
        elif intent == "notification":
            response = await self._handle_notification(message)
        else:
            response = await self._handle_general(message)
        
        # Store context for future reference
        if user_id not in self.context_memory:
            self.context_memory[user_id] = []
        self.context_memory[user_id].append({
            "message": message,
            "response": response,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return response
    
    def _detect_intent(self, message):
        """Simple keyword-based intent detection"""
        if any(word in message for word in ["service connection", "connected", "nexus"]):
            return "service_connection"
        elif any(word in message for word in ["rating", "percentage", "evaluation"]):
            return "disability_rating"
        elif any(word in message for word in ["navigate", "go to", "show me", "where"]):
            return "navigation"
        elif any(word in message for word in ["notification", "alert", "update"]):
            return "notification"
        return "general"
    
    async def _handle_service_connection(self, message):
        """Handle service connection queries"""
        m21_content = self.knowledge_base["m21_1"]["part_iii_iv"]["sections"][0]["content"]
        cfr_content = self.knowledge_base["cfr_38"]["part_3"]["sections"][0]["content"]
        
        return {
            "type": "knowledge_response",
            "content": f"Based on M21-1 and 38 CFR guidelines:\n\n{m21_content}\n\nAdditionally, per 38 CFR 3.303: {cfr_content}",
            "citations": ["M21-1 Part III.i.1", "38 CFR 3.303"],
            "suggestions": [
                "Review medical evidence requirements",
                "Check presumptive conditions list",
                "Schedule C&P examination if needed"
            ]
        }
    
    async def _handle_disability_rating(self, message):
        """Handle disability rating queries"""
        m21_content = self.knowledge_base["m21_1"]["part_iii_iv"]["sections"][1]["content"]
        
        return {
            "type": "knowledge_response",
            "content": f"Regarding disability ratings:\n\n{m21_content}\n\nRatings range from 0% to 100% in 10% increments.",
            "citations": ["M21-1 Part III.iv.4", "38 CFR Part 4"],
            "suggestions": [
                "Review rating criteria for your condition",
                "Consider filing for increase if condition worsened",
                "Check for secondary conditions"
            ]
        }
    
    async def _handle_navigation(self, message):
        """Handle navigation requests"""
        # Extract potential page/feature from message
        pages = {
            "dashboard": "/dashboard",
            "claims": "/claims",
            "appeals": "/appeals",
            "metrics": "/metrics",
            "quality": "/quality",
            "notifications": "/notifications",
            "profile": "/profile"
        }
        
        for page, path in pages.items():
            if page in message.lower():
                return {
                    "type": "navigation",
                    "content": f"I'll help you navigate to the {page} section.",
                    "action": {
                        "type": "navigate",
                        "path": path
                    },
                    "instructions": f"Click here to go to {page}, or use the navigation menu on the left."
                }
        
        return {
            "type": "navigation",
            "content": "I can help you navigate the NOVA platform. Which section would you like to visit?",
            "options": list(pages.keys())
        }
    
    async def _handle_notification(self, message):
        """Handle notification queries"""
        return {
            "type": "notification_info",
            "content": "I can help you manage your notifications. You can view all notifications in the notification center.",
            "actions": [
                {"label": "View Notifications", "action": "view_notifications"},
                {"label": "Notification Settings", "action": "notification_settings"}
            ]
        }
    
    async def _handle_general(self, message):
        """Handle general queries"""
        return {
            "type": "general_response",
            "content": "I'm QBit, your AI assistant for the NOVA platform. I can help you with:\n• Service connection claims\n• Disability ratings\n• Navigation assistance\n• M21-1 and 38 CFR guidance\n• Notification management\n\nHow can I assist you today?"
        }

# Agent Orchestrator
class AgentOrchestrator:
    def __init__(self):
        self.agents = {
            "claims_processor": {"role": "Process and review claims", "permissions": ["read_claims", "write_decisions"]},
            "medical_reviewer": {"role": "Review medical evidence", "permissions": ["read_medical", "write_opinions"]},
            "quality_auditor": {"role": "Audit claim quality", "permissions": ["read_all", "write_audits"]},
            "document_analyzer": {"role": "Analyze documents", "permissions": ["read_documents", "write_analysis"]},
            "notification_manager": {"role": "Manage notifications", "permissions": ["read_notifications", "write_notifications"]},
            "leiden_analyzer": {"role": "Pattern analysis with Leiden clustering", "permissions": ["read_analytics", "write_patterns"]}
        }
    
    async def route_task(self, task_type: str, data: dict):
        """Route task to appropriate agent"""
        agent_mapping = {
            "claim_review": "claims_processor",
            "medical_review": "medical_reviewer",
            "quality_check": "quality_auditor",
            "document_analysis": "document_analyzer",
            "notification": "notification_manager",
            "pattern_analysis": "leiden_analyzer"
        }
        
        agent_name = agent_mapping.get(task_type, "claims_processor")
        agent = self.agents.get(agent_name)
        
        # Simulate agent processing
        result = {
            "agent": agent_name,
            "role": agent["role"],
            "task_type": task_type,
            "status": "completed",
            "result": f"Task processed by {agent_name}",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Agent task completed", agent=agent_name, task_type=task_type)
        return result

# Initialize services
qbit_service = QBitService(storage.knowledge_base)
orchestrator = AgentOrchestrator()

# Lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("NOVA QBit Backend starting up...")
    app.state.storage = storage
    app.state.qbit = qbit_service
    app.state.orchestrator = orchestrator
    yield
    # Shutdown
    logger.info("NOVA QBit Backend shutting down...")

# Create FastAPI app
app = FastAPI(
    title="NOVA QBit Backend",
    description="Secure AI-powered backend for NOVA platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "NOVA QBit Backend",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

# Authentication endpoints
@app.post("/api/auth/login")
async def login(credentials: dict):
    """Simple login endpoint"""
    username = credentials.get("username")
    password = credentials.get("password")
    
    # Simple demo authentication
    if username and password:
        user_id = hashlib.md5(username.encode()).hexdigest()[:8]
        token = create_access_token({"sub": username, "user_id": user_id})
        
        storage.users[user_id] = {
            "username": username,
            "role": "user",
            "created_at": datetime.utcnow().isoformat()
        }
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": user_id,
            "username": username
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/auth/verify")
async def verify(token: str):
    """Verify token"""
    payload = verify_token(token)
    if payload:
        return {"valid": True, "user_id": payload.get("user_id")}
    raise HTTPException(status_code=401, detail="Invalid token")

# Chat endpoints
@app.post("/api/chat/message")
async def send_message(message: dict):
    """Send message to QBit"""
    user_id = message.get("user_id", "anonymous")
    content = message.get("content", "")
    context = message.get("context", {})
    
    response = await qbit_service.process_message(user_id, content, context)
    
    # Store in chat history
    if user_id not in storage.chat_history:
        storage.chat_history[user_id] = []
    
    storage.chat_history[user_id].append({
        "id": str(uuid.uuid4()),
        "user_message": content,
        "bot_response": response,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return response

# WebSocket endpoint
@app.websocket("/api/chat/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str, token: str = None):
    """WebSocket endpoint for real-time chat"""
    
    # Verify token
    user_id = "anonymous"
    if token:
        payload = verify_token(token)
        if payload:
            user_id = payload.get("user_id", "anonymous")
    
    await manager.connect(websocket, user_id, session_id)
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Process with QBit
            response = await qbit_service.process_message(
                user_id,
                message.get("content", ""),
                message.get("context", {})
            )
            
            # Send response
            await manager.send_personal_message(json.dumps(response), websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"WebSocket disconnected", user_id=user_id, session_id=session_id)

# Notification endpoints
@app.post("/api/notifications")
async def create_notification(notification: dict):
    """Create notification"""
    user_id = notification.get("user_id", "anonymous")
    notif_id = str(uuid.uuid4())
    
    notif_data = {
        "id": notif_id,
        "user_id": user_id,
        "type": notification.get("type", "general"),
        "title": notification.get("title", "Notification"),
        "message": notification.get("message", ""),
        "status": "unread",
        "created_at": datetime.utcnow().isoformat()
    }
    
    if user_id not in storage.notifications:
        storage.notifications[user_id] = []
    
    storage.notifications[user_id].append(notif_data)
    
    # Send via WebSocket if connected
    await manager.broadcast_to_user(user_id, {
        "type": "notification",
        "notification": notif_data
    })
    
    return notif_data

@app.get("/api/notifications/{user_id}")
async def get_notifications(user_id: str):
    """Get user notifications"""
    notifications = storage.notifications.get(user_id, [])
    return {
        "notifications": notifications,
        "total": len(notifications),
        "unread": sum(1 for n in notifications if n["status"] == "unread")
    }

# Agent endpoints
@app.post("/api/agents/task")
async def submit_agent_task(task: dict):
    """Submit task to agent orchestrator"""
    result = await orchestrator.route_task(
        task.get("type", "general"),
        task.get("data", {})
    )
    return result

@app.get("/api/agents/status")
async def get_agents_status():
    """Get status of all agents"""
    return {
        "agents": orchestrator.agents,
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

# Knowledge base endpoints
@app.get("/api/knowledge/search")
async def search_knowledge(query: str):
    """Search knowledge base"""
    results = []
    query_lower = query.lower()
    
    # Search M21-1
    for part_key, part_data in storage.knowledge_base["m21_1"].items():
        for section in part_data.get("sections", []):
            if query_lower in section["content"].lower() or query_lower in section["title"].lower():
                results.append({
                    "source": "M21-1",
                    "section": section["id"],
                    "title": section["title"],
                    "content": section["content"]
                })
    
    # Search 38 CFR
    for part_key, part_data in storage.knowledge_base["cfr_38"].items():
        for section in part_data.get("sections", []):
            if query_lower in section["content"].lower() or query_lower in section["title"].lower():
                results.append({
                    "source": "38 CFR",
                    "section": section["id"],
                    "title": section["title"],
                    "content": section["content"]
                })
    
    return {
        "query": query,
        "results": results,
        "count": len(results)
    }

# Navigation endpoints
@app.post("/api/navigation/assist")
async def navigation_assist(request: dict):
    """Assist with navigation"""
    current_page = request.get("current_page", "/")
    destination = request.get("destination", "")
    
    # Simple navigation logic
    routes = {
        "dashboard": "/dashboard",
        "claims": "/claims",
        "appeals": "/appeals",
        "quality": "/quality",
        "metrics": "/metrics",
        "notifications": "/notifications",
        "profile": "/profile",
        "settings": "/settings"
    }
    
    if destination in routes:
        return {
            "from": current_page,
            "to": routes[destination],
            "instructions": f"Navigate to {destination} using the left sidebar or direct URL",
            "path": routes[destination]
        }
    
    return {
        "available_routes": routes,
        "current": current_page,
        "message": "Please specify a valid destination"
    }

# Stats endpoint
@app.get("/api/stats")
async def get_stats():
    """Get system statistics"""
    return {
        "users": len(storage.users),
        "active_connections": len(manager.active_connections),
        "total_notifications": sum(len(notifs) for notifs in storage.notifications.values()),
        "chat_sessions": len(storage.chat_history),
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)