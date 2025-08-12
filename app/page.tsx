'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SkinZAIHomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { value: '$1B+', label: 'Annual Savings', icon: '💰', color: 'from-emerald-400 to-teal-600' },
    { value: '60%', label: 'Faster Decisions', icon: '⚡', color: 'from-blue-400 to-indigo-600' },
    { value: '95%+', label: 'AI Accuracy', icon: '🎯', color: 'from-purple-400 to-violet-600' },
    { value: '300K', label: 'Monthly Exams', icon: '🔬', color: 'from-orange-400 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  SkinZAI VBMS
                </h1>
                <p className="text-xs text-gray-400">RUMEV1 Intelligence Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Dashboard', 'Analytics', 'Claims', 'Veterans', 'Settings'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
                >
                  {item}
                </Link>
              ))}
            </div>

            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              Deploy Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={`relative z-40 max-w-7xl mx-auto px-6 pt-20 pb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-300">Revolutionary AI-Powered Veterans Benefits</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
              The Future
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">
              of Veterans
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Benefits
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Eliminating <span className="font-bold text-red-400">$4.2 billion</span> in unnecessary medical exams through 
            <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> revolutionary AI</span>, 
            <span className="font-bold bg-gradient-to-r from-purple-500 to-emerald-400 bg-clip-text text-transparent"> Leiden community detection</span>, and 
            <span className="font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> XGBoost prediction engines</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 overflow-hidden">
              <span className="relative z-10">Start Saving Billions</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10">
              <span className="flex items-center space-x-2">
                <span>Watch Demo</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${metric.color} p-1 rounded-2xl hover:scale-105 transition-all duration-500 ${
                activeMetric === index ? 'ring-4 ring-white/30 shadow-2xl' : ''
              }`}
            >
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 h-full">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-sm text-white/80">{metric.label}</div>
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* RUMEV1 System Preview */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">RUMEV1 Multi-Agent Intelligence</h2>
            <p className="text-gray-300 text-lg">Four specialized AI agents working in perfect harmony</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Agent A', title: 'Leiden Community Detection', icon: '🔬', desc: 'Graph-based claim clustering' },
              { name: 'Agent B', title: 'XGBoost Prediction Engine', icon: '🎯', desc: '95%+ accuracy predictions' },
              { name: 'Agent C', title: 'NLP Anonymization', icon: '📝', desc: 'HIPAA-compliant processing' },
              { name: 'Agent D', title: 'Continuous Learning', icon: '🔄', desc: 'Real-time improvements' }
            ].map((agent, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl mb-4 group-hover:animate-bounce">{agent.icon}</div>
                <h3 className="font-bold text-white mb-2">{agent.name}</h3>
                <h4 className="text-sm font-semibold text-blue-400 mb-3">{agent.title}</h4>
                <p className="text-xs text-gray-400">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 cursor-pointer">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
