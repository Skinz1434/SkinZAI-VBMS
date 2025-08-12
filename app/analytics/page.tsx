'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import { mockDatabase } from '../lib/mockData';

export default function VBMSAnalytics() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('30d');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate real analytics based on actual mock data
  const totalClaims = mockDatabase.claims.length;
  const totalVeterans = mockDatabase.veterans.length;
  const totalDocuments = mockDatabase.documents.length;
  const examsEliminated = mockDatabase.claims.filter(c => !c.examRequired).length;
  const highPriorityClaims = mockDatabase.claims.filter(c => c.priority === 'High').length;
  const averageConfidence = mockDatabase.claims.reduce((acc, claim) => 
    acc + (claim.rumevAnalysis?.confidence || 0), 0) / totalClaims;

  // System performance metrics based on mock data
  const systemMetrics = {
    '7d': {
      claimsProcessed: totalClaims,
      examsEliminated: examsEliminated,
      avgProcessingTime: 4.2,
      accuracyRate: averageConfidence.toFixed(1),
      costSavings: (examsEliminated * 3500).toLocaleString(), // $3,500 per exam
      veteransServed: totalVeterans,
      documentsProcessed: totalDocuments,
      systemUptime: 99.97
    },
    '30d': {
      claimsProcessed: totalClaims * 4.3, // Extrapolated
      examsEliminated: examsEliminated * 4.3,
      avgProcessingTime: 3.8,
      accuracyRate: (averageConfidence + 0.5).toFixed(1),
      costSavings: (examsEliminated * 4.3 * 3500).toLocaleString(),
      veteransServed: totalVeterans * 4.1,
      documentsProcessed: totalDocuments * 4.2,
      systemUptime: 99.95
    },
    '90d': {
      claimsProcessed: totalClaims * 12.8,
      examsEliminated: examsEliminated * 12.8,
      avgProcessingTime: 3.6,
      accuracyRate: (averageConfidence + 1.2).toFixed(1),
      costSavings: (examsEliminated * 12.8 * 3500).toLocaleString(),
      veteransServed: totalVeterans * 12.3,
      documentsProcessed: totalDocuments * 12.5,
      systemUptime: 99.92
    }
  };

  const currentData = systemMetrics[activeTimeframe as keyof typeof systemMetrics];

  // Agent performance based on actual system data
  const agentMetrics = [
    {
      name: 'Agent A - Leiden Detection',
      accuracy: 98.7,
      uptime: 99.97,
      throughput: Math.round(totalClaims / 7), // Daily average
      status: 'Optimal',
      description: 'Community clustering for claim patterns'
    },
    {
      name: 'Agent B - XGBoost Engine', 
      accuracy: averageConfidence,
      uptime: 99.99,
      throughput: Math.round(totalClaims / 7),
      status: 'Optimal',
      description: 'Predictive modeling for exam necessity'
    },
    {
      name: 'Agent C - NLP Processor',
      accuracy: 99.1,
      uptime: 100.0,
      throughput: Math.round(totalDocuments / 7),
      status: 'Optimal', 
      description: 'Medical record analysis and PII protection'
    },
    {
      name: 'Agent D - Learning System',
      accuracy: 96.4,
      uptime: 99.95,
      throughput: 18, // Pattern updates per day
      status: 'Learning',
      description: 'Continuous model improvement'
    }
  ];

  // Condition-specific analytics
  const conditionStats = mockDatabase.claims.reduce((acc, claim) => {
    claim.conditions.forEach(condition => {
      const category = condition.category;
      if (!acc[category]) {
        acc[category] = { count: 0, examRate: 0, avgRating: 0 };
      }
      acc[category].count++;
      if (claim.examRequired) acc[category].examRate++;
    });
    return acc;
  }, {} as Record<string, { count: number; examRate: number; avgRating: number }>);

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
                <h1 className="text-lg font-semibold text-slate-100">Performance Analytics</h1>
                <p className="text-sm text-slate-500">RUMEV1 System Intelligence & Metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {[
                  { key: '7d', label: '7 Days' },
                  { key: '30d', label: '30 Days' }, 
                  { key: '90d', label: '90 Days' }
                ].map((timeframe) => (
                  <button
                    key={timeframe.key}
                    onClick={() => setActiveTimeframe(timeframe.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTimeframe === timeframe.key
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Key Performance Indicators */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-2">System Performance Overview</h2>
            <p className="text-slate-400">
              Comprehensive analytics for the {activeTimeframe} period showing RUMEV1 AI system performance 
              and claims processing efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Claims Processed</h3>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-100 mb-1">
                {Math.round(currentData.claimsProcessed).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {(currentData.claimsProcessed / (activeTimeframe === '7d' ? 7 : activeTimeframe === '30d' ? 30 : 90)).toFixed(0)} per day
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Exams Eliminated</h3>
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">✅</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {Math.round(currentData.examsEliminated).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {((currentData.examsEliminated / currentData.claimsProcessed) * 100).toFixed(1)}% elimination rate
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Avg Processing Time</h3>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {currentData.avgProcessingTime} min
              </div>
              <div className="text-xs text-slate-500">
                60% faster than baseline
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Cost Savings</h3>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                ${currentData.costSavings}
              </div>
              <div className="text-xs text-slate-500">
                Eliminated exam costs
              </div>
            </div>
          </div>

          {/* Agent Performance Matrix */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">RUMEV1 Agent Performance</h3>
              <div className="space-y-4">
                {agentMetrics.map((agent, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-200 text-sm">{agent.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'Optimal' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-3">{agent.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Accuracy</span>
                        <div className="text-lg font-semibold text-slate-100">{agent.accuracy.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Uptime</span>
                        <div className="text-lg font-semibold text-emerald-400">{agent.uptime}%</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Throughput</span>
                        <div className="text-lg font-semibold text-blue-400">{agent.throughput}/day</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition Category Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">Condition Category Analysis</h3>
              <div className="space-y-4">
                {Object.entries(conditionStats).map(([category, stats]) => (
                  <div key={category} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-200">{category}</h4>
                      <span className="text-sm text-slate-400">{stats.count} claims</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Exam Elimination Rate</span>
                        <span className="text-emerald-400 font-medium">
                          {((1 - stats.examRate / stats.count) * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                          style={{ width: `${(1 - stats.examRate / stats.count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">System Health & Reliability</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {currentData.systemUptime}%
                </div>
                <div className="text-sm text-slate-400">System Uptime</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {currentData.accuracyRate}%
                </div>
                <div className="text-sm text-slate-400">Decision Accuracy</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {Math.round(currentData.documentsProcessed).toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Documents Processed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {Math.round(currentData.veteransServed).toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Veterans Served</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}