'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { massiveMockDatabase } from '../lib/massiveMockData';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  resourceType: 'claim' | 'veteran' | 'document' | 'user' | 'system' | 'appeal' | 'exam';
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  module: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export default function AuditPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Generate comprehensive audit log data
  const generateAuditLogs = (): AuditLog[] => {
    const logs: AuditLog[] = [];
    const actions = [
      'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'LOGIN', 'LOGOUT',
      'APPROVE', 'REJECT', 'ASSIGN', 'REASSIGN', 'SCHEDULE', 'CANCEL',
      'UPLOAD', 'DOWNLOAD', 'PRINT', 'EMAIL', 'ARCHIVE', 'RESTORE'
    ];
    
    const resources = [
      'User Account', 'Veteran Profile', 'Disability Claim', 'Medical Document',
      'C&P Examination', 'Rating Decision', 'Appeal', 'Evidence Item',
      'System Configuration', 'User Session', 'Report Generation', 'Data Export',
      'AI Analysis', 'Quality Review', 'Audit Log', 'Integration Setting'
    ];
    
    const modules = [
      'Authentication', 'Claims Processing', 'Document Management', 'User Management',
      'Veterans Registry', 'Examinations', 'Appeals Processing', 'Reports & Analytics',
      'AI Orchestration', 'Quality Assurance', 'System Administration', 'Data Integration'
    ];
    
    const users = [
      { id: 'U001', name: 'Sarah Johnson', role: 'Claims Processor' },
      { id: 'U002', name: 'Michael Rodriguez', role: 'Senior Examiner' },
      { id: 'U003', name: 'Jennifer Chen', role: 'System Administrator' },
      { id: 'U004', name: 'David Kim', role: 'Quality Reviewer' },
      { id: 'U005', name: 'Lisa Williams', role: 'Appeals Coordinator' },
      { id: 'U006', name: 'James Garcia', role: 'Medical Officer' },
      { id: 'U007', name: 'Emily Davis', role: 'Case Manager' },
      { id: 'U008', name: 'Robert Martinez', role: 'Data Analyst' },
      { id: 'U009', name: 'Amanda Thompson', role: 'Training Coordinator' },
      { id: 'U010', name: 'Thomas Anderson', role: 'IT Specialist' }
    ];
    
    const ipAddresses = [
      '192.168.1.100', '192.168.1.101', '192.168.1.102', '192.168.1.103',
      '10.0.0.50', '10.0.0.51', '10.0.0.52', '172.16.1.20', '172.16.1.21'
    ];
    
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
    ];

    // Generate logs for the past 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 500; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resource = resources[Math.floor(Math.random() * resources.length)];
      const module = modules[Math.floor(Math.random() * modules.length)];
      
      const timestamp = new Date(
        thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
      );
      
      const resourceTypes: AuditLog['resourceType'][] = ['claim', 'veteran', 'document', 'user', 'system', 'appeal', 'exam'];
      const statuses: AuditLog['status'][] = ['success', 'failure', 'warning'];
      const severities: AuditLog['severity'][] = ['low', 'medium', 'high', 'critical'];
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      
      // Generate resource ID based on type
      let resourceId = '';
      switch (resourceType) {
        case 'claim':
          resourceId = massiveMockDatabase.claims[Math.floor(Math.random() * massiveMockDatabase.claims.length)]?.id || 'CL-000001';
          break;
        case 'veteran':
          resourceId = massiveMockDatabase.veterans[Math.floor(Math.random() * massiveMockDatabase.veterans.length)]?.id || 'V001';
          break;
        case 'document':
          resourceId = `DOC-${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;
          break;
        default:
          resourceId = `${resourceType.toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
      }
      
      const details = generateLogDetails(action, resource, status, user.name);
      
      const changes = action === 'UPDATE' && Math.random() > 0.5 ? [
        {
          field: 'Status',
          oldValue: 'Pending Review',
          newValue: 'In Progress'
        },
        {
          field: 'Assigned To',
          oldValue: 'Unassigned',
          newValue: user.name
        }
      ] : undefined;

      logs.push({
        id: `AL-${String(i + 1).padStart(6, '0')}`,
        timestamp: timestamp.toISOString(),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action,
        resource,
        resourceId,
        resourceType,
        ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        status,
        details,
        severity,
        module,
        changes
      });
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const generateLogDetails = (action: string, resource: string, status: string, userName: string): string => {
    const templates = {
      CREATE: {
        success: `Successfully created ${resource.toLowerCase()} by ${userName}`,
        failure: `Failed to create ${resource.toLowerCase()} due to validation errors`,
        warning: `Created ${resource.toLowerCase()} with incomplete data`
      },
      UPDATE: {
        success: `Successfully updated ${resource.toLowerCase()} fields`,
        failure: `Failed to update ${resource.toLowerCase()} due to permission error`,
        warning: `Updated ${resource.toLowerCase()} with potential data inconsistencies`
      },
      DELETE: {
        success: `Successfully archived ${resource.toLowerCase()}`,
        failure: `Failed to delete ${resource.toLowerCase()} due to dependencies`,
        warning: `Deleted ${resource.toLowerCase()} with active references`
      },
      VIEW: {
        success: `Accessed ${resource.toLowerCase()} for review`,
        failure: `Access denied to ${resource.toLowerCase()}`,
        warning: `Viewed ${resource.toLowerCase()} without proper authorization`
      },
      LOGIN: {
        success: `User successfully authenticated`,
        failure: `Authentication failed - invalid credentials`,
        warning: `Login from unusual location detected`
      }
    };
    
    const template = templates[action as keyof typeof templates] || {
      success: `${action} operation completed successfully`,
      failure: `${action} operation failed`,
      warning: `${action} operation completed with warnings`
    };
    
    return template[status as keyof typeof template];
  };

  const auditLogs = generateAuditLogs();

  // Filter and sort logs
  const filteredLogs = auditLogs
    .filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
      const matchesResourceType = selectedResourceType === 'all' || log.resourceType === selectedResourceType;
      
      const logDate = new Date(log.timestamp);
      const matchesDateFrom = !dateFrom || logDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || logDate <= new Date(dateTo);
      
      return matchesSearch && matchesSeverity && matchesStatus && matchesResourceType && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => {
      let aVal: any = a[sortBy as keyof AuditLog];
      let bVal: any = b[sortBy as keyof AuditLog];
      
      if (sortBy === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Calculate metrics
  const totalLogs = auditLogs.length;
  const successRate = Math.round((auditLogs.filter(l => l.status === 'success').length / totalLogs) * 100);
  const criticalIssues = auditLogs.filter(l => l.severity === 'critical').length;
  const recentActivity = auditLogs.filter(l => {
    const logDate = new Date(l.timestamp);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return logDate >= yesterday;
  }).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-400/10';
      case 'failure': return 'text-red-400 bg-red-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'claim': return 'text-blue-400 bg-blue-400/10';
      case 'veteran': return 'text-emerald-400 bg-emerald-400/10';
      case 'document': return 'text-purple-400 bg-purple-400/10';
      case 'user': return 'text-yellow-400 bg-yellow-400/10';
      case 'system': return 'text-red-400 bg-red-400/10';
      case 'appeal': return 'text-orange-400 bg-orange-400/10';
      case 'exam': return 'text-pink-400 bg-pink-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="audit"
          title="Audit Logs"
          description="Comprehensive audit logging system for tracking all user actions, system events, and data changes across the VBMS platform with advanced filtering and search capabilities."
          features={[
            "Complete audit trail with user actions and system events",
            "Advanced filtering by severity, status, resource type, and date ranges",
            "Detailed change tracking with before/after values",
            "Real-time activity monitoring and security analysis"
          ]}
          demoActions={[
            { label: "View Critical Issues", action: () => setSelectedSeverity('critical') },
            { label: "Show Failed Actions", action: () => setSelectedStatus('failure') },
            { label: "Search System Events", action: () => setSearchTerm('system') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Audit Logs</h1>
                  <p className="text-sm text-slate-500">System Activity & Security Monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
            {/* Audit Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Total Events</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {totalLogs.toLocaleString()}
                </div>
                <div className="text-xs text-blue-300/70">Last 30 days</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Success Rate</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {successRate}%
                </div>
                <div className="text-xs text-emerald-300/70">System reliability</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Recent Activity</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {recentActivity}
                </div>
                <div className="text-xs text-yellow-300/70">Last 24 hours</div>
              </div>

              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-red-300">Critical Issues</h3>
                  <span className="text-2xl">🚨</span>
                </div>
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {criticalIssues}
                </div>
                <div className="text-xs text-red-300/70">Requiring attention</div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Filter & Search</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by user, action, resource..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
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
                      <option value="success">Success</option>
                      <option value="failure">Failure</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Resource Type</label>
                    <select
                      value={selectedResourceType}
                      onChange={(e) => setSelectedResourceType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="claim">Claims</option>
                      <option value="veteran">Veterans</option>
                      <option value="document">Documents</option>
                      <option value="user">Users</option>
                      <option value="system">System</option>
                      <option value="appeal">Appeals</option>
                      <option value="exam">Examinations</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="timestamp">Timestamp</option>
                      <option value="userName">User Name</option>
                      <option value="action">Action</option>
                      <option value="severity">Severity</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      {sortOrder === 'asc' ? 'Oldest First ↑' : 'Newest First ↓'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Logs List */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">
                  Audit Logs ({filteredLogs.length.toLocaleString()})
                </h2>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 text-sm"
                  >
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <span className="text-sm text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-slate-800">
                {paginatedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {log.action} - {log.resource}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                            {log.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(log.resourceType)}`}>
                            {log.resourceType.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">User</p>
                            <p className="text-sm text-slate-300">{log.userName}</p>
                            <p className="text-xs text-slate-500">{log.userRole}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Timestamp</p>
                            <p className="text-sm text-slate-300">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Resource ID</p>
                            <p className="text-sm font-mono text-slate-300">{log.resourceId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Module</p>
                            <p className="text-sm text-slate-300">{log.module}</p>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <p className="text-sm text-slate-300">{log.details}</p>
                        </div>
                        
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-3 text-xs text-slate-400">
                            <span className="font-medium">Changes: </span>
                            {log.changes.map((change, idx) => (
                              <span key={idx} className="mr-4">
                                {change.field}: <span className="text-red-400">{change.oldValue}</span> → <span className="text-emerald-400">{change.newValue}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-xs text-slate-500 mb-1">IP Address</div>
                        <div className="text-xs font-mono text-slate-400">{log.ipAddress}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {paginatedLogs.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No audit logs match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Audit Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">{selectedLog.action} - {selectedLog.resource}</h2>
                    <p className="text-slate-400">Audit Log Details - {selectedLog.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
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
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Event Information</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Log ID</span>
                          <span className="text-slate-200 font-mono">{selectedLog.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Timestamp</span>
                          <span className="text-slate-200">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Action</span>
                          <span className="text-slate-200 font-medium">{selectedLog.action}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resource</span>
                          <span className="text-slate-200">{selectedLog.resource}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resource ID</span>
                          <span className="text-slate-200 font-mono">{selectedLog.resourceId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resource Type</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getResourceTypeColor(selectedLog.resourceType)}`}>
                            {selectedLog.resourceType.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Module</span>
                          <span className="text-slate-200">{selectedLog.module}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                            {selectedLog.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Severity</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                            {selectedLog.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">User & Session</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">User ID</span>
                        <span className="text-slate-200 font-mono">{selectedLog.userId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">User Name</span>
                        <span className="text-slate-200">{selectedLog.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">User Role</span>
                        <span className="text-blue-400">{selectedLog.userRole}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">IP Address</span>
                        <span className="text-slate-200 font-mono">{selectedLog.ipAddress}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-slate-100 mb-2">User Agent</h4>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-300 font-mono break-all">{selectedLog.userAgent}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Event Details</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-300">{selectedLog.details}</p>
                  </div>
                </div>
                
                {selectedLog.changes && selectedLog.changes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Changes Made</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="space-y-3">
                        {selectedLog.changes.map((change, index) => (
                          <div key={index} className="border border-slate-700 rounded-lg p-3">
                            <div className="font-medium text-slate-200 mb-2">{change.field}</div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Previous Value</p>
                                <p className="text-sm text-red-400 bg-red-400/10 px-2 py-1 rounded">{change.oldValue}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">New Value</p>
                                <p className="text-sm text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">{change.newValue}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    Export Log
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