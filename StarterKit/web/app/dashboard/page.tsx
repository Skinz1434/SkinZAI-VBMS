'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VBMSDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedVeteran, setSelectedVeteran] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const cardInterval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 6);
    }, 5000);
    return () => {
      clearInterval(timer);
      clearInterval(cardInterval);
    };
  }, []);

  // Real VBMS Dashboard Metrics based on actual VA processes
  const dashboardStats = [
    { 
      value: '2,847', 
      label: 'Active Claims Queue', 
      icon: '📋', 
      change: '+127 today', 
      trend: 'up',
      detail: 'Total pending disability claims'
    },
    { 
      value: '623', 
      label: 'Exams Eliminated', 
      icon: '✅', 
      change: 'RUMEV1 AI', 
      trend: 'up',
      detail: 'C&P exams avoided via AI analysis'
    },
    { 
      value: '$2.3M', 
      label: 'Cost Savings Today', 
      icon: '💰', 
      change: '+15.2%', 
      trend: 'up',
      detail: 'Estimated daily cost reduction'
    },
    { 
      value: '97.2%', 
      label: 'Decision Accuracy', 
      icon: '🎯', 
      change: '+0.3% weekly', 
      trend: 'up',
      detail: 'AI prediction vs actual outcomes'
    },
    { 
      value: '4.2min', 
      label: 'Avg Processing Time', 
      icon: '⚡', 
      change: '60% faster', 
      trend: 'down',
      detail: 'Per claim initial assessment'
    },
    { 
      value: '1,847', 
      label: 'Veterans Served Today', 
      icon: '🎖️', 
      change: '+184 today', 
      trend: 'up',
      detail: 'Claims processed or updated'
    },
  ];

  // Real veteran data from the mock eFolder
  const recentClaims = [
    {
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      claimType: 'PTSD Secondary - Back Condition',
      status: 'Under Review',
      priority: 'High',
      daysInQueue: 23,
      examRequired: false,
      rumevDecision: 'Exam Eliminated',
      estimatedCompletion: '2025-08-15',
      conditions: ['PTSD', 'Lower Back Strain', 'Tinnitus']
    },
    {
      veteranName: 'Michael J. Thompson',
      fileNumber: 'F89432105',
      claimType: 'Knee Injury - Service Connected',
      status: 'Ready for Decision',
      priority: 'Standard',
      daysInQueue: 45,
      examRequired: true,
      rumevDecision: 'Exam Required',
      estimatedCompletion: '2025-08-20',
      conditions: ['Right Knee Strain', 'Arthritis']
    },
    {
      veteranName: 'Sarah K. Williams',
      fileNumber: 'F23156789',
      claimType: 'Hearing Loss - Tinnitus',
      status: 'Evidence Gathering',
      priority: 'Standard',
      daysInQueue: 12,
      examRequired: false,
      rumevDecision: 'Sufficient Evidence',
      estimatedCompletion: '2025-08-18',
      conditions: ['Bilateral Hearing Loss', 'Tinnitus']
    }
  ];

  const agentStatus = [
    { 
      name: 'Agent A - Leiden Detection', 
      status: 'active', 
      efficiency: 98.7, 
      workload: 87,
      processed: '2,847 claims analyzed today',
      description: 'Community detection & clustering'
    },
    { 
      name: 'Agent B - XGBoost Engine', 
      status: 'active', 
      efficiency: 97.2, 
      workload: 92,
      processed: '623 exams eliminated',
      description: 'Predictive outcome modeling'
    },
    { 
      name: 'Agent C - NLP Processor', 
      status: 'active', 
      efficiency: 99.1, 
      workload: 78,
      processed: '4,291 documents processed',
      description: 'Medical record analysis'
    },
    { 
      name: 'Agent D - Learning System', 
      status: 'learning', 
      efficiency: 96.4, 
      workload: 65,
      processed: '127 new patterns learned',
      description: 'Continuous improvement'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 neural-grid opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Professional Header */}
      <header className="relative z-50 glass-strong border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* VA Logo & System Name */}
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg mirror-effect">
                <div className="text-white font-bold text-xl">VA</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-display">
                  VBMS Dashboard
                </h1>
                <p className="text-sm text-slate-400 font-medium">Real-time Claims Management</p>
              </div>
            </Link>

            {/* System Status & Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">All Systems Online</span>
                </div>
                <div className="text-slate-400 font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                {[
                  { name: 'Dashboard', icon: '📊', active: true },
                  { name: 'Analytics', icon: '📈' },
                  { name: 'Claims', icon: '📋' },
                  { name: 'eFolder', icon: '📁' },
                  { name: 'Search', icon: '🔍' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={`/${item.name.toLowerCase()}`}
                    className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg ${
                      item.active 
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className={`relative z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Dashboard Header */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="glass-strong rounded-3xl p-6 border border-slate-700/50 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 font-display">
                  Claims Management Dashboard
                </h2>
                <p className="text-slate-400 text-lg">
                  Real-time oversight of veteran disability claims and RUMEV1 AI system performance
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  {currentTime.toLocaleDateString()}
                </div>
                <div className="text-slate-400 font-mono text-sm">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 font-heading flex items-center">
            <span className="mr-3">📊</span>
            Key Performance Indicators
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dashboardStats.map((stat, index) => (
              <div
                key={index}
                className={`group relative glass-strong rounded-2xl p-4 border border-slate-700/50 hover:scale-105 transition-all duration-500 hover:shadow-2xl mirror-effect ${
                  activeCard === index ? 'ring-2 ring-blue-400/50 border-blue-400/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : stat.trend === 'down'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1 font-display">{stat.value}</div>
                <div className="text-xs text-slate-400 mb-2">{stat.label}</div>
                <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-2">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-6 mb-6">
          
          {/* Recent Claims Queue */}
          <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white font-heading flex items-center">
                <span className="mr-3">📋</span>
                Priority Claims Queue
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-medium">Live Updates</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentClaims.map((claim, index) => (
                <div 
                  key={claim.fileNumber}
                  className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => setSelectedVeteran(claim)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{claim.veteranName}</h4>
                      <p className="text-slate-400 text-sm font-mono">File: {claim.fileNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        claim.priority === 'High' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {claim.priority}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{claim.daysInQueue} days in queue</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-slate-400">Claim Type:</span>
                      <p className="text-white font-medium">{claim.claimType}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Status:</span>
                      <p className="text-white font-medium">{claim.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className={`flex items-center space-x-1 ${
                        claim.examRequired ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        <span>{claim.examRequired ? '🔍' : '✅'}</span>
                        <span>{claim.rumevDecision}</span>
                      </div>
                      <div className="text-slate-400">
                        Est: {new Date(claim.estimatedCompletion).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex flex-wrap gap-2">
                      {claim.conditions.map((condition, i) => (
                        <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RUMEV1 Agent Status */}
          <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white font-heading flex items-center">
                <span className="mr-3">🤖</span>
                RUMEV1 AI System Status
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-medium">4/4 Agents Active</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {agentStatus.map((agent, index) => (
                <div key={index} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white">{agent.name}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {agent.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4">{agent.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Efficiency</span>
                        <span className="text-blue-400 font-semibold">{agent.efficiency}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${agent.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Workload</span>
                        <span className="text-purple-400 font-semibold">{agent.workload}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${agent.workload}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400">{agent.processed}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center">
              <span className="mr-3">🔄</span>
              Real-Time System Activity
            </h3>
            
            <div className="space-y-3">
              {[
                { 
                  time: '2 min ago', 
                  action: 'RUMEV1 eliminated C&P exam for Jordan R. Sampleton (F31605305)', 
                  type: 'elimination', 
                  icon: '✅',
                  savings: '$3,200 saved'
                },
                { 
                  time: '5 min ago', 
                  action: 'Leiden Algorithm detected new PTSD claim cluster pattern', 
                  type: 'detection', 
                  icon: '🔬',
                  impact: '23 similar cases'
                },
                { 
                  time: '8 min ago', 
                  action: 'NLP processor completed medical record analysis for 47 claims', 
                  type: 'processing', 
                  icon: '📝',
                  processed: '47 documents'
                },
                { 
                  time: '12 min ago', 
                  action: 'Agent D learning system incorporated new decision patterns', 
                  type: 'learning', 
                  icon: '🧠',
                  patterns: '15 new patterns'
                },
                { 
                  time: '18 min ago', 
                  action: 'Priority claim queue updated - 3 high-priority cases added', 
                  type: 'queue', 
                  icon: '📋',
                  count: '3 cases'
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="text-xl mr-4">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{activity.action}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-slate-400 text-xs font-mono">{activity.time}</p>
                      {activity.savings && (
                        <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded-full">
                          {activity.savings}
                        </span>
                      )}
                      {activity.impact && (
                        <span className="text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded-full">
                          {activity.impact}
                        </span>
                      )}
                      {activity.processed && (
                        <span className="text-purple-400 text-xs bg-purple-500/10 px-2 py-1 rounded-full">
                          {activity.processed}
                        </span>
                      )}
                      {activity.patterns && (
                        <span className="text-amber-400 text-xs bg-amber-500/10 px-2 py-1 rounded-full">
                          {activity.patterns}
                        </span>
                      )}
                      {activity.count && (
                        <span className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-full">
                          {activity.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    activity.type === 'elimination' ? 'bg-emerald-400' :
                    activity.type === 'detection' ? 'bg-blue-400' :
                    activity.type === 'processing' ? 'bg-purple-400' :
                    activity.type === 'learning' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        {/* Refresh Data */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Refresh Data
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
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            RUMEV1 Assistant
          </div>
        </div>
      </div>
    </div>
  );
}