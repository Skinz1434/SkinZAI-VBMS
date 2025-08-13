'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

export default function AIOrchestrationPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'network' | 'details'>('overview');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeAgents: 4,
    tasksProcessed: 14892,
    averageLatency: 124,
    systemLoad: 67,
    accuracy: 96.4
  });

  useEffect(() => {
    setIsLoaded(true);
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        tasksProcessed: prev.tasksProcessed + Math.floor(Math.random() * 10),
        averageLatency: 100 + Math.floor(Math.random() * 50),
        systemLoad: 50 + Math.floor(Math.random() * 30)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const agents = [
    {
      id: 'leiden',
      name: 'Leiden Detection Agent',
      status: 'active',
      description: 'Community detection and pattern recognition using advanced graph algorithms',
      metrics: {
        accuracy: 98.7,
        throughput: '2,341 claims/hour',
        uptime: '99.97%',
        lastActivity: '2 seconds ago'
      },
      capabilities: ['Pattern Recognition', 'Cluster Analysis', 'Anomaly Detection', 'Relationship Mapping'],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'xgboost',
      name: 'XGBoost Prediction Engine',
      status: 'active',
      description: 'Machine learning model for outcome prediction and rating determination',
      metrics: {
        accuracy: 96.4,
        throughput: '1,892 predictions/hour',
        uptime: '99.99%',
        lastActivity: '1 second ago'
      },
      capabilities: ['Outcome Prediction', 'Risk Assessment', 'Rating Calculation', 'Confidence Scoring'],
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'nlp',
      name: 'NLP Document Processor',
      status: 'active',
      description: 'Natural language processing for medical record analysis and entity extraction',
      metrics: {
        accuracy: 99.1,
        throughput: '5,234 documents/hour',
        uptime: '100%',
        lastActivity: '3 seconds ago'
      },
      capabilities: ['Text Extraction', 'Entity Recognition', 'Sentiment Analysis', 'PII Detection'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'learning',
      name: 'Continuous Learning System',
      status: 'learning',
      description: 'Adaptive learning system that improves model performance through feedback',
      metrics: {
        accuracy: 94.2,
        throughput: '142 updates/hour',
        uptime: '99.95%',
        lastActivity: '12 seconds ago'
      },
      capabilities: ['Model Retraining', 'Feedback Integration', 'Performance Optimization', 'Drift Detection'],
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <AppLayout>
      <WelcomeModal
        pageName="ai-orchestration"
        title="AI Orchestration Center"
        description="Monitor and manage the RUMEV1 multi-agent AI system powering NOVA platform. Real-time visibility into agent performance, task distribution, and system optimization."
        features={[
          "Real-time agent monitoring and performance metrics",
          "Interactive network visualization of agent collaboration",
          "Task distribution and load balancing controls",
          "Model performance analytics and optimization tools"
        ]}
      />

      <div className={`p-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">AI Orchestration Center</h1>
          <p className="text-slate-400">
            RUMEV1 Multi-Agent System • {agents.length} Active Agents • {realTimeMetrics.tasksProcessed.toLocaleString()} Tasks Processed
          </p>
        </div>

        {/* System Overview Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border border-blue-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🤖</span>
              <span className="text-xs text-blue-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{realTimeMetrics.activeAgents}</p>
            <p className="text-sm text-slate-400">Active Agents</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 border border-emerald-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-emerald-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{realTimeMetrics.tasksProcessed.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Tasks Today</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-purple-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⏱️</span>
              <span className="text-xs text-purple-400">{realTimeMetrics.averageLatency}ms</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{realTimeMetrics.averageLatency}ms</p>
            <p className="text-sm text-slate-400">Avg Latency</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 border border-amber-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-amber-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📊</span>
              <span className="text-xs text-amber-400">{realTimeMetrics.systemLoad}%</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{realTimeMetrics.systemLoad}%</p>
            <p className="text-sm text-slate-400">System Load</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 border border-cyan-600/20 rounded-xl p-4 hover:shadow-xl hover:shadow-cyan-600/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xs text-cyan-400">High</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{realTimeMetrics.accuracy}%</p>
            <p className="text-sm text-slate-400">Accuracy</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('network')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'network'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            Network View
          </button>
          <button
            onClick={() => setViewMode('details')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'details'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            Detailed Metrics
          </button>
        </div>

        {/* Agent Cards */}
        {viewMode === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                  activeAgent === agent.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${agent.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-1">{agent.name}</h3>
                      <p className="text-sm text-slate-400">{agent.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Accuracy</p>
                      <p className="text-lg font-semibold text-slate-100">{agent.metrics.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Throughput</p>
                      <p className="text-lg font-semibold text-slate-100">{agent.metrics.throughput}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Uptime</p>
                      <p className="text-lg font-semibold text-emerald-400">{agent.metrics.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Last Activity</p>
                      <p className="text-lg font-semibold text-blue-400">{agent.metrics.lastActivity}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Network View */}
        {viewMode === 'network' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="mb-8">
                  <svg className="w-full h-64" viewBox="0 0 400 300">
                    {/* Agent nodes */}
                    <circle cx="200" cy="150" r="30" fill="url(#blue-gradient)" className="animate-pulse" />
                    <circle cx="100" cy="100" r="25" fill="url(#green-gradient)" className="animate-pulse animation-delay-200" />
                    <circle cx="300" cy="100" r="25" fill="url(#purple-gradient)" className="animate-pulse animation-delay-400" />
                    <circle cx="100" cy="200" r="25" fill="url(#amber-gradient)" className="animate-pulse animation-delay-600" />
                    <circle cx="300" cy="200" r="25" fill="url(#cyan-gradient)" className="animate-pulse animation-delay-800" />
                    
                    {/* Connections */}
                    <line x1="200" y1="150" x2="100" y2="100" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
                    <line x1="200" y1="150" x2="300" y2="100" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
                    <line x1="200" y1="150" x2="100" y2="200" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
                    <line x1="200" y1="150" x2="300" y2="200" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
                    
                    {/* Gradients */}
                    <defs>
                      <radialGradient id="blue-gradient">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1e40af" />
                      </radialGradient>
                      <radialGradient id="green-gradient">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </radialGradient>
                      <radialGradient id="purple-gradient">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </radialGradient>
                      <radialGradient id="amber-gradient">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </radialGradient>
                      <radialGradient id="cyan-gradient">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </radialGradient>
                    </defs>
                    
                    {/* Labels */}
                    <text x="200" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Core</text>
                    <text x="100" y="105" textAnchor="middle" fill="white" fontSize="8">Leiden</text>
                    <text x="300" y="105" textAnchor="middle" fill="white" fontSize="8">XGBoost</text>
                    <text x="100" y="205" textAnchor="middle" fill="white" fontSize="8">NLP</text>
                    <text x="300" y="205" textAnchor="middle" fill="white" fontSize="8">Learning</text>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Agent Network Topology</h3>
                <p className="text-slate-400">Real-time visualization of agent communication and task distribution</p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Metrics */}
        {viewMode === 'details' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {['Claims Processing', 'Document Analysis', 'Pattern Recognition', 'Decision Making'].map((metric) => (
                  <div key={metric}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{metric}</span>
                      <span className="text-slate-200">{85 + Math.floor(Math.random() * 15)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        style={{ width: `${85 + Math.floor(Math.random() * 15)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Task Distribution</h3>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{agent.name.split(' ')[0]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-full bg-gradient-to-r ${agent.color} rounded-full`}
                          style={{ width: `${60 + Math.floor(Math.random() * 40)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 w-12 text-right">
                        {Math.floor(Math.random() * 1000)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}