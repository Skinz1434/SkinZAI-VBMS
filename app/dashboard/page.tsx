'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import WelcomeModal from '../components/WelcomeModal';
import ActivityFeed from '../components/ActivityFeed';
import { useAuth } from '../components/AuthProvider';
import { massiveMockDatabase } from '../lib/massiveMockData';

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Dashboard metrics calculated from massive mock data
  const dashboardMetrics = {
    examEliminationRate: ((massiveMockDatabase.claims.filter(c => !c.examRequired).length / massiveMockDatabase.claims.length) * 100).toFixed(1),
    systemAccuracy: (massiveMockDatabase.claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / massiveMockDatabase.claims.length).toFixed(1),
    totalSavings: ((massiveMockDatabase.claims.filter(c => !c.examRequired).length * 3500) / 1000000).toFixed(2),
    activeAgents: 5,
    systemUptime: 99.97
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-slate-400 mb-6">Please sign in to access your dashboard</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
      <WelcomeModal
        pageName="dashboard"
        title="Personal Dashboard"
        description="Your comprehensive overview of the VBMS system with personalized metrics, recent activity, and priority items requiring your attention."
        features={[
          "Real-time system performance and personal productivity metrics",
          "Comprehensive data overview with massive mock dataset",
          "System status monitoring and quick action access"
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
                <h1 className="text-lg font-semibold text-slate-100">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, {user?.firstName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">{currentTime.toLocaleDateString()}</p>
                <p className="text-xs text-slate-500">{currentTime.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">System Status</h3>
                <span className="text-2xl">💚</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {dashboardMetrics.systemUptime}%
              </div>
              <div className="text-xs text-slate-500">{dashboardMetrics.activeAgents} agents active</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Claims Processed</h3>
                <span className="text-2xl">📋</span>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {massiveMockDatabase.claims.length}
              </div>
              <div className="text-xs text-slate-500">Total in system</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Exam Elimination</h3>
                <span className="text-2xl">🚫</span>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {dashboardMetrics.examEliminationRate}%
              </div>
              <div className="text-xs text-slate-500">${dashboardMetrics.totalSavings}M saved</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Accuracy Rate</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {dashboardMetrics.systemAccuracy}%
              </div>
              <div className="text-xs text-slate-500">RUMEV1 AI precision</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h2 className="text-xl font-semibold text-slate-100 mb-2">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-slate-300 mb-4">
                  You're logged in as a {user?.role} at {user?.organization}. 
                  Here's what's happening in your VBMS workspace today.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/claims" 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
                  >
                    View Claims
                  </Link>
                  <Link 
                    href="/analytics" 
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Analytics
                  </Link>
                  <Link 
                    href="/orchestration" 
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                  >
                    AI Agents
                  </Link>
                </div>
              </div>

              {/* System Performance */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">System Performance Overview</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3">RUMEV1 Agents</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Leiden Detection</span>
                        <span className="text-emerald-400 text-sm font-medium">98.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">XGBoost Engine</span>
                        <span className="text-emerald-400 text-sm font-medium">97.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">NLP Processor</span>
                        <span className="text-emerald-400 text-sm font-medium">99.1%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3">Processing Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Avg Latency</span>
                        <span className="text-blue-400 text-sm font-medium">45ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Throughput</span>
                        <span className="text-blue-400 text-sm font-medium">2.8K/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Queue Size</span>
                        <span className="text-purple-400 text-sm font-medium">23</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity Feed */}
              <ActivityFeed 
                limit={15}
                showFilters={true}
                autoRefresh={true}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  <Link 
                    href="/claims"
                    className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <span className="text-blue-400 text-sm">📋</span>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-slate-100">View All Claims</span>
                  </Link>
                  
                  <Link 
                    href="/efolder"
                    className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                      <span className="text-emerald-400 text-sm">📁</span>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-slate-100">Search Documents</span>
                  </Link>
                  
                  <Link 
                    href="/exams"
                    className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                      <span className="text-yellow-400 text-sm">🩺</span>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-slate-100">Manage Exams</span>
                  </Link>
                  
                  <Link 
                    href="/conditions"
                    className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <span className="text-purple-400 text-sm">⚕️</span>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-slate-100">Rating Conditions</span>
                  </Link>
                </div>
              </div>

              {/* Data Overview */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">System Data</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Veterans</span>
                    <span className="text-lg font-semibold text-slate-200">
                      {massiveMockDatabase.veterans.length.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Claims</span>
                    <span className="text-lg font-semibold text-slate-200">
                      {massiveMockDatabase.claims.length.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Documents</span>
                    <span className="text-lg font-semibold text-slate-200">
                      {massiveMockDatabase.documents.length.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="border-t border-slate-800 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Total Pages</span>
                      <span className="text-lg font-semibold text-emerald-400">
                        {Math.round(massiveMockDatabase.documents.reduce((acc, d) => acc + d.pages, 0) / 1000)}K
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">System Status</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Overall Health</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 text-sm font-medium">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Active Agents</span>
                    <span className="text-blue-400 text-sm font-medium">5/5</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Queue Status</span>
                    <span className="text-yellow-400 text-sm font-medium">Normal</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Last Update</span>
                    <span className="text-slate-300 text-sm">{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}