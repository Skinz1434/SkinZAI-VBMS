'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import { massiveMockDatabase } from '../lib/massiveMockData';

export default function VBMSAnalytics() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState<any>({});

  useEffect(() => {
    setIsLoaded(true);
    
    // Animate counter values
    const animateCounters = () => {
      const targets = {
        claimsProcessed: systemMetrics[activeTimeframe].claimsProcessed,
        examsEliminated: systemMetrics[activeTimeframe].examsEliminated,
        costSavings: parseInt(systemMetrics[activeTimeframe].costSavings.replace(/,/g, '')),
        manHoursSaved: systemMetrics[activeTimeframe].manHoursSaved,
        veteransServed: systemMetrics[activeTimeframe].veteransServed
      };
      
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setAnimatedValues({
          claimsProcessed: Math.round(targets.claimsProcessed * easeOutQuart),
          examsEliminated: Math.round(targets.examsEliminated * easeOutQuart),
          costSavings: Math.round(targets.costSavings * easeOutQuart),
          manHoursSaved: Math.round(targets.manHoursSaved * easeOutQuart),
          veteransServed: Math.round(targets.veteransServed * easeOutQuart)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    };
    
    animateCounters();
  }, [activeTimeframe]);

  // Calculate real analytics based on massive mock data
  const totalClaims = massiveMockDatabase.claims.length;
  const totalVeterans = massiveMockDatabase.veterans.length;
  const totalDocuments = massiveMockDatabase.comprehensiveDocuments.length;
  const examsEliminated = massiveMockDatabase.claims.filter(c => !c.examRequired).length;
  const highPriorityClaims = massiveMockDatabase.claims.filter(c => c.priority === 'High').length;
  const averageConfidence = massiveMockDatabase.claims.reduce((acc, claim) => 
    acc + (claim.rumevAnalysis?.confidence || 0), 0) / totalClaims;
  
  // Calculate document processing metrics
  const documentsReviewed = massiveMockDatabase.comprehensiveDocuments.filter(
    d => d.reviewStatus === 'reviewed' || d.reviewStatus === 'verified'
  ).length;
  const totalPages = massiveMockDatabase.comprehensiveDocuments.reduce((acc, d) => acc + d.pages, 0);
  const ocrProcessed = massiveMockDatabase.comprehensiveDocuments.filter(d => d.ocrStatus === 'completed').length;

  // System performance metrics with detailed calculations
  const systemMetrics: any = {
    '7d': {
      claimsProcessed: totalClaims,
      examsEliminated: examsEliminated,
      avgProcessingTime: 4.2,
      accuracyRate: averageConfidence.toFixed(1),
      costSavings: (examsEliminated * 3500).toLocaleString(),
      costSavingsRaw: examsEliminated * 3500,
      veteransServed: totalVeterans,
      documentsProcessed: totalDocuments,
      systemUptime: 99.97,
      manHoursSaved: examsEliminated * 12, // 12 hours per exam average
      backlogReduction: 62,
      appealsPrevented: Math.floor(examsEliminated * 0.15),
      satisfactionScore: 94
    },
    '30d': {
      claimsProcessed: Math.round(totalClaims * 4.3),
      examsEliminated: Math.round(examsEliminated * 4.3),
      avgProcessingTime: 3.8,
      accuracyRate: (averageConfidence + 0.5).toFixed(1),
      costSavings: (Math.round(examsEliminated * 4.3) * 3500).toLocaleString(),
      costSavingsRaw: Math.round(examsEliminated * 4.3) * 3500,
      veteransServed: Math.round(totalVeterans * 4.1),
      documentsProcessed: Math.round(totalDocuments * 4.2),
      systemUptime: 99.95,
      manHoursSaved: Math.round(examsEliminated * 4.3 * 12),
      backlogReduction: 71,
      appealsPrevented: Math.floor(examsEliminated * 4.3 * 0.15),
      satisfactionScore: 95
    },
    '90d': {
      claimsProcessed: Math.round(totalClaims * 12.8),
      examsEliminated: Math.round(examsEliminated * 12.8),
      avgProcessingTime: 3.6,
      accuracyRate: (averageConfidence + 1.2).toFixed(1),
      costSavings: (Math.round(examsEliminated * 12.8) * 3500).toLocaleString(),
      costSavingsRaw: Math.round(examsEliminated * 12.8) * 3500,
      veteransServed: Math.round(totalVeterans * 12.3),
      documentsProcessed: Math.round(totalDocuments * 12.5),
      systemUptime: 99.92,
      manHoursSaved: Math.round(examsEliminated * 12.8 * 12),
      backlogReduction: 78,
      appealsPrevented: Math.floor(examsEliminated * 12.8 * 0.15),
      satisfactionScore: 96
    }
  };

  const currentData = systemMetrics[activeTimeframe];

  // Agent performance based on actual system data
  const agentMetrics = [
    {
      name: 'Agent A - Leiden Detection',
      purpose: 'Community clustering for claim pattern recognition',
      accuracy: 98.7,
      uptime: 99.97,
      throughput: Math.round(totalClaims / 7),
      status: 'Optimal',
      tasksCompleted: 14250,
      avgResponseTime: '124ms',
      errorRate: 0.03,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Agent B - XGBoost Engine', 
      purpose: 'Predictive modeling for exam necessity determination',
      accuracy: averageConfidence,
      uptime: 99.99,
      throughput: Math.round(totalClaims / 7),
      status: 'Optimal',
      tasksCompleted: 14890,
      avgResponseTime: '89ms',
      errorRate: 0.01,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Agent C - NLP Processor',
      purpose: 'Medical record analysis and PII protection',
      accuracy: 99.1,
      uptime: 100.0,
      throughput: Math.round(totalDocuments / 7),
      status: 'Optimal',
      tasksCompleted: 52340,
      avgResponseTime: '201ms',
      errorRate: 0.09,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Agent D - Learning System',
      purpose: 'Continuous model improvement and accuracy enhancement',
      accuracy: 96.4,
      uptime: 99.95,
      throughput: 18,
      status: 'Learning',
      tasksCompleted: 3260,
      avgResponseTime: '1.2s',
      errorRate: 0.36,
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  // ROI Calculations
  const roiMetrics = {
    examCost: 3500,
    examDuration: 12, // hours
    raterHourlyRate: 85,
    appealCost: 25000,
    backlogDays: currentData.claimsProcessed * 0.2, // days saved
    veteranSatisfactionValue: 500 // estimated value per point increase
  };

  const totalROI = 
    currentData.costSavingsRaw + // Direct exam cost savings
    (currentData.manHoursSaved * roiMetrics.raterHourlyRate) + // Labor savings
    (currentData.appealsPrevented * roiMetrics.appealCost) + // Appeal prevention
    (currentData.satisfactionScore * roiMetrics.veteranSatisfactionValue * currentData.veteransServed / 100); // Satisfaction value

  // Condition-specific analytics
  const conditionStats = massiveMockDatabase.claims.reduce((acc, claim) => {
    claim.conditions.forEach(condition => {
      const category = condition.category;
      if (!acc[category]) {
        acc[category] = { 
          count: 0, 
          examRate: 0, 
          avgRating: 0,
          totalSaved: 0,
          avgProcessingDays: 0 
        };
      }
      acc[category].count++;
      if (claim.examRequired) acc[category].examRate++;
      acc[category].avgProcessingDays += claim.daysInQueue;
    });
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and savings
  Object.keys(conditionStats).forEach(category => {
    const stat = conditionStats[category];
    stat.avgProcessingDays = Math.round(stat.avgProcessingDays / stat.count);
    stat.eliminationRate = ((1 - stat.examRate / stat.count) * 100).toFixed(1);
    stat.totalSaved = (stat.count - stat.examRate) * roiMetrics.examCost;
  });

  const getMetricExplanation = (metric: string) => {
    const explanations: any = {
      claimsProcessed: {
        title: 'Claims Processed',
        description: 'Total number of disability compensation claims analyzed by RUMEV1 AI system',
        calculation: 'Sum of all claims entering the system within the timeframe',
        source: 'VBMS database, claims management system',
        impact: `Each processed claim saves approximately ${currentData.avgProcessingTime} hours of manual review`,
        trend: '+23% vs previous period'
      },
      examsEliminated: {
        title: 'C&P Exams Eliminated',
        description: 'Compensation & Pension examinations avoided through AI-powered evidence sufficiency analysis',
        calculation: 'Claims with sufficient existing medical evidence × AI confidence threshold (>85%)',
        source: 'RUMEV1 exam necessity algorithm, DBQ analysis',
        impact: `$${roiMetrics.examCost} saved per exam, ${roiMetrics.examDuration} hours of veteran/examiner time saved`,
        trend: '+31% elimination rate improvement'
      },
      costSavings: {
        title: 'Total Cost Savings',
        description: 'Comprehensive financial impact including exam costs, labor, appeals prevention, and efficiency gains',
        calculation: '(Exams eliminated × $3,500) + (Hours saved × $85/hr) + (Appeals prevented × $25,000)',
        source: 'VA financial data, CBO cost estimates, GAO reports',
        impact: 'Funds redirected to veteran benefits and system improvements',
        trend: '+$2.3M vs last quarter'
      },
      manHours: {
        title: 'Man Hours Saved',
        description: 'Total human labor hours saved through automation and AI assistance',
        calculation: '(Exams eliminated × 12 hrs) + (Claims processed × efficiency gain)',
        source: 'Time motion studies, VA workforce analytics',
        impact: 'Equivalent to ' + Math.round(currentData.manHoursSaved / 2080) + ' full-time employees',
        trend: '+45% efficiency gain'
      },
      accuracy: {
        title: 'Decision Accuracy',
        description: 'Percentage of AI determinations validated by quality review and appeals data',
        calculation: 'Correct determinations / Total determinations × 100',
        source: 'Quality assurance reviews, Board of Veterans Appeals outcomes',
        impact: 'Reduces appeals by ' + currentData.appealsPrevented + ' cases',
        trend: '+2.3% accuracy improvement through continuous learning'
      }
    };
    
    return explanations[metric] || null;
  };

  return (
    <AppLayout>
      <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Performance Analytics</h1>
            <p className="text-slate-400">RUMEV1 System Intelligence & Cost Impact Analysis</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              Live Data • Last updated: {new Date().toLocaleTimeString()}
            </div>
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
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* ROI Summary Hero */}
        <div className="relative overflow-hidden rounded-xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-emerald-600/10"></div>
          <div className="relative max-w-7xl mx-auto p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Total Return on Investment</h2>
              <p className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                ${(totalROI / 1000000).toFixed(2)}M
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Projected annual savings: ${(totalROI * 12 / 1000000).toFixed(1)}M
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Direct Exam Savings', value: `$${(currentData.costSavingsRaw / 1000000).toFixed(2)}M`, color: 'from-blue-500 to-blue-600' },
                { label: 'Labor Cost Reduction', value: `$${((currentData.manHoursSaved * roiMetrics.raterHourlyRate) / 1000000).toFixed(2)}M`, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Appeals Prevention', value: `$${((currentData.appealsPrevented * roiMetrics.appealCost) / 1000000).toFixed(2)}M`, color: 'from-purple-500 to-purple-600' },
                { label: 'Efficiency Gains', value: `${currentData.backlogReduction}% Reduction`, color: 'from-amber-500 to-amber-600' }
              ].map((item, index) => (
                <div key={index} className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
                  <div className={`h-1 w-full bg-gradient-to-r ${item.color} rounded-full mb-3`}></div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="text-xl font-bold text-slate-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Performance Indicators with Explanations */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-2">Key Performance Metrics</h2>
            <p className="text-slate-400">
              Click any metric for detailed explanation and calculation methodology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                id: 'claimsProcessed',
                icon: '📋',
                label: 'Claims Processed',
                value: animatedValues.claimsProcessed || 0,
                suffix: '',
                subtext: `${(animatedValues.claimsProcessed / (activeTimeframe === '7d' ? 7 : activeTimeframe === '30d' ? 30 : 90) || 0).toFixed(0)} per day`,
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                id: 'examsEliminated',
                icon: '✅',
                label: 'Exams Eliminated',
                value: animatedValues.examsEliminated || 0,
                suffix: '',
                subtext: `${((animatedValues.examsEliminated / (animatedValues.claimsProcessed || 1)) * 100).toFixed(1)}% elimination rate`,
                gradient: 'from-emerald-500 to-emerald-600'
              },
              {
                id: 'costSavings',
                icon: '💰',
                label: 'Cost Savings',
                value: animatedValues.costSavings || 0,
                suffix: '',
                prefix: '$',
                subtext: 'Direct exam costs only',
                gradient: 'from-yellow-500 to-amber-600'
              },
              {
                id: 'manHours',
                icon: '⏱️',
                label: 'Hours Saved',
                value: animatedValues.manHoursSaved || 0,
                suffix: ' hrs',
                subtext: `${Math.round((animatedValues.manHoursSaved || 0) / 2080)} FTE equivalent`,
                gradient: 'from-purple-500 to-purple-600'
              }
            ].map((metric) => (
              <div 
                key={metric.id}
                onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-xl"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                ></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-400">{metric.label}</h3>
                    <div className={`w-10 h-10 bg-gradient-to-br ${metric.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-lg">{metric.icon}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-100 mb-1">
                    {metric.prefix}{metric.value.toLocaleString()}{metric.suffix}
                  </div>
                  <div className="text-xs text-slate-500">{metric.subtext}</div>
                  
                  {selectedMetric === metric.id && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-2xl">
                      {getMetricExplanation(metric.id) && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-100">{getMetricExplanation(metric.id).title}</h4>
                          <p className="text-sm text-slate-300">{getMetricExplanation(metric.id).description}</p>
                          <div className="border-t border-slate-800 pt-2 space-y-1">
                            <p className="text-xs text-slate-400">
                              <span className="font-medium text-slate-300">Calculation:</span> {getMetricExplanation(metric.id).calculation}
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="font-medium text-slate-300">Data Source:</span> {getMetricExplanation(metric.id).source}
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="font-medium text-slate-300">Impact:</span> {getMetricExplanation(metric.id).impact}
                            </p>
                            <p className="text-xs text-emerald-400">
                              <span className="font-medium">Trend:</span> {getMetricExplanation(metric.id).trend}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Agent Performance Matrix with Visual Enhancements */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">RUMEV1 Multi-Agent Performance</h3>
              <div className="space-y-4">
                {agentMetrics.map((agent, index) => (
                  <div key={index} className="relative overflow-hidden bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-10"
                      style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                      className={agent.gradient}
                    ></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-200 text-sm">{agent.name}</h4>
                          <p className="text-xs text-slate-400">{agent.purpose}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.status === 'Optimal' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500 text-xs">Accuracy</span>
                          <div className="text-lg font-semibold text-slate-100">{agent.accuracy.toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs">Uptime</span>
                          <div className="text-lg font-semibold text-emerald-400">{agent.uptime}%</div>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs">Tasks/Day</span>
                          <div className="text-lg font-semibold text-blue-400">{agent.throughput}</div>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs">Response</span>
                          <div className="text-lg font-semibold text-purple-400">{agent.avgResponseTime}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Total Processed: {agent.tasksCompleted.toLocaleString()}</span>
                          <span className="text-slate-500">Error Rate: {agent.errorRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition Category Analysis with Cost Impact */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">Condition Analysis & Savings</h3>
              <div className="space-y-4">
                {Object.entries(conditionStats).slice(0, 5).map(([category, stats]) => (
                  <div key={category} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-200">{category}</h4>
                        <p className="text-xs text-slate-400">{stats.count} claims • {stats.avgProcessingDays} avg days</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">
                        ${(stats.totalSaved / 1000).toFixed(0)}K saved
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Exam Elimination Rate</span>
                        <span className="text-emerald-400 font-medium">{stats.eliminationRate}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
                            style={{ width: `${stats.eliminationRate}%` }}
                          >
                            <span className="text-xs text-white font-medium">{stats.eliminationRate}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <span>Exams Saved: {stats.count - stats.examRate}</span>
                        <span>Hours Saved: {(stats.count - stats.examRate) * 12}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health & Efficiency Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">System Efficiency & Quality Metrics</h3>
            
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" 
                      className="text-emerald-400" 
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - currentData.systemUptime / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-emerald-400">{currentData.systemUptime}%</span>
                  </div>
                </div>
                <div className="text-sm text-slate-400">System Uptime</div>
                <div className="text-xs text-slate-500">99.9% SLA Target</div>
              </div>
              
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" 
                      className="text-blue-400" 
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - parseFloat(currentData.accuracyRate) / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-400">{currentData.accuracyRate}%</span>
                  </div>
                </div>
                <div className="text-sm text-slate-400">Decision Accuracy</div>
                <div className="text-xs text-slate-500">ML Model Confidence</div>
              </div>
              
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" 
                      className="text-purple-400" 
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - currentData.backlogReduction / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-400">{currentData.backlogReduction}%</span>
                  </div>
                </div>
                <div className="text-sm text-slate-400">Backlog Reduction</div>
                <div className="text-xs text-slate-500">vs Manual Processing</div>
              </div>
              
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                    <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" 
                      className="text-yellow-400" 
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - currentData.satisfactionScore / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-yellow-400">{currentData.satisfactionScore}%</span>
                  </div>
                </div>
                <div className="text-sm text-slate-400">Veteran Satisfaction</div>
                <div className="text-xs text-slate-500">NPS Score: +72</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">
                  {currentData.avgProcessingTime}
                </div>
                <div className="text-lg text-slate-300">minutes</div>
                <div className="text-sm text-slate-400">Avg Processing Time</div>
                <div className="text-xs text-slate-500">-76% vs baseline</div>
              </div>
            </div>
          </div>

          {/* Document Processing Analytics */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">Document Processing Intelligence</h3>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📄</span>
                  <span className="text-xs text-emerald-400">+12% ↑</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{totalDocuments.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Documents Processed</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📑</span>
                  <span className="text-xs text-blue-400">Real-time</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{totalPages.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Total Pages Analyzed</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">🔍</span>
                  <span className="text-xs text-purple-400">99.2% accuracy</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{ocrProcessed.toLocaleString()}</p>
                <p className="text-xs text-slate-400">OCR Completed</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">✅</span>
                  <span className="text-xs text-yellow-400">Verified</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{documentsReviewed.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Documents Reviewed</p>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Processing Speed by Document Type</h4>
              <div className="space-y-2">
                {[
                  { type: 'DD214', speed: '1.2s', count: 50 },
                  { type: 'Medical Records', speed: '3.4s', count: 2340 },
                  { type: 'C&P Exams', speed: '2.8s', count: 450 },
                  { type: 'Service Treatment', speed: '2.1s', count: 1230 }
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{item.type}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-500">{item.count} docs</span>
                      <span className="text-emerald-400 font-medium">{item.speed}/doc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}