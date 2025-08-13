'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

export default function MDEOWorkflowPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState('intake');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const workflowStages = [
    {
      id: 'intake',
      name: 'Intake & Triage',
      description: 'Initial claim receipt and priority assessment',
      count: 42,
      avgTime: '2.3 hours',
      color: 'from-blue-500 to-blue-600',
      icon: '📥'
    },
    {
      id: 'evidence',
      name: 'Evidence Review',
      description: 'Medical documentation analysis and verification',
      count: 38,
      avgTime: '4.1 hours',
      color: 'from-purple-500 to-purple-600',
      icon: '🔍'
    },
    {
      id: 'draft',
      name: 'Draft Generation',
      description: 'AI-powered exam draft creation',
      count: 27,
      avgTime: '1.2 hours',
      color: 'from-emerald-500 to-emerald-600',
      icon: '📝'
    },
    {
      id: 'mdeo-review',
      name: 'MDEO Review',
      description: 'Medical Disability Examination Office review',
      count: 19,
      avgTime: '3.5 hours',
      color: 'from-amber-500 to-amber-600',
      icon: '👨‍⚕️'
    },
    {
      id: 'approval',
      name: 'Approval & Routing',
      description: 'Final approval and exam scheduling',
      count: 15,
      avgTime: '1.8 hours',
      color: 'from-green-500 to-green-600',
      icon: '✅'
    }
  ];

  const mockCases = [
    {
      id: 'MDEO-2025-001',
      veteranName: 'Johnson, Robert A.',
      claimType: 'PTSD Increase',
      stage: 'mdeo-review',
      priority: 'High',
      assignedTo: 'Dr. Sarah Chen',
      daysInQueue: 3,
      confidence: 94,
      examRequired: true
    },
    {
      id: 'MDEO-2025-002',
      veteranName: 'Williams, Maria C.',
      claimType: 'Hearing Loss',
      stage: 'evidence',
      priority: 'Standard',
      assignedTo: 'Dr. Michael Ross',
      daysInQueue: 5,
      confidence: 87,
      examRequired: false
    },
    {
      id: 'MDEO-2025-003',
      veteranName: 'Davis, James T.',
      claimType: 'Back Condition',
      stage: 'draft',
      priority: 'High',
      assignedTo: 'Dr. Emily Wang',
      daysInQueue: 1,
      confidence: 91,
      examRequired: true
    },
    {
      id: 'MDEO-2025-004',
      veteranName: 'Brown, Jennifer L.',
      claimType: 'Knee Condition',
      stage: 'approval',
      priority: 'Low',
      assignedTo: 'Dr. John Martinez',
      daysInQueue: 7,
      confidence: 96,
      examRequired: false
    },
    {
      id: 'MDEO-2025-005',
      veteranName: 'Miller, David K.',
      claimType: 'TBI',
      stage: 'intake',
      priority: 'High',
      assignedTo: 'Unassigned',
      daysInQueue: 0,
      confidence: 82,
      examRequired: true
    }
  ];

  const filteredCases = filterStatus === 'all' 
    ? mockCases 
    : mockCases.filter(c => c.stage === filterStatus);

  return (
    <AppLayout>
      <WelcomeModal
        pageName="mdeo-workflow"
        title="MDEO Workflow Management"
        description="Medical Disability Examination Office workflow system for managing exam requests, medical reviews, and approval processes. Streamline the path from claim to examination."
        features={[
          "Real-time workflow tracking and stage management",
          "AI-assisted draft generation and review tools",
          "Medical professional assignment and workload balancing",
          "Comprehensive audit trail and compliance tracking"
        ]}
      />

      <div className={`p-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">MDEO Workflow Management</h1>
          <p className="text-slate-400">
            Medical Disability Examination Office • {mockCases.length} Active Cases • 12.7 hr Average Processing Time
          </p>
        </div>

        {/* Workflow Pipeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Workflow Pipeline</h2>
          <div className="flex items-center space-x-2 overflow-x-auto pb-4">
            {workflowStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <button
                  onClick={() => setActiveStage(stage.id)}
                  className={`relative min-w-[200px] p-4 rounded-xl border transition-all duration-300 hover:shadow-xl ${
                    activeStage === stage.id
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stage.color} rounded-t-xl`}></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stage.icon}</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-medium">
                      {stage.count}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-100 mb-1">{stage.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{stage.description}</p>
                  <p className="text-xs text-slate-500">Avg: {stage.avgTime}</p>
                </button>
                {index < workflowStages.length - 1 && (
                  <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border border-blue-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📊</span>
              <span className="text-xs text-blue-400">Today</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">141</p>
            <p className="text-sm text-slate-400">Total Cases</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 border border-emerald-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-emerald-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-xs text-emerald-400">62%</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">87</p>
            <p className="text-sm text-slate-400">Exams Eliminated</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-purple-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⏱️</span>
              <span className="text-xs text-purple-400">-48%</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">12.7h</p>
            <p className="text-sm text-slate-400">Avg Processing</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 border border-amber-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-amber-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👨‍⚕️</span>
              <span className="text-xs text-amber-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">24</p>
            <p className="text-sm text-slate-400">MDEO Staff</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              All Cases ({mockCases.length})
            </button>
            {workflowStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setFilterStatus(stage.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filterStatus === stage.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {stage.name} ({mockCases.filter(c => c.stage === stage.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-slate-100">Active MDEO Cases</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Case ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Veteran</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Claim Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Exam</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {caseItem.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-200">
                      {caseItem.veteranName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                      {caseItem.claimType}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium bg-gradient-to-r ${
                        workflowStages.find(s => s.id === caseItem.stage)?.color
                      } text-white`}>
                        {workflowStages.find(s => s.id === caseItem.stage)?.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border ${
                        caseItem.priority === 'High'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : caseItem.priority === 'Standard'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                      {caseItem.assignedTo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">
                      {caseItem.daysInQueue}d
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-200">{caseItem.confidence}%</span>
                        <div className="ml-2 w-16 bg-slate-700 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            style={{ width: `${caseItem.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        caseItem.examRequired ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {caseItem.examRequired ? 'Required' : 'Eliminated'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100">Case Review: {selectedCase.id}</h2>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Veteran</label>
                    <p className="text-sm font-medium text-slate-200">{selectedCase.veteranName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Claim Type</label>
                    <p className="text-sm font-medium text-slate-200">{selectedCase.claimType}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Current Stage</label>
                    <p className="text-sm font-medium text-slate-200">
                      {workflowStages.find(s => s.id === selectedCase.stage)?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">AI Confidence</label>
                    <p className="text-sm font-medium text-slate-200">{selectedCase.confidence}%</p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-100 mb-3">Recommended Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm">
                      Approve for Next Stage
                    </button>
                    <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors text-sm">
                      Request Additional Evidence
                    </button>
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm">
                      Reassign Case
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}