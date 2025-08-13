'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { useAuth } from '../components/AuthProvider';
import { massiveMockDatabase } from '../lib/massiveMockData';

export default function ClaimsManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedView, setSelectedView] = useState<'list' | 'kanban' | 'timeline'>('list');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState(0);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status' | 'veteran'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsLoaded(true);
    
    // Real-time updates simulation
    if (realTimeUpdates) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 30000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [realTimeUpdates]);
  
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterStatus !== 'all') count++;
    if (filterPriority !== 'all') count++;
    setActiveFilters(count);
  }, [searchTerm, filterStatus, filterPriority]);

  // Filter and sort claims based on search and filters
  const filteredClaims = massiveMockDatabase.claims.filter(claim => {
    const matchesSearch = searchTerm === '' || 
      claim.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.fileNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || claim.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesPriority = filterPriority === 'all' || claim.priority.toLowerCase() === filterPriority.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Standard': 2, 'Low': 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'veteran':
        comparison = a.veteranName.localeCompare(b.veteranName);
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'Development': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Evidence Gathering': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'Ready for Decision': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Complete': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      'In Review': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      'Preparing Decision': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
    return colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };
  
  const getStatusIcon = (status: string) => {
    const icons = {
      'Pending': '⏳',
      'Development': '🔄', 
      'Evidence Gathering': '📋',
      'Ready for Decision': '⚖️',
      'Complete': '✅',
      'In Review': '👁️',
      'Preparing Decision': '📝'
    };
    return icons[status] || '📄';
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

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-slate-400 mb-6">Please sign in to access claims management</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <WelcomeModal
        pageName="claims"
        title="Claims Management"
        description="Comprehensive claims processing with real-time updates, advanced filtering, and AI-powered workflow management through RUMEV1 system."
        features={[
          "Real-time claim status updates and workflow tracking",
          "Advanced filtering and sorting with massive dataset",
          "RUMEV1 AI analysis and exam elimination insights",
          "Multi-view support (List, Kanban, Timeline)"
        ]}
        demoActions={[
          { label: 'Filter High Priority', action: () => setFilterPriority('high') },
          { label: 'View Ready for Decision', action: () => setFilterStatus('ready for decision') },
          { label: 'Switch to Kanban View', action: () => setSelectedView('kanban') }
        ]}
      />

      <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} p-6`}>
        {/* Header Stats */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Claims Management</h1>
            <p className="text-slate-400">Veterans Disability Compensation Claims</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              {filteredClaims.length} of {massiveMockDatabase.claims.length} claims
              {activeFilters > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className={`p-2 rounded-lg transition-colors ${
                  realTimeUpdates 
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
                title={`Real-time updates ${realTimeUpdates ? 'enabled' : 'disabled'}`}
              >
                {realTimeUpdates ? '🔴' : '⏸️'}
              </button>
              <span className="text-xs text-slate-500">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              New Claim
            </button>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Active Claims Processing</h2>
            
            {/* View Toggle and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                  {['list', 'kanban', 'timeline'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view as 'list' | 'kanban' | 'timeline')}
                      className={`px-4 py-2 text-sm rounded-md transition-colors capitalize ${
                        selectedView === view
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {view === 'list' && '📋'} {view === 'kanban' && '📊'} {view === 'timeline' && '📅'} {view}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-slate-400">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'status' | 'veteran')}
                    className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-slate-200"
                  >
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                    <option value="veteran">Veteran</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors"
                    title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterPriority('all');
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
                disabled={activeFilters === 0}
              >
                Clear Filters {activeFilters > 0 && `(${activeFilters})`}
              </button>
            </div>
            
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
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📋</span>
                  <span className="text-2xl font-semibold text-slate-100">{massiveMockDatabase.claims.length}</span>
                </div>
                <p className="text-sm text-slate-400">Total Claims</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🔄</span>
                  <span className="text-2xl font-semibold text-blue-400">{massiveMockDatabase.claims.filter(c => c.status === 'Development').length}</span>
                </div>
                <p className="text-sm text-slate-400">In Development</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-2xl font-semibold text-emerald-400">{massiveMockDatabase.claims.filter(c => !c.examRequired).length}</span>
                </div>
                <p className="text-sm text-slate-400">Exams Eliminated</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🔴</span>
                  <span className="text-2xl font-semibold text-red-400">{massiveMockDatabase.claims.filter(c => c.priority === 'High').length}</span>
                </div>
                <p className="text-sm text-slate-400">High Priority</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-2xl font-semibold text-emerald-400">
                    {((massiveMockDatabase.claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / massiveMockDatabase.claims.length)).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-slate-400">Avg Confidence</p>
              </div>
            </div>
          </div>

          {/* Claims Views */}
          {selectedView === 'kanban' && (
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              {['Pending', 'Development', 'Evidence Gathering', 'Ready for Decision'].map((status) => {
                const statusClaims = filteredClaims.filter(claim => claim.status === status);
                return (
                  <div key={status} className="bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="p-4 border-b border-slate-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-100 flex items-center space-x-2">
                          <span>{getStatusIcon(status)}</span>
                          <span>{status}</span>
                        </h3>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                          {statusClaims.length}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {statusClaims.map((claim) => (
                        <div key={claim.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-200 text-sm">{claim.veteranName}</span>
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(claim.priority)}`}>
                              {claim.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">Claim {claim.id}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">{claim.daysInQueue} days</span>
                            <span className={claim.examRequired ? 'text-red-400' : 'text-emerald-400'}>
                              {claim.examRequired ? '🔍' : '✅'}
                            </span>
                          </div>
                          {claim.rumevAnalysis?.confidence && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-500">AI Confidence</span>
                                <span className="text-emerald-400">{claim.rumevAnalysis.confidence}%</span>
                              </div>
                              <div className="bg-slate-700 rounded-full h-1">
                                <div 
                                  className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${claim.rumevAnalysis.confidence}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {statusClaims.length === 0 && (
                        <div className="text-center text-slate-500 text-sm py-8">
                          No claims in {status.toLowerCase()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedView === 'timeline' && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center space-x-2">
                <span>📅</span>
                <span>Claims Processing Timeline</span>
              </h3>
              <div className="space-y-6">
                {filteredClaims.slice(0, 10).map((claim, index) => {
                  const progressPercentage = {
                    'Pending': 10,
                    'Development': 30,
                    'Evidence Gathering': 50,
                    'Ready for Decision': 80,
                    'Complete': 100
                  }[claim.status] || 0;
                  
                  return (
                    <div key={claim.id} className="relative">
                      {index < filteredClaims.slice(0, 10).length - 1 && (
                        <div className="absolute left-4 top-12 w-0.5 h-16 bg-slate-700" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {claim.veteranName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-100">{claim.veteranName} - Claim {claim.id}</h4>
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            Submitted {new Date(claim.submittedDate).toLocaleDateString()} • {claim.daysInQueue} days in queue
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-slate-300">{progressPercentage}%</span>
                              </div>
                              <div className="bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">RUMEV1 Confidence</p>
                              <p className="text-sm font-semibold text-emerald-400">
                                {claim.rumevAnalysis?.confidence || 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {selectedView === 'list' && (
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
                          <h3 className="font-semibold text-slate-100 mb-1 flex items-center space-x-2">
                            <span>Claim {claim.id}</span>
                            {realTimeUpdates && (
                              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Real-time monitoring active" />
                            )}
                          </h3>
                          <p className="text-sm text-slate-400">{claim.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg" title={`${claim.priority} Priority`}>{getPriorityIcon(claim.priority)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(claim.priority)}`}>
                            {claim.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)} flex items-center space-x-1`}>
                            <span>{getStatusIcon(claim.status)}</span>
                            <span>{claim.status}</span>
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
                            {claim.rumevAnalysis?.examEliminated && (
                              <p className="text-xs text-emerald-400 mt-1">
                                💰 ${((claim.rumevAnalysis?.confidence || 0) * 35).toFixed(0)} saved
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-slate-400">AI Confidence:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex-1 bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${claim.rumevAnalysis?.confidence || 0}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-emerald-400">
                                {claim.rumevAnalysis?.confidence}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-slate-400">Est. Benefit:</span>
                            <p className="text-sm font-semibold text-emerald-400">
                              {claim.rumevAnalysis?.estimatedMonthlyBenefit}
                            </p>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-700">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {claim.assignedTo?.split(' ').map(n => n[0]).join('') || 'AI'}
                              </div>
                              <div>
                                <span className="text-slate-400 text-xs">Assigned to:</span>
                                <p className="text-slate-200 text-xs">{claim.assignedTo || 'RUMEV1 AI System'}</p>
                              </div>
                            </div>
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
          )}
        </div>
      </div>
    </AppLayout>
  );
}