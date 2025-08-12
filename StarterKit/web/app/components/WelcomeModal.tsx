'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: 'Welcome to VBMS Enhanced',
      subtitle: 'AI-Powered Veterans Benefits Management',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <div className="text-white font-bold text-3xl">VA</div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Experience the future of Veterans Benefits processing with our RUMEV1 AI system.
              Reducing unnecessary medical exams by 30-37% while maintaining 95%+ accuracy.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-emerald-400 font-bold text-xl">97.2%</div>
              <div className="text-slate-400 text-sm">AI Accuracy</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-emerald-400 font-bold text-xl">$1B+</div>
              <div className="text-slate-400 text-sm">Annual Savings</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-emerald-400 font-bold text-xl">60%</div>
              <div className="text-slate-400 text-sm">Faster Decisions</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="text-2xl mb-2">🔬</div>
              <div className="text-emerald-400 font-bold text-xl">623</div>
              <div className="text-slate-400 text-sm">Exams Eliminated</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'RUMEV1 Multi-Agent System',
      subtitle: 'Four Specialized AI Agents Working in Harmony',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                name: 'Agent A',
                title: 'Leiden Community Detection',
                icon: '🔬',
                description: 'Graph-based claim clustering and pattern recognition',
                accuracy: 98.7
              },
              {
                name: 'Agent B', 
                title: 'XGBoost Prediction Engine',
                icon: '🎯',
                description: 'ML-based outcome prediction and exam necessity',
                accuracy: 97.2
              },
              {
                name: 'Agent C',
                title: 'NLP Medical Processor', 
                icon: '📝',
                description: 'HIPAA-compliant document analysis and extraction',
                accuracy: 99.1
              },
              {
                name: 'Agent D',
                title: 'Continuous Learning',
                icon: '🧠', 
                description: 'Real-time system optimization and improvement',
                accuracy: 96.4
              }
            ].map((agent, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{agent.icon}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{agent.name}</div>
                    <div className="text-blue-400 text-xs">{agent.title}</div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-3">{agent.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Accuracy</span>
                  <span className="text-emerald-400 font-semibold">{agent.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${agent.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'System Features & Navigation',
      subtitle: 'Explore the Enhanced VBMS Platform',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                name: 'Dashboard',
                icon: '📊',
                description: 'Real-time system overview with live metrics and agent status monitoring',
                href: '/dashboard'
              },
              {
                name: 'Claims Management',
                icon: '📋', 
                description: 'Comprehensive veteran claims processing with AI-powered insights',
                href: '/claims'
              },
              {
                name: 'Analytics',
                icon: '📈',
                description: 'Advanced performance analytics and system intelligence reporting',
                href: '/analytics'
              },
              {
                name: 'Agent Orchestration',
                icon: '🤖',
                description: 'Sophisticated MCP agent management with model fine-tuning capabilities',
                href: '/orchestration'
              },
              {
                name: 'eFolder Management',
                icon: '📁',
                description: 'Digital document management and veteran record systems',
                href: '/efolder'
              }
            ].map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                onClick={onClose}
                className="group bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{feature.name}</div>
                    <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
                  </div>
                  <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 neural-grid opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="relative z-10 glass-strong border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white font-display">{steps[currentStep].title}</h2>
              <p className="text-slate-400 mt-1">{steps[currentStep].subtitle}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Step Indicator */}
              <div className="flex space-x-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentStep ? 'bg-blue-400 w-6' : 'bg-slate-600'
                    }`}
                  ></div>
                ))}
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-8 overflow-y-auto max-h-[60vh]">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {steps[currentStep].content}
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 glass-strong border-t border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 0
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Previous</span>
            </button>
            
            <div className="text-center text-slate-400 text-sm">
              {currentStep + 1} of {steps.length}
            </div>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={onClose}
                className="skinzai-button px-8 py-3"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 skinzai-button px-6 py-3"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}