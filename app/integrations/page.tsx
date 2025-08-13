'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'database' | 'file' | 'webhook' | 'messaging';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  provider: string;
  endpoint?: string;
  version: string;
  lastSync: string;
  nextSync?: string;
  dataFlows: {
    direction: 'inbound' | 'outbound' | 'bidirectional';
    frequency: string;
    volume: number;
  };
  health: {
    uptime: number;
    latency: number;
    errorRate: number;
    throughput: number;
  };
  authentication: string;
  environment: 'production' | 'staging' | 'development';
  maintainer: string;
  documentation?: string;
}

export default function IntegrationsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Comprehensive integrations data
  const integrations: Integration[] = [
    {
      id: 'INT-001',
      name: 'Benefits Gateway Service (BGS)',
      description: 'Core VA benefits system integration for claim processing and veteran data',
      type: 'api',
      status: 'active',
      provider: 'VA Enterprise',
      endpoint: 'https://bgs.vba.va.gov/api/v2',
      version: '2.1.4',
      lastSync: '2024-01-15T10:30:00Z',
      nextSync: '2024-01-15T11:30:00Z',
      dataFlows: {
        direction: 'bidirectional',
        frequency: 'real-time',
        volume: 25000
      },
      health: {
        uptime: 99.97,
        latency: 245,
        errorRate: 0.03,
        throughput: 1250
      },
      authentication: 'OAuth 2.0',
      environment: 'production',
      maintainer: 'VBA Integration Team',
      documentation: '/docs/integrations/bgs'
    },
    {
      id: 'INT-002',
      name: 'Master Person Index (MPI)',
      description: 'Veteran identity and demographics service integration',
      type: 'api',
      status: 'active',
      provider: 'VA Identity Services',
      endpoint: 'https://mpi.va.gov/api/v1',
      version: '1.8.2',
      lastSync: '2024-01-15T10:25:00Z',
      nextSync: '2024-01-15T10:55:00Z',
      dataFlows: {
        direction: 'inbound',
        frequency: 'every 30 minutes',
        volume: 8500
      },
      health: {
        uptime: 99.92,
        latency: 180,
        errorRate: 0.08,
        throughput: 850
      },
      authentication: 'mTLS Certificate',
      environment: 'production',
      maintainer: 'Identity Management Team'
    },
    {
      id: 'INT-003',
      name: 'Corporate Data Warehouse (CDW)',
      description: 'Data warehouse integration for analytics and reporting',
      type: 'database',
      status: 'active',
      provider: 'VA Data & Analytics',
      version: '3.2.1',
      lastSync: '2024-01-15T06:00:00Z',
      nextSync: '2024-01-16T06:00:00Z',
      dataFlows: {
        direction: 'outbound',
        frequency: 'daily',
        volume: 150000
      },
      health: {
        uptime: 99.85,
        latency: 2500,
        errorRate: 0.15,
        throughput: 500
      },
      authentication: 'Database Credentials',
      environment: 'production',
      maintainer: 'Data Analytics Team'
    },
    {
      id: 'INT-004',
      name: 'VistA Medical Records',
      description: 'Electronic health records system integration',
      type: 'api',
      status: 'active',
      provider: 'VHA Systems',
      endpoint: 'https://vista.va.gov/api/fhir',
      version: '4.0.1',
      lastSync: '2024-01-15T09:45:00Z',
      dataFlows: {
        direction: 'inbound',
        frequency: 'real-time',
        volume: 18000
      },
      health: {
        uptime: 99.94,
        latency: 320,
        errorRate: 0.06,
        throughput: 900
      },
      authentication: 'SAML 2.0',
      environment: 'production',
      maintainer: 'VHA Integration Team'
    },
    {
      id: 'INT-005',
      name: 'Caseflow Appeals',
      description: 'Appeals processing system integration',
      type: 'api',
      status: 'active',
      provider: 'Board of Veterans Appeals',
      endpoint: 'https://caseflow.va.gov/api/v1',
      version: '1.5.0',
      lastSync: '2024-01-15T10:15:00Z',
      dataFlows: {
        direction: 'bidirectional',
        frequency: 'hourly',
        volume: 5200
      },
      health: {
        uptime: 99.89,
        latency: 450,
        errorRate: 0.11,
        throughput: 350
      },
      authentication: 'API Key',
      environment: 'production',
      maintainer: 'Appeals Technology Team'
    },
    {
      id: 'INT-006',
      name: 'Document Management Service',
      description: 'Centralized document storage and retrieval system',
      type: 'file',
      status: 'active',
      provider: 'VA Content Management',
      version: '2.3.0',
      lastSync: '2024-01-15T10:00:00Z',
      dataFlows: {
        direction: 'bidirectional',
        frequency: 'real-time',
        volume: 45000
      },
      health: {
        uptime: 99.96,
        latency: 150,
        errorRate: 0.04,
        throughput: 2200
      },
      authentication: 'OAuth 2.0',
      environment: 'production',
      maintainer: 'Content Management Team'
    },
    {
      id: 'INT-007',
      name: 'Notification Service',
      description: 'Email and SMS notification delivery system',
      type: 'messaging',
      status: 'active',
      provider: 'VA Communications',
      version: '1.2.8',
      lastSync: '2024-01-15T10:35:00Z',
      dataFlows: {
        direction: 'outbound',
        frequency: 'real-time',
        volume: 12000
      },
      health: {
        uptime: 99.91,
        latency: 95,
        errorRate: 0.09,
        throughput: 600
      },
      authentication: 'Bearer Token',
      environment: 'production',
      maintainer: 'Communications Team'
    },
    {
      id: 'INT-008',
      name: 'External Partner APIs',
      description: 'Third-party medical provider integrations',
      type: 'webhook',
      status: 'active',
      provider: 'Multiple Providers',
      version: 'Various',
      lastSync: '2024-01-15T09:20:00Z',
      dataFlows: {
        direction: 'inbound',
        frequency: 'event-driven',
        volume: 3500
      },
      health: {
        uptime: 98.75,
        latency: 850,
        errorRate: 1.25,
        throughput: 175
      },
      authentication: 'Various',
      environment: 'production',
      maintainer: 'External Integration Team'
    }
  ];

  // Add more integrations for staging/development
  const additionalIntegrations = [
    'Legacy Claims System', 'Audit Trail Service', 'Performance Analytics',
    'Security Event Monitor', 'Backup & Recovery Service', 'Load Balancer Health',
    'Database Replication', 'File Transfer Protocol', 'Message Queue Service',
    'Cache Management System'
  ].map((name, index) => {
    const types: Integration['type'][] = ['api', 'database', 'file', 'webhook', 'messaging'];
    const statuses: Integration['status'][] = ['active', 'inactive', 'error', 'maintenance'];
    const environments: Integration['environment'][] = ['production', 'staging', 'development'];
    
    return {
      id: `INT-${String(index + 9).padStart(3, '0')}`,
      name,
      description: `Integration service for ${name.toLowerCase()}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      provider: 'VA Systems',
      version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      lastSync: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      dataFlows: {
        direction: ['inbound', 'outbound', 'bidirectional'][Math.floor(Math.random() * 3)] as 'inbound' | 'outbound' | 'bidirectional',
        frequency: ['real-time', 'hourly', 'daily', 'weekly'][Math.floor(Math.random() * 4)],
        volume: Math.floor(Math.random() * 50000) + 1000
      },
      health: {
        uptime: Math.floor(Math.random() * 500 + 9500) / 100,
        latency: Math.floor(Math.random() * 2000) + 50,
        errorRate: Math.floor(Math.random() * 300) / 100,
        throughput: Math.floor(Math.random() * 2000) + 100
      },
      authentication: ['OAuth 2.0', 'API Key', 'mTLS Certificate', 'Bearer Token'][Math.floor(Math.random() * 4)],
      environment: environments[Math.floor(Math.random() * environments.length)],
      maintainer: ['Integration Team', 'Platform Team', 'DevOps Team'][Math.floor(Math.random() * 3)]
    };
  });

  const allIntegrations = [...integrations, ...additionalIntegrations];

  // Filter and sort integrations
  const filteredIntegrations = allIntegrations
    .filter(integration => {
      const matchesSearch = searchTerm === '' || 
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || integration.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus;
      const matchesEnvironment = selectedEnvironment === 'all' || integration.environment === selectedEnvironment;
      return matchesSearch && matchesType && matchesStatus && matchesEnvironment;
    })
    .sort((a, b) => {
      let aVal: any = a[sortBy as keyof Integration];
      let bVal: any = b[sortBy as keyof Integration];
      
      if (typeof aVal === 'string') {
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
  const totalIntegrations = allIntegrations.length;
  const activeIntegrations = allIntegrations.filter(i => i.status === 'active').length;
  const avgUptime = Math.round(allIntegrations.reduce((acc, i) => acc + i.health.uptime, 0) / totalIntegrations * 100) / 100;
  const avgLatency = Math.round(allIntegrations.reduce((acc, i) => acc + i.health.latency, 0) / totalIntegrations);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10';
      case 'inactive': return 'text-slate-400 bg-slate-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api': return 'text-blue-400 bg-blue-400/10';
      case 'database': return 'text-emerald-400 bg-emerald-400/10';
      case 'file': return 'text-purple-400 bg-purple-400/10';
      case 'webhook': return 'text-yellow-400 bg-yellow-400/10';
      case 'messaging': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'text-red-400 bg-red-400/10';
      case 'staging': return 'text-yellow-400 bg-yellow-400/10';
      case 'development': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getHealthColor = (uptime: number) => {
    if (uptime >= 99.5) return 'text-emerald-400';
    if (uptime >= 99) return 'text-blue-400';
    if (uptime >= 98) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="integrations"
          title="Integrations Management"
          description="Comprehensive integration management system for monitoring, configuring, and maintaining all system connections, APIs, databases, and third-party services."
          features={[
            "Real-time integration health monitoring and alerting",
            "API endpoint management with authentication controls",
            "Data flow tracking and performance analytics",
            "Multi-environment deployment and configuration management"
          ]}
          demoActions={[
            { label: "View API Integrations", action: () => setSelectedType('api') },
            { label: "Check System Health", action: () => setSelectedStatus('active') },
            { label: "Filter Production", action: () => setSelectedEnvironment('production') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Integrations Management</h1>
                  <p className="text-sm text-slate-500">API Connections & System Integration</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Integration
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
            {/* Integration Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Total Integrations</h3>
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {totalIntegrations}
                </div>
                <div className="text-xs text-blue-300/70">Active connections</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Active Services</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {activeIntegrations}
                </div>
                <div className="text-xs text-emerald-300/70">{Math.round((activeIntegrations/totalIntegrations)*100)}% operational</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">System Uptime</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {avgUptime}%
                </div>
                <div className="text-xs text-purple-300/70">Average availability</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Avg Latency</h3>
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {avgLatency}ms
                </div>
                <div className="text-xs text-yellow-300/70">Response time</div>
              </div>
            </div>

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
                      placeholder="Search integrations..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="api">API</option>
                      <option value="database">Database</option>
                      <option value="file">File</option>
                      <option value="webhook">Webhook</option>
                      <option value="messaging">Messaging</option>
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
                      <option value="error">Error</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Environment</label>
                    <select
                      value={selectedEnvironment}
                      onChange={(e) => setSelectedEnvironment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Environments</option>
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="development">Development</option>
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
                        <option value="name">Name</option>
                        <option value="type">Type</option>
                        <option value="status">Status</option>
                        <option value="environment">Environment</option>
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

            {/* Integrations List */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-100">
                  System Integrations ({filteredIntegrations.length})
                </h2>
              </div>
              
              <div className="divide-y divide-slate-800">
                {filteredIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {integration.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {integration.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(integration.type)}`}>
                            {integration.type.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(integration.environment)}`}>
                            {integration.environment.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-slate-300 mb-4 text-sm">{integration.description}</p>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">Provider</p>
                            <p className="text-sm text-slate-300">{integration.provider}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Version</p>
                            <p className="text-sm text-slate-300">{integration.version}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Data Flow</p>
                            <p className="text-sm text-slate-300">{integration.dataFlows.direction}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Maintainer</p>
                            <p className="text-sm text-slate-300">{integration.maintainer}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Uptime:</span>
                            <span className={`text-sm font-medium ${getHealthColor(integration.health.uptime)}`}>
                              {integration.health.uptime}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Latency:</span>
                            <span className="text-sm text-yellow-400 font-medium">{integration.health.latency}ms</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Throughput:</span>
                            <span className="text-sm text-blue-400 font-medium">{integration.health.throughput}/min</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-sm text-slate-400 mb-1">Last Sync</div>
                        <div className="text-sm text-slate-300">{new Date(integration.lastSync).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredIntegrations.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <p>No integrations match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Integration Detail Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">{selectedIntegration.name}</h2>
                    <p className="text-slate-400">Integration Details - {selectedIntegration.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedIntegration(null)}
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
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Integration Details</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Integration ID</span>
                          <span className="text-slate-200 font-mono">{selectedIntegration.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedIntegration.type)}`}>
                            {selectedIntegration.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedIntegration.status)}`}>
                            {selectedIntegration.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Environment</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getEnvironmentColor(selectedIntegration.environment)}`}>
                            {selectedIntegration.environment.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Provider</span>
                          <span className="text-slate-200">{selectedIntegration.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Version</span>
                          <span className="text-slate-200">{selectedIntegration.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Authentication</span>
                          <span className="text-slate-200">{selectedIntegration.authentication}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Maintainer</span>
                          <span className="text-slate-200">{selectedIntegration.maintainer}</span>
                        </div>
                        {selectedIntegration.endpoint && (
                          <div className="pt-2 border-t border-slate-700">
                            <span className="text-slate-400 text-sm">Endpoint</span>
                            <p className="text-slate-200 font-mono text-xs mt-1 break-all">{selectedIntegration.endpoint}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Health Metrics</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold mb-1 ${getHealthColor(selectedIntegration.health.uptime)}`}>
                          {selectedIntegration.health.uptime}%
                        </div>
                        <div className="text-sm text-slate-400">System Uptime</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-yellow-400">
                            {selectedIntegration.health.latency}ms
                          </div>
                          <div className="text-xs text-slate-400">Latency</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-400">
                            {selectedIntegration.health.throughput}
                          </div>
                          <div className="text-xs text-slate-400">Throughput/min</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-red-400">
                            {selectedIntegration.health.errorRate}%
                          </div>
                          <div className="text-xs text-slate-400">Error Rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Data Flow</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Direction</span>
                          <span className="text-blue-400 font-medium">{selectedIntegration.dataFlows.direction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Frequency</span>
                          <span className="text-slate-200">{selectedIntegration.dataFlows.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Volume</span>
                          <span className="text-emerald-400 font-medium">{selectedIntegration.dataFlows.volume.toLocaleString()}/day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Description</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-300">{selectedIntegration.description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Sync Information</h3>
                  <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Sync</span>
                      <span className="text-slate-200">{new Date(selectedIntegration.lastSync).toLocaleString()}</span>
                    </div>
                    {selectedIntegration.nextSync && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Next Sync</span>
                        <span className="text-emerald-400">{new Date(selectedIntegration.nextSync).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors">
                    Test Connection
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    Edit Configuration
                  </button>
                  {selectedIntegration.documentation && (
                    <Link
                      href={selectedIntegration.documentation}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      View Documentation
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}