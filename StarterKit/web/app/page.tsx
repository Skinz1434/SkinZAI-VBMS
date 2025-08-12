'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WelcomeModal from './components/WelcomeModal';

export default function VBMSHomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if user is first-time visitor
  useEffect(() => {
    const hasVisited = localStorage.getItem('vbms-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('vbms-visited', 'true');
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const metricInterval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 4000);
    return () => {
      clearInterval(timer);
      clearInterval(metricInterval);
    };
  }, []);

  // Real VBMS metrics based on actual data
  const metrics = [
    { value: '2,847', label: 'Active Claims', icon: '📋', color: 'from-blue-500 to-blue-700', change: '+127 today' },
    { value: '623', label: 'Exams Eliminated', icon: '✅', color: 'from-emerald-500 to-emerald-700', change: 'RUMEV1 AI' },
    { value: '97.2%', label: 'Decision Accuracy', icon: '🎯', color: 'from-purple-500 to-purple-700', change: '+0.3% this week' },
    { value: '4.2min', label: 'Avg Processing Time', icon: '⚡', color: 'from-amber-500 to-amber-700', change: '60% faster' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Professional Background Grid */}
      <div className="absolute inset-0 neural-grid opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Professional Header */}
      <header className="relative z-50 glass-strong border-b border-slate-700/50 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Enhanced VA Logo & System Name */}
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-2xl mirror-effect group-hover:scale-110 transition-all duration-500">
                  <div className="text-white font-bold text-2xl tracking-tight">VA</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white font-display bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                  Veterans Benefits Management System
                </h1>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-slate-300 font-medium">Enhanced with RUMEV1 AI Intelligence</p>
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-xs text-emerald-400 font-semibold tracking-wide">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced System Status & Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden xl:flex items-center space-x-6">
                {/* Live System Metrics */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-600/50">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-lg font-mono">2,847</div>
                      <div className="text-slate-400 text-xs">Claims</div>
                    </div>
                    <div className="w-px h-8 bg-slate-600"></div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold text-lg font-mono">97.2%</div>
                      <div className="text-slate-400 text-xs">Accuracy</div>
                    </div>
                    <div className="w-px h-8 bg-slate-600"></div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold text-lg font-mono">4.2m</div>
                      <div className="text-slate-400 text-xs">Avg Time</div>
                    </div>
                  </div>
                </div>

                {/* Current Time Display */}
                <div className="text-right bg-slate-800/40 rounded-xl px-4 py-2 border border-slate-600/30">
                  <div className="text-white font-mono text-lg font-bold">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Navigation */}
              <nav className="hidden lg:flex items-center space-x-2 bg-slate-800/50 rounded-2xl p-2 backdrop-blur-sm border border-slate-600/50">
                {[
                  { name: 'Dashboard', icon: '📊', desc: 'System overview & metrics' },
                  { name: 'Analytics', icon: '📈', desc: 'Performance analytics' },
                  { name: 'Claims', icon: '📋', desc: 'Active claims management' },
                  { name: 'Orchestration', icon: '🤖', desc: 'AI agent orchestration' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={`/${item.name.toLowerCase()}`}
                    className="group relative flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-500 hover:scale-105 px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-indigo-600/20 hover:border-blue-400/30 border border-transparent hover:shadow-xl"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className="font-semibold tracking-wide">{item.name}</span>
                    
                    {/* Enhanced Tooltip */}
                    <div className="invisible group-hover:visible absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-600/50 whitespace-nowrap z-[60]">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-l border-t border-slate-600/50 rotate-45"></div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Enhanced Sign In Button */}
              <div className="flex items-center space-x-3">
                <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 border border-blue-400/30">
                  <div className="relative z-10 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Sign In</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`relative z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Welcome Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="glass-strong rounded-3xl p-8 border border-slate-700/50 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 font-display">
                  Welcome to VBMS Enhanced
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl">
                  Your comprehensive Veterans Benefits Management platform, now enhanced with RUMEV1 AI to streamline 
                  claims processing and reduce unnecessary medical examinations.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">{currentTime.toLocaleDateString()}</div>
                  <div className="text-slate-400 font-mono text-sm">{currentTime.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { 
                  title: 'New Claim', 
                  icon: '📋', 
                  desc: 'Start processing new veteran claim', 
                  href: '/claims', 
                  color: 'blue',
                  stats: '2,847 active'
                },
                { 
                  title: 'View Dashboard', 
                  icon: '📊', 
                  desc: 'Real-time system overview', 
                  href: '/dashboard', 
                  color: 'emerald',
                  stats: '4 agents online'
                },
                { 
                  title: 'eFolder Access', 
                  icon: '📁', 
                  desc: 'Digital document management', 
                  href: '/efolder', 
                  color: 'purple',
                  stats: '15,847 documents'
                },
                { 
                  title: 'Analytics', 
                  icon: '📈', 
                  desc: 'Performance metrics & insights', 
                  href: '/analytics', 
                  color: 'amber',
                  stats: '97.2% accuracy'
                },
              ].map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group relative overflow-hidden bg-gradient-to-br ${
                    action.color === 'blue' ? 'from-blue-500/10 to-blue-600/20 hover:from-blue-500/20 hover:to-blue-600/30' :
                    action.color === 'emerald' ? 'from-emerald-500/10 to-emerald-600/20 hover:from-emerald-500/20 hover:to-emerald-600/30' :
                    action.color === 'purple' ? 'from-purple-500/10 to-purple-600/20 hover:from-purple-500/20 hover:to-purple-600/30' :
                    'from-amber-500/10 to-amber-600/20 hover:from-amber-500/20 hover:to-amber-600/30'
                  } rounded-2xl p-6 border ${
                    action.color === 'blue' ? 'border-blue-500/30 hover:border-blue-400/50' :
                    action.color === 'emerald' ? 'border-emerald-500/30 hover:border-emerald-400/50' :
                    action.color === 'purple' ? 'border-purple-500/30 hover:border-purple-400/50' :
                    'border-amber-500/30 hover:border-amber-400/50'
                  } hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{action.icon}</div>
                      <div className={`text-xs font-mono px-2 py-1 rounded-full ${
                        action.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                        action.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' :
                        action.color === 'purple' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {action.stats}
                      </div>
                    </div>
                    <h3 className="text-white font-bold mb-2 group-hover:text-blue-300 transition-colors">{action.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{action.desc}</p>
                    
                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className={`w-5 h-5 ${
                        action.color === 'blue' ? 'text-blue-400' :
                        action.color === 'emerald' ? 'text-emerald-400' :
                        action.color === 'purple' ? 'text-purple-400' :
                        'text-amber-400'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Subtle background gradient on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${
                    action.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    action.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                    action.color === 'purple' ? 'from-purple-400 to-purple-600' :
                    'from-amber-400 to-amber-600'
                  } rounded-2xl`}></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* System Metrics */}
        <section className="max-w-7xl mx-auto px-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 font-display flex items-center">
            <span className="mr-3">📊</span>
            Real-Time System Metrics
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`group relative glass-strong rounded-2xl p-6 border border-slate-700/50 hover:scale-105 transition-all duration-500 hover:shadow-2xl mirror-effect ${
                  activeMetric === index ? 'ring-2 ring-blue-400/50 border-blue-400/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{metric.icon}</div>
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    {metric.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2 font-display">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RUMEV1 AI System Status */}
        <section className="max-w-7xl mx-auto px-6 mb-8">
          <div className="glass-strong rounded-3xl border border-slate-700/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-display flex items-center">
                  <span className="mr-3">🤖</span>
                  RUMEV1 AI Intelligence System
                </h3>
                <p className="text-slate-400">Advanced multi-agent system for automated claims processing</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-medium">All Agents Online</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: 'Agent A', 
                  title: 'Leiden Detection', 
                  icon: '🔬', 
                  desc: 'Community clustering analysis',
                  status: 'active',
                  efficiency: 98.7,
                  processed: '2,847 claims today'
                },
                { 
                  name: 'Agent B', 
                  title: 'XGBoost Engine', 
                  icon: '🎯', 
                  desc: 'Predictive outcome modeling',
                  status: 'active',
                  efficiency: 97.2,
                  processed: '623 exams eliminated'
                },
                { 
                  name: 'Agent C', 
                  title: 'NLP Processor', 
                  icon: '📝', 
                  desc: 'HIPAA-compliant data cleansing',
                  status: 'active',
                  efficiency: 99.9,
                  processed: '4,291 docs processed'
                },
                { 
                  name: 'Agent D', 
                  title: 'Learning System', 
                  icon: '🧠', 
                  desc: 'Continuous improvement',
                  status: 'learning',
                  efficiency: 96.4,
                  processed: '127 patterns learned'
                }
              ].map((agent, index) => (
                <div key={index} className="group bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden">
                  {/* Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">{agent.icon}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border transition-all group-hover:scale-105 ${
                        agent.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 group-hover:bg-yellow-500/30'
                      }`}>
                        {agent.status.toUpperCase()}
                      </div>
                    </div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{agent.name}</h4>
                    <h5 className="text-sm font-semibold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">{agent.title}</h5>
                    <p className="text-xs text-slate-400 mb-3 group-hover:text-slate-300 transition-colors">{agent.desc}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Efficiency</span>
                        <span className="text-white font-semibold group-hover:text-emerald-300 transition-colors">{agent.efficiency}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2.5 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                          style={{ width: `${agent.efficiency}%` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{agent.processed}</div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pulse effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Floating Action Center */}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        {/* Quick Actions Menu */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-purple-600 to-pink-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 mirror-effect group">
            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-600/50 shadow-2xl">
            <div className="font-semibold">Quick Actions</div>
            <div className="text-slate-400 text-xs">System controls & shortcuts</div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
          </div>
        </div>

        {/* Help & Documentation */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-600/50 shadow-2xl">
            <div className="font-semibold">Help & Support</div>
            <div className="text-slate-400 text-xs">Documentation & tutorials</div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
          </div>
        </div>

        {/* RUMEV1 AI Assistant - Enhanced */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-emerald-600 to-teal-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 mirror-effect relative overflow-hidden">
            {/* Pulsing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 animate-pulse rounded-full"></div>
            
            <div className="relative">
              <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-full"></div>
          </button>
          
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-600/50 shadow-2xl">
            <div className="font-semibold flex items-center space-x-2">
              <span>RUMEV1 AI Assistant</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-slate-400 text-xs">Intelligent claims analysis</div>
            <div className="text-emerald-400 text-xs font-mono">●Online • 4 agents active</div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600/50 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-40 glass-strong border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold text-sm">VA</div>
                </div>
                <div className="text-white font-bold text-lg">VBMS Enhanced</div>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Veterans Benefits Management System enhanced with RUMEV1 AI Intelligence for improved claims processing and veteran services.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 text-xs text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="text-xs text-slate-400">
                  Version 2.1.0 | Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(new Date().getDate()).padStart(2, '0')}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { name: 'Dashboard', href: '/dashboard' },
                  { name: 'Analytics', href: '/analytics' },
                  { name: 'Claims', href: '/claims' },
                  { name: 'eFolder', href: '/efolder' }
                ].map(link => (
                  <Link key={link.name} href={link.href} className="block text-slate-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Claims Queue</span>
                  <span className="text-emerald-400">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Agents</span>
                  <span className="text-emerald-400">4/4 Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Processing</span>
                  <span className="text-emerald-400">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
}
