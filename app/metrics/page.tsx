'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { massiveMockDatabase } from '../lib/massiveMockData';

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  description: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export default function MetricsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('overview');
  const [activeChart, setActiveChart] = useState('claims-processing');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate comprehensive metrics
  const totalClaims = massiveMockDatabase.claims.length;
  const totalVeterans = massiveMockDatabase.veterans.length;
  const totalDocuments = massiveMockDatabase.documents.length;
  
  const examEliminationRate = ((massiveMockDatabase.claims.filter(c => !c.examRequired).length / totalClaims) * 100).toFixed(1);
  const averageProcessingTime = Math.round(massiveMockDatabase.claims.reduce((acc, claim) => {
    const daysSinceReceived = Math.floor((Date.now() - new Date(claim.dateReceived).getTime()) / (1000 * 60 * 60 * 24));
    return acc + daysSinceReceived;
  }, 0) / totalClaims);
  
  const systemAccuracy = (massiveMockDatabase.claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / totalClaims).toFixed(1);
  const costSavings = ((massiveMockDatabase.claims.filter(c => !c.examRequired).length * 3500) / 1000000).toFixed(2);

  // Generate chart data for the past 30 days
  const generateChartData = (type: string): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      let value = 0;
      switch (type) {
        case 'claims-processing':
          value = Math.floor(Math.random() * 50) + 100 + (i * 2); // Trending up
          break;
        case 'exam-elimination':
          value = Math.floor(Math.random() * 10) + 65 + (i * 0.5); // Slowly increasing
          break;
        case 'accuracy':
          value = Math.floor(Math.random() * 5) + 92 + Math.sin(i / 5) * 2; // Oscillating around 94%
          break;
        case 'throughput':
          value = Math.floor(Math.random() * 200) + 2000 + (i * 10); // Daily throughput
          break;
        default:
          value = Math.floor(Math.random() * 100);
      }
      
      data.push({
        date: dateStr,
        value: Math.round(value),
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  };

  const claimsProcessingData = generateChartData('claims-processing');
  const examEliminationData = generateChartData('exam-elimination');
  const accuracyData = generateChartData('accuracy');
  const throughputData = generateChartData('throughput');

  const metrics: { [key: string]: MetricCard[] } = {
    overview: [
      {
        title: 'Total Claims',
        value: totalClaims.toLocaleString(),
        change: '+12.5%',
        trend: 'up',
        icon: '📋',
        description: 'Total claims in the system'
      },
      {
        title: 'Exam Elimination Rate',
        value: `${examEliminationRate}%`,
        change: '+8.2%',
        trend: 'up',
        icon: '🚫',
        description: 'Claims processed without C&P exam'
      },
      {
        title: 'System Accuracy',
        value: `${systemAccuracy}%`,
        change: '+2.1%',
        trend: 'up',
        icon: '🎯',
        description: 'AI decision accuracy rate'
      },
      {
        title: 'Cost Savings',
        value: `$${costSavings}M`,
        change: '+15.8%',
        trend: 'up',
        icon: '💰',
        description: 'Total cost savings this year'
      },
      {
        title: 'Avg Processing Time',
        value: `${averageProcessingTime} days`,
        change: '-5.3%',
        trend: 'down',
        icon: '⏱️',
        description: 'Average claim processing time'
      },
      {
        title: 'Active Veterans',
        value: totalVeterans.toLocaleString(),
        change: '+3.7%',
        trend: 'up',
        icon: '👥',
        description: 'Veterans with active claims'
      }
    ],
    rumev: [
      {
        title: 'AI Agent Uptime',
        value: '99.97%',
        change: '+0.02%',
        trend: 'up',
        icon: '🤖',
        description: 'RUMEV1 system availability'
      },
      {
        title: 'Leiden Detection',
        value: '98.7%',
        change: '+1.2%',
        trend: 'up',
        icon: '🔍',
        description: 'Medical condition detection accuracy'
      },
      {
        title: 'XGBoost Performance',
        value: '97.2%',
        change: '+0.8%',
        trend: 'up',
        icon: '⚡',
        description: 'Machine learning model accuracy'
      },
      {
        title: 'NLP Processing',
        value: '99.1%',
        change: '+0.5%',
        trend: 'up',
        icon: '📝',
        description: 'Natural language processing accuracy'
      },
      {
        title: 'Decisions per Day',
        value: '2,847',
        change: '+18.3%',
        trend: 'up',
        icon: '🏃',
        description: 'Daily AI-assisted decisions'
      },
      {
        title: 'Avg Response Time',
        value: '45ms',
        change: '-12%',
        trend: 'down',
        icon: '⚡',
        description: 'Average AI response latency'
      }
    ],
    quality: [
      {
        title: 'Quality Score',
        value: '94.8%',
        change: '+2.3%',
        trend: 'up',
        icon: '⭐',
        description: 'Overall quality rating'
      },
      {
        title: 'Appeals Rate',
        value: '3.2%',
        change: '-1.8%',
        trend: 'down',
        icon: '⚖️',
        description: 'Percentage of decisions appealed'
      },
      {
        title: 'Accuracy Audits',
        value: '287',
        change: '+9.4%',
        trend: 'up',
        icon: '🔍',
        description: 'Completed quality reviews'
      },
      {
        title: 'Error Rate',
        value: '1.3%',
        change: '-0.7%',
        trend: 'down',
        icon: '❌',
        description: 'Processing error percentage'
      },
      {
        title: 'Compliance Score',
        value: '98.5%',
        change: '+1.1%',
        trend: 'up',
        icon: '✅',
        description: 'Regulatory compliance rate'
      },
      {
        title: 'Review Turnaround',
        value: '2.3 days',
        change: '-0.8 days',
        trend: 'down',
        icon: '⏰',
        description: 'Average quality review time'
      }
    ]
  };

  const currentMetrics = metrics[selectedCategory] || metrics.overview;

  const chartConfigs = {
    'claims-processing': {
      title: 'Claims Processing Volume',
      data: claimsProcessingData,
      color: 'blue',
      yLabel: 'Claims Processed'
    },
    'exam-elimination': {
      title: 'Exam Elimination Rate',
      data: examEliminationData,
      color: 'purple',
      yLabel: 'Percentage (%)'
    },
    'accuracy': {
      title: 'System Accuracy Trend',
      data: accuracyData,
      color: 'emerald',
      yLabel: 'Accuracy (%)'
    },
    'throughput': {
      title: 'Daily Processing Throughput',
      data: throughputData,
      color: 'orange',
      yLabel: 'Documents Processed'
    }
  };

  const currentChart = chartConfigs[activeChart as keyof typeof chartConfigs];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const renderMiniChart = (data: ChartDataPoint[], color: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    
    return (
      <div className="flex items-end space-x-1 h-16 mt-4">
        {data.slice(-14).map((point, index) => {
          const height = range === 0 ? 50 : ((point.value - minValue) / range) * 60 + 4;
          return (
            <div
              key={index}
              className={`bg-${color}-400 opacity-70 w-2 transition-all hover:opacity-100 rounded-t`}
              style={{ height: `${height}px` }}
              title={`${point.label}: ${point.value}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="metrics"
          title="Metrics Dashboard"
          description="Comprehensive analytics and performance metrics for the VBMS system, including AI performance, quality indicators, cost savings, and operational efficiency measurements."
          features={[
            "Real-time system performance metrics and KPI tracking",
            "RUMEV1 AI agent performance monitoring and analytics",
            "Quality assurance metrics and compliance tracking",
            "Interactive charts and trend analysis over time"
          ]}
          demoActions={[
            { label: "View RUMEV1 Metrics", action: () => setSelectedCategory('rumev') },
            { label: "Show Quality Metrics", action: () => setSelectedCategory('quality') },
            { label: "Analyze Trends", action: () => setActiveChart('accuracy') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Metrics Dashboard</h1>
                  <p className="text-sm text-slate-500">Performance Analytics & KPI Monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Category Tabs */}
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg mb-8">
              {Object.keys(metrics).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {category === 'overview' ? 'System Overview' : 
                   category === 'rumev' ? 'RUMEV1 AI' : 
                   'Quality Metrics'}
                </button>
              ))}
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentMetrics.map((metric, index) => (
                <div key={index} className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-400">{metric.title}</h3>
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-100 mb-2">
                    {metric.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-1 text-sm ${getTrendColor(metric.trend)}`}>
                      <span>{getTrendIcon(metric.trend)}</span>
                      <span>{metric.change}</span>
                    </div>
                    <div className="text-xs text-slate-500">vs last period</div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
                  
                  {/* Mini chart based on metric type */}
                  {selectedCategory === 'overview' && index < 4 && renderMiniChart(
                    index === 0 ? claimsProcessingData : 
                    index === 1 ? examEliminationData :
                    index === 2 ? accuracyData : throughputData,
                    index === 0 ? 'blue' : index === 1 ? 'purple' : index === 2 ? 'emerald' : 'orange'
                  )}
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-100">{currentChart.title}</h2>
                    <div className="flex space-x-2">
                      {Object.keys(chartConfigs).map((chartKey) => (
                        <button
                          key={chartKey}
                          onClick={() => setActiveChart(chartKey)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            activeChart === chartKey
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {chartConfigs[chartKey as keyof typeof chartConfigs].title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chart Visualization */}
                  <div className="h-64 flex items-end space-x-2">
                    {currentChart.data.slice(-20).map((point, index) => {
                      const maxValue = Math.max(...currentChart.data.map(d => d.value));
                      const minValue = Math.min(...currentChart.data.map(d => d.value));
                      const range = maxValue - minValue;
                      const height = range === 0 ? 50 : ((point.value - minValue) / range) * 240 + 20;
                      
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center group"
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs px-2 py-1 rounded mb-2">
                            {point.value}{currentChart.yLabel.includes('%') ? '%' : ''}
                          </div>
                          <div
                            className={`bg-gradient-to-t from-${currentChart.color}-500 to-${currentChart.color}-400 w-full rounded-t transition-all hover:brightness-110`}
                            style={{ height: `${height}px` }}
                          />
                          <div className="text-xs text-slate-500 mt-2 rotate-45 origin-left">
                            {point.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-slate-400">
                    {currentChart.yLabel}
                  </div>
                </div>
              </div>
              
              {/* Side Stats */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">API Uptime</span>
                      <span className="text-emerald-400 font-semibold">99.97%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Database Health</span>
                      <span className="text-emerald-400 font-semibold">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">AI Agents</span>
                      <span className="text-blue-400 font-semibold">5/5 Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Queue Length</span>
                      <span className="text-yellow-400 font-semibold">23 items</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance Targets</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Processing Time</span>
                        <span className="text-emerald-400">85%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Accuracy Target</span>
                        <span className="text-blue-400">94%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Cost Reduction</span>
                        <span className="text-purple-400">112%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">User Satisfaction</span>
                        <span className="text-emerald-400">96%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Performance</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    RUMEV1 is operating at peak efficiency with exceptional accuracy rates.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">4.8K</div>
                      <div className="text-xs text-slate-400">Daily Decisions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">45ms</div>
                      <div className="text-xs text-slate-400">Avg Latency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Recent Performance Insights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-200 font-medium">Exam elimination rate increased by 8.2%</p>
                      <p className="text-slate-400 text-sm">AI improvements reduced unnecessary examinations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-200 font-medium">Processing time reduced by 2.3 days</p>
                      <p className="text-slate-400 text-sm">Workflow optimizations showing positive results</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-200 font-medium">Quality scores improved across all categories</p>
                      <p className="text-slate-400 text-sm">Enhanced training protocols taking effect</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-200 font-medium">System uptime maintained at 99.97%</p>
                      <p className="text-slate-400 text-sm">Infrastructure improvements delivering reliability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-200 font-medium">Cost savings exceeded projections</p>
                      <p className="text-slate-400 text-sm">$2.45M saved through automation initiatives</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-200 font-medium">Appeal rates decreased by 1.8%</p>
                      <p className="text-slate-400 text-sm">Improved accuracy reducing veteran appeals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}