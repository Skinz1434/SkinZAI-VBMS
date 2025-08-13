'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress?: number;
  completed?: boolean;
  rating: number;
  enrolledUsers: number;
  prerequisites?: string[];
  objectives: string[];
  modules: {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'interactive';
    duration: string;
    completed?: boolean;
  }[];
  certificate: boolean;
}

interface UserProgress {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  certificatesEarned: number;
  totalHours: number;
}

export default function TrainingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'progress' | 'certificates'>('catalog');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const trainingModules: TrainingModule[] = [
    {
      id: 'TRN-001',
      title: 'VBMS Fundamentals',
      description: 'Comprehensive introduction to the Veterans Benefits Management System, covering basic navigation, core concepts, and essential workflows.',
      category: 'System Basics',
      difficulty: 'beginner',
      duration: '4 hours',
      progress: 100,
      completed: true,
      rating: 4.8,
      enrolledUsers: 1247,
      objectives: [
        'Navigate the VBMS interface efficiently',
        'Understand core system terminology',
        'Access veteran profiles and claim information',
        'Use basic search and filtering functions'
      ],
      modules: [
        { id: 'M1', title: 'System Overview', type: 'video', duration: '30 min', completed: true },
        { id: 'M2', title: 'Navigation Basics', type: 'interactive', duration: '45 min', completed: true },
        { id: 'M3', title: 'User Interface Guide', type: 'reading', duration: '20 min', completed: true },
        { id: 'M4', title: 'Basic Operations Quiz', type: 'quiz', duration: '15 min', completed: true },
        { id: 'M5', title: 'Hands-on Practice', type: 'interactive', duration: '90 min', completed: true }
      ],
      certificate: true
    },
    {
      id: 'TRN-002',
      title: 'Claims Processing Mastery',
      description: 'Advanced training on processing disability compensation claims, including evidence development, rating decisions, and quality assurance.',
      category: 'Claims Processing',
      difficulty: 'intermediate',
      duration: '8 hours',
      progress: 65,
      completed: false,
      rating: 4.9,
      enrolledUsers: 892,
      prerequisites: ['TRN-001'],
      objectives: [
        'Process complete disability claims from intake to decision',
        'Develop evidence effectively using multiple sources',
        'Apply rating criteria according to 38 CFR Part 4',
        'Ensure quality and compliance in all decisions'
      ],
      modules: [
        { id: 'M1', title: 'Claim Intake Process', type: 'video', duration: '45 min', completed: true },
        { id: 'M2', title: 'Evidence Development', type: 'reading', duration: '60 min', completed: true },
        { id: 'M3', title: 'Medical Review Techniques', type: 'interactive', duration: '90 min', completed: true },
        { id: 'M4', title: 'Rating Determinations', type: 'video', duration: '75 min', completed: false },
        { id: 'M5', title: 'Decision Documentation', type: 'reading', duration: '30 min', completed: false },
        { id: 'M6', title: 'Quality Assurance', type: 'interactive', duration: '45 min', completed: false },
        { id: 'M7', title: 'Final Assessment', type: 'quiz', duration: '30 min', completed: false }
      ],
      certificate: true
    },
    {
      id: 'TRN-003',
      title: 'RUMEV1 AI System Training',
      description: 'Learn to effectively use the RUMEV1 AI assistant for medical exam necessity determinations and evidence analysis.',
      category: 'AI Tools',
      difficulty: 'intermediate',
      duration: '3 hours',
      progress: 0,
      completed: false,
      rating: 4.7,
      enrolledUsers: 634,
      prerequisites: ['TRN-001'],
      objectives: [
        'Understand RUMEV1 AI capabilities and limitations',
        'Interpret AI confidence scores and recommendations',
        'Know when to override AI recommendations',
        'Provide effective feedback to improve AI performance'
      ],
      modules: [
        { id: 'M1', title: 'AI System Overview', type: 'video', duration: '25 min' },
        { id: 'M2', title: 'Using RUMEV1 Interface', type: 'interactive', duration: '40 min' },
        { id: 'M3', title: 'Interpreting AI Results', type: 'reading', duration: '30 min' },
        { id: 'M4', title: 'Override Scenarios', type: 'interactive', duration: '35 min' },
        { id: 'M5', title: 'Best Practices', type: 'video', duration: '20 min' },
        { id: 'M6', title: 'Practical Application', type: 'quiz', duration: '30 min' }
      ],
      certificate: true
    },
    {
      id: 'TRN-004',
      title: 'Advanced Medical Evidence Analysis',
      description: 'Deep dive into complex medical evidence interpretation, including radiology, pathology, and specialist reports.',
      category: 'Medical Review',
      difficulty: 'advanced',
      duration: '12 hours',
      progress: 25,
      completed: false,
      rating: 4.6,
      enrolledUsers: 345,
      prerequisites: ['TRN-002'],
      objectives: [
        'Interpret complex medical imaging and test results',
        'Understand specialty medical terminology and procedures',
        'Evaluate conflicting medical opinions effectively',
        'Apply advanced rating criteria for complex conditions'
      ],
      modules: [
        { id: 'M1', title: 'Medical Terminology Deep Dive', type: 'reading', duration: '90 min', completed: true },
        { id: 'M2', title: 'Radiology Interpretation', type: 'video', duration: '75 min', completed: true },
        { id: 'M3', title: 'Laboratory Values Analysis', type: 'interactive', duration: '60 min', completed: false },
        { id: 'M4', title: 'Cardiology Reports', type: 'reading', duration: '45 min', completed: false },
        { id: 'M5', title: 'Orthopedic Assessments', type: 'video', duration: '80 min', completed: false },
        { id: 'M6', title: 'Mental Health Evaluations', type: 'reading', duration: '70 min', completed: false },
        { id: 'M7', title: 'Complex Case Studies', type: 'interactive', duration: '120 min', completed: false },
        { id: 'M8', title: 'Final Certification', type: 'quiz', duration: '60 min', completed: false }
      ],
      certificate: true
    },
    {
      id: 'TRN-005',
      title: 'Quality Assurance Excellence',
      description: 'Comprehensive training on quality review processes, error identification, and continuous improvement methodologies.',
      category: 'Quality Assurance',
      difficulty: 'advanced',
      duration: '6 hours',
      progress: 0,
      completed: false,
      rating: 4.5,
      enrolledUsers: 278,
      prerequisites: ['TRN-002'],
      objectives: [
        'Conduct thorough quality reviews of claim decisions',
        'Identify common errors and their root causes',
        'Provide constructive feedback to improve performance',
        'Implement continuous improvement processes'
      ],
      modules: [
        { id: 'M1', title: 'QA Methodology', type: 'video', duration: '40 min' },
        { id: 'M2', title: 'Error Pattern Recognition', type: 'interactive', duration: '60 min' },
        { id: 'M3', title: 'Review Documentation', type: 'reading', duration: '30 min' },
        { id: 'M4', title: 'Feedback Techniques', type: 'video', duration: '45 min' },
        { id: 'M5', title: 'Statistical Analysis', type: 'interactive', duration: '50 min' },
        { id: 'M6', title: 'Improvement Planning', type: 'reading', duration: '25 min' },
        { id: 'M7', title: 'QA Certification Exam', type: 'quiz', duration: '50 min' }
      ],
      certificate: true
    },
    {
      id: 'TRN-006',
      title: 'Security and Compliance Training',
      description: 'Essential security protocols, privacy requirements, and compliance procedures for VBMS users.',
      category: 'Security & Compliance',
      difficulty: 'beginner',
      duration: '2 hours',
      progress: 100,
      completed: true,
      rating: 4.3,
      enrolledUsers: 1456,
      objectives: [
        'Understand federal security requirements and protocols',
        'Protect personally identifiable information (PII)',
        'Follow proper authentication and access procedures',
        'Report security incidents appropriately'
      ],
      modules: [
        { id: 'M1', title: 'Security Overview', type: 'video', duration: '20 min', completed: true },
        { id: 'M2', title: 'PII Protection', type: 'reading', duration: '25 min', completed: true },
        { id: 'M3', title: 'Access Controls', type: 'interactive', duration: '30 min', completed: true },
        { id: 'M4', title: 'Incident Reporting', type: 'video', duration: '15 min', completed: true },
        { id: 'M5', title: 'Compliance Quiz', type: 'quiz', duration: '30 min', completed: true }
      ],
      certificate: true
    }
  ];

  const userProgress: UserProgress = {
    totalModules: trainingModules.length,
    completedModules: trainingModules.filter(m => m.completed).length,
    inProgressModules: trainingModules.filter(m => m.progress && m.progress > 0 && !m.completed).length,
    certificatesEarned: trainingModules.filter(m => m.completed && m.certificate).length,
    totalHours: trainingModules.filter(m => m.completed).reduce((acc, m) => acc + parseInt(m.duration), 0)
  };

  const categories = ['all', ...Array.from(new Set(trainingModules.map(module => module.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredModules = trainingModules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' || 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🔴';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚫';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-400';
    if (progress >= 50) return 'bg-blue-400';
    if (progress > 0) return 'bg-yellow-400';
    return 'bg-slate-600';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="training"
          title="Training Center"
          description="Comprehensive training platform with interactive modules, video tutorials, and certification programs designed to enhance your VBMS skills and knowledge."
          features={[
            "Interactive training modules with hands-on exercises",
            "Progress tracking and performance analytics",
            "Professional certification programs",
            "Multi-format learning with videos, readings, and quizzes"
          ]}
          demoActions={[
            { label: "Start Basic Training", action: () => setSelectedModule(trainingModules[0]) },
            { label: "View Progress", action: () => setActiveTab('progress') },
            { label: "Browse Catalog", action: () => setSearchTerm('RUMEV1') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Training Center</h1>
                  <p className="text-sm text-slate-500">Professional Development & Certification</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search training modules..."
                    className="w-64 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <svg className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Training Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Available Modules</h3>
                  <span className="text-2xl">📚</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {userProgress.totalModules}
                </div>
                <div className="text-xs text-blue-300/70">Training programs</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Completed</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {userProgress.completedModules}
                </div>
                <div className="text-xs text-emerald-300/70">Modules finished</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Certificates</h3>
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {userProgress.certificatesEarned}
                </div>
                <div className="text-xs text-purple-300/70">Professional certifications</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Training Hours</h3>
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {userProgress.totalHours}
                </div>
                <div className="text-xs text-yellow-300/70">Hours completed</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Training Catalog
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'progress'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                My Progress
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'certificates'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Certificates
              </button>
            </div>

            {/* Training Catalog */}
            {activeTab === 'catalog' && (
              <>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Module Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map((module) => (
                    <div
                      key={module.id}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedModule(module)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getDifficultyIcon(module.difficulty)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty.toUpperCase()}
                            </span>
                            {module.certificate && (
                              <span className="text-yellow-400 text-sm">🏆</span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-100 mb-2">{module.title}</h3>
                          <p className="text-slate-400 text-sm mb-3">{module.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-slate-300">{module.duration}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Enrolled:</span>
                          <span className="text-slate-300">{module.enrolledUsers.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-slate-300">{module.rating}</span>
                          </div>
                        </div>
                        
                        {module.progress !== undefined && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-400">Progress:</span>
                              <span className="text-slate-300">{module.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(module.progress)}`}
                                style={{ width: `${module.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {module.category}
                          </span>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors">
                            {module.completed ? 'Review' : module.progress ? 'Continue' : 'Start'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-slate-100 mb-6">Learning Progress Overview</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-4">Current Status</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Completed Modules</span>
                          <span className="text-emerald-400 font-semibold">{userProgress.completedModules} / {userProgress.totalModules}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div 
                            className="bg-emerald-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(userProgress.completedModules / userProgress.totalModules) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">In Progress</span>
                          <span className="text-blue-400 font-semibold">{userProgress.inProgressModules}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Certificates Earned</span>
                          <span className="text-purple-400 font-semibold">{userProgress.certificatesEarned}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Total Training Hours</span>
                          <span className="text-yellow-400 font-semibold">{userProgress.totalHours} hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
                          <span className="text-emerald-400">✓</span>
                          <div className="flex-1">
                            <p className="text-slate-200 text-sm">Completed: VBMS Fundamentals</p>
                            <p className="text-slate-500 text-xs">2 days ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
                          <span className="text-blue-400">⏵</span>
                          <div className="flex-1">
                            <p className="text-slate-200 text-sm">In Progress: Claims Processing Mastery</p>
                            <p className="text-slate-500 text-xs">65% complete</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
                          <span className="text-emerald-400">✓</span>
                          <div className="flex-1">
                            <p className="text-slate-200 text-sm">Completed: Security & Compliance Training</p>
                            <p className="text-slate-500 text-xs">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-slate-100 mb-6">Module Progress Details</h2>
                  
                  <div className="space-y-4">
                    {trainingModules.map((module) => (
                      <div key={module.id} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-slate-100">{module.title}</h3>
                          <div className="flex items-center space-x-2">
                            {module.completed ? (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                                COMPLETED
                              </span>
                            ) : module.progress && module.progress > 0 ? (
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                IN PROGRESS
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-medium">
                                NOT STARTED
                              </span>
                            )}
                            {module.certificate && module.completed && (
                              <span className="text-yellow-400">🏆</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300">{module.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(module.progress || 0)}`}
                            style={{ width: `${module.progress || 0}%` }}
                          ></div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-slate-400 text-sm">{module.category} • {module.duration}</span>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors">
                            {module.completed ? 'Review' : module.progress ? 'Continue' : 'Start'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-slate-100 mb-2">Professional Certificates</h2>
                  <p className="text-slate-400">Your achievements and professional certifications</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainingModules.filter(m => m.completed && m.certificate).map((module) => (
                    <div key={module.id} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 text-center">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-2">{module.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">Certificate of Completion</p>
                      <div className="bg-slate-800 rounded-lg p-3 mb-4">
                        <p className="text-slate-300 text-sm">Completed: {new Date().toLocaleDateString()}</p>
                        <p className="text-slate-400 text-xs">Duration: {module.duration}</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                        Download Certificate
                      </button>
                    </div>
                  ))}
                  
                  {trainingModules.filter(m => !m.completed && m.certificate).map((module) => (
                    <div key={module.id} className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center opacity-50">
                      <div className="text-6xl mb-4">🔒</div>
                      <h3 className="text-lg font-medium text-slate-300 mb-2">{module.title}</h3>
                      <p className="text-slate-500 text-sm mb-4">Certificate Available</p>
                      <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                        <p className="text-slate-400 text-sm">Complete training to unlock</p>
                        <p className="text-slate-500 text-xs">Progress: {module.progress || 0}%</p>
                      </div>
                      <button 
                        onClick={() => setSelectedModule(module)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                      >
                        {module.progress ? 'Continue Training' : 'Start Training'}
                      </button>
                    </div>
                  ))}
                </div>
                
                {trainingModules.filter(m => m.completed && m.certificate).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-2">No Certificates Yet</h3>
                    <p className="text-slate-400 mb-6">Complete training modules to earn professional certificates</p>
                    <button 
                      onClick={() => setActiveTab('catalog')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      Browse Training Catalog
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Module Detail Modal */}
        {selectedModule && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getDifficultyIcon(selectedModule.difficulty)}</span>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-100">{selectedModule.title}</h2>
                      <p className="text-slate-400">{selectedModule.category} • {selectedModule.difficulty} • {selectedModule.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Course Description</h3>
                  <p className="text-slate-300">{selectedModule.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {selectedModule.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-slate-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedModule.prerequisites && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Prerequisites</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedModule.prerequisites.map((prereq, index) => {
                        const prereqModule = trainingModules.find(m => m.id === prereq);
                        return (
                          <span key={index} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                            {prereqModule?.title || prereq}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Module Content</h3>
                  <div className="space-y-3">
                    {selectedModule.modules.map((subModule, index) => (
                      <div key={subModule.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {subModule.type === 'video' ? '🎥' : 
                             subModule.type === 'reading' ? '📚' :
                             subModule.type === 'quiz' ? '❓' : '💻'}
                          </span>
                          <div>
                            <p className="text-slate-200 font-medium">{subModule.title}</p>
                            <p className="text-slate-400 text-sm">{subModule.type} • {subModule.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {subModule.completed ? (
                            <span className="text-emerald-400">✓</span>
                          ) : (
                            <span className="text-slate-500">○</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-slate-300">{selectedModule.rating}</span>
                    </div>
                    <span className="text-slate-400">{selectedModule.enrolledUsers.toLocaleString()} enrolled</span>
                    {selectedModule.certificate && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">
                        🏆 Certificate Available
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedModule(null)}
                      className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                      {selectedModule.completed ? 'Review Module' : selectedModule.progress ? 'Continue Learning' : 'Start Training'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}