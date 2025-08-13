'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { massiveMockDatabase } from '../lib/massiveMockData';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'error' | 'maintenance';
  model: string;
  accuracy: number;
  throughput: number;
  latency: string;
  memory: string;
  gpu: string;
  endpoints: string[];
  capabilities: string[];
  configuration: Record<string, any>;
  trainingData: {
    samples: string;
    lastTrained: string;
    accuracy: number;
    f1Score: number;
  };
  currentTask?: string;
  queueSize?: number;
  lastActivity?: string;
}

interface ProcessingTask {
  id: string;
  type: string;
  veteranId: string;
  claimId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  assignedAgent: string;
  startTime: Date;
  estimatedCompletion?: Date;
  progress: number;
}

export default function AgentOrchestration() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [processingTasks, setProcessingTasks] = useState<ProcessingTask[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalProcessed: 0,
    averageLatency: '45ms',
    systemLoad: 68,
    accuracy: 97.8
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      simulateRealTimeProcessing();
      updateSystemMetrics();
    }, 2000);
    
    drawNetworkDiagram();
    generateInitialTasks();
    
    return () => clearInterval(timer);
  }, []);

  // Advanced Multi-Agent System Architecture
  const mcpAgents: Agent[] = [
    {
      id: 'agent-a',
      name: 'Leiden Community Detection Agent',
      type: 'Graph Analysis',
      status: 'active',
      model: 'Custom Leiden Algorithm v3.2.1',
      accuracy: 98.7,
      throughput: Math.floor(massiveMockDatabase.claims.length / 7), // Daily claims
      latency: '12ms',
      memory: '2.3GB',
      gpu: 'NVIDIA A100-80GB',
      endpoints: ['community-detection', 'graph-clustering', 'pattern-analysis'],
      capabilities: [
        'Graph-based community detection using modularity optimization',
        'Claim clustering and similarity analysis with 98.7% accuracy',
        'Network topology optimization for efficient processing',
        'Real-time cluster updates with sub-second latency',
        'Pattern recognition across 2.4M+ veteran claim dataset',
        'Automated anomaly detection in claim patterns'
      ],
      configuration: {
        resolution: 1.0,
        randomSeed: 42,
        maxIterations: 1000,
        tolerance: 1e-6,
        clusterThreshold: 0.85,
        communityDetectionAlgorithm: 'Leiden',
        optimizationFunction: 'CPM'
      },
      trainingData: {
        samples: '2.4M veteran claims',
        lastTrained: '2025-08-10',
        accuracy: 98.7,
        f1Score: 0.984
      },
      currentTask: 'Analyzing claim similarity patterns',
      queueSize: 23,
      lastActivity: '2s ago'
    },
    {
      id: 'agent-b',
      name: 'XGBoost Prediction Engine',
      type: 'ML Prediction',
      status: 'active',
      model: 'XGBoost Pro v4.2 (VA Fine-tuned)',
      accuracy: 97.2,
      throughput: Math.floor(massiveMockDatabase.claims.length / 7),
      latency: '8ms',
      memory: '1.8GB',
      gpu: 'NVIDIA A100-80GB',
      endpoints: ['predict-outcome', 'exam-necessity', 'rating-estimate', 'confidence-score'],
      capabilities: [
        'Disability rating prediction with 97.2% accuracy',
        'C&P exam necessity determination using evidence analysis',
        'Monthly compensation estimation with confidence intervals',
        'Evidence sufficiency scoring for rating decisions',
        'Multi-condition outcome prediction with combined ratings',
        'Automated decision confidence scoring'
      ],
      configuration: {
        nEstimators: 1500,
        maxDepth: 12,
        learningRate: 0.08,
        subsample: 0.85,
        colsampleBytree: 0.8,
        regAlpha: 0.1,
        regLambda: 1.0,
        scalePosWeight: 1.2
      },
      trainingData: {
        samples: '5.2M historical claims',
        lastTrained: '2025-08-11',
        accuracy: 97.2,
        f1Score: 0.971
      },
      currentTask: 'Predicting exam necessity for PTSD claims',
      queueSize: 156,
      lastActivity: '1s ago'
    },
    {
      id: 'agent-c',
      name: 'NLP Medical Record Processor',
      type: 'Natural Language Processing',
      status: 'active',
      model: 'GPT-4o Fine-tuned for VA Medical Records',
      accuracy: 99.1,
      throughput: Math.floor(massiveMockDatabase.documents.length / 7),
      latency: '150ms',
      memory: '4.2GB',
      gpu: 'NVIDIA A100-80GB',
      endpoints: ['extract-medical-data', 'pii-anonymization', 'nexus-analysis', 'condition-identification'],
      capabilities: [
        'Medical record analysis with HIPAA-compliant PII protection',
        'Automated condition extraction from clinical documents',
        'Service connection nexus analysis using medical evidence',
        'Real-time document processing with 99.1% accuracy',
        'Multi-language medical record interpretation',
        'Automated medical terminology standardization'
      ],
      configuration: {
        modelVersion: 'gpt-4o-2025-05-13',
        temperature: 0.1,
        maxTokens: 4096,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        contextWindow: 128000
      },
      trainingData: {
        samples: '890K medical documents',
        lastTrained: '2025-08-09',
        accuracy: 99.1,
        f1Score: 0.993
      },
      currentTask: 'Processing service treatment records',
      queueSize: 89,
      lastActivity: '3s ago'
    },
    {
      id: 'agent-d',
      name: 'Continuous Learning & Optimization Agent',
      type: 'Meta-Learning',
      status: 'active',
      model: 'Custom Adaptive Learning Engine v2.0',
      accuracy: 96.4,
      throughput: 18,
      latency: '2.1s',
      memory: '3.1GB',
      gpu: 'NVIDIA A100-80GB',
      endpoints: ['model-optimization', 'performance-analysis', 'feedback-integration', 'anomaly-detection'],
      capabilities: [
        'Real-time model performance monitoring and optimization',
        'Automated A/B testing for agent configuration parameters',
        'Feedback loop integration from rating specialists',
        'Continuous model retraining based on new data patterns',
        'System-wide performance analytics and recommendations',
        'Predictive maintenance for agent infrastructure'
      ],
      configuration: {
        learningRate: 0.001,
        batchSize: 32,
        optimizationAlgorithm: 'Adam',
        metricThreshold: 0.95,
        retrainingSchedule: 'daily',
        performanceWindow: '7d'
      },
      trainingData: {
        samples: '127 model improvements',
        lastTrained: '2025-08-12',
        accuracy: 96.4,
        f1Score: 0.962
      },
      currentTask: 'Optimizing XGBoost hyperparameters',
      queueSize: 4,
      lastActivity: '15s ago'
    },
    {
      id: 'agent-e',
      name: 'RUMEV1 Orchestration Controller',
      type: 'System Orchestration',
      status: 'active',
      model: 'Custom Workflow Engine v1.8.3',
      accuracy: 99.5,
      throughput: Math.floor(massiveMockDatabase.claims.length * 1.2 / 7),
      latency: '5ms',
      memory: '1.2GB',
      gpu: 'CPU-optimized',
      endpoints: ['task-routing', 'load-balancing', 'workflow-management', 'priority-assignment'],
      capabilities: [
        'Intelligent task routing across agent network',
        'Dynamic load balancing based on agent capacity',
        'Priority-based claim processing optimization',
        'Real-time workflow orchestration and monitoring',
        'Automated failover and recovery management',
        'SLA monitoring and performance guarantees'
      ],
      configuration: {
        routingAlgorithm: 'weighted-round-robin',
        loadThreshold: 0.8,
        priorityWeights: { high: 3, standard: 2, low: 1 },
        timeoutMs: 30000,
        retryAttempts: 3,
        circuitBreakerThreshold: 0.95
      },
      trainingData: {
        samples: 'System performance data',
        lastTrained: '2025-08-12',
        accuracy: 99.5,
        f1Score: 0.998
      },
      currentTask: 'Optimizing claim processing pipeline',
      queueSize: 0,
      lastActivity: 'continuous'
    }
  ];

  const simulateRealTimeProcessing = () => {
    const newTasks = Math.floor(Math.random() * 3);
    if (newTasks > 0) {
      const tasks: ProcessingTask[] = [];
      for (let i = 0; i < newTasks; i++) {
        const veteran = massiveMockDatabase.veterans[Math.floor(Math.random() * massiveMockDatabase.veterans.length)];
        const claim = massiveMockDatabase.claims[Math.floor(Math.random() * massiveMockDatabase.claims.length)];
        const agent = mcpAgents[Math.floor(Math.random() * mcpAgents.length)];
        
        tasks.push({
          id: `task-${Date.now()}-${i}`,
          type: ['Evidence Analysis', 'Rating Prediction', 'Document Processing', 'Nexus Analysis'][Math.floor(Math.random() * 4)],
          veteranId: veteran.id,
          claimId: claim.id,
          status: 'processing',
          assignedAgent: agent.id,
          startTime: new Date(),
          estimatedCompletion: new Date(Date.now() + Math.random() * 300000),
          progress: Math.floor(Math.random() * 100)
        });
      }
      
      setProcessingTasks(prev => [
        ...tasks,
        ...prev.slice(0, 20) // Keep only latest 20 tasks
      ]);
    }

    // Update existing tasks
    setProcessingTasks(prev => prev.map(task => ({
      ...task,
      progress: Math.min(100, task.progress + Math.floor(Math.random() * 15)),
      status: task.progress >= 100 ? 'completed' : task.status
    })));
  };

  const updateSystemMetrics = () => {
    setSystemMetrics(prev => ({
      totalProcessed: prev.totalProcessed + Math.floor(Math.random() * 5),
      averageLatency: `${40 + Math.floor(Math.random() * 20)}ms`,
      systemLoad: 60 + Math.floor(Math.random() * 30),
      accuracy: 97 + Math.random() * 2
    }));
  };

  const generateInitialTasks = () => {
    const tasks: ProcessingTask[] = [];
    for (let i = 0; i < 15; i++) {
      const veteran = massiveMockDatabase.veterans[Math.floor(Math.random() * massiveMockDatabase.veterans.length)];
      const claim = massiveMockDatabase.claims[Math.floor(Math.random() * massiveMockDatabase.claims.length)];
      const agent = mcpAgents[Math.floor(Math.random() * mcpAgents.length)];
      
      tasks.push({
        id: `initial-task-${i}`,
        type: ['Evidence Analysis', 'Rating Prediction', 'Document Processing', 'Nexus Analysis'][Math.floor(Math.random() * 4)],
        veteranId: veteran.id,
        claimId: claim.id,
        status: (['queued', 'processing', 'completed', 'failed'] as const)[Math.floor(Math.random() * 4)],
        assignedAgent: agent.id,
        startTime: new Date(Date.now() - Math.random() * 3600000),
        estimatedCompletion: new Date(Date.now() + Math.random() * 300000),
        progress: Math.floor(Math.random() * 100)
      });
    }
    setProcessingTasks(tasks);
  };

  const drawNetworkDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw network connections
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    // Draw central orchestration node
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw agent nodes and connections
    mcpAgents.forEach((agent, index) => {
      const angle = (2 * Math.PI * index) / mcpAgents.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Draw agent node
      const color = agent.status === 'active' ? '#10b981' : 
                   agent.status === 'error' ? '#ef4444' : '#f59e0b';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw pulsing effect for active agents
      if (agent.status === 'active') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.sin(Date.now() / 200) * 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(drawNetworkDiagram, 100);
    return () => clearInterval(interval);
  }, [mcpAgents]);

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'idle': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'error': 'bg-red-500/10 text-red-400 border-red-500/30',
      'maintenance': 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    };
    return colors[status] || colors['idle'];
  };

  return (
    <AppLayout>
      <WelcomeModal
        pageName="orchestration"
        title="Multi-Agent Orchestration"
        description="Monitor and manage the RUMEV1 AI system with real-time agent performance, workflow visualization, and intelligent task routing."
        features={[
          "Real-time agent monitoring and performance metrics",
          "Interactive network visualization and system health",
          "Intelligent task routing and load balancing"
        ]}
        demoActions={[
          { label: 'View Agent Details', action: () => setSelectedAgent(mcpAgents[0]) },
          { label: 'Show Processing Queue', action: () => setActiveTab('processing') },
          { label: 'Open Network Diagram', action: () => setActiveTab('network') }
        ]}
      />

      <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">RUMEV1 Agent Orchestration</h1>
            <p className="text-slate-400">Multi-Agent System Management & Monitoring</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-200">System Status: Operational</p>
              <p className="text-xs text-slate-500">{currentTime.toLocaleTimeString()}</p>
            </div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        {/* System Overview */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Claims Processed</h3>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {systemMetrics.totalProcessed.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">+{Math.floor(Math.random() * 20)} in last hour</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Average Latency</h3>
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">{systemMetrics.averageLatency}</div>
              <div className="text-xs text-slate-500">-12% from last week</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">System Load</h3>
                <span className="text-2xl">🔥</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">{systemMetrics.systemLoad}%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemMetrics.systemLoad}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Overall Accuracy</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {systemMetrics.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">↑0.3% this month</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg mb-8">
            <div className="border-b border-slate-800">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'overview', label: 'Agent Overview', icon: '🤖' },
                  { key: 'network', label: 'Network Diagram', icon: '🔗' },
                  { key: 'processing', label: 'Live Processing', icon: '⚙️' },
                  { key: 'performance', label: 'Performance', icon: '📈' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-100">Active Agents ({mcpAgents.filter(a => a.status === 'active').length})</h3>
                  
                  <div className="grid gap-6">
                    {mcpAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-100 mb-1">{agent.name}</h4>
                            <p className="text-sm text-slate-400 mb-2">{agent.type} • {agent.model}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
                              {agent.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-400 mb-1">{agent.accuracy}%</div>
                            <div className="text-xs text-slate-500">Accuracy</div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-slate-400">Throughput</div>
                            <div className="text-lg font-semibold text-slate-200">{agent.throughput}/day</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Latency</div>
                            <div className="text-lg font-semibold text-blue-400">{agent.latency}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Queue</div>
                            <div className="text-lg font-semibold text-yellow-400">{agent.queueSize || 0}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Last Activity</div>
                            <div className="text-sm text-slate-300">{agent.lastActivity}</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm text-slate-400 mb-2">Current Task</div>
                          <div className="text-sm text-slate-300">{agent.currentTask}</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities.slice(0, 3).map((capability, i) => (
                            <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                              {capability}
                            </span>
                          ))}
                          {agent.capabilities.length > 3 && (
                            <span className="text-xs text-slate-500">+{agent.capabilities.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-100">Agent Network Topology</h3>
                  
                  <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={400}
                      className="w-full h-auto max-w-full"
                    />
                    
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Active Agents</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Orchestration Controller</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-slate-600 rounded-full"></div>
                        <span className="text-sm text-slate-300">Data Flow</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'processing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-100">Live Processing Queue</h3>
                    <div className="text-sm text-slate-400">
                      {processingTasks.filter(t => t.status === 'processing').length} active tasks
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {processingTasks.slice(0, 10).map((task) => (
                      <div key={task.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-slate-200">{task.type}</h4>
                            <p className="text-sm text-slate-400">
                              Claim {task.claimId} • Assigned to {mcpAgents.find(a => a.id === task.assignedAgent)?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              task.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                              task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {task.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Progress: {task.progress}%</span>
                          <span>Started: {task.startTime.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-100">Performance Analytics</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {mcpAgents.map((agent) => (
                      <div key={agent.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h4 className="font-semibold text-slate-100 mb-4">{agent.name}</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-400">Accuracy</span>
                              <span className="text-slate-200">{agent.accuracy}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${agent.accuracy}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-400">Throughput</span>
                              <span className="text-slate-200">{agent.throughput}/day</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (agent.throughput / 5000) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-slate-400">Memory</div>
                              <div className="text-slate-200">{agent.memory}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Latency</div>
                              <div className="text-slate-200">{agent.latency}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-100">{selectedAgent.name}</h2>
                  <p className="text-slate-400">{selectedAgent.type} • {selectedAgent.model}</p>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance Metrics</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-400">{selectedAgent.accuracy}%</div>
                    <div className="text-sm text-slate-400">Accuracy Rate</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{selectedAgent.throughput}</div>
                    <div className="text-sm text-slate-400">Daily Throughput</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{selectedAgent.latency}</div>
                    <div className="text-sm text-slate-400">Average Latency</div>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Capabilities</h3>
                <div className="grid gap-3">
                  {selectedAgent.capabilities.map((capability, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                      <p className="text-sm text-slate-300">{capability}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Configuration Parameters</h3>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(selectedAgent.configuration).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-400 text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-slate-200 text-sm font-mono">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Training Data */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Training Information</h3>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-400 text-sm">Training Dataset</div>
                      <div className="text-slate-200">{selectedAgent.trainingData.samples}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Last Training</div>
                      <div className="text-slate-200">{selectedAgent.trainingData.lastTrained}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">F1 Score</div>
                      <div className="text-slate-200">{selectedAgent.trainingData.f1Score}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">GPU</div>
                      <div className="text-slate-200">{selectedAgent.gpu}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}