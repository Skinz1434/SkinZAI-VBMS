'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Analytics() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('7d');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const analyticsData = {
    '7d': {
      examsSaved: 1847,
      costSavings: '$2.3M',
      accuracy: 97.2,
      processingTime: 4.2,
      veteransHelped: 1203
    },
    '30d': {
      examsSaved: 7234,
      costSavings: '$9.1M',
      accuracy: 97.8,
      processingTime: 3.9,
      veteransHelped: 4891
    },
    '90d': {
      examsSaved: 21892,
      costSavings: '$27.6M',
      accuracy: 98.1,
      processingTime: 3.6,
      veteransHelped: 14672
    }
  };

  const currentData = analyticsData[activeTimeframe as keyof typeof analyticsData];

  const performanceMetrics = [
    { name: 'Leiden Community Detection', accuracy: 98.7, speed: 'Ultra-Fast', status: 'Optimal' },
    { name: 'XGBoost Prediction Engine', accuracy: 97.2, speed: 'Real-time', status: 'Optimal' },
    { name: 'NLP Anonymization', accuracy: 99.9, speed: 'Instant', status: 'Optimal' },
    { name: 'Continuous Learning', accuracy: 96.4, speed: 'Adaptive', status: 'Learning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  SkinZAI VBMS
                </h1>
                <p className="text-xs text-gray-400">RUMEV1 Analytics</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {['Dashboard', 'Analytics', 'Claims', 'Veterans', 'Settings'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    item === 'Analytics' 
                      ? 'text-purple-400 border-b-2 border-purple-400 pb-1' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`relative z-40 max-w-7xl mx-auto px-6 py-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-gray-300">RUMEV1 Performance Intelligence & Insights</p>
          </div>

          {/* Time Filter */}
          <div className="flex bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' }
            ].map((timeframe) => (
              <button
                key={timeframe.key}
                onClick={() => setActiveTimeframe(timeframe.key)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTimeframe === timeframe.key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-xl rounded-2xl border border-emerald-400/30 p-6 hover:scale-105 transition-all duration-500">
            <div className="text-3xl mb-3">🚫</div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">{currentData.examsSaved.toLocaleString()}</div>
            <div className="text-sm text-emerald-300">Exams Eliminated</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl border border-yellow-400/30 p-6 hover:scale-105 transition-all duration-500">
            <div className="text-3xl mb-3">💰</div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{currentData.costSavings}</div>
            <div className="text-sm text-yellow-300">Cost Savings</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6 hover:scale-105 transition-all duration-500">
            <div className="text-3xl mb-3">🎯</div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{currentData.accuracy}%</div>
            <div className="text-sm text-blue-300">AI Accuracy</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6 hover:scale-105 transition-all duration-500">
            <div className="text-3xl mb-3">⚡</div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{currentData.processingTime}min</div>
            <div className="text-sm text-purple-300">Avg Processing</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-xl rounded-2xl border border-pink-400/30 p-6 hover:scale-105 transition-all duration-500">
            <div className="text-3xl mb-3">🎖️</div>
            <div className="text-3xl font-bold text-pink-400 mb-2">{currentData.veteransHelped.toLocaleString()}</div>
            <div className="text-sm text-pink-300">Veterans Helped</div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Agent Performance */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🤖</span>
              Agent Performance Matrix
            </h2>
            
            <div className="space-y-6">
              {performanceMetrics.map((agent, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'Optimal' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Accuracy</span>
                      <div className="text-xl font-bold text-white">{agent.accuracy}%</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Speed</span>
                      <div className="text-xl font-bold text-blue-400">{agent.speed}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${agent.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Visualization */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Impact Visualization
            </h2>
            
            <div className="space-y-6">
              {/* Savings Over Time */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-600/10 rounded-2xl p-6 border border-emerald-400/20">
                <h3 className="text-lg font-semibold text-white mb-4">Cumulative Savings Impact</h3>
                <div className="flex items-end space-x-2 h-32">
                  {[65, 78, 92, 88, 95, 87, 100].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-emerald-400 to-blue-500 rounded-t flex-1 transition-all duration-1000 hover:from-emerald-300 hover:to-blue-400"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Week 1</span>
                  <span>Week 7</span>
                </div>
              </div>

              {/* Efficiency Metrics */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-2xl p-6 border border-purple-400/20">
                <h3 className="text-lg font-semibold text-white mb-4">System Efficiency</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Processing Speed', value: 94, color: 'from-purple-500 to-purple-400' },
                    { label: 'Resource Optimization', value: 87, color: 'from-pink-500 to-pink-400' },
                    { label: 'Prediction Accuracy', value: 97, color: 'from-blue-500 to-blue-400' }
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">{metric.label}</span>
                        <span className="text-white font-semibold">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${metric.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🔮</span>
            Predictive Insights & Trends
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Next Week Forecast</h3>
              <div className="text-2xl font-bold text-blue-400 mb-2">$3.1M</div>
              <div className="text-sm text-gray-300">Projected savings with 12% increase</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl p-6 border border-emerald-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Optimization Potential</h3>
              <div className="text-2xl font-bold text-emerald-400 mb-2">23%</div>
              <div className="text-sm text-gray-300">Additional efficiency gains available</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl p-6 border border-purple-400/20">
              <h3 className="text-lg font-semibold text-white mb-3">Learning Rate</h3>
              <div className="text-2xl font-bold text-purple-400 mb-2">+0.3%</div>
              <div className="text-sm text-gray-300">Weekly accuracy improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Refresh Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}