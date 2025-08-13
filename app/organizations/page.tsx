'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface Organization {
  id: string;
  name: string;
  type: 'varo' | 'vmc' | 'hospital' | 'outreach' | 'headquarters';
  region: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  director: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'maintenance';
  userCount: number;
  claimsVolume: number;
  avgProcessingTime: number;
  systemAccess: {
    vbms: boolean;
    bgs: boolean;
    stakeholder: boolean;
    caseflow: boolean;
  };
  certifications: string[];
  lastAudit: string;
  nextAudit: string;
  performance: {
    accuracy: number;
    timeliness: number;
    satisfaction: number;
  };
}

export default function OrganizationsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Generate comprehensive organization data
  const organizations: Organization[] = [
    {
      id: 'ORG-001',
      name: 'VA Regional Office - Houston',
      type: 'varo',
      region: 'South',
      address: {
        street: '6900 Almeda Rd',
        city: 'Houston',
        state: 'TX',
        zip: '77030'
      },
      director: 'Robert Martinez',
      email: 'houston.varo@va.gov',
      phone: '(713) 794-4000',
      status: 'active',
      userCount: 287,
      claimsVolume: 15420,
      avgProcessingTime: 89,
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: true
      },
      certifications: ['ISO 27001', 'FedRAMP', 'FISMA'],
      lastAudit: '2024-09-15',
      nextAudit: '2025-03-15',
      performance: {
        accuracy: 94.2,
        timeliness: 87.5,
        satisfaction: 91.8
      }
    },
    {
      id: 'ORG-002',
      name: 'Michael E. DeBakey VA Medical Center',
      type: 'hospital',
      region: 'South',
      address: {
        street: '2002 Holcombe Blvd',
        city: 'Houston',
        state: 'TX',
        zip: '77030'
      },
      director: 'Dr. Sarah Johnson',
      email: 'houston.vamc@va.gov',
      phone: '(713) 791-1414',
      status: 'active',
      userCount: 156,
      claimsVolume: 8940,
      avgProcessingTime: 67,
      systemAccess: {
        vbms: true,
        bgs: false,
        stakeholder: true,
        caseflow: false
      },
      certifications: ['CARF', 'Joint Commission', 'ISO 27001'],
      lastAudit: '2024-11-02',
      nextAudit: '2025-05-02',
      performance: {
        accuracy: 96.8,
        timeliness: 92.3,
        satisfaction: 94.1
      }
    },
    {
      id: 'ORG-003',
      name: 'VA Regional Office - Atlanta',
      type: 'varo',
      region: 'Southeast',
      address: {
        street: '1700 Clairmont Rd',
        city: 'Atlanta',
        state: 'GA',
        zip: '30033'
      },
      director: 'Jennifer Chen',
      email: 'atlanta.varo@va.gov',
      phone: '(404) 929-5300',
      status: 'active',
      userCount: 342,
      claimsVolume: 18750,
      avgProcessingTime: 82,
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: true
      },
      certifications: ['ISO 27001', 'FedRAMP', 'NIST'],
      lastAudit: '2024-08-20',
      nextAudit: '2025-02-20',
      performance: {
        accuracy: 93.7,
        timeliness: 89.2,
        satisfaction: 90.5
      }
    },
    {
      id: 'ORG-004',
      name: 'VA Medical Center - Phoenix',
      type: 'hospital',
      region: 'West',
      address: {
        street: '650 E Indian School Rd',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85012'
      },
      director: 'Dr. Michael Rodriguez',
      email: 'phoenix.vamc@va.gov',
      phone: '(602) 277-5551',
      status: 'active',
      userCount: 203,
      claimsVolume: 11280,
      avgProcessingTime: 71,
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: false
      },
      certifications: ['CARF', 'Joint Commission', 'FISMA'],
      lastAudit: '2024-10-12',
      nextAudit: '2025-04-12',
      performance: {
        accuracy: 95.1,
        timeliness: 88.7,
        satisfaction: 92.9
      }
    },
    {
      id: 'ORG-005',
      name: 'VA Central Office - Washington DC',
      type: 'headquarters',
      region: 'National',
      address: {
        street: '810 Vermont Ave NW',
        city: 'Washington',
        state: 'DC',
        zip: '20420'
      },
      director: 'Thomas Anderson',
      email: 'vaco.headquarters@va.gov',
      phone: '(202) 461-9700',
      status: 'active',
      userCount: 89,
      claimsVolume: 2100,
      avgProcessingTime: 45,
      systemAccess: {
        vbms: true,
        bgs: true,
        stakeholder: true,
        caseflow: true
      },
      certifications: ['FedRAMP High', 'ISO 27001', 'FISMA'],
      lastAudit: '2024-12-01',
      nextAudit: '2025-06-01',
      performance: {
        accuracy: 98.5,
        timeliness: 95.8,
        satisfaction: 96.2
      }
    }
  ];

  // Add more organizations programmatically
  const regions = ['Northeast', 'Southeast', 'Midwest', 'West', 'South'];
  const states = ['NY', 'FL', 'IL', 'CA', 'TX', 'OH', 'PA', 'NC', 'MI', 'AZ'];
  const cities = ['New York', 'Miami', 'Chicago', 'Los Angeles', 'Dallas', 'Columbus', 'Philadelphia', 'Charlotte', 'Detroit', 'Phoenix'];
  const directors = ['James Wilson', 'Maria Garcia', 'David Kim', 'Lisa Williams', 'Robert Brown', 'Jennifer Davis', 'Michael Johnson', 'Sarah Lee', 'Christopher Miller', 'Amanda Martinez'];

  for (let i = 6; i <= 25; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const director = directors[Math.floor(Math.random() * directors.length)];
    const type: Organization['type'] = ['varo', 'vmc', 'hospital', 'outreach'][Math.floor(Math.random() * 4)] as Organization['type'];
    
    organizations.push({
      id: `ORG-${String(i).padStart(3, '0')}`,
      name: `VA ${type === 'varo' ? 'Regional Office' : type === 'hospital' ? 'Medical Center' : type === 'vmc' ? 'Vet Center' : 'Outreach Center'} - ${city}`,
      type,
      region,
      address: {
        street: `${Math.floor(Math.random() * 9999)} ${['Main', 'Oak', 'Pine', 'Cedar', 'Elm'][Math.floor(Math.random() * 5)]} St`,
        city,
        state,
        zip: `${Math.floor(Math.random() * 90000) + 10000}`
      },
      director,
      email: `${city.toLowerCase().replace(' ', '')}.${type}@va.gov`,
      phone: `(${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 800) + 200}-${Math.floor(Math.random() * 9000) + 1000}`,
      status: ['active', 'inactive', 'maintenance'][Math.floor(Math.random() * 3)] as Organization['status'],
      userCount: Math.floor(Math.random() * 300) + 50,
      claimsVolume: Math.floor(Math.random() * 20000) + 2000,
      avgProcessingTime: Math.floor(Math.random() * 40) + 60,
      systemAccess: {
        vbms: Math.random() > 0.1,
        bgs: Math.random() > 0.3,
        stakeholder: Math.random() > 0.2,
        caseflow: Math.random() > 0.4
      },
      certifications: ['ISO 27001', 'FedRAMP', 'FISMA', 'CARF', 'Joint Commission', 'NIST'].filter(() => Math.random() > 0.4),
      lastAudit: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      nextAudit: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      performance: {
        accuracy: Math.floor(Math.random() * 15) + 85,
        timeliness: Math.floor(Math.random() * 20) + 75,
        satisfaction: Math.floor(Math.random() * 15) + 85
      }
    });
  }

  // Filter and sort organizations
  const filteredOrgs = organizations
    .filter(org => {
      const matchesSearch = searchTerm === '' || 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.address.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || org.type === selectedType;
      const matchesRegion = selectedRegion === 'all' || org.region === selectedRegion;
      const matchesStatus = selectedStatus === 'all' || org.status === selectedStatus;
      return matchesSearch && matchesType && matchesRegion && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortBy as keyof Organization];
      let bVal: any = b[sortBy as keyof Organization];
      
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
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(o => o.status === 'active').length;
  const totalUsers = organizations.reduce((acc, org) => acc + org.userCount, 0);
  const avgPerformance = Math.round(organizations.reduce((acc, org) => acc + org.performance.accuracy, 0) / totalOrgs);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'varo': return 'text-blue-400 bg-blue-400/10';
      case 'hospital': return 'text-emerald-400 bg-emerald-400/10';
      case 'vmc': return 'text-purple-400 bg-purple-400/10';
      case 'outreach': return 'text-yellow-400 bg-yellow-400/10';
      case 'headquarters': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-emerald-400';
    if (score >= 85) return 'text-blue-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="organizations"
          title="Organizations Management"
          description="Comprehensive organizational management system for VA facilities, regional offices, medical centers, and administrative units with performance monitoring and compliance tracking."
          features={[
            "Multi-location facility management with hierarchical organization",
            "Performance monitoring and audit compliance tracking",
            "System access control and certification management",
            "User assignment and capacity planning tools"
          ]}
          demoActions={[
            { label: "View Regional Offices", action: () => setSelectedType('varo') },
            { label: "Show Medical Centers", action: () => setSelectedType('hospital') },
            { label: "Filter Active Organizations", action: () => setSelectedStatus('active') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Organizations Management</h1>
                  <p className="text-sm text-slate-500">VA Facilities & Administrative Units</p>
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
                  Add Organization
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
            {/* Organization Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Total Organizations</h3>
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {totalOrgs}
                </div>
                <div className="text-xs text-blue-300/70">Across all regions</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Active Facilities</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {activeOrgs}
                </div>
                <div className="text-xs text-emerald-300/70">{Math.round((activeOrgs/totalOrgs)*100)}% operational</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Total Users</h3>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {totalUsers.toLocaleString()}
                </div>
                <div className="text-xs text-purple-300/70">System access accounts</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Avg Performance</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {avgPerformance}%
                </div>
                <div className="text-xs text-yellow-300/70">System-wide accuracy</div>
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
                      placeholder="Search organizations..."
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
                      <option value="varo">Regional Offices</option>
                      <option value="hospital">Medical Centers</option>
                      <option value="vmc">Vet Centers</option>
                      <option value="outreach">Outreach</option>
                      <option value="headquarters">Headquarters</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Region</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Regions</option>
                      <option value="Northeast">Northeast</option>
                      <option value="Southeast">Southeast</option>
                      <option value="Midwest">Midwest</option>
                      <option value="West">West</option>
                      <option value="South">South</option>
                      <option value="National">National</option>
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
                      <option value="maintenance">Maintenance</option>
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
                        <option value="region">Region</option>
                        <option value="userCount">User Count</option>
                        <option value="claimsVolume">Claims Volume</option>
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

            {/* Organizations List */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-100">
                  Organizations ({filteredOrgs.length})
                </h2>
              </div>
              
              <div className="divide-y divide-slate-800">
                {filteredOrgs.map((org) => (
                  <div
                    key={org.id}
                    className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrg(org)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {org.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                            {org.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(org.type)}`}>
                            {org.type.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">Director</p>
                            <p className="text-sm text-slate-300">{org.director}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Region</p>
                            <p className="text-sm text-slate-300">{org.region}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Location</p>
                            <p className="text-sm text-slate-300">{org.address.city}, {org.address.state}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Users</p>
                            <p className="text-sm text-slate-300">{org.userCount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Claims Volume:</span>
                            <span className="text-sm text-blue-400 font-medium">{org.claimsVolume.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Avg Processing:</span>
                            <span className="text-sm text-yellow-400 font-medium">{org.avgProcessingTime} days</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-sm text-slate-400 mb-1">Performance</div>
                        <div className={`text-2xl font-bold mb-1 ${getPerformanceColor(org.performance.accuracy)}`}>
                          {org.performance.accuracy}%
                        </div>
                        <div className="text-xs text-slate-500">Accuracy</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredOrgs.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p>No organizations match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Organization Detail Modal */}
        {selectedOrg && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">{selectedOrg.name}</h2>
                    <p className="text-slate-400">Organization Details - {selectedOrg.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrg(null)}
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
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Basic Information</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Organization ID</span>
                          <span className="text-slate-200 font-mono">{selectedOrg.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedOrg.type)}`}>
                            {selectedOrg.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Region</span>
                          <span className="text-slate-200">{selectedOrg.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedOrg.status)}`}>
                            {selectedOrg.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Director</span>
                          <span className="text-slate-200">{selectedOrg.director}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email</span>
                          <span className="text-blue-400">{selectedOrg.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone</span>
                          <span className="text-slate-200">{selectedOrg.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Address</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                      <p className="text-slate-200">{selectedOrg.address.street}</p>
                      <p className="text-slate-200">{selectedOrg.address.city}, {selectedOrg.address.state} {selectedOrg.address.zip}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Performance Metrics</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Accuracy</span>
                            <span className="text-emerald-400">{selectedOrg.performance.accuracy}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${selectedOrg.performance.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Timeliness</span>
                            <span className="text-blue-400">{selectedOrg.performance.timeliness}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${selectedOrg.performance.timeliness}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Satisfaction</span>
                            <span className="text-purple-400">{selectedOrg.performance.satisfaction}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-purple-400 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${selectedOrg.performance.satisfaction}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">System Access</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedOrg.systemAccess.vbms ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-slate-300">VBMS</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedOrg.systemAccess.bgs ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-slate-300">BGS</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedOrg.systemAccess.stakeholder ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-slate-300">SEP</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedOrg.systemAccess.caseflow ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-slate-300">Caseflow</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Operational Metrics</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Users</span>
                        <span className="text-slate-200 font-semibold">{selectedOrg.userCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Claims Volume</span>
                        <span className="text-slate-200 font-semibold">{selectedOrg.claimsVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Processing</span>
                        <span className="text-slate-200 font-semibold">{selectedOrg.avgProcessingTime} days</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Certifications</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedOrg.certifications.map((cert, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Audit Schedule</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Audit</span>
                        <span className="text-slate-200">{new Date(selectedOrg.lastAudit).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Next Audit</span>
                        <span className="text-emerald-400">{new Date(selectedOrg.nextAudit).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedOrg(null)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    Edit Organization
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    View Users
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