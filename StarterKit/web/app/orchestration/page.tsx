'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgentOrchestration() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [showQBit, setShowQBit] = useState(false);
  const [userRole, setUserRole] = useState('VSR');
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [workflowConnections, setWorkflowConnections] = useState([]);

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

  // Comprehensive AI Model Library - Best Closed Source & Open Source Models
  const availableModels = [
    // OpenAI Models
    {
      name: 'GPT-4o',
      provider: 'OpenAI',
      version: '2024-08-06',
      capabilities: ['NLP', 'Medical Text Analysis', 'Document Processing', 'Code Generation'],
      maxTokens: 128000,
      costPerToken: 0.0025,
      finetuningAvailable: true,
      status: 'available',
      category: 'Closed Source',
      performance: 95,
      specialty: 'General Purpose'
    },
    {
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      version: '2024-04-09',
      capabilities: ['Advanced Reasoning', 'Multimodal', 'Function Calling'],
      maxTokens: 128000,
      costPerToken: 0.01,
      finetuningAvailable: true,
      status: 'available',
      category: 'Closed Source',
      performance: 93,
      specialty: 'Complex Tasks'
    },
    {
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      version: '2024-01-25',
      capabilities: ['Fast Processing', 'Chat Optimization', 'Cost Effective'],
      maxTokens: 16385,
      costPerToken: 0.0005,
      finetuningAvailable: true,
      status: 'available',
      category: 'Closed Source',
      performance: 85,
      specialty: 'Speed & Cost'
    },
    // Anthropic Models
    {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      version: '2024-10-22',
      capabilities: ['Advanced Reasoning', 'Analysis', 'Complex Problem Solving', 'Code Generation'],
      maxTokens: 200000,
      costPerToken: 0.003,
      finetuningAvailable: true,
      status: 'available',
      category: 'Closed Source',
      performance: 97,
      specialty: 'Reasoning & Analysis'
    },
    {
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      version: '2024-02-29',
      capabilities: ['Top-tier Performance', 'Complex Tasks', 'Creative Writing'],
      maxTokens: 200000,
      costPerToken: 0.015,
      finetuningAvailable: false,
      status: 'available',
      category: 'Closed Source',
      performance: 98,
      specialty: 'Premium Performance'
    },
    // Google Models
    {
      name: 'Gemini Pro 1.5',
      provider: 'Google',
      version: '2024-07-01',
      capabilities: ['Multimodal', 'Long Context', 'Code Analysis', '2M Token Window'],
      maxTokens: 2000000,
      costPerToken: 0.00125,
      finetuningAvailable: true,
      status: 'available',
      category: 'Closed Source',
      performance: 92,
      specialty: 'Long Context'
    },
    {
      name: 'Gemini Ultra',
      provider: 'Google',
      version: '2024-01-15',
      capabilities: ['Multimodal Excellence', 'Advanced Math', 'Scientific Reasoning'],
      maxTokens: 32000,
      costPerToken: 0.02,
      finetuningAvailable: false,
      status: 'available',
      category: 'Closed Source',
      performance: 96,
      specialty: 'Multimodal'
    },
    // Meta Open Source Models
    {
      name: 'Llama 3.1 405B',
      provider: 'Meta',
      version: '2024-07-23',
      capabilities: ['Open Source', 'High Performance', 'Customizable', 'Self-Hosted'],
      maxTokens: 128000,
      costPerToken: 0.0008,
      finetuningAvailable: true,
      status: 'available',
      category: 'Open Source',
      performance: 94,
      specialty: 'Open Source Leader'
    },
    {
      name: 'Llama 3.1 70B',
      provider: 'Meta',
      version: '2024-07-23',
      capabilities: ['Balanced Performance', 'Cost Effective', 'Multilingual'],
      maxTokens: 128000,
      costPerToken: 0.0004,
      finetuningAvailable: true,
      status: 'available',
      category: 'Open Source',
      performance: 88,
      specialty: 'Balanced Open Source'
    },
    {
      name: 'Code Llama 34B',
      provider: 'Meta',
      version: '2024-01-29',
      capabilities: ['Code Generation', 'Code Completion', 'Programming Languages'],
      maxTokens: 16000,
      costPerToken: 0.0003,
      finetuningAvailable: true,
      status: 'available',
      category: 'Open Source',
      performance: 89,
      specialty: 'Code Generation'
    },
    // Mistral Models
    {
      name: 'Mistral Large',
      provider: 'Mistral AI',
      version: '2024-02-26',
      capabilities: ['Multilingual', 'Code Generation', 'European Privacy'],
      maxTokens: 32000,
      costPerToken: 0.008,
      finetuningAvailable: true,
      status: 'available',
      category: 'Closed Source',
      performance: 87,
      specialty: 'European Alternative'
    },
    {
      name: 'Mixtral 8x7B',
      provider: 'Mistral AI',
      version: '2023-12-11',
      capabilities: ['Mixture of Experts', 'Open Source', 'Efficient'],
      maxTokens: 32000,
      costPerToken: 0.0002,
      finetuningAvailable: true,
      status: 'available',
      category: 'Open Source',
      performance: 83,
      specialty: 'MoE Architecture'
    },
    // Specialized Models
    {
      name: 'Perplexity Sonar Large',
      provider: 'Perplexity',
      version: '2024-01-04',
      capabilities: ['Real-time Search', 'Current Information', 'Web Integration'],
      maxTokens: 127072,
      costPerToken: 0.001,
      finetuningAvailable: false,
      status: 'available',
      category: 'Specialized',
      performance: 86,
      specialty: 'Real-time Search'
    }
  ];

  // VBA Role Definitions
  const vbaRoles = [
    {
      id: 'VSR',
      name: 'Veterans Service Representative',
      description: 'Initial claim intake, document collection, and basic processing',
      permissions: ['claim_intake', 'document_review', 'basic_rating'],
      workflows: ['intake', 'evidence_gathering'],
      color: 'blue'
    },
    {
      id: 'RVSR',
      name: 'Rating Veterans Service Representative',
      description: 'Advanced claim analysis, rating decisions, and complex cases',
      permissions: ['advanced_rating', 'decision_authority', 'complex_cases'],
      workflows: ['rating_analysis', 'decision_making'],
      color: 'emerald'
    },
    {
      id: 'RATER',
      name: 'Rating Specialist',
      description: 'Expert-level rating decisions and specialized conditions',
      permissions: ['expert_rating', 'specialized_conditions', 'appeals'],
      workflows: ['expert_analysis', 'appeals_processing'],
      color: 'purple'
    },
    {
      id: 'DRO',
      name: 'Decision Review Officer',
      description: 'Appeals processing and higher-level reviews',
      permissions: ['appeals_authority', 'hlr_processing', 'remands'],
      workflows: ['appeals_review', 'remand_processing'],
      color: 'amber'
    },
    {
      id: 'COACH',
      name: 'Quality Review Coach',
      description: 'Quality assurance, training, and performance monitoring',
      permissions: ['quality_review', 'training', 'performance_metrics'],
      workflows: ['quality_assurance', 'training_delivery'],
      color: 'rose'
    }
  ];

  // MCP Agent Plugin Types
  const agentPluginTypes = [
    {
      id: 'medical_analyzer',
      name: 'Medical Records Analyzer',
      icon: '🏥',
      description: 'HIPAA-compliant medical document analysis and extraction',
      capabilities: ['OCR', 'Medical NLP', 'Condition Identification', 'Symptom Mapping'],
      inputTypes: ['PDF', 'Images', 'Text'],
      outputTypes: ['Structured Data', 'Medical Summary', 'Condition List']
    },
    {
      id: 'evidence_collector',
      name: 'Evidence Collection Agent',
      icon: '📋',
      description: 'Automated evidence gathering from multiple sources',
      capabilities: ['DoD Records', 'VA Records', 'Private Records', 'Nexus Analysis'],
      inputTypes: ['Claim Data', 'SSN', 'Service Dates'],
      outputTypes: ['Evidence Package', 'Gap Analysis', 'Recommendation']
    },
    {
      id: 'rating_calculator',
      name: 'Disability Rating Calculator',
      icon: '🧮',
      description: 'Automated rating calculations using VA schedules',
      capabilities: ['VASRD Application', 'Combined Ratings', 'Effective Dates', 'SMC'],
      inputTypes: ['Medical Evidence', 'Service Records', 'Nexus Opinions'],
      outputTypes: ['Rating Decision', 'Calculations', 'Justification']
    },
    {
      id: 'exam_scheduler',
      name: 'C&P Exam Scheduler',
      icon: '📅',
      description: 'Intelligent exam scheduling and necessity determination',
      capabilities: ['DBQ Analysis', 'Exam Routing', 'Contractor Management', 'ACE'],
      inputTypes: ['Claim Type', 'Evidence', 'Geographic Data'],
      outputTypes: ['Exam Orders', 'Scheduling', 'ACE Results']
    },
    {
      id: 'legal_advisor',
      name: 'Legal Research Assistant',
      icon: '⚖️',
      description: 'Case law research and regulatory compliance',
      capabilities: ['BVA Research', 'M21-1 Search', 'Precedent Analysis', 'Citations'],
      inputTypes: ['Legal Questions', 'Case Facts', 'Regulations'],
      outputTypes: ['Legal Analysis', 'Citations', 'Recommendations']
    },
    {
      id: 'notification_manager',
      name: 'Veteran Communication Manager',
      icon: '📧',
      description: 'Automated veteran communications and notifications',
      capabilities: ['Letter Generation', 'Status Updates', 'Appointment Reminders', 'Appeals Rights'],
      inputTypes: ['Claim Status', 'Veteran Info', 'Decision Data'],
      outputTypes: ['Letters', 'Notifications', 'Communications Log']
    },
    {
      id: 'quality_checker',
      name: 'Quality Assurance Agent',
      icon: '✅',
      description: 'Automated quality review and error detection',
      capabilities: ['Decision Review', 'Error Detection', 'Compliance Check', 'Metrics'],
      inputTypes: ['Decisions', 'Claims', 'Process Data'],
      outputTypes: ['Quality Score', 'Error Report', 'Recommendations']
    },
    {
      id: 'workflow_coordinator',
      name: 'Workflow Coordinator',
      icon: '🎯',
      description: 'Manages task routing and process orchestration',
      capabilities: ['Task Routing', 'Priority Management', 'SLA Monitoring', 'Escalation'],
      inputTypes: ['Process Rules', 'Workload Data', 'Priority Flags'],
      outputTypes: ['Task Assignments', 'Routing Decisions', 'Status Updates']
    }
  ];

  // Pre-built Workflow Templates
  const workflowTemplates = [
    {
      id: 'standard_claim',
      name: 'Standard Disability Claim Processing',
      description: 'End-to-end processing for standard disability compensation claims',
      roles: ['VSR', 'RVSR'],
      agents: ['evidence_collector', 'medical_analyzer', 'rating_calculator', 'notification_manager'],
      estimatedTime: '45 days',
      automationLevel: 85
    },
    {
      id: 'complex_ptsd',
      name: 'Complex PTSD Claim Processing',
      description: 'Specialized workflow for PTSD claims with multiple stressors',
      roles: ['RVSR', 'RATER'],
      agents: ['medical_analyzer', 'evidence_collector', 'legal_advisor', 'exam_scheduler'],
      estimatedTime: '125 days',
      automationLevel: 70
    },
    {
      id: 'ace_processing',
      name: 'ACE Exam Processing',
      description: 'Automated C&P Exam processing using ACE technology',
      roles: ['VSR', 'RVSR'],
      agents: ['medical_analyzer', 'rating_calculator', 'exam_scheduler', 'quality_checker'],
      estimatedTime: '15 days',
      automationLevel: 95
    },
    {
      id: 'appeals_review',
      name: 'Higher Level Review Processing',
      description: 'Systematic processing of HLR appeals with duty to assist',
      roles: ['DRO', 'RATER'],
      agents: ['legal_advisor', 'evidence_collector', 'medical_analyzer', 'workflow_coordinator'],
      estimatedTime: '90 days',
      automationLevel: 75
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

        {/* Enhanced Tab Navigation */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <div className="flex flex-wrap gap-2 bg-slate-800/50 rounded-2xl p-2 backdrop-blur-sm border border-slate-600/50">
            {[
              { id: 'overview', name: 'System Overview', icon: '🎯', desc: 'Agent status & metrics' },
              { id: 'workflow', name: 'Workflow Designer', icon: '⚡', desc: 'Visual workflow builder' },
              { id: 'agents', name: 'Agent Library', icon: '🤖', desc: 'MCP agent plugins' },
              { id: 'models', name: 'Model Hub', icon: '🧠', desc: '13 AI models available' },
              { id: 'qbit', name: 'QBit Assistant', icon: '💬', desc: 'Role-based AI chat' },
              { id: 'monitoring', name: 'Live Monitor', icon: '📊', desc: 'Real-time analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50 border border-transparent'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-70">{tab.desc}</div>
                </div>
                
                {/* Enhanced tooltip */}
                <div className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-slate-600/50 shadow-2xl z-50">
                  {tab.desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-600/50 rotate-45"></div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === 'workflow' && (
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            {/* Visual Workflow Designer */}
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-heading flex items-center">
                    <span className="mr-3">⚡</span>
                    Visual Workflow Designer
                  </h3>
                  <p className="text-slate-400">Drag and drop MCP agents to build custom workflows</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {vbaRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  <button className="skinzai-button px-4 py-2">Save Workflow</button>
                </div>
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
                {/* Agent Palette */}
                <div className="lg:col-span-1">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🧩</span>
                    MCP Agent Plugins
                  </h4>
                  <div className="space-y-3">
                    {agentPluginTypes.map((agent) => (
                      <div
                        key={agent.id}
                        draggable
                        onDragStart={() => setDraggedNode(agent)}
                        className="group bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 cursor-move transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{agent.icon}</span>
                          <div>
                            <div className="font-semibold text-white text-sm">{agent.name}</div>
                            <div className="text-xs text-slate-400">{agent.description.split(' ').slice(0, 4).join(' ')}...</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.slice(0, 2).map((cap, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Canvas */}
                <div className="lg:col-span-3">
                  <div className="bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-600/50 p-8 min-h-[600px] relative">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    
                    {workflowNodes.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎨</div>
                          <h3 className="text-xl font-semibold text-white mb-2">Design Your Workflow</h3>
                          <p className="text-slate-400 mb-6">Drag MCP agents from the left panel to build your custom workflow</p>
                          
                          {/* Quick Start Templates */}
                          <div className="grid grid-cols-2 gap-4 max-w-2xl">
                            {workflowTemplates.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => {
                                  // Load template workflow
                                  const templateNodes = template.agents.map((agentId, index) => {
                                    const agent = agentPluginTypes.find(a => a.id === agentId);
                                    return {
                                      id: `${agentId}-${Date.now()}-${index}`,
                                      type: agentId,
                                      agent: agent,
                                      x: 100 + (index * 200),
                                      y: 100,
                                      model: selectedModel
                                    };
                                  });
                                  setWorkflowNodes(templateNodes);
                                }}
                                className="group bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-blue-500/50 hover:bg-slate-700/70 transition-all text-left"
                              >
                                <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                  {template.name}
                                </h4>
                                <p className="text-xs text-slate-400 mb-2">{template.description}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-emerald-400">{template.automationLevel}% automated</span>
                                  <span className="text-blue-400">{template.estimatedTime}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Workflow Nodes */}
                        {workflowNodes.map((node, index) => (
                          <div
                            key={node.id}
                            className="absolute bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/50 shadow-2xl"
                            style={{ left: node.x, top: node.y }}
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="text-2xl">{node.agent.icon}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{node.agent.name}</div>
                                <div className="text-xs text-blue-400">{node.model}</div>
                              </div>
                              <button 
                                onClick={() => setWorkflowNodes(workflowNodes.filter(n => n.id !== node.id))}
                                className="text-red-400 hover:text-red-300 ml-auto"
                              >
                                ×
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-xs">
                                <span className="text-slate-400">Input:</span>
                                <div className="text-white font-mono">
                                  {node.agent.inputTypes.slice(0, 2).join(', ')}
                                </div>
                              </div>
                              <div className="text-xs">
                                <span className="text-slate-400">Output:</span>
                                <div className="text-emerald-400 font-mono">
                                  {node.agent.outputTypes.slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </div>

                            {/* Connection points */}
                            {index < workflowNodes.length - 1 && (
                              <div className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                            )}
                            {index > 0 && (
                              <div className="absolute left-0 top-1/2 w-3 h-3 bg-emerald-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                        ))}

                        {/* Connection Lines */}
                        {workflowNodes.map((node, index) => {
                          if (index === workflowNodes.length - 1) return null;
                          const nextNode = workflowNodes[index + 1];
                          return (
                            <svg
                              key={`connection-${index}`}
                              className="absolute top-0 left-0 pointer-events-none"
                              style={{ width: '100%', height: '100%' }}
                            >
                              <defs>
                                <marker
                                  id="arrowhead"
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="10"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    fill="#3b82f6"
                                  />
                                </marker>
                              </defs>
                              <line
                                x1={node.x + 200}
                                y1={node.y + 50}
                                x2={nextNode.x}
                                y2={nextNode.y + 50}
                                stroke="#3b82f6"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                                className="animate-pulse"
                              />
                            </svg>
                          );
                        })}
                      </div>
                    )}

                    {/* Drop zone overlay */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-blue-500/5 rounded-2xl"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedNode) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const newNode = {
                            id: `${draggedNode.id}-${Date.now()}`,
                            type: draggedNode.id,
                            agent: draggedNode,
                            x: e.clientX - rect.left - 100,
                            y: e.clientY - rect.top - 50,
                            model: selectedModel
                          };
                          setWorkflowNodes([...workflowNodes, newNode]);
                          setDraggedNode(null);
                        }
                      }}
                    >
                      {draggedNode && (
                        <div className="text-blue-400 font-semibold animate-bounce">
                          Drop {draggedNode.name} here
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Workflow Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setWorkflowNodes([])}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Clear All
                      </button>
                      <div className="text-sm text-slate-400">
                        {workflowNodes.length} agents in workflow
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <select 
                        value={selectedModel} 
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        {availableModels.slice(0, 5).map(model => (
                          <option key={model.name} value={model.name}>{model.name}</option>
                        ))}
                      </select>
                      <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm hover:bg-emerald-500/30 transition-all">
                        Test Workflow
                      </button>
                      <button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-all">
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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

            {/* Workflow Templates */}
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center">
                <span className="mr-3">⚡</span>
                Pre-built Workflow Templates
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-4">
                {workflowTemplates.map((template, index) => (
                  <div key={template.id} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">{template.name}</h4>
                        <p className="text-slate-400 text-xs">{template.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-lg">{template.automationLevel}%</div>
                        <div className="text-slate-400 text-xs">Automated</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimated Time:</span>
                        <span className="text-white font-semibold">{template.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Roles:</span>
                        <span className="text-blue-400 font-semibold">{template.roles.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Agents:</span>
                        <span className="text-emerald-400 font-semibold">{template.agents.length} agents</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-all">
                      Deploy Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* QBit AI Assistant Tab */}
        {activeTab === 'qbit' && (
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-heading flex items-center">
                    <span className="mr-3">💬</span>
                    QBit - Your Personalized AI Assistant
                  </h3>
                  <p className="text-slate-400">Role-based AI assistant tailored for VBA professionals</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-800/50 rounded-xl px-4 py-2 border border-slate-600/50">
                    <span className="text-emerald-400 text-sm font-semibold">● Online</span>
                  </div>
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    {vbaRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Role Context Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-6">
                    <h4 className="font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">👤</span>
                      Current Role: {vbaRoles.find(r => r.id === userRole)?.name}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-400 text-sm">Description:</span>
                        <p className="text-white text-sm mt-1">{vbaRoles.find(r => r.id === userRole)?.description}</p>
                      </div>
                      
                      <div>
                        <span className="text-slate-400 text-sm">Permissions:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vbaRoles.find(r => r.id === userRole)?.permissions.map((perm, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                              {perm.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Claims Context */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <h4 className="font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">📋</span>
                      Current Claims Context
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="font-semibold text-white text-sm">Jordan R. Sampleton</div>
                        <div className="text-slate-400 text-xs">File: F31605305</div>
                        <div className="text-blue-400 text-xs mt-1">PTSD Secondary - Under Review</div>
                      </div>
                      
                      <div className="text-xs text-slate-400">
                        Next Steps:
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Review medical evidence</li>
                          <li>Check nexus requirements</li>
                          <li>Determine C&P exam necessity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/30 rounded-2xl border border-slate-600/50 h-[600px] flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-600/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">QB</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">QBit Assistant</div>
                          <div className="text-xs text-emerald-400">Specialized for {userRole} • Ready to help</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 text-xs font-semibold">Active</span>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {/* Welcome Message */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">QB</span>
                        </div>
                        <div className="bg-slate-700/50 rounded-2xl p-4 max-w-md">
                          <div className="text-white text-sm">
                            Hello! I'm QBit, your personalized AI assistant for VBA claims processing. As a {vbaRoles.find(r => r.id === userRole)?.name}, I'm here to help you with:
                          </div>
                          <div className="mt-2 space-y-1">
                            {userRole === 'VSR' && (
                              <>
                                <div className="text-emerald-400 text-xs">• Claim intake guidance</div>
                                <div className="text-emerald-400 text-xs">• Document verification</div>
                                <div className="text-emerald-400 text-xs">• Basic rating assistance</div>
                              </>
                            )}
                            {userRole === 'RVSR' && (
                              <>
                                <div className="text-emerald-400 text-xs">• Complex rating decisions</div>
                                <div className="text-emerald-400 text-xs">• Medical opinion analysis</div>
                                <div className="text-emerald-400 text-xs">• Exam necessity determinations</div>
                              </>
                            )}
                            {userRole === 'RATER' && (
                              <>
                                <div className="text-emerald-400 text-xs">• Specialized condition ratings</div>
                                <div className="text-emerald-400 text-xs">• Appeals processing</div>
                                <div className="text-emerald-400 text-xs">• Complex medical evidence review</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sample Interaction */}
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="bg-blue-500/20 rounded-2xl p-4 max-w-md">
                          <div className="text-white text-sm">
                            I'm reviewing Jordan Sampleton's PTSD claim. The veteran is claiming secondary conditions related to back problems. Can you help me understand the nexus requirements?
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                          <span className="text-blue-400 font-bold text-xs">{userRole}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">QB</span>
                        </div>
                        <div className="bg-slate-700/50 rounded-2xl p-4 max-w-md">
                          <div className="text-white text-sm mb-2">
                            Great question! For secondary PTSD conditions, you'll need to establish:
                          </div>
                          <div className="space-y-2">
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <div className="font-semibold text-emerald-400 text-xs mb-1">1. Primary Service-Connected Condition</div>
                              <div className="text-slate-300 text-xs">Confirm the back condition is already service-connected</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <div className="font-semibold text-emerald-400 text-xs mb-1">2. Medical Nexus</div>
                              <div className="text-slate-300 text-xs">Need medical opinion linking PTSD to aggravation from back pain</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <div className="font-semibold text-emerald-400 text-xs mb-1">3. Timeline Evidence</div>
                              <div className="text-slate-300 text-xs">PTSD symptoms manifested after back condition onset</div>
                            </div>
                          </div>
                          <div className="mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="text-blue-400 text-xs">
                              💡 I've delegated this to the Medical Analyzer agent to review the file for existing nexus evidence.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Human-in-the-loop notification */}
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-amber-400 text-2xl">⚠️</div>
                          <div>
                            <div className="font-semibold text-amber-400 text-sm">Human Review Required</div>
                            <div className="text-white text-sm mt-1">
                              The Medical Analyzer has flagged potential conflicting evidence in the veteran's file. Your expert review is needed to determine the appropriate nexus opinion requirements.
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs hover:bg-emerald-500/30 transition-all">
                                Review Evidence
                              </button>
                              <button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg text-xs hover:bg-blue-500/30 transition-all">
                                Get Recommendation
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-slate-600/50 p-4">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder={`Ask QBit about ${userRole} procedures, regulations, or this specific claim...`}
                          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
                        />
                        <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-xl hover:bg-emerald-500/30 transition-all">
                          Send
                        </button>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          'Check M21-1 guidance',
                          'Review VASRD schedule',
                          'Delegate to agent',
                          'Generate notification letter'
                        ].map((action, i) => (
                          <button
                            key={i}
                            className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-600/50 transition-all"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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

        {/* Model Hub Tab */}
        {activeTab === 'models' && (
          <section className="max-w-7xl mx-auto px-6">
            <div className="glass-strong rounded-3xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-heading flex items-center">
                    <span className="mr-3">🧠</span>
                    AI Model Hub & Fine-tuning Center
                  </h3>
                  <p className="text-slate-400">13 cutting-edge models available for VBA agent orchestration</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-800/50 rounded-xl px-4 py-2 border border-slate-600/50">
                    <span className="text-emerald-400 text-sm font-semibold">{availableModels.filter(m => m.status === 'available').length}/{availableModels.length} Available</span>
                  </div>
                </div>
              </div>

              {/* Model Categories */}
              <div className="mb-8">
                <div className="flex space-x-4 mb-6">
                  {['All', 'Closed Source', 'Open Source', 'Specialized'].map((category) => (
                    <button
                      key={category}
                      className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all text-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Model Grid */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableModels.map((model) => (
                  <div key={model.name} className="group bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-bold text-white group-hover:text-blue-400 transition-colors">{model.name}</h5>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            model.category === 'Closed Source' ? 'bg-blue-500/20 text-blue-400' :
                            model.category === 'Open Source' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {model.category}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">{model.provider} • {model.version}</p>
                        <p className="text-slate-500 text-xs">{model.specialty}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">{model.performance}</div>
                        <div className="text-xs text-slate-400">Performance</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Context Window</span>
                        <span className="text-white font-mono">{model.maxTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cost per Token</span>
                        <span className="text-white font-mono">${model.costPerToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fine-tuning</span>
                        <span className={model.finetuningAvailable ? 'text-emerald-400' : 'text-red-400'}>
                          {model.finetuningAvailable ? '✓ Available' : '✗ Not Available'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Performance Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs">Overall Performance</span>
                        <span className="text-white text-xs font-semibold">{model.performance}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${model.performance}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-slate-400 text-xs mb-2">Key Capabilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.slice(0, 3).map((cap) => (
                          <span key={cap} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
                            {cap}
                          </span>
                        ))}
                        {model.capabilities.length > 3 && (
                          <span className="text-xs text-slate-500">+{model.capabilities.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-xs hover:bg-blue-500/30 transition-all">
                        Deploy
                      </button>
                      {model.finetuningAvailable && (
                        <button className="flex-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-2 rounded-lg text-xs hover:bg-purple-500/30 transition-all">
                          Fine-tune
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fine-tuning Console */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Quick Fine-tuning Console</h4>
                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Select Model</label>
                      <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                        {availableModels.filter(m => m.finetuningAvailable).slice(0, 5).map(model => (
                          <option key={model.name} value={model.name}>{model.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Training Dataset</label>
                      <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                        <option>VA Medical Records (1.8M samples)</option>
                        <option>Historical Claims (5.2M samples)</option>
                        <option>VBA Procedures (892K samples)</option>
                      </select>
                    </div>
                  </div>
                  
                  <button className="w-full skinzai-button py-3">
                    Start Fine-tuning Job
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Enhanced Floating Action Panel */}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        {/* Workflow Designer Shortcut */}
        <div className="group relative">
          <button 
            onClick={() => setActiveTab('workflow')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 mirror-effect"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-600/50 shadow-2xl">
            <div className="font-semibold">Workflow Designer</div>
            <div className="text-slate-400 text-xs">Build custom agent workflows</div>
          </div>
        </div>

        {/* QBit Assistant Toggle */}
        <div className="group relative">
          <button 
            onClick={() => setActiveTab('qbit')}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 mirror-effect relative overflow-hidden"
          >
            {/* Pulsing background for active state */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 animate-pulse rounded-full"></div>
            
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">QB</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-full"></div>
          </button>
          
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-600/50 shadow-2xl">
            <div className="font-semibold flex items-center space-x-2">
              <span>QBit Assistant</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-slate-400 text-xs">Role-based AI guidance</div>
            <div className="text-emerald-400 text-xs font-mono">●Ready for {userRole}</div>
          </div>
        </div>

        {/* System Settings */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-purple-600 to-pink-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-slate-600/50 shadow-2xl">
            <div className="font-semibold">System Settings</div>
            <div className="text-slate-400 text-xs">Configure orchestration</div>
          </div>
        </div>
      </div>
    </div>
  );
}