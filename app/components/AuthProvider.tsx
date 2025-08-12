'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  organizationId: string;
  role: string;
  roleId: string;
  loginTime: string;
  lastLoginTime?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
  preferences?: {
    theme: 'dark' | 'light';
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('vbms-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('vbms-user');
      }
    }
  }, []);

  const login = (userData: User) => {
    // Enhance user data with additional fields
    const enhancedUser = {
      ...userData,
      userId: userData.id || userData.userId || `user_${Math.random().toString(36).substr(2, 9)}`,
      status: userData.status || 'active',
      lastLoginTime: userData.loginTime,
      loginTime: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        notifications: true,
        emailUpdates: false,
        language: 'en',
        ...userData.preferences
      }
    };
    
    setUser(enhancedUser);
    localStorage.setItem('vbms-user', JSON.stringify(enhancedUser));
    
    // Log the login event
    console.log('User logged in:', enhancedUser.email, enhancedUser.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vbms-user');
    localStorage.removeItem('vbms-current-veteran');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('vbms-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};