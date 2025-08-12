'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { ROLES, ORGANIZATIONS, PERMISSIONS, PermissionManager, AuditLogger, Role, Organization, Permission } from '../lib/permissions';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  organizationId: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdDate: Date;
  permissions?: string[];
}

interface RoleManagementProps {
  currentUser?: User;
}

export default function RoleManagement({ currentUser }: RoleManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    generateMockUsers();
  }, []);

  const generateMockUsers = () => {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        email: 'john.smith@va.gov',
        firstName: 'John',
        lastName: 'Smith',
        roleId: 'rating-specialist',
        organizationId: 'ro-atlanta',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdDate: new Date('2024-01-15')
      },
      {
        id: 'user-2',
        email: 'sarah.johnson@va.gov',
        firstName: 'Sarah',
        lastName: 'Johnson',
        roleId: 'supervisor',
        organizationId: 'ro-atlanta',
        status: 'active',
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
        createdDate: new Date('2023-11-08')
      },
      {
        id: 'user-3',
        email: 'mike.davis@va.gov',
        firstName: 'Mike',
        lastName: 'Davis',
        roleId: 'vsr',
        organizationId: 'ro-denver',
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdDate: new Date('2024-03-22')
      },
      {
        id: 'user-4',
        email: 'lisa.brown@va.gov',
        firstName: 'Lisa',
        lastName: 'Brown',
        roleId: 'administrator',
        organizationId: 'hq-washington',
        status: 'active',
        lastLogin: new Date(Date.now() - 30 * 60 * 1000),
        createdDate: new Date('2023-05-12')
      },
      {
        id: 'user-5',
        email: 'robert.wilson@qic.com',
        firstName: 'Robert',
        lastName: 'Wilson',
        roleId: 'contract-examiner',
        organizationId: 'contract-qic',
        status: 'inactive',
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdDate: new Date('2024-02-03')
      }
    ];

    setUsers(mockUsers);
  };

  const filteredUsers = users.filter(user => {
    const matchesStatus = filter === 'all' || user.status === filter;
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === 'all' || user.organizationId === selectedOrg;
    
    return matchesStatus && matchesSearch && matchesOrg;
  });

  const getUserRole = (roleId: string): Role => {
    return ROLES.find(r => r.id === roleId) || ROLES[0];
  };

  const getUserOrganization = (orgId: string): Organization => {
    return ORGANIZATIONS.find(o => o.id === orgId) || ORGANIZATIONS[0];
  };

  const canManageUser = (targetUser: User): boolean => {
    if (!user?.role) return false;
    return PermissionManager.canManageUser(user.role, targetUser.roleId);
  };

  const handleRoleChange = (userId: string, newRoleId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, roleId: newRoleId }
        : u
    ));

    // Log the change
    AuditLogger.log({
      userId: user?.userId || 'system',
      userName: `${user?.firstName} ${user?.lastName}` || 'System',
      action: 'role_assigned',
      target: userId,
      details: {
        newRole: newRoleId,
        previousRole: users.find(u => u.id === userId)?.roleId
      }
    });
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: newStatus }
        : u
    ));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'inactive': 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      'suspended': 'bg-red-500/10 text-red-400 border-red-500/30'
    };
    return colors[status] || colors.inactive;
  };

  const getRoleColor = (roleId: string) => {
    const role = getUserRole(roleId);
    const colors = {
      1: 'bg-blue-500/10 text-blue-400',
      2: 'bg-green-500/10 text-green-400',
      3: 'bg-yellow-500/10 text-yellow-400',
      4: 'bg-orange-500/10 text-orange-400',
      5: 'bg-red-500/10 text-red-400',
      6: 'bg-purple-500/10 text-purple-400',
      7: 'bg-pink-500/10 text-pink-400',
      8: 'bg-indigo-500/10 text-indigo-400'
    };
    return colors[role.level] || colors[3];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg">
      {/* Header */}
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">User & Role Management</h2>
              <p className="text-sm text-slate-400">Manage user accounts, roles, and permissions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRoleEditor(true)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
            >
              Manage Roles
            </button>
            <button
              onClick={() => setShowCreateUser(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
            >
              Add User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Search Users</label>
            <input
              type="text"
              placeholder="Name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Organization</label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Organizations</option>
              {ORGANIZATIONS.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-slate-400">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const role = getUserRole(user.roleId);
            const organization = getUserOrganization(user.organizationId);
            
            return (
              <div
                key={user.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-100">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-slate-400">{user.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 text-xs rounded border ${getRoleColor(user.roleId)}`}>
                          {role.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {organization.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Last login: {formatTimeAgo(user.lastLogin)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {canManageUser(user) && (
                        <>
                          <select
                            value={user.roleId}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                          >
                            {ROLES
                              .filter(r => r.organizationTypes.includes(organization.type))
                              .map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                          </select>
                          
                          <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </>
                      )}
                      
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* User permissions preview */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Key Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 5).map(permission => (
                          <span key={permission.id} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            {permission.name}
                          </span>
                        ))}
                        {role.permissions.length > 5 && (
                          <span className="text-xs text-slate-500">
                            +{role.permissions.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-slate-500">
                      <p>Account created: {user.createdDate.toLocaleDateString()}</p>
                      <p>Level {role.level} • {role.canDelegate ? 'Can delegate' : 'No delegation'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-2">No users found</p>
              <p className="text-sm text-slate-500">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}