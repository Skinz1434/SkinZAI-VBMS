'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization: string;
  department: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdDate: string;
  phone?: string;
  supervisor?: string;
  certifications: string[];
  systemAccess: {
    vbms: boolean;
    bgs: boolean;
    stakeholder: boolean;
    caseflow: boolean;
  };
  activityMetrics: {
    claimsProcessed: number;
    accuracy: number;
    avgTimePerClaim: number;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  userCount: number;
  systemAccess: string[];
  canDelegate: boolean;
  requiresCertification: boolean;
}

export default function UsersPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Comprehensive user data
  const users: User[] = [
    {
      id: 'U001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@va.gov',
      role: 'Senior Claims Processor',
      organization: 'VA Regional Office - Houston',
      department: 'Claims Processing',
      status: 'active',
      lastLogin: '2024-01-15T09:30:00Z',
      permissions: ['view_claims', 'edit_claims', 'approve_claims', 'view_veterans', 'generate_reports'],
      createdDate: '2022-03-15',
      phone: '(713) 555-0123',
      supervisor: 'Michael Rodriguez',
      certifications: ['Claims Processing Certification', 'VBMS Advanced'],
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: false
      },
      activityMetrics: {
        claimsProcessed: 1247,
        accuracy: 94.7,
        avgTimePerClaim: 12.3
      }
    },
    {
      id: 'U002',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      email: 'michael.rodriguez@va.gov',
      role: 'Claims Supervisor',
      organization: 'VA Regional Office - Houston',
      department: 'Claims Processing',
      status: 'active',
      lastLogin: '2024-01-15T14:45:00Z',
      permissions: ['view_claims', 'edit_claims', 'approve_claims', 'assign_claims', 'view_veterans', 'manage_users', 'generate_reports', 'quality_review'],
      createdDate: '2020-01-08',
      phone: '(713) 555-0124',
      supervisor: 'Jennifer Chen',
      certifications: ['Leadership Certification', 'Claims Processing Certification', 'Quality Assurance'],
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: true
      },
      activityMetrics: {
        claimsProcessed: 2891,
        accuracy: 96.2,
        avgTimePerClaim: 15.7
      }
    },
    {
      id: 'U003',
      firstName: 'Jennifer',
      lastName: 'Chen',
      email: 'jennifer.chen@va.gov',
      role: 'Regional Director',
      organization: 'VA Regional Office - Houston',
      department: 'Administration',
      status: 'active',
      lastLogin: '2024-01-15T16:20:00Z',
      permissions: ['view_claims', 'edit_claims', 'approve_claims', 'assign_claims', 'view_veterans', 'manage_users', 'manage_organization', 'generate_reports', 'quality_review', 'system_admin'],
      createdDate: '2018-06-20',
      phone: '(713) 555-0125',
      certifications: ['Executive Leadership', 'Strategic Management', 'VBA Operations'],
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: true
      },
      activityMetrics: {
        claimsProcessed: 156,
        accuracy: 98.1,
        avgTimePerClaim: 8.9
      }
    }
  ];

  // Generate additional users programmatically
  const roles = [
    'Claims Processor', 'Senior Claims Processor', 'Claims Supervisor', 
    'Quality Reviewer', 'Medical Examiner', 'Appeals Coordinator',
    'System Administrator', 'Data Analyst', 'Case Manager', 'Training Coordinator'
  ];
  
  const organizations = [
    'VA Regional Office - Houston', 'VA Regional Office - Atlanta',
    'VA Medical Center - Houston', 'VA Medical Center - Phoenix',
    'VA Central Office - Washington DC'
  ];
  
  const departments = [
    'Claims Processing', 'Medical Services', 'Appeals', 'Quality Assurance',
    'Information Technology', 'Administration', 'Training', 'Data Analytics'
  ];

  const firstNames = [
    'David', 'Lisa', 'James', 'Maria', 'Robert', 'Amanda', 'Thomas', 'Emily',
    'Christopher', 'Michelle', 'Daniel', 'Jessica', 'Paul', 'Ashley', 'Mark',
    'Rachel', 'Steven', 'Laura', 'Kevin', 'Stephanie', 'Brian', 'Nicole'
  ];
  
  const lastNames = [
    'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore',
    'Taylor', 'Anderson', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
    'Garcia', 'Martinez', 'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall'
  ];

  // Add more users
  for (let i = 4; i <= 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const org = organizations[Math.floor(Math.random() * organizations.length)];
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const status: User['status'] = ['active', 'inactive', 'pending', 'suspended'][Math.floor(Math.random() * 4)] as User['status'];
    
    const basePermissions = ['view_claims', 'view_veterans'];
    const rolePermissions: { [key: string]: string[] } = {
      'Claims Processor': ['edit_claims'],
      'Senior Claims Processor': ['edit_claims', 'approve_claims'],
      'Claims Supervisor': ['edit_claims', 'approve_claims', 'assign_claims', 'manage_users'],
      'Quality Reviewer': ['quality_review'],
      'System Administrator': ['system_admin', 'manage_users', 'manage_organization']
    };
    
    const permissions = [...basePermissions, ...(rolePermissions[role] || [])];
    
    users.push({
      id: `U${String(i).padStart(3, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@va.gov`,
      role,
      organization: org,
      department: dept,
      status,
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      permissions,
      createdDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      phone: `(${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 800) + 200}-${Math.floor(Math.random() * 9000) + 1000}`,
      supervisor: i > 10 ? users[Math.floor(Math.random() * Math.min(10, i-1))]?.firstName + ' ' + users[Math.floor(Math.random() * Math.min(10, i-1))]?.lastName : undefined,
      certifications: ['Basic Certification', 'Advanced Training'].filter(() => Math.random() > 0.5),
      systemAccess: {
        vbms: Math.random() > 0.1,
        bgs: Math.random() > 0.4,
        stakeholder: Math.random() > 0.3,
        caseflow: Math.random() > 0.6
      },
      activityMetrics: {
        claimsProcessed: Math.floor(Math.random() * 2000) + 100,
        accuracy: Math.floor(Math.random() * 20) + 80,
        avgTimePerClaim: Math.floor(Math.random() * 20) + 8
      }
    });
  }

  // Role definitions
  const roleDefinitions: Role[] = [
    {
      id: 'R001',
      name: 'Claims Processor',
      description: 'Processes disability compensation claims and related documents',
      level: 1,
      permissions: ['view_claims', 'edit_claims', 'view_veterans', 'upload_documents'],
      userCount: users.filter(u => u.role === 'Claims Processor').length,
      systemAccess: ['VBMS', 'BGS'],
      canDelegate: false,
      requiresCertification: true
    },
    {
      id: 'R002',
      name: 'Senior Claims Processor',
      description: 'Advanced claims processing with approval authority',
      level: 2,
      permissions: ['view_claims', 'edit_claims', 'approve_claims', 'view_veterans', 'upload_documents', 'generate_reports'],
      userCount: users.filter(u => u.role === 'Senior Claims Processor').length,
      systemAccess: ['VBMS', 'BGS', 'SEP'],
      canDelegate: true,
      requiresCertification: true
    },
    {
      id: 'R003',
      name: 'Claims Supervisor',
      description: 'Supervises claims processing team and quality assurance',
      level: 3,
      permissions: ['view_claims', 'edit_claims', 'approve_claims', 'assign_claims', 'view_veterans', 'manage_users', 'generate_reports', 'quality_review'],
      userCount: users.filter(u => u.role === 'Claims Supervisor').length,
      systemAccess: ['VBMS', 'BGS', 'SEP', 'Caseflow'],
      canDelegate: true,
      requiresCertification: true
    },
    {
      id: 'R004',
      name: 'Quality Reviewer',
      description: 'Reviews claim decisions for accuracy and compliance',
      level: 2,
      permissions: ['view_claims', 'quality_review', 'view_veterans', 'generate_reports'],
      userCount: users.filter(u => u.role === 'Quality Reviewer').length,
      systemAccess: ['VBMS', 'BGS'],
      canDelegate: false,
      requiresCertification: true
    },
    {
      id: 'R005',
      name: 'System Administrator',
      description: 'Manages system configuration and user access',
      level: 4,
      permissions: ['system_admin', 'manage_users', 'manage_organization', 'view_claims', 'view_veterans', 'generate_reports'],
      userCount: users.filter(u => u.role === 'System Administrator').length,
      systemAccess: ['VBMS', 'BGS', 'SEP', 'Caseflow'],
      canDelegate: true,
      requiresCertification: false
    }
  ];

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesOrganization = selectedOrganization === 'all' || user.organization === selectedOrganization;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      return matchesSearch && matchesRole && matchesOrganization && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortBy as keyof User];
      let bVal: any = b[sortBy as keyof User];
      
      if (sortBy === 'lastLogin') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRoles = roleDefinitions.length;
  const avgAccuracy = Math.round(users.reduce((acc, u) => acc + u.activityMetrics.accuracy, 0) / users.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10';
      case 'inactive': return 'text-slate-400 bg-slate-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'suspended': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getRoleColor = (role: string) => {
    const colors = [
      'text-blue-400 bg-blue-400/10',
      'text-emerald-400 bg-emerald-400/10',
      'text-purple-400 bg-purple-400/10',
      'text-yellow-400 bg-yellow-400/10',
      'text-red-400 bg-red-400/10',
      'text-orange-400 bg-orange-400/10'
    ];
    return colors[Math.abs(role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="users"
          title="Users & Roles Management"
          description="Comprehensive user management system for controlling access, permissions, and roles across the VBMS platform with advanced security and compliance features."
          features={[
            "User account management with role-based access control",
            "Advanced permission system with granular controls",
            "Performance tracking and activity monitoring",
            "Role definitions with delegation and certification requirements"
          ]}
          demoActions={[
            { label: "View User Roles", action: () => setActiveTab('roles') },
            { label: "Filter Active Users", action: () => setSelectedStatus('active') },
            { label: "Search Users", action: () => setSearchTerm('Johnson') }
          ]}
        />
        
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
                  <h1 className="text-xl font-semibold text-slate-100">Users & Roles Management</h1>
                  <p className="text-sm text-slate-500">Access Control & Permission Management</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => activeTab === 'users' ? setShowCreateUserModal(true) : setShowCreateRoleModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {activeTab === 'users' ? 'Add User' : 'Add Role'}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg transition-colors border ${
                    showFilters 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* User Management Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Total Users</h3>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {totalUsers}
                </div>
                <div className="text-xs text-blue-300/70">System accounts</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Active Users</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {activeUsers}
                </div>
                <div className="text-xs text-emerald-300/70">{Math.round((activeUsers/totalUsers)*100)}% of total</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Defined Roles</h3>
                  <span className="text-2xl">🏷️</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {totalRoles}
                </div>
                <div className="text-xs text-purple-300/70">Permission groups</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Avg Performance</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {avgAccuracy}%
                </div>
                <div className="text-xs text-yellow-300/70">User accuracy</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Users Management
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'roles'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Roles & Permissions
              </button>
            </div>

            {activeTab === 'users' && (
              <>
                {/* Filters Panel */}
                {showFilters && (
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Filter & Search</h3>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search users..."
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="all">All Roles</option>
                          {[...new Set(users.map(u => u.role))].map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                        <select
                          value={selectedOrganization}
                          onChange={(e) => setSelectedOrganization(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="all">All Organizations</option>
                          {[...new Set(users.map(u => u.organization))].map(org => (
                            <option key={org} value={org}>{org}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                        <div className="flex space-x-2">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                          >
                            <option value="lastName">Last Name</option>
                            <option value="firstName">First Name</option>
                            <option value="role">Role</option>
                            <option value="lastLogin">Last Login</option>
                            <option value="organization">Organization</option>
                          </select>
                          <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors"
                          >
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users List */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-100">
                      Users ({filteredUsers.length})
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-slate-800">
                    {filteredUsers.slice(0, 20).map((user) => (
                      <div
                        key={user.id}
                        className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.firstName[0]}{user.lastName[0]}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-100">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-slate-400 text-sm">{user.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {user.status.toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-slate-400">Organization</p>
                                <p className="text-sm text-slate-300">{user.organization}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Department</p>
                                <p className="text-sm text-slate-300">{user.department}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Last Login</p>
                                <p className="text-sm text-slate-300">{new Date(user.lastLogin).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Claims Processed</p>
                                <p className="text-sm text-blue-400 font-medium">{user.activityMetrics.claimsProcessed.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-slate-400">System Access:</span>
                                <div className="flex space-x-1">
                                  {Object.entries(user.systemAccess).map(([system, access]) => (
                                    <span key={system} className={`w-2 h-2 rounded-full ${access ? 'bg-emerald-400' : 'bg-red-400'}`} title={system.toUpperCase()}></span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-slate-400">Accuracy:</span>
                                <span className="text-sm text-emerald-400 font-medium">{user.activityMetrics.accuracy}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                      <div className="p-12 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <p>No users match your current filters.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'roles' && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Role Definitions ({roleDefinitions.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-slate-800">
                  {roleDefinitions.map((role) => (
                    <div key={role.id} className="p-6 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-xl font-semibold text-slate-100">{role.name}</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                              Level {role.level}
                            </span>
                            {role.canDelegate && (
                              <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-300">
                                Can Delegate
                              </span>
                            )}
                            {role.requiresCertification && (
                              <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-300">
                                Requires Certification
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 mb-4">{role.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">Permissions ({role.permissions.length})</h4>
                              <div className="space-y-1">
                                {role.permissions.slice(0, 4).map((permission) => (
                                  <div key={permission} className="text-sm text-slate-300">• {permission.replace('_', ' ')}</div>
                                ))}
                                {role.permissions.length > 4 && (
                                  <div className="text-xs text-slate-500">+{role.permissions.length - 4} more</div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">System Access</h4>
                              <div className="flex flex-wrap gap-2">
                                {role.systemAccess.map((system) => (
                                  <span key={system} className="px-2 py-1 bg-slate-800 text-xs text-slate-300 rounded">
                                    {system}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">Users</h4>
                              <div className="text-2xl font-bold text-blue-400">{role.userCount}</div>
                              <div className="text-xs text-slate-500">assigned users</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6">
                          <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm">
                            Edit Role
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-100">{selectedUser.firstName} {selectedUser.lastName}</h2>
                      <p className="text-slate-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">User Information</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">User ID</span>
                          <span className="text-slate-200 font-mono">{selectedUser.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Role</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                            {selectedUser.role}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                            {selectedUser.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Department</span>
                          <span className="text-slate-200">{selectedUser.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone</span>
                          <span className="text-slate-200">{selectedUser.phone}</span>
                        </div>
                        {selectedUser.supervisor && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Supervisor</span>
                            <span className="text-slate-200">{selectedUser.supervisor}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Created</span>
                          <span className="text-slate-200">{new Date(selectedUser.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Login</span>
                          <span className="text-slate-200">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Performance Metrics</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-400 mb-1">
                          {selectedUser.activityMetrics.accuracy}%
                        </div>
                        <div className="text-sm text-slate-400">Accuracy Rate</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-xl font-semibold text-blue-400">
                            {selectedUser.activityMetrics.claimsProcessed.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">Claims Processed</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold text-purple-400">
                            {selectedUser.activityMetrics.avgTimePerClaim}
                          </div>
                          <div className="text-xs text-slate-400">Avg Time (days)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Organization</h3>
                      <div className="bg-slate-800 rounded-lg p-4">
                        <p className="text-slate-200 mb-2">{selectedUser.organization}</p>
                        <p className="text-slate-400 text-sm">{selectedUser.department}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">System Access</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedUser.systemAccess).map(([system, access]) => (
                          <div key={system} className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${access ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                            <span className="text-sm text-slate-300">{system.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Certifications</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="space-y-2">
                        {selectedUser.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">{cert}</span>
                          </div>
                        ))}
                        {selectedUser.certifications.length === 0 && (
                          <p className="text-slate-500 text-sm">No certifications on file</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Permissions</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.permissions.map((permission, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    Edit User
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}