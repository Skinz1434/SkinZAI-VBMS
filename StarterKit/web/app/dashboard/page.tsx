'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const dashboardStats = [
    { value: '1,847', label: 'Claims Processed Today', icon: '📋', change: '+12%', trend: 'up' },
    { value: '623', label: 'Exams Eliminated', icon: '🚫', change: '+18%', trend: 'up' },
    { value: '$2.3M', label: 'Savings Today', icon: '💰', change: '+15%', trend: 'up' },
    { value: '97.2%', label: 'AI Accuracy', icon: '🎯', change: '+0.3%', trend: 'up' },
    { value: '4.2min', label: 'Avg Decision Time', icon: '⚡', change: '-23%', trend: 'down' },
    { value: '1,203', label: 'Veterans Helped', icon: '🎖️', change: '+16%', trend: 'up' },
  ];

  const agentStatus = [
    { name: 'Agent A - Leiden Detection', status: 'active', efficiency: 98, workload: 87 },
    { name: 'Agent B - XGBoost Engine', status: 'active', efficiency: 97, workload: 92 },
    { name: 'Agent C - NLP Anonymizer', status: 'active', efficiency: 99, workload: 78 },
    { name: 'Agent D - Learning System', status: 'learning', efficiency: 96, workload: 65 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  SkinZAI VBMS
                </h1>
                <p className="text-xs text-gray-400">RUMEV1 Dashboard</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {['Dashboard', 'Analytics', 'Claims', 'Veterans', 'Settings'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    item === 'Dashboard' 
                      ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">RUMEV1 Command Center</h1>
          <p className="text-gray-300">Real-time Veterans Benefits Management & AI Intelligence</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 ${
                activeCard === index ? 'ring-2 ring-blue-400/50 shadow-xl' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Agent Status Panel */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🤖</span>
            Multi-Agent System Status
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {agentStatus.map((agent, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Efficiency</span>
                      <span className="text-blue-400">{agent.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${agent.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Workload</span>
                      <span className="text-purple-400">{agent.workload}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${agent.workload}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Live Activity Feed
          </h2>
          
          <div className="space-y-4">
            {[
              { time: '2 min ago', action: 'Leiden Algorithm detected new claim cluster', type: 'detection', icon: '🔬' },
              { time: '5 min ago', action: 'XGBoost eliminated unnecessary exam for Veteran #47291', type: 'elimination', icon: '🚫' },
              { time: '8 min ago', action: 'NLP system processed 347 claims with 100% anonymization', type: 'processing', icon: '📝' },
              { time: '12 min ago', action: 'System learned from 23 new decision patterns', type: 'learning', icon: '🧠' },
              { time: '15 min ago', action: 'Generated $47K in cost savings through efficient routing', type: 'savings', icon: '💰' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-2xl mr-4">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'detection' ? 'bg-blue-400' :
                  activity.type === 'elimination' ? 'bg-red-400' :
                  activity.type === 'processing' ? 'bg-green-400' :
                  activity.type === 'learning' ? 'bg-purple-400' :
                  'bg-yellow-400'
                } animate-pulse`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-gradient-to-r from-emerald-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}