'use client';

import { useState, useEffect } from 'react';

interface WelcomeModalProps {
  pageName: string;
  title: string;
  description: string;
  features: string[];
  demoActions?: { label: string; action: () => void }[];
}

const WelcomeModal = ({ pageName, title, description, features, demoActions }: WelcomeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`vbms-welcome-${pageName}`);
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, [pageName]);

  const handleClose = () => {
    localStorage.setItem(`vbms-welcome-${pageName}`, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">👋</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-100">Welcome to {title}</h2>
                <p className="text-sm text-slate-400">Let's get you started</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <p className="text-slate-300 text-lg leading-relaxed">{description}</p>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 
                    index < currentStep ? 'bg-blue-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Feature showcase */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {currentStep + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  {features[currentStep]}
                </h3>
                <div className="text-slate-300">
                  {getFeatureDescription(pageName, currentStep)}
                </div>
              </div>
            </div>
          </div>

          {/* Demo actions */}
          {demoActions && demoActions.length > 0 && currentStep === features.length - 1 && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20 mb-6">
              <h4 className="text-lg font-semibold text-slate-100 mb-3">Try These Actions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      handleClose();
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-left border border-slate-700 hover:border-slate-600"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">→</span>
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
              >
                {currentStep === features.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getFeatureDescription = (pageName: string, step: number) => {
  const descriptions = {
    'home': [
      'Navigate through our comprehensive Veterans Benefits Management System with powerful AI-driven insights and streamlined workflows.',
      'Access real-time system performance metrics, including claims processing rates, exam elimination statistics, and cost savings.',
      'Utilize our four specialized AI agents working together to analyze claims, eliminate unnecessary exams, and improve decision accuracy.'
    ],
    'claims': [
      'View and manage all active disability compensation claims in a unified dashboard with advanced filtering and search capabilities.',
      'See RUMEV1 AI analysis for each claim, including exam necessity decisions, confidence scores, and estimated benefits.',
      'Track claim progress through automated workflows with real-time status updates and assignee information.'
    ],
    'efolder': [
      'Search through comprehensive digital records including service treatment records, VA medical records, and private medical evidence.',
      'View documents with OCR processing results, extracted data, and intelligent categorization for rapid evidence review.',
      'Access document viewer with metadata, tags, and review status to streamline the claims decision process.'
    ],
    'analytics': [
      'Monitor real-time system performance with comprehensive dashboards showing claims processing, exam elimination rates, and accuracy metrics.',
      'View RUMEV1 agent performance including individual accuracy rates, throughput statistics, and system health indicators.',
      'Analyze condition-specific data to understand exam elimination patterns and identify opportunities for process improvement.'
    ],
    'orchestration': [
      'Visualize the multi-agent AI system with real-time agent status, processing queues, and communication flows.',
      'Monitor agent performance metrics including accuracy, throughput, and system resource utilization.',
      'Configure agent parameters, review decision logs, and optimize system performance for maximum efficiency.'
    ],
    'exams': [
      'Schedule and manage Compensation & Pension examinations with integrated calendar and examiner assignment.',
      'Track exam requirements based on RUMEV1 analysis and automatically identify claims that can bypass examination.',
      'Monitor exam completion rates, reschedule requests, and maintain comprehensive examination history.'
    ],
    'conditions': [
      'Reference the complete 38 CFR Schedule for Rating Disabilities with searchable conditions and rating criteria.',
      'View evidence requirements, exam necessities, and average rating statistics for each disability condition.',
      'Analyze condition-specific trends and examination patterns to improve rating consistency and accuracy.'
    ]
  };

  return descriptions[pageName as keyof typeof descriptions]?.[step] || 
    'Explore the powerful features and capabilities of this module to streamline your workflow and improve efficiency.';
};

export default WelcomeModal;