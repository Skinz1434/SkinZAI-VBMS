'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { massiveMockDatabase } from '../lib/massiveMockData';

export interface Notification {
  id: string;
  type: 'claim_update' | 'exam_scheduled' | 'decision_ready' | 'system_alert' | 'message' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  veteranId?: string;
  claimId?: string;
  category: 'Claims' | 'Exams' | 'System' | 'Personal' | 'AI Analysis';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'claims'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      generateNotifications();
      
      // Simulate real-time notifications
      intervalRef.current = setInterval(() => {
        if (Math.random() < 0.3) {
          addNewNotification();
        }
      }, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const generateNotifications = () => {
    const notificationTemplates = [
      {
        type: 'claim_update' as const,
        title: 'Claim Status Updated',
        category: 'Claims' as const,
        priority: 'medium' as const,
        messages: [
          'Your claim has moved to Evidence Gathering phase',
          'Additional evidence required for claim processing',
          'RUMEV1 analysis completed with 94% confidence',
          'Claim moved to Ready for Decision status'
        ]
      },
      {
        type: 'exam_scheduled' as const,
        title: 'C&P Exam Scheduled',
        category: 'Exams' as const,
        priority: 'high' as const,
        messages: [
          'C&P examination scheduled for next week',
          'Virtual exam appointment confirmed',
          'Exam eliminated by RUMEV1 AI analysis'
        ]
      },
      {
        type: 'decision_ready' as const,
        title: 'Decision Ready',
        category: 'Claims' as const,
        priority: 'high' as const,
        messages: [
          'Rating decision completed - 70% service connected',
          'Favorable decision rendered for PTSD claim',
          'Claim decision pending quality review'
        ]
      },
      {
        type: 'system_alert' as const,
        title: 'System Update',
        category: 'System' as const,
        priority: 'low' as const,
        messages: [
          'RUMEV1 system updated to v2.1.3',
          'New AI models deployed for enhanced accuracy',
          'Scheduled maintenance completed successfully'
        ]
      },
      {
        type: 'message' as const,
        title: 'New Message',
        category: 'Personal' as const,
        priority: 'medium' as const,
        messages: [
          'Message from Rating Specialist Johnson',
          'Quality review feedback available',
          'Supervisor has requested your attention'
        ]
      }
    ];

    const generatedNotifications: Notification[] = [];
    const randomClaims = massiveMockDatabase.claims.slice(0, 20);
    
    for (let i = 0; i < 25; i++) {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const claim = randomClaims[Math.floor(Math.random() * randomClaims.length)];
      
      generatedNotifications.push({
        id: `notif-${i + 1}`,
        type: template.type,
        title: template.title,
        message: template.messages[Math.floor(Math.random() * template.messages.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        read: Math.random() < 0.4,
        priority: template.priority,
        category: template.category,
        claimId: claim?.id,
        veteranId: claim?.veteranId,
        actionUrl: template.type === 'claim_update' ? `/claims/${claim?.id}` : undefined,
        actionText: template.type === 'claim_update' ? 'View Claim' : undefined
      });
    }

    setNotifications(generatedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    setIsLoading(false);
  };

  const addNewNotification = () => {
    const newNotifications = [
      {
        type: 'system_alert' as const,
        title: 'RUMEV1 Alert',
        message: 'New high-confidence rating prediction available',
        category: 'AI Analysis' as const,
        priority: 'medium' as const
      },
      {
        type: 'claim_update' as const,
        title: 'Claim Processing Update',
        message: 'Claim moved to development phase automatically',
        category: 'Claims' as const,
        priority: 'medium' as const
      }
    ];

    const template = newNotifications[Math.floor(Math.random() * newNotifications.length)];
    const newNotif: Notification = {
      id: `notif-new-${Date.now()}`,
      ...template,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.read;
      case 'high': return notif.priority === 'high' || notif.priority === 'urgent';
      case 'claims': return notif.category === 'Claims';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'high': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      'urgent': 'bg-red-500/10 text-red-400 border-red-500/30'
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'claim_update': '📋',
      'exam_scheduled': '🩺',
      'decision_ready': '⚖️',
      'system_alert': '🔔',
      'message': '💬',
      'reminder': '⏰'
    };
    return icons[type] || '📄';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🔔</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Notifications</h2>
                <p className="text-xs text-slate-400">
                  {unreadCount} unread of {notifications.length} total
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'high', label: 'High', count: notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length },
              { key: 'claims', label: 'Claims', count: notifications.filter(n => n.category === 'Claims').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {label} {count > 0 && `(${count})`}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
              disabled={unreadCount === 0}
            >
              Mark All Read
            </button>
            <div className="flex-1" />
            <span className="text-xs text-slate-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 mb-2">No notifications found</p>
              <p className="text-xs text-slate-500">Try adjusting your filter</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:border-slate-600 cursor-pointer ${
                    notification.read
                      ? 'bg-slate-800/50 border-slate-800'
                      : 'bg-slate-800 border-blue-500/30 shadow-sm'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-slate-300' : 'text-slate-100'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className={`text-xs mb-2 ${
                        notification.read ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-xs rounded border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          <span className="text-xs text-slate-500">
                            {notification.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {notification.timestamp.toLocaleDateString()}
                        </span>
                      </div>

                      {notification.actionUrl && (
                        <div className="mt-2">
                          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            {notification.actionText || 'View Details'} →
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}