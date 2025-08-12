'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import WelcomeModal from '../components/WelcomeModal';
import RoleManagement from '../components/RoleManagement';
import OrganizationManager from '../components/OrganizationManager';
import { useAuth } from '../components/AuthProvider';
import { PermissionManager, AuditLogger } from '../lib/permissions';

export default function AdminPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'users' | 'organizations' | 'permissions' | 'audit' | 'system'>('users');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    // Generate some sample audit logs
    const logs = [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        userId: 'user-admin',
        userName: 'System Administrator',
        action: 'role_assigned',
        target: 'user-123',
        details: { newRole: 'rating-specialist', previousRole: 'vsr' },
        ipAddress: '192.168.1.100'
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        userId: 'user-admin',
        userName: 'System Administrator',
        action: 'permission_granted',
        target: 'user-456',
        details: { permission: 'claims.approve', grantedBy: 'supervisor-role' },
        ipAddress: '192.168.1.101'
      },
      {
        id: 'audit-3',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        userId: 'user-supervisor',
        userName: 'Jane Supervisor',
        action: 'org_changed',
        target: 'user-789',
        details: { newOrg: 'ro-denver', previousOrg: 'ro-atlanta' },
        ipAddress: '10.0.1.50'
      }
    ];
    setAuditLogs(logs);
  };

  // Check permissions
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-slate-400 mb-6">Please sign in to access administration panel</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user?.role || !PermissionManager.hasAnyPermission(user.role, ['admin.users', 'admin.roles', 'admin.system'])) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Insufficient Permissions</h2>
          <p className="text-slate-400 mb-6">You don't have administrator privileges</p>
          <Link href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    const icons = {
      'role_assigned': '👤',
      'role_removed': '🚫',
      'permission_granted': '✅',
      'permission_revoked': '❌',
      'org_changed': '🏢'
    };
    return icons[action] || '📝';
  };

  const getActionColor = (action: string) => {
    const colors = {
      'role_assigned': 'text-blue-400',
      'role_removed': 'text-red-400',
      'permission_granted': 'text-emerald-400',
      'permission_revoked': 'text-red-400',
      'org_changed': 'text-yellow-400'
    };
    return colors[action] || 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
      <WelcomeModal
        pageName="admin"
        title="System Administration"
        description="Comprehensive administration panel for managing users, roles, permissions, and organizational settings with full audit trail."
        features={[
          "User and role management with hierarchical permissions",
          "Organization configuration and security settings",
          "Real-time audit logging and compliance monitoring",
          "System configuration and maintenance tools"
        ]}
        demoActions={[
          { label: 'View User Roles', action: () => setSelectedTab('users') },
          { label: 'Manage Organizations', action: () => setSelectedTab('organizations') },
          { label: 'Review Audit Logs', action: () => setSelectedTab('audit') }
        ]}
      />
      
      {/* Professional Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-slate-100">System Administration</h1>
                <p className="text-sm text-slate-500">VBMS Platform Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                Logged in as: {user?.firstName} {user?.lastName}
              </div>
              <div className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                ADMIN ACCESS
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg mb-8">
            <div className="flex border-b border-slate-800">
              {[
                { id: 'users', label: 'Users & Roles', icon: '👥' },
                { id: 'organizations', label: 'Organizations', icon: '🏢' },
                { id: 'permissions', label: 'Permissions', icon: '🔐' },
                { id: 'audit', label: 'Audit Logs', icon: '📋' },
                { id: 'system', label: 'System', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {selectedTab === 'users' && <RoleManagement />}
          
          {selectedTab === 'organizations' && <OrganizationManager />}
          
          {selectedTab === 'permissions' && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-100 mb-6">Permission Management</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['claims', 'veterans', 'exams', 'documents', 'reports', 'admin'].map(category => (
                  <div key={category} className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-100 mb-3 capitalize">{category} Permissions</h3>
                    <div className="space-y-2">
                      {['view', 'edit', 'create', 'delete', 'approve'].map(level => (
                        <div key={level} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300 capitalize">{level}</span>
                          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">
                            {category}.{level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedTab === 'audit' && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Audit Logs</h2>
                  <p className="text-sm text-slate-400">System activity and security events</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm">
                    Export Logs
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                    Filter Logs
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getActionIcon(log.action)}</span>
                        <div>
                          <h4 className={`font-medium ${getActionColor(log.action)}`}>
                            {log.action.replace('_', ' ').toUpperCase()}
                          </h4>
                          <p className="text-sm text-slate-400">
                            by {log.userName} • Target: {log.target}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">
                          {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-slate-500">IP: {log.ipAddress}</p>
                      </div>
                    </div>
                    
                    {log.details && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(log.details).map(([key, value]) => (
                            <span key={key} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedTab === 'system' && (
            <div className="space-y-6">
              {/* System Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">System Status</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-100 mb-3">RUMEV1 AI System</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Status</span>
                        <span className="text-emerald-400 text-sm">🟢 Operational</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Uptime</span>
                        <span className="text-slate-200 text-sm">99.97%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Version</span>
                        <span className="text-slate-200 text-sm">v2.1.3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-100 mb-3">Database</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Connection</span>
                        <span className="text-emerald-400 text-sm">🟢 Healthy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Storage</span>
                        <span className="text-slate-200 text-sm">847 GB / 2 TB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Backup</span>
                        <span className="text-emerald-400 text-sm">✅ Current</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-100 mb-3">Security</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">SSL/TLS</span>
                        <span className="text-emerald-400 text-sm">🔒 Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Firewall</span>
                        <span className="text-emerald-400 text-sm">🛡️ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Last Scan</span>
                        <span className="text-slate-200 text-sm">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* System Configuration */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">System Configuration</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-200">Maintenance Mode</p>
                      <p className="text-sm text-slate-400">Enable system maintenance mode</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-200">System Backup</p>
                      <p className="text-sm text-slate-400">Create full system backup</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                      Start Backup
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-200">Clear Cache</p>
                      <p className="text-sm text-slate-400">Clear system and application cache</p>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors text-sm">
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}