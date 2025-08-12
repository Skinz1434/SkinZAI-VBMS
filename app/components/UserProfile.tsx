'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowQuickSettings(false);
      }
    };

    if (isOpen || showQuickSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, showQuickSettings]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-emerald-500',
      'inactive': 'bg-slate-500',
      'suspended': 'bg-red-500'
    };
    return colors[status] || colors.active;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Administrator': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Supervisor': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Rating Specialist': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'RVSR': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'VSR': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Data Analyst': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    };
    return colors[role] || colors['Rating Specialist'];
  };

  const quickActions = [
    { label: 'View Profile', href: '/settings', icon: '👤' },
    { label: 'Preferences', href: '/settings?tab=preferences', icon: '⚙️' },
    { label: 'Notifications', href: '/settings?tab=notifications', icon: '🔔' },
    { label: 'Privacy', href: '/settings?tab=privacy', icon: '🔒' }
  ];

  const recentActivity = [
    { action: 'Reviewed claim', item: 'CLM-2024-001', time: '5 min ago' },
    { action: 'Updated veteran record', item: 'John Smith', time: '12 min ago' },
    { action: 'Completed exam review', item: 'EX-2024-045', time: '1 hour ago' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 hover:bg-slate-800 rounded-lg transition-all duration-200 group"
      >
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status || 'active')} rounded-full border-2 border-slate-900`} />
        </div>
        
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-slate-200 group-hover:text-white">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-slate-500">{user.role}</p>
        </div>

        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status || 'active')} rounded-full border-2 border-slate-900`} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-slate-400">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{user.organization}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-2">
            <div className="text-xs text-slate-500 uppercase tracking-wide px-2 py-1 mb-1">Quick Actions</div>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="p-2 border-t border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wide px-2 py-1 mb-1">Recent Activity</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div key={index} className="px-3 py-2 text-xs hover:bg-slate-800 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">{activity.action}</span>
                    <span className="text-slate-500">{activity.time}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">{activity.item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Stats */}
          <div className="p-2 border-t border-slate-800">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2">
                <div className="text-lg font-semibold text-slate-200">47</div>
                <div className="text-xs text-slate-500">Claims Reviewed</div>
              </div>
              <div className="p-2">
                <div className="text-lg font-semibold text-emerald-400">98.4%</div>
                <div className="text-xs text-slate-500">Accuracy</div>
              </div>
              <div className="p-2">
                <div className="text-lg font-semibold text-blue-400">15</div>
                <div className="text-xs text-slate-500">Days Active</div>
              </div>
            </div>
          </div>

          {/* Settings & Logout */}
          <div className="p-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowQuickSettings(!showQuickSettings);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Quick Settings</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Login Time */}
          <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-500 border-t border-slate-800">
            Logged in: {user.loginTime ? new Date(user.loginTime).toLocaleString() : 'Unknown'}
          </div>
        </div>
      )}

      {/* Quick Settings Panel */}
      {showQuickSettings && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 animate-in slide-in-from-right-2 duration-200">
          <div className="p-4">
            <h3 className="font-medium text-slate-100 mb-4">Quick Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Auto-refresh</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link
                href="/settings"
                onClick={() => setShowQuickSettings(false)}
                className="block w-full text-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                All Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}