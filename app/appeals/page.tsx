'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { massiveMockDatabase } from '../lib/massiveMockData';

interface Appeal {
  id: string;
  claimId: string;
  veteranName: string;
  veteranId: string;
  appealType: 'legacy' | 'ama' | 'higher-level-review' | 'supplemental-claim' | 'board-appeal';
  status: 'pending' | 'in-review' | 'evidence-gathering' | 'hearing-scheduled' | 'decided' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'expedited';
  dateReceived: string;
  lastAction: string;
  docketNumber?: string;
  judge?: string;
  hearingDate?: string;
  conditions: string[];
  currentStage: string;
  estimatedCompletion: string;
  assignedTo: string;
  issues: {
    condition: string;
    currentRating: number;
    requestedRating: number;
    issue: string;
  }[];
  timeline: {
    date: string;
    action: string;
    details: string;
    actor: string;
  }[];
}

export default function AppealsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAppealType, setSelectedAppealType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('dateReceived');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Generate appeal data from existing claims
  const appeals: Appeal[] = massiveMockDatabase.claims.slice(0, 45).map((claim, index) => {
    const veteran = massiveMockDatabase.veterans.find(v => v.claimIds?.includes(claim.id));
    const appealTypes: Appeal['appealType'][] = ['legacy', 'ama', 'higher-level-review', 'supplemental-claim', 'board-appeal'];
    const statuses: Appeal['status'][] = ['pending', 'in-review', 'evidence-gathering', 'hearing-scheduled', 'decided', 'closed'];
    const priorities: Appeal['priority'][] = ['low', 'medium', 'high', 'expedited'];
    
    const judges = [
      'Judge Harrison', 'Judge Martinez', 'Judge Thompson', 'Judge Williams',
      'Judge Davis', 'Judge Rodriguez', 'Judge Johnson', 'Judge Lee',
      'Judge Brown', 'Judge Garcia', 'Judge Miller', 'Judge Wilson'
    ];

    const assignees = [
      'Sarah Chen', 'Michael Rodriguez', 'Jennifer Thompson', 'David Kim',
      'Lisa Williams', 'James Garcia', 'Emily Davis', 'Robert Martinez',
      'Amanda Johnson', 'Thomas Anderson', 'Maria Lopez', 'Christopher Lee'
    ];

    const stages = [
      'Initial Review', 'Evidence Gathering', 'Medical Examination',
      'Legal Review', 'Hearing Preparation', 'Decision Drafting',
      'Final Review', 'Quality Assurance', 'Notification'
    ];

    const appealType = appealTypes[Math.floor(Math.random() * appealTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    const receivedDate = new Date(2023, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
    const estimatedDays = appealType === 'higher-level-review' ? 125 : appealType === 'supplemental-claim' ? 145 : 365;
    const estimatedCompletion = new Date(receivedDate.getTime() + estimatedDays * 24 * 60 * 60 * 1000);

    const issues = claim.conditions.slice(0, Math.floor(Math.random() * 3) + 1).map(condition => ({
      condition: condition.name,
      currentRating: Math.floor(Math.random() * 10) * 10,
      requestedRating: Math.floor(Math.random() * 5 + 5) * 10,
      issue: `Rating determination for ${condition.name} condition`
    }));

    const timelineActions = [
      'Appeal received and logged',
      'Initial review completed',
      'Evidence request sent to veteran',
      'Medical records obtained',
      'C&P examination scheduled',
      'Legal review initiated',
      'Hearing scheduled',
      'Decision drafted',
      'Quality review completed',
      'Decision finalized'
    ];

    const timeline = Array.from({ length: Math.floor(Math.random() * 6) + 3 }, (_, i) => {
      const actionDate = new Date(receivedDate.getTime() + i * 30 * 24 * 60 * 60 * 1000);
      return {
        date: actionDate.toISOString().split('T')[0],
        action: timelineActions[i % timelineActions.length],
        details: `${timelineActions[i % timelineActions.length]} on ${actionDate.toLocaleDateString()}`,
        actor: assignees[Math.floor(Math.random() * assignees.length)]
      };
    });

    return {
      id: `APL-${String(index + 1).padStart(4, '0')}`,
      claimId: claim.id,
      veteranName: veteran?.name || 'Unknown Veteran',
      veteranId: veteran?.id || 'V000',
      appealType,
      status,
      priority,
      dateReceived: receivedDate.toISOString().split('T')[0],
      lastAction: timeline[timeline.length - 1]?.action || 'Appeal received',
      docketNumber: appealType === 'board-appeal' ? `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}` : undefined,
      judge: appealType === 'board-appeal' && Math.random() > 0.5 ? judges[Math.floor(Math.random() * judges.length)] : undefined,
      hearingDate: status === 'hearing-scheduled' ? new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      conditions: claim.conditions.map(c => c.name),
      currentStage: stages[Math.floor(Math.random() * stages.length)],
      estimatedCompletion: estimatedCompletion.toISOString().split('T')[0],
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      issues,
      timeline: timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  });

  // Filter and sort appeals
  const filteredAppeals = appeals
    .filter(appeal => {
      const matchesSearch = searchTerm === '' || 
        appeal.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.docketNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedAppealType === 'all' || appeal.appealType === selectedAppealType;
      const matchesStatus = selectedStatus === 'all' || appeal.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortBy as keyof Appeal];
      let bVal: any = b[sortBy as keyof Appeal];
      
      if (sortBy === 'dateReceived') {
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

  // Calculate metrics
  const totalAppeals = appeals.length;
  const pendingAppeals = appeals.filter(a => ['pending', 'in-review', 'evidence-gathering'].includes(a.status)).length;
  const averageDaysOpen = Math.round(appeals.reduce((acc, appeal) => {
    const daysOpen = Math.floor((Date.now() - new Date(appeal.dateReceived).getTime()) / (1000 * 60 * 60 * 24));
    return acc + daysOpen;
  }, 0) / appeals.length);
  const expeditedAppeals = appeals.filter(a => a.priority === 'expedited').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'decided': return 'text-emerald-400 bg-emerald-400/10';
      case 'closed': return 'text-slate-400 bg-slate-400/10';
      case 'hearing-scheduled': return 'text-purple-400 bg-purple-400/10';
      case 'in-review': return 'text-blue-400 bg-blue-400/10';
      case 'evidence-gathering': return 'text-yellow-400 bg-yellow-400/10';
      case 'pending': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'legacy': return 'text-purple-400 bg-purple-400/10';
      case 'ama': return 'text-blue-400 bg-blue-400/10';
      case 'higher-level-review': return 'text-emerald-400 bg-emerald-400/10';
      case 'supplemental-claim': return 'text-yellow-400 bg-yellow-400/10';
      case 'board-appeal': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'expedited': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="appeals"
          title="Appeals Management"
          description="Comprehensive appeals tracking and management system for handling veteran benefit appeals across all VA appeal processes including Legacy, AMA, Higher Level Reviews, and Board Appeals."
          features={[
            "Multi-track appeal processing with Legacy and AMA workflows",
            "Real-time status tracking and timeline management",
            "Issue-specific appeal tracking with rating comparisons",
            "Hearing scheduling and judge assignment coordination"
          ]}
          demoActions={[
            { label: "View Board Appeals", action: () => setSelectedAppealType('board-appeal') },
            { label: "Show Expedited Cases", action: () => setSelectedStatus('expedited') },
            { label: "Search Appeals", action: () => setSearchTerm('Johnson') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Appeals Management</h1>
                  <p className="text-sm text-slate-500">Legacy & AMA Appeal Processing</p>
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
            {/* Appeals Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Total Appeals</h3>
                  <span className="text-2xl">⚖️</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {totalAppeals}
                </div>
                <div className="text-xs text-blue-300/70">Active appeal cases</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Pending Review</h3>
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {pendingAppeals}
                </div>
                <div className="text-xs text-yellow-300/70">Awaiting processing</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Avg Days Open</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {averageDaysOpen}
                </div>
                <div className="text-xs text-purple-300/70">Average processing time</div>
              </div>

              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-red-300">Expedited</h3>
                  <span className="text-2xl">🚨</span>
                </div>
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {expeditedAppeals}
                </div>
                <div className="text-xs text-red-300/70">Priority cases</div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Filter & Search</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by veteran, appeal ID, or docket..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Appeal Type</label>
                    <select
                      value={selectedAppealType}
                      onChange={(e) => setSelectedAppealType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="legacy">Legacy</option>
                      <option value="ama">AMA</option>
                      <option value="higher-level-review">Higher Level Review</option>
                      <option value="supplemental-claim">Supplemental Claim</option>
                      <option value="board-appeal">Board Appeal</option>
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
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="evidence-gathering">Evidence Gathering</option>
                      <option value="hearing-scheduled">Hearing Scheduled</option>
                      <option value="decided">Decided</option>
                      <option value="closed">Closed</option>
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
                        <option value="dateReceived">Date Received</option>
                        <option value="veteranName">Veteran Name</option>
                        <option value="status">Status</option>
                        <option value="priority">Priority</option>
                        <option value="appealType">Appeal Type</option>
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

            {/* Appeals List */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-100">
                  Appeals ({filteredAppeals.length})
                </h2>
              </div>
              
              <div className="divide-y divide-slate-800">
                {filteredAppeals.map((appeal) => (
                  <div
                    key={appeal.id}
                    className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedAppeal(appeal)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {appeal.veteranName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appeal.status)}`}>
                            {appeal.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(appeal.appealType)}`}>
                            {appeal.appealType.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(appeal.priority)}`}>
                            {appeal.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">Appeal ID</p>
                            <p className="text-sm font-mono text-slate-300">{appeal.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Date Received</p>
                            <p className="text-sm text-slate-300">{new Date(appeal.dateReceived).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Assigned To</p>
                            <p className="text-sm text-slate-300">{appeal.assignedTo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Current Stage</p>
                            <p className="text-sm text-slate-300">{appeal.currentStage}</p>
                          </div>
                        </div>
                        
                        {appeal.docketNumber && (
                          <div className="mb-2">
                            <span className="text-sm text-slate-400">Docket Number: </span>
                            <span className="text-sm font-mono text-slate-300">{appeal.docketNumber}</span>
                          </div>
                        )}
                        
                        {appeal.judge && (
                          <div className="mb-2">
                            <span className="text-sm text-slate-400">Assigned Judge: </span>
                            <span className="text-sm text-slate-300">{appeal.judge}</span>
                          </div>
                        )}
                        
                        {appeal.hearingDate && (
                          <div className="mb-2">
                            <span className="text-sm text-slate-400">Hearing Date: </span>
                            <span className="text-sm text-emerald-400">{new Date(appeal.hearingDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Issues:</span>
                            <span className="text-sm text-slate-300">{appeal.issues.length} issue{appeal.issues.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Conditions:</span>
                            <div className="flex flex-wrap gap-1">
                              {appeal.conditions.slice(0, 2).map((condition, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-800 text-xs text-slate-300 rounded">
                                  {condition}
                                </span>
                              ))}
                              {appeal.conditions.length > 2 && (
                                <span className="text-xs text-slate-400">+{appeal.conditions.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-sm text-slate-400 mb-1">Est. Completion</div>
                        <div className="text-sm text-slate-300">{new Date(appeal.estimatedCompletion).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500 mt-2">
                          {Math.floor((new Date(appeal.estimatedCompletion).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredAppeals.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No appeals match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Appeal Detail Modal */}
        {selectedAppeal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">{selectedAppeal.veteranName}</h2>
                    <p className="text-slate-400">Appeal Details - {selectedAppeal.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAppeal(null)}
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
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Appeal Information</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Appeal ID</span>
                          <span className="text-slate-200 font-mono">{selectedAppeal.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Claim ID</span>
                          <span className="text-slate-200 font-mono">{selectedAppeal.claimId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedAppeal.appealType)}`}>
                            {selectedAppeal.appealType.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedAppeal.status)}`}>
                            {selectedAppeal.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Priority</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedAppeal.priority)}`}>
                            {selectedAppeal.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Assigned To</span>
                          <span className="text-slate-200">{selectedAppeal.assignedTo}</span>
                        </div>
                        {selectedAppeal.judge && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Judge</span>
                            <span className="text-slate-200">{selectedAppeal.judge}</span>
                          </div>
                        )}
                        {selectedAppeal.docketNumber && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Docket Number</span>
                            <span className="text-slate-200 font-mono">{selectedAppeal.docketNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Timeline</h3>
                    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date Received</span>
                        <span className="text-slate-200">{new Date(selectedAppeal.dateReceived).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Stage</span>
                        <span className="text-blue-400">{selectedAppeal.currentStage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Completion</span>
                        <span className="text-emerald-400">{new Date(selectedAppeal.estimatedCompletion).toLocaleDateString()}</span>
                      </div>
                      {selectedAppeal.hearingDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hearing Date</span>
                          <span className="text-purple-400">{new Date(selectedAppeal.hearingDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Days Open</span>
                        <span className="text-yellow-400">
                          {Math.floor((Date.now() - new Date(selectedAppeal.dateReceived).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Appeal Issues</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="space-y-4">
                      {selectedAppeal.issues.map((issue, index) => (
                        <div key={index} className="border border-slate-700 rounded-lg p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Condition</p>
                              <p className="text-slate-200 font-medium">{issue.condition}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Current Rating</p>
                              <p className="text-red-400 font-bold">{issue.currentRating}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400 mb-1">Requested Rating</p>
                              <p className="text-emerald-400 font-bold">{issue.requestedRating}%</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-slate-400 mb-1">Issue Description</p>
                            <p className="text-slate-300 text-sm">{issue.issue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Activity Timeline</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="space-y-4">
                      {selectedAppeal.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-slate-200 font-medium">{item.action}</p>
                              <p className="text-slate-400 text-sm">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                            <p className="text-slate-300 text-sm mt-1">{item.details}</p>
                            <p className="text-slate-500 text-xs mt-1">By: {item.actor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedAppeal(null)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/veterans/${selectedAppeal.veteranId}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    View Veteran Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}