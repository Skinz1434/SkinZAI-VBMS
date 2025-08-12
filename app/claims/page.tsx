'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import { mockDatabase } from '../lib/mockData';

export default function ClaimsManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter claims based on search and filters
  const filteredClaims = mockDatabase.claims.filter(claim => {
    const matchesSearch = searchTerm === '' || 
      claim.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.fileNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || claim.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesPriority = filterPriority === 'all' || claim.priority.toLowerCase() === filterPriority.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'Development': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Evidence Gathering': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'Ready for Decision': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Complete': 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    };
    return colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-500/10 text-red-400 border-red-500/30',
      'Standard': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Low': 'bg-green-500/10 text-green-400 border-green-500/30'
    };
    return colors[priority] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Standard': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
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
                <h1 className="text-lg font-semibold text-slate-100">Claims Management</h1>
                <p className="text-sm text-slate-500">Veterans Disability Compensation Claims</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                {filteredClaims.length} of {mockDatabase.claims.length} claims
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                New Claim
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Search and Filters */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Active Claims Processing</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Search Claims</label>
                <input
                  type="text"
                  placeholder="Search by veteran name, claim ID, or file number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="development">Development</option>
                  <option value="evidence gathering">Evidence Gathering</option>
                  <option value="ready for decision">Ready for Decision</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="standard">Standard</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-slate-100">{mockDatabase.claims.length}</p>
                <p className="text-sm text-slate-400">Total Claims</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-blue-400">{mockDatabase.claims.filter(c => c.status === 'Development').length}</p>
                <p className="text-sm text-slate-400">In Development</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-emerald-400">{mockDatabase.claims.filter(c => !c.examRequired).length}</p>
                <p className="text-sm text-slate-400">Exams Eliminated</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-red-400">{mockDatabase.claims.filter(c => c.priority === 'High').length}</p>
                <p className="text-sm text-slate-400">High Priority</p>
              </div>
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400">No claims found matching your search criteria.</p>
              </div>
            ) : (
              filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Veteran Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg">
                          {claim.veteranName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <Link 
                            href={`/veteran/${claim.veteranId}`}
                            className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
                          >
                            {claim.veteranName}
                          </Link>
                          <p className="text-sm text-slate-400 font-mono">{claim.fileNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Claim Details */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-100 mb-1">Claim {claim.id}</h3>
                          <p className="text-sm text-slate-400">{claim.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPriorityIcon(claim.priority)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(claim.priority)}`}>
                            {claim.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Claimed Conditions:</p>
                          <div className="flex flex-wrap gap-2">
                            {claim.conditions.map((condition, i) => (
                              <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                {condition.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Submitted:</span>
                            <p className="text-slate-200">{new Date(claim.submittedDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Days in Queue:</span>
                            <p className="text-slate-200">{claim.daysInQueue} days</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Target Date:</span>
                            <p className="text-slate-200">{new Date(claim.targetCompletionDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* RUMEV1 Analysis */}
                    <div className="lg:col-span-1">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <h4 className="font-medium text-slate-100 mb-3 flex items-center">
                          <span className="mr-2">🤖</span>
                          RUMEV1 Analysis
                        </h4>
                        
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={claim.examRequired ? 'text-red-400' : 'text-emerald-400'}>
                                {claim.examRequired ? '🔍' : '✅'}
                              </span>
                              <span className="text-slate-400">Exam Status:</span>
                            </div>
                            <p className="text-xs text-slate-200">
                              {claim.rumevAnalysis?.examEliminated ? 'Eliminated' : 'Required'}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-slate-400">Confidence:</span>
                            <p className="text-sm font-semibold text-emerald-400">
                              {claim.rumevAnalysis?.confidence}%
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-slate-400">Est. Benefit:</span>
                            <p className="text-sm font-semibold text-emerald-400">
                              {claim.rumevAnalysis?.estimatedMonthlyBenefit}
                            </p>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-700">
                            <span className="text-slate-400 text-xs">Assigned to:</span>
                            <p className="text-slate-200 text-xs">{claim.assignedTo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                      Last updated: {new Date(claim.lastUpdateDate).toLocaleDateString()}
                    </div>
                    <Link 
                      href={`/claims/${claim.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}