'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgentOrchestration() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sophisticated MCP Agent Architecture
  const mcpAgents = [
    {
      id: 'agent-a',
      name: 'Leiden Community Detection Agent',
      type: 'Graph Analysis',
      status: 'active',
      model: 'Custom Leiden Algorithm v2.1.3',
      accuracy: 98.7,
      throughput: 2847,
      latency: '12ms',
      memory: '2.3GB',
      gpu: 'NVIDIA A100-80GB',
      endpoints: ['community-detection', 'graph-clustering', 'pattern-analysis'],
      capabilities: [
        'Graph-based community detection',
        'Claim clustering and similarity analysis', 
        'Network topology optimization',
        'Real-time cluster updates'
      ],
      configuration: {
        resolution: 1.0,
        randomSeed: 42,
        maxIterations: 100,
        tolerance: 1e-6,
        clusterThreshold: 0.85
      },
      trainingData: {
        samples: '2.4M veteran claims',
        lastTrained: '2025-08-10',
        accuracy: 98.7,
        f1Score: 0.984
      }
    },
    {
      id: 'agent-b',
      name: 'XGBoost Prediction Engine',
      type: 'ML Prediction',
      status: 'active',
      model: 'XGBoost Pro v4.2 (Fine-tuned)',
      accuracy: 97.2,
      throughput: 2847,
      latency: '8ms',
      memory: '1.8GB',
      gpu: 'NVIDIA A100-80GB',
      endpoints: ['predict-outcome', 'exam-necessity', 'rating-estimate'],
      capabilities: [
        'Outcome prediction with 97% accuracy',
        'C&P exam necessity determination',
        'Disability rating estimation',
        'Evidence sufficiency analysis'
      ],
      configuration: {
        nEstimators: 1000,
        maxDepth: 8,
        learningRate: 0.1,
        subsample: 0.8,
        colsampleBytree: 0.8
      },
      trainingData: {
        samples: '5.2M historical claims',
        lastTrained: '2025-08-11',
        accuracy: 97.2,
        f1Score: 0.971
      }
    },
    {
      id: 'agent-c',
      name: 'NLP Medical Record Processor',
      type: 'Natural Language Processing',
      status: 'active',
      model: 'GPT-4o Fine-tuned for VA Medical Records',
      accuracy: 99.1,
      throughput: 4291,
      latency: '150ms',
      memory: '12GB',
      gpu: 'NVIDIA H100-80GB',
      endpoints: ['extract-medical-info', 'anonymize-records', 'condition-extraction'],
      capabilities: [
        'Medical record parsing and extraction',
        'HIPAA-compliant anonymization',
        'Condition and symptom identification',
        'Medical terminology standardization'
      ],
      configuration: {
        temperature: 0.1,
        maxTokens: 4096,
        topP: 0.95,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      trainingData: {
        samples: '1.8M medical records',
        lastTrained: '2025-08-12',
        accuracy: 99.1,
        f1Score: 0.992
      }
    },
    {
      id: 'agent-d',
      name: 'Continuous Learning Orchestrator',
      type: 'Meta-Learning',
      status: 'learning',
      model: 'Claude 3.5 Sonnet Fine-tuned for VA Operations',
      accuracy: 96.4,
      throughput: 127,
      latency: '200ms',
      memory: '8GB',
      gpu: 'NVIDIA A100-40GB',
      endpoints: ['pattern-learning', 'model-optimization', 'feedback-integration'],
      capabilities: [
        'Real-time pattern learning',
        'Cross-agent optimization',
        'Feedback loop integration',
        'Model performance monitoring'
      ],
      configuration: {
        temperature: 0.3,
        maxTokens: 8192,
        topP: 0.9,
        learningRate: 0.001,
        batchSize: 32
      },
      trainingData: {
        samples: '847K feedback loops',
        lastTrained: '2025-08-12',
        accuracy: 96.4,
        f1Score: 0.958
      }
    }
  ];

  // Available AI Models for Fine-tuning
  const availableModels = [
    {
      name: 'GPT-4o',
      provider: 'OpenAI',
      version: '2024-08-06',
      capabilities: ['NLP', 'Medical Text Analysis', 'Document Processing'],
      maxTokens: 128000,
      costPerToken: 0.0025,
      finetuningAvailable: true,
      status: 'available'
    },
    {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      version: '2024-10-22',
      capabilities: ['Reasoning', 'Analysis', 'Complex Problem Solving'],
      maxTokens: 200000,
      costPerToken: 0.003,
      finetuningAvailable: true,
      status: 'available'
    },
    {
      name: 'Gemini Pro 1.5',
      provider: 'Google',
      version: '2024-07-01',
      capabilities: ['Multimodal', 'Long Context', 'Code Analysis'],
      maxTokens: 2000000,
      costPerToken: 0.00125,
      finetuningAvailable: true,
      status: 'available'
    },
    {
      name: 'Llama 3.1 405B',
      provider: 'Meta',
      version: '2024-07-23',
      capabilities: ['Open Source', 'High Performance', 'Customizable'],
      maxTokens: 128000,
      costPerToken: 0.0008,
      finetuningAvailable: true,
      status: 'available'
    }
  ];

  // MCP Workflow Stages
  const workflowStages = [
    {
      id: 'intake',
      name: 'Claim Intake & Preprocessing',
      agents: ['agent-c'],
      description: 'Initial claim ingestion, document parsing, and data extraction',
      avgTime: '45 seconds',
      successRate: 99.2
    },
    {
      id: 'analysis',
      name: 'Community Detection & Clustering',
      agents: ['agent-a'],
      description: 'Graph-based analysis to identify similar claims and patterns',
      avgTime: '12 seconds',
      successRate: 98.7
    },
    {
      id: 'prediction',
      name: 'Outcome Prediction & Exam Determination',
      agents: ['agent-b'],
      description: 'ML-based prediction of claim outcomes and C&P exam necessity',
      avgTime: '8 seconds',
      successRate: 97.2
    },
    {
      id: 'learning',
      name: 'Continuous Learning & Optimization',
      agents: ['agent-d'],
      description: 'Real-time learning from outcomes and system optimization',
      avgTime: '200 milliseconds',
      successRate: 96.4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 neural-grid opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Professional Header */}
      <header className="relative z-50 glass-strong border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* VA Logo & System Name */}
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg mirror-effect">
                <div className="text-white font-bold text-xl">VA</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-display">
                  Agent Orchestration
                </h1>
                <p className="text-sm text-slate-400 font-medium">MCP Agentic System Management</p>
              </div>
            </Link>

            {/* System Status & Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">MCP Online</span>
                </div>
                <div className="text-slate-400 font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                {[
                  { name: 'Dashboard', icon: '📊' },
                  { name: 'Analytics', icon: '📈' },
                  { name: 'Claims', icon: '📋' },
                  { name: 'eFolder', icon: '📁' },
                  { name: 'Orchestration', icon: '🤖', active: true }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={`/${item.name.toLowerCase()}`}
                    className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg ${
                      item.active 
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="glass-strong rounded-3xl p-6 border border-slate-700/50 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 font-display">
                  RUMEV1 MCP Agent Orchestration
                </h2>
                <p className="text-slate-400 text-lg">
                  Sophisticated multi-agent system with model context protocol integration and fine-tuning capabilities
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="skinzai-button px-6 py-3"
                  onClick={() => setIsConfiguring(!isConfiguring)}
                >
                  {isConfiguring ? 'Exit Config' : 'Configure Agents'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <div className="flex space-x-1 bg-slate-800/50 rounded-2xl p-2">
            {[
              { id: 'overview', name: 'System Overview', icon: '🎯' },
              { id: 'agents', name: 'Agent Management', icon: '🤖' },
              { id: 'workflow', name: 'Workflow Designer', icon: '⚡' },
              { id: 'models', name: 'Model Fine-tuning', icon: '🧠' },
              { id: 'monitoring', name: 'Real-time Monitoring', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            {/* System Architecture Overview */}
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center">
                <span className="mr-3">🏗️</span>
                MCP System Architecture
              </h3>
              
              <div className="grid lg:grid-cols-4 gap-6">
                {mcpAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl">{index === 0 ? '🔬' : index === 1 ? '🎯' : index === 2 ? '📝' : '🧠'}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {agent.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-white mb-2">{agent.name}</h4>
                    <p className="text-slate-400 text-sm mb-3">{agent.type}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Accuracy</span>
                        <span className="text-blue-400 font-semibold">{agent.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${agent.accuracy}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-slate-400">Throughput</span>
                        <span className="text-white font-semibold">{agent.throughput.toLocaleString()}/day</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Pipeline */}
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center">
                <span className="mr-3">⚡</span>
                Processing Pipeline
              </h3>
              
              <div className="grid lg:grid-cols-4 gap-4">
                {workflowStages.map((stage, index) => (
                  <div key={stage.id} className="relative">
                    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                      <div className="text-center mb-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-white text-sm">{stage.name}</h4>
                      </div>
                      
                      <p className="text-slate-400 text-xs mb-3 text-center">{stage.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Time</span>
                          <span className="text-emerald-400 font-semibold">{stage.avgTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Success Rate</span>
                          <span className="text-blue-400 font-semibold">{stage.successRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {index < workflowStages.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-slate-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Agent Management Tab */}
        {activeTab === 'agents' && (
          <section className="max-w-7xl mx-auto px-6">
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center">
                <span className="mr-3">🤖</span>
                Agent Configuration & Management
              </h3>
              
              <div className="space-y-6">
                {mcpAgents.map((agent) => (
                  <div key={agent.id} className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Agent Info */}
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{agent.name}</h4>
                        <p className="text-slate-400 text-sm mb-3">{agent.model}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className={agent.status === 'active' ? 'text-emerald-400' : 'text-yellow-400'}>
                              {agent.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Latency</span>
                            <span className="text-white font-mono">{agent.latency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Memory</span>
                            <span className="text-white font-mono">{agent.memory}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">GPU</span>
                            <span className="text-white font-mono text-xs">{agent.gpu}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Configuration */}
                      <div>
                        <h5 className="font-semibold text-white mb-3">Configuration</h5>
                        <div className="space-y-2 text-xs">
                          {Object.entries(agent.configuration).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="text-white font-mono">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div>
                        <h5 className="font-semibold text-white mb-3">Actions</h5>
                        <div className="space-y-2">
                          <button className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-all">
                            Configure Model
                          </button>
                          <button className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
                            Fine-tune Parameters
                          </button>
                          <button className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm hover:bg-emerald-500/30 transition-all">
                            View Performance
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Model Fine-tuning Tab */}
        {activeTab === 'models' && (
          <section className="max-w-7xl mx-auto px-6">
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center">
                <span className="mr-3">🧠</span>
                Advanced Model Fine-tuning & Selection
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Available Models */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Available Foundation Models</h4>
                  <div className="space-y-4">
                    {availableModels.map((model) => (
                      <div key={model.name} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-bold text-white">{model.name}</h5>
                            <p className="text-slate-400 text-sm">{model.provider} • {model.version}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            model.status === 'available' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {model.status}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs mb-4">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Max Tokens</span>
                            <span className="text-white font-mono">{model.maxTokens.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Cost/Token</span>
                            <span className="text-white font-mono">${model.costPerToken}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Fine-tuning</span>
                            <span className={model.finetuningAvailable ? 'text-emerald-400' : 'text-red-400'}>
                              {model.finetuningAvailable ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-slate-400 text-xs mb-2">Capabilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {model.capabilities.map((cap) => (
                              <span key={cap} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {model.finetuningAvailable && (
                          <button className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
                            Start Fine-tuning
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Fine-tuning Console */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Fine-tuning Console</h4>
                  <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Select Agent</label>
                      <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                        <option>Agent A - Leiden Detection</option>
                        <option>Agent B - XGBoost Engine</option>
                        <option>Agent C - NLP Processor</option>
                        <option>Agent D - Learning System</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Foundation Model</label>
                      <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                        <option>GPT-4o (OpenAI)</option>
                        <option>Claude 3.5 Sonnet (Anthropic)</option>
                        <option>Gemini Pro 1.5 (Google)</option>
                        <option>Llama 3.1 405B (Meta)</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Training Dataset</label>
                      <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                        <option>VA Medical Records (1.8M samples)</option>
                        <option>Historical Claims (5.2M samples)</option>
                        <option>Feedback Loops (847K samples)</option>
                        <option>Custom Dataset</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Learning Rate</label>
                        <input type="number" step="0.0001" defaultValue="0.0001" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Batch Size</label>
                        <input type="number" defaultValue="32" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono" />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Training Epochs</label>
                      <input type="number" defaultValue="5" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono" />
                    </div>
                    
                    <button className="w-full skinzai-button py-3">
                      Start Fine-tuning Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        <div className="group relative">
          <button className="bg-gradient-to-r from-purple-600 to-pink-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            System Settings
          </div>
        </div>
      </div>
    </div>
  );
}