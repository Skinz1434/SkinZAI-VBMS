'use client';

import { useState, useEffect } from 'react';
import { ORGANIZATIONS, ROLES, Organization, Role } from '../lib/permissions';
import { useAuth } from './AuthProvider';

interface OrganizationStats {
  totalUsers: number;
  activeUsers: number;
  totalClaims: number;
  monthlyVolume: number;
  systemHealth: number;
  complianceScore: number;
}

export default function OrganizationManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [orgStats, setOrgStats] = useState<Record<string, OrganizationStats>>({});
  const [filter, setFilter] = useState<'all' | 'Regional Office' | 'Headquarters' | 'Contract Office'>('all');
  const { user } = useAuth();

  useEffect(() => {
    setOrganizations(ORGANIZATIONS);
    generateOrgStats();
  }, []);

  const generateOrgStats = () => {
    const stats: Record<string, OrganizationStats> = {};
    
    ORGANIZATIONS.forEach(org => {
      stats[org.id] = {
        totalUsers: org.activeUsers + Math.floor(Math.random() * 50),
        activeUsers: org.activeUsers,
        totalClaims: org.totalClaims,
        monthlyVolume: org.monthlyVolume,
        systemHealth: 85 + Math.floor(Math.random() * 15),
        complianceScore: 90 + Math.floor(Math.random() * 10)
      };
    });
    
    setOrgStats(stats);
  };

  const filteredOrgs = organizations.filter(org => 
    filter === 'all' || org.type === filter
  );

  const getTypeColor = (type: string) => {
    const colors = {
      'Regional Office': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Headquarters': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'Contract Office': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Medical Center': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'Field Office': 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    };
    return colors[type] || colors['Regional Office'];
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-emerald-400';
    if (health >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const updateOrgSettings = (orgId: string, settings: Partial<Organization['settings']>) => {
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? { ...org, settings: { ...org.settings, ...settings } }
        : org
    ));
  };

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🏢</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Organization Management</h2>
              <p className="text-sm text-slate-400">Configure organizational settings and monitor performance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Regional Office">Regional Offices</option>
              <option value="Headquarters">Headquarters</option>
              <option value="Contract Office">Contract Offices</option>
            </select>
            
            <button
              onClick={() => setShowCreateOrg(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
            >
              Add Organization
            </button>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            const stats = orgStats[org.id] || {
              totalUsers: 0,
              activeUsers: 0,
              totalClaims: 0,
              monthlyVolume: 0,
              systemHealth: 85,
              complianceScore: 95
            };
            
            return (
              <div
                key={org.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all cursor-pointer"
                onClick={() => setSelectedOrg(org)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">{org.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded border ${getTypeColor(org.type)}`}>
                      {org.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{org.region}</p>
                    <p className="text-xs text-slate-400">{org.state}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Active Users</span>
                    <span className="text-sm font-medium text-slate-200">
                      {stats.activeUsers} / {org.settings.maxConcurrentUsers}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Monthly Volume</span>
                    <span className="text-sm font-medium text-blue-400">
                      {org.monthlyVolume?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">System Health</span>
                    <span className={`text-sm font-medium ${getHealthColor(stats.systemHealth)}`}>
                      {stats.systemHealth}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Compliance</span>
                    <span className="text-sm font-medium text-emerald-400">
                      {stats.complianceScore}%
                    </span>
                  </div>
                </div>

                {/* Security Status */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <span className={org.settings.requireMFA ? 'text-emerald-400' : 'text-red-400'}>
                        {org.settings.requireMFA ? '🔒' : '🔓'}
                      </span>
                      <span className="text-slate-500">MFA</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className={org.settings.allowExternalAccess ? 'text-yellow-400' : 'text-emerald-400'}>
                        {org.settings.allowExternalAccess ? '🌐' : '🏠'}
                      </span>
                      <span className="text-slate-500">
                        {org.settings.allowExternalAccess ? 'External' : 'Internal'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-400">📅</span>
                      <span className="text-slate-500">
                        {Math.floor(org.settings.dataRetentionDays / 365)}yr retention
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organization Details Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={() => setSelectedOrg(null)} />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white">🏢</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">{selectedOrg.name}</h2>
                    <p className="text-sm text-slate-400">{selectedOrg.type} • {selectedOrg.region}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Organization Stats */}
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-slate-100 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Total Claims</p>
                    <p className="text-xl font-semibold text-slate-100">
                      {selectedOrg.totalClaims?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Monthly Processing</p>
                    <p className="text-xl font-semibold text-blue-400">
                      {selectedOrg.monthlyVolume?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Active Users</p>
                    <p className="text-xl font-semibold text-emerald-400">
                      {selectedOrg.activeUsers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Capacity</p>
                    <p className="text-xl font-semibold text-slate-100">
                      {selectedOrg.settings.maxConcurrentUsers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-slate-100 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Multi-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Require MFA for all users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOrg.settings.requireMFA}
                        onChange={(e) => updateOrgSettings(selectedOrg.id, { requireMFA: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">External Access</p>
                      <p className="text-xs text-slate-500">Allow access from external networks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOrg.settings.allowExternalAccess}
                        onChange={(e) => updateOrgSettings(selectedOrg.id, { allowExternalAccess: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Data Retention (days)
                    </label>
                    <input
                      type="number"
                      value={selectedOrg.settings.dataRetentionDays}
                      onChange={(e) => updateOrgSettings(selectedOrg.id, { dataRetentionDays: parseInt(e.target.value) })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Max Concurrent Users
                    </label>
                    <input
                      type="number"
                      value={selectedOrg.settings.maxConcurrentUsers}
                      onChange={(e) => updateOrgSettings(selectedOrg.id, { maxConcurrentUsers: parseInt(e.target.value) })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Available Roles */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-medium text-slate-100 mb-4">Available Roles</h3>
                <div className="space-y-2">
                  {ROLES
                    .filter(role => role.organizationTypes.includes(selectedOrg.type))
                    .map(role => (
                      <div key={role.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-200">{role.name}</p>
                          <p className="text-xs text-slate-400">{role.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                            Level {role.level}
                          </span>
                          <span className="text-xs text-slate-500">
                            {role.permissions.length} permissions
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}