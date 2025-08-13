'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { useAuth } from '../components/AuthProvider';
import { massiveMockDatabase } from '../lib/massiveMockData';
import { PermissionManager } from '../lib/permissions';

interface ReportMetrics {
  totalClaims: number;
  completedClaims: number;
  avgProcessingTime: number;
  examEliminationRate: number;
  costSavings: number;
  aiAccuracy: number;
  userProductivity: number;
  complianceScore: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export default function ReportsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<'overview' | 'claims' | 'performance' | 'ai' | 'compliance' | 'custom'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [reportMetrics, setReportMetrics] = useState<ReportMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customFilters, setCustomFilters] = useState({
    organization: 'all',
    userRole: 'all',
    claimType: 'all',
    priority: 'all'
  });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
    generateReportData();
  }, [selectedReport, dateRange]);

  const generateReportData = () => {
    const claims = massiveMockDatabase.claims;
    const veterans = massiveMockDatabase.veterans;
    
    // Calculate key metrics
    const metrics: ReportMetrics = {
      totalClaims: claims.length,
      completedClaims: claims.filter(c => c.status === 'Complete').length,
      avgProcessingTime: Math.round(claims.reduce((acc, c) => acc + c.daysInQueue, 0) / claims.length),
      examEliminationRate: Math.round((claims.filter(c => !c.examRequired).length / claims.length) * 100),
      costSavings: claims.filter(c => !c.examRequired).length * 3500,
      aiAccuracy: Math.round(claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / claims.length),
      userProductivity: Math.round(claims.length / 30), // Claims per day
      complianceScore: 96.8
    };
    
    setReportMetrics(metrics);
    
    // Generate chart data based on selected report
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const claimsData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 10);
    const examEliminationData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 15) + 5);
    
    setChartData({
      labels: last30Days,
      datasets: [
        {
          label: 'Claims Processed',
          data: claimsData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Exams Eliminated',
          data: examEliminationData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }
      ]
    });
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsGenerating(true);
    
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate comprehensive export data with real metrics
    const exportData = {
      reportType: selectedReport,
      dateRange: dateRange,
      generatedBy: `${user?.firstName} ${user?.lastName}`,
      generatedAt: new Date().toISOString(),
      metrics: reportMetrics,
      organization: user?.organization,
      ...customFilters
    };
    
    // In a real app, this would trigger actual file download
    console.log(`Exporting ${selectedReport} report as ${format}:`, exportData);
    
    // Create a mock download
    const fileName = `VBMS_${selectedReport}_report_${dateRange}_${new Date().toISOString().split('T')[0]}.${format}`;
    const mockContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([mockContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  const scheduleReport = () => {
    // Mock scheduling functionality
    alert(`Scheduled ${selectedReport} report to be generated ${dateRange} and emailed to ${user?.email}`);
  };

  // Check permissions
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-slate-400 mb-6">Please sign in to access reports</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user?.role || !PermissionManager.hasPermission(user.role, 'reports.view')) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Insufficient Permissions</h2>
            <p className="text-slate-400 mb-6">You don't have permission to view reports</p>
            <Link href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <WelcomeModal
        pageName="reports"
        title="Reports & Analytics"
        description="Comprehensive reporting suite with advanced analytics, data visualization, and export capabilities for performance monitoring and compliance reporting."
        features={[
          "Real-time performance metrics and KPI dashboards",
          "Advanced data visualization with interactive charts",
          "Comprehensive export options (PDF, Excel, CSV)",
          "Smart scheduling with context-aware delivery and stakeholder alerts"
        ]}
        demoActions={[
          { label: 'View Claims Analytics', action: () => setSelectedReport('claims') },
          { label: 'AI Performance Metrics', action: () => setSelectedReport('ai') },
          { label: 'Generate Live Report', action: () => exportReport('pdf') }
        ]}
      />

      <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Reports & Analytics</h1>
            <p className="text-slate-400">Comprehensive data insights and reporting</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="custom">Custom range</option>
            </select>
            
            <button
              onClick={scheduleReport}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm"
            >
              Schedule Report
            </button>
            
            <div className="relative group">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                Export Report
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button
                    onClick={() => exportReport('pdf')}
                    disabled={isGenerating}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                  >
                    📄 Export as PDF
                  </button>
                  <button
                    onClick={() => exportReport('excel')}
                    disabled={isGenerating}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                  >
                    📊 Export as Excel
                  </button>
                  <button
                    onClick={() => exportReport('csv')}
                    disabled={isGenerating}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                  >
                    📋 Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          {/* Report Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg mb-8">
            <div className="flex border-b border-slate-800 overflow-x-auto">
              {[
                { id: 'overview', label: 'Executive Overview', icon: '📊' },
                { id: 'claims', label: 'Claims Analytics', icon: '📋' },
                { id: 'performance', label: 'Performance Metrics', icon: '⚡' },
                { id: 'ai', label: 'AI & RUMEV1', icon: '🤖' },
                { id: 'compliance', label: 'Compliance Report', icon: '✅' },
                { id: 'custom', label: 'Custom Report', icon: '🔧' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedReport(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedReport === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Dashboard */}
          {reportMetrics && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-400">Total Claims</h3>
                  <span className="text-2xl">📋</span>
                </div>
                <div className="text-3xl font-bold text-slate-100 mb-1">
                  {reportMetrics.totalClaims.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-400">
                  +12% from last period
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-400">Exam Elimination</h3>
                  <span className="text-2xl">🚫</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {reportMetrics.examEliminationRate}%
                </div>
                <div className="text-xs text-emerald-400">
                  +5.2% efficiency gain
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-400">Cost Savings</h3>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  ${(reportMetrics.costSavings / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-emerald-400">
                  {reportMetrics.costSavings.toLocaleString()} saved
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-400">AI Accuracy</h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {reportMetrics.aiAccuracy}%
                </div>
                <div className="text-xs text-emerald-400">
                  RUMEV1 precision
                </div>
              </div>
            </div>
          )}

          {/* Report Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Chart Area */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-100">
                    {selectedReport === 'overview' && 'Executive Dashboard'}
                    {selectedReport === 'claims' && 'Claims Processing Trends'}
                    {selectedReport === 'performance' && 'System Performance Metrics'}
                    {selectedReport === 'ai' && 'RUMEV1 AI Analytics'}
                    {selectedReport === 'compliance' && 'Compliance Monitoring'}
                    {selectedReport === 'custom' && 'Custom Report Builder'}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <span>Last updated:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="bg-slate-800/50 rounded-lg p-8 mb-6">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">📈</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Interactive Chart Visualization</h3>
                      <p className="text-sm text-slate-400 max-w-md">
                        Real-time data visualization with interactive charts showing trends, 
                        performance metrics, and key insights over the selected time period.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-4">Processing Efficiency</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Average Processing Time</span>
                        <span className="text-sm font-semibold text-blue-400">
                          {reportMetrics?.avgProcessingTime} days
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Claims Completed</span>
                        <span className="text-sm font-semibold text-emerald-400">
                          {reportMetrics?.completedClaims}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">User Productivity</span>
                        <span className="text-sm font-semibold text-purple-400">
                          {reportMetrics?.userProductivity} claims/day
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-4">Quality Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">RUMEV1 Accuracy</span>
                        <span className="text-sm font-semibold text-emerald-400">
                          {reportMetrics?.aiAccuracy}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Compliance Score</span>
                        <span className="text-sm font-semibold text-emerald-400">
                          {reportMetrics?.complianceScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Error Rate</span>
                        <span className="text-sm font-semibold text-red-400">
                          0.8%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Filters */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Report Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Organization</label>
                    <select
                      value={customFilters.organization}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Organizations</option>
                      <option value="ro-atlanta">Atlanta RO</option>
                      <option value="ro-denver">Denver RO</option>
                      <option value="hq-washington">VA Central Office</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">User Role</label>
                    <select
                      value={customFilters.userRole}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, userRole: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="rating-specialist">Rating Specialists</option>
                      <option value="vsr">VSRs</option>
                      <option value="supervisor">Supervisors</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
                    <select
                      value={customFilters.priority}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="standard">Standard</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Export & Share</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => exportReport('pdf')}
                    disabled={isGenerating}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span className="text-red-400">📄</span>
                    <span className="text-sm text-slate-200">Export as PDF</span>
                  </button>
                  
                  <button
                    onClick={() => exportReport('excel')}
                    disabled={isGenerating}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span className="text-emerald-400">📊</span>
                    <span className="text-sm text-slate-200">Export as Excel</span>
                  </button>
                  
                  <button
                    onClick={() => exportReport('csv')}
                    disabled={isGenerating}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span className="text-blue-400">📋</span>
                    <span className="text-sm text-slate-200">Export as CSV</span>
                  </button>
                  
                  <button
                    onClick={scheduleReport}
                    className="w-full flex items-center space-x-3 p-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                  >
                    <span>📅</span>
                    <span className="text-sm text-white">Schedule Report</span>
                  </button>
                </div>
                
                {isGenerating && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-blue-400">Generating report...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Reports */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Recent Reports</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Monthly Performance Report', date: '2 hours ago', type: 'PDF' },
                    { name: 'Claims Analytics Export', date: '1 day ago', type: 'Excel' },
                    { name: 'RUMEV1 Accuracy Report', date: '3 days ago', type: 'PDF' },
                    { name: 'Compliance Summary', date: '1 week ago', type: 'CSV' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded transition-colors">
                      <div className="flex-1">
                        <p className="text-sm text-slate-200 font-medium">{report.name}</p>
                        <p className="text-xs text-slate-500">{report.date}</p>
                      </div>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {report.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}