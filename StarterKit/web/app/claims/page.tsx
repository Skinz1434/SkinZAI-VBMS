'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClaimsManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Comprehensive veteran claims data
  const veteranClaims = [
    {
      id: 'CL-2025-081201',
      veteran: {
        name: 'Jordan R. Sampleton',
        fileNumber: 'F31605305',
        ssn: '***-**-5390',
        dob: '1980-03-15',
        branch: 'Navy',
        serviceYears: '2002-2014'
      },
      claimType: 'Disability Compensation',
      conditions: [
        { name: 'PTSD', category: 'Mental Health', requestedRating: 70, currentRating: 0, status: 'Under Review' },
        { name: 'Lower Back Strain', category: 'Musculoskeletal', requestedRating: 40, currentRating: 0, status: 'Evidence Review' },
        { name: 'Tinnitus', category: 'Hearing', requestedRating: 10, currentRating: 0, status: 'Exam Scheduled' }
      ],
      status: 'Development',
      priority: 'High',
      submittedDate: '2025-07-15',
      lastUpdate: '2025-08-10',
      targetDate: '2025-09-15',
      daysInQueue: 28,
      examRequired: false,
      rumevDecision: 'Exam Eliminated - Sufficient Evidence',
      estimatedRating: '70% (PTSD), 20% (Back), 10% (Tinnitus)',
      estimatedAward: '$1,847/month',
      documents: 15,
      evidence: ['Service Medical Records', 'VA Medical Records', 'Private Treatment Records', 'Lay Statements'],
      assignedRater: 'Rating Specialist Johnson',
      regionalOffice: 'Houston Regional Office'
    },
    {
      id: 'CL-2025-080845',
      veteran: {
        name: 'Michael J. Thompson',
        fileNumber: 'F89432105',
        ssn: '***-**-7821',
        dob: '1985-11-22',
        branch: 'Army',
        serviceYears: '2003-2011'
      },
      claimType: 'Disability Compensation',
      conditions: [
        { name: 'Right Knee Strain', category: 'Musculoskeletal', requestedRating: 30, currentRating: 0, status: 'C&P Exam Required' },
        { name: 'Sleep Apnea', category: 'Respiratory', requestedRating: 50, currentRating: 0, status: 'Evidence Gathering' }
      ],
      status: 'Evidence Gathering',
      priority: 'Standard',
      submittedDate: '2025-06-28',
      lastUpdate: '2025-08-08',
      targetDate: '2025-09-30',
      daysInQueue: 45,
      examRequired: true,
      rumevDecision: 'C&P Exam Required - Insufficient Medical Evidence',
      estimatedRating: '30% (Knee), 50% (Sleep Apnea)',
      estimatedAward: '$1,235/month',
      documents: 8,
      evidence: ['Service Personnel Records', 'Limited Medical Records'],
      assignedRater: 'Rating Specialist Davis',
      regionalOffice: 'Atlanta Regional Office'
    },
    {
      id: 'CL-2025-081156',
      veteran: {
        name: 'Sarah K. Williams',
        fileNumber: 'F23156789',
        ssn: '***-**-4563',
        dob: '1987-06-08',
        branch: 'Air Force',
        serviceYears: '2006-2018'
      },
      claimType: 'Disability Compensation',
      conditions: [
        { name: 'Bilateral Hearing Loss', category: 'Hearing', requestedRating: 30, currentRating: 0, status: 'Medical Review' },
        { name: 'Tinnitus', category: 'Hearing', requestedRating: 10, currentRating: 0, status: 'Medical Review' }
      ],
      status: 'Ready for Decision',
      priority: 'Standard',
      submittedDate: '2025-08-01',
      lastUpdate: '2025-08-11',
      targetDate: '2025-08-25',
      daysInQueue: 11,
      examRequired: false,
      rumevDecision: 'Sufficient Evidence - Audio Testing Complete',
      estimatedRating: '30% (Hearing Loss), 10% (Tinnitus)',
      estimatedAward: '$524/month',
      documents: 12,
      evidence: ['Audiometry Reports', 'Service Medical Records', 'Occupational Exposure Records'],
      assignedRater: 'Rating Specialist Martinez',
      regionalOffice: 'Phoenix Regional Office'
    },
    {
      id: 'CL-2025-072234',
      veteran: {
        name: 'Robert E. Harrison',
        fileNumber: 'F67890234',
        ssn: '***-**-9876',
        dob: '1975-12-03',
        branch: 'Marines',
        serviceYears: '1994-2014'
      },
      claimType: 'Disability Compensation',
      conditions: [
        { name: 'TBI (Traumatic Brain Injury)', category: 'Neurological', requestedRating: 70, currentRating: 0, status: 'Neurological Exam Required' },
        { name: 'Migraine Headaches', category: 'Neurological', requestedRating: 30, currentRating: 0, status: 'Secondary to TBI' }
      ],
      status: 'Development',
      priority: 'High',
      submittedDate: '2025-07-22',
      lastUpdate: '2025-08-09',
      targetDate: '2025-10-15',
      daysInQueue: 21,
      examRequired: true,
      rumevDecision: 'Specialized Neurological Exam Required',
      estimatedRating: '70% (TBI), 30% (Migraines)',
      estimatedAward: '$1,847/month',
      documents: 22,
      evidence: ['Combat Medical Records', 'Neuropsychological Testing', 'VA Mental Health Records'],
      assignedRater: 'Senior Rating Specialist Chen',
      regionalOffice: 'Los Angeles Regional Office'
    }
  ];

  // Filter claims based on status and search
  const filteredClaims = veteranClaims.filter(claim => {
    const matchesStatus = filterStatus === 'all' || claim.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesSearch = searchTerm === '' || 
      claim.veteran.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.veteran.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Evidence Gathering': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Ready for Decision': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Under Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'High' 
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 neural-grid opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Professional Header */}
      <header className="relative z-50 glass-strong border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* VA Logo & System Name */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg mirror-effect group-hover:scale-110 transition-all duration-300">
                <div className="text-white font-bold text-xl">VA</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-display group-hover:text-blue-400 transition-colors">
                  Claims Management
                </h1>
                <p className="text-sm text-slate-400 font-medium">Veterans Benefits Processing Center</p>
              </div>
            </Link>

            {/* System Status & Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 group">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">Claims System Online</span>
                  <div className="group-hover:visible invisible bg-slate-800 text-white text-xs px-3 py-1 rounded-lg absolute top-full mt-2 whitespace-nowrap">
                    All claim processing systems operational
                  </div>
                </div>
                <div className="text-slate-400 font-mono border-l border-slate-600 pl-4">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-4">
                {[
                  { name: 'Dashboard', icon: '📊', href: '/dashboard' },
                  { name: 'Analytics', icon: '📈', href: '/analytics' },
                  { name: 'Claims', icon: '📋', href: '/claims', active: true },
                  { name: 'eFolder', icon: '📁', href: '/efolder' },
                  { name: 'Orchestration', icon: '🤖', href: '/orchestration' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center space-x-2 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg ${
                      item.active 
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5 hover:shadow-lg'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Enhanced Tooltip */}
                    <div className="invisible group-hover:visible absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-2xl border border-slate-600 whitespace-nowrap z-50">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-slate-400">
                        {item.name === 'Dashboard' ? 'System overview & metrics' :
                         item.name === 'Analytics' ? 'Performance analytics' :
                         item.name === 'Claims' ? 'Active claims management' :
                         item.name === 'eFolder' ? 'Document management' :
                         'AI agent orchestration'}
                      </div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600 rotate-45"></div>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Enhanced Header Section */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="glass-strong rounded-3xl p-8 border border-slate-700/50 mb-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 font-display">
                  Veterans Disability Claims Management
                </h2>
                <p className="text-slate-400 text-lg">
                  Comprehensive claim processing with RUMEV1 AI assistance and real-time status tracking
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    {filteredClaims.length}
                  </div>
                  <div className="text-slate-400 text-sm">Active Claims</div>
                </div>
                <button className="group skinzai-button px-6 py-3 hover:shadow-2xl">
                  <div className="flex items-center space-x-2">
                    <span>New Claim</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Enhanced Search and Filter Controls */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Search Claims</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search by name, file number, or claim ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="development">Development</option>
                  <option value="evidence">Evidence Gathering</option>
                  <option value="ready">Ready for Decision</option>
                  <option value="review">Under Review</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Quick Actions</label>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-3 rounded-xl text-sm hover:bg-blue-500/30 transition-all group">
                    <div className="flex items-center justify-center space-x-1">
                      <span>Export</span>
                      <svg className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  <button className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-3 rounded-xl text-sm hover:bg-emerald-500/30 transition-all">
                    <div className="flex items-center justify-center">
                      <span>📊</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Claims List */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="group glass-strong rounded-3xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer"
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Veteran Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {claim.veteran.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                          {claim.veteran.name}
                        </h3>
                        <p className="text-slate-400 text-sm font-mono">{claim.veteran.fileNumber}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Branch:</span>
                        <span className="text-white font-medium">{claim.veteran.branch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Service:</span>
                        <span className="text-white font-medium">{claim.veteran.serviceYears}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Claim Details */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white mb-1">Claim {claim.id}</h4>
                        <p className="text-slate-400 text-sm">{claim.claimType}</p>
                      </div>
                      <div className="flex space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(claim.priority)}`}>
                          {claim.priority}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Claimed Conditions:</p>
                        <div className="flex flex-wrap gap-2">
                          {claim.conditions.map((condition, i) => (
                            <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600/50">
                              {condition.name} ({condition.requestedRating}%)
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Submitted:</span>
                          <p className="text-white font-medium">{new Date(claim.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Days in Queue:</span>
                          <p className="text-white font-medium">{claim.daysInQueue} days</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Target Date:</span>
                          <p className="text-white font-medium">{new Date(claim.targetDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* RUMEV1 Analysis */}
                  <div className="lg:col-span-1">
                    <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                      <h5 className="font-semibold text-white mb-3 flex items-center">
                        <span className="mr-2">🤖</span>
                        RUMEV1 Analysis
                      </h5>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={claim.examRequired ? 'text-amber-400' : 'text-emerald-400'}>
                              {claim.examRequired ? '🔍' : '✅'}
                            </span>
                            <span className="text-slate-400">Exam Status:</span>
                          </div>
                          <p className="text-white text-xs">{claim.rumevDecision}</p>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Est. Rating:</span>
                          <p className="text-emerald-400 font-semibold text-xs">{claim.estimatedRating}</p>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Est. Award:</span>
                          <p className="text-emerald-400 font-bold">{claim.estimatedAward}</p>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-700/50">
                          <span className="text-slate-400 text-xs">Assigned to:</span>
                          <p className="text-white text-xs">{claim.assignedRater}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Enhanced Floating Actions */}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        {/* Filters Toggle */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-purple-600 to-pink-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600 shadow-2xl">
            <div className="font-semibold">Advanced Filters</div>
            <div className="text-slate-400 text-xs">Priority, RO, Conditions</div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-emerald-600 to-teal-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <div className="relative">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600 shadow-2xl">
            <div className="font-semibold">RUMEV1 Assistant</div>
            <div className="text-slate-400 text-xs">Claims analysis & recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
