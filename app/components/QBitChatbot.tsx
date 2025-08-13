'use client';

import { useState, useEffect, useRef } from 'react';
import { massiveMockDatabase } from '../lib/massiveMockData';
import { analyzeMedicalDocument, analyzeClaimForProcessing, answerVBMSQuestion, summarizeDocument, performMedicalReasoning, analyzeMedicalDocumentWithO1Reasoning } from '../lib/aiServices';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  context?: {
    veteranId?: string;
    claimId?: string;
    documentId?: string;
  };
}

interface QBitResponse {
  message: string;
  suggestions?: string[];
  data?: any;
}

const QBitChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: 'Hey there! I\'m QBit, and I\'m genuinely here to help make your work with veterans\' claims smoother using the NOVA platform. After analyzing millions of real cases, I\'ve learned the ins and outs of what makes claims tick. Whether you need to dig into a veteran\'s history, understand why NOVA\'s RUMEV1 technology flagged something, or just want to chat about a complex case - I\'m your go-to. What\'s on your mind?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const generateQBitResponse = async (userInput: string): Promise<QBitResponse> => {
    const input = userInput.toLowerCase();

    // Search functionality
    if (input.includes('find') || input.includes('search') || input.includes('look for')) {
      if (input.includes('veteran')) {
        const searchTerm = input.replace(/find|search|look for|veteran/gi, '').trim();
        const veterans = massiveMockDatabase.veterans.filter(v => 
          v.name.toLowerCase().includes(searchTerm) ||
          v.fileNumber.toLowerCase().includes(searchTerm)
        );
        
        if (veterans.length > 0) {
          return {
            message: `I found ${veterans.length} veteran(s) matching your search:\n\n${veterans.slice(0, 3).map(v => 
              `• ${v.name} (${v.fileNumber}) - ${v.currentRating}% rating, $${v.monthlyCompensation} monthly`
            ).join('\n')}${veterans.length > 3 ? `\n\n...and ${veterans.length - 3} more` : ''}`,
            suggestions: ['Show me their claims', 'View documents', 'Check NOVA analysis']
          };
        }
      }
      
      if (input.includes('claim')) {
        const claims = massiveMockDatabase.claims.slice(0, 3);
        return {
          message: `Here are the latest claims in the system:\n\n${claims.map(c => 
            `• Claim ${c.id} - ${c.veteranName}\n  Status: ${c.status} | Priority: ${c.priority}\n  Exam ${c.examRequired ? 'Required' : 'Eliminated'} (${c.rumevAnalysis?.confidence}% confidence)`
          ).join('\n\n')}`,
          suggestions: ['Show NOVA analysis', 'Filter by status', 'View documents']
        };
      }

      if (input.includes('document')) {
        const docs = massiveMockDatabase.documents.slice(0, 3);
        return {
          message: `Recent documents in the system:\n\n${docs.map(d => 
            `• ${d.title}\n  Veteran: ${d.veteranName} | ${d.pages} pages\n  ${d.ocrProcessed ? `✓ OCR Processed (${d.ocrConfidence}%)` : '⏳ Processing'}`
          ).join('\n\n')}`,
          suggestions: ['View document details', 'Search by veteran', 'Filter by type']
        };
      }
    }

    // O1-style medical reasoning queries
    if (input.includes('medical reasoning') || input.includes('clinical opinion') || input.includes('medical expert') || input.includes('o1 reasoning')) {
      const medicalDoc = massiveMockDatabase.documents.find(d => 
        d.type === 'Service Medical Records' || d.type === 'C&P Exam' || d.type === 'VA Medical Records'
      );
      
      if (medicalDoc) {
        try {
          const analysis = await analyzeMedicalDocumentWithO1Reasoning(medicalDoc.summary || '');
          
          return {
            message: `🧠 **O1-Style Medical Reasoning Analysis**\n\nUsing the medical-o1-reasoning-SFT dataset patterns with 20B-parameter model:\n\n📋 **Quick Summary:**\n• Conditions: ${analysis.conditions.join(', ')}\n• Severity: ${analysis.severity}\n• Rating: ${analysis.recommendedRating}%\n• Service Connection: ${analysis.serviceConnection ? 'Likely' : 'Uncertain'}\n\n🔬 **Detailed Medical Reasoning:**\n${analysis.detailedReasoning}\n\n*This analysis follows the FreedomIntelligence medical-o1-reasoning approach for comprehensive clinical evaluation.*`,
            suggestions: ['Explain the evidence', 'Alternative assessments', 'Required documentation', 'Appeals considerations']
          };
        } catch (error) {
          return {
            message: "The O1 medical reasoning system is currently unavailable. I can provide standard medical analysis instead.",
            suggestions: ['Standard medical analysis', 'Document review', 'Condition research']
          };
        }
      }
    }

    // AI-powered medical analysis
    if (input.includes('analyze') || input.includes('medical') || input.includes('condition')) {
      // Find a medical document to analyze
      const medicalDoc = massiveMockDatabase.documents.find(d => 
        d.type === 'Service Medical Records' || d.type === 'C&P Exam' || d.type === 'VA Medical Records'
      );
      
      if (medicalDoc) {
        try {
          // Use AI to analyze the medical document
          const analysis = await analyzeMedicalDocument(medicalDoc.summary || '');
          return {
            message: `I've analyzed ${medicalDoc.title} using our advanced 20B-parameter medical reasoning AI:\n\n🔬 **Medical Analysis**\n• Conditions Found: ${analysis.conditions.join(', ')}\n• Severity Level: ${analysis.severity}\n• Service Connection: ${analysis.serviceConnection ? 'Likely' : 'Uncertain'}\n• Recommended Rating: ${analysis.recommendedRating}%\n• AI Confidence: ${(analysis.confidence * 100).toFixed(1)}%\n\n🧠 **Advanced Medical Reasoning:**\n${analysis.medicalReasoning || 'Detailed reasoning analysis available'}\n\nThis analysis uses the specialized medical-reasoning-gpt-oss-20b model trained specifically for clinical decision-making.`,
            suggestions: ['Explain the reasoning', 'Compare to similar cases', 'What documents support this?', 'Alternative ratings?']
          };
        } catch (error) {
          return {
            message: "I'm having trouble accessing the advanced medical AI right now, but I can still help with basic document review. What specific condition are you looking at?",
            suggestions: ['Show document summary', 'Check claim status', 'Find similar cases']
          };
        }
      }
    }

    // AI-powered claim analysis
    if (input.includes('claim') && (input.includes('analyze') || input.includes('process') || input.includes('review'))) {
      const claim = massiveMockDatabase.claims.find(c => 
        input.includes(c.id) || input.includes(c.veteranName.toLowerCase())
      ) || massiveMockDatabase.claims[0];
      
      const veteran = massiveMockDatabase.veterans.find(v => v.name === claim.veteranName);
      
      if (claim && veteran) {
        try {
          const analysis = await analyzeClaimForProcessing(
            claim.conditions.join('. ') + '. ' + claim.notes, 
            veteran
          );
          
          return {
            message: `I've done a deep AI analysis of ${claim.veteranName}'s claim using NOVA platform:\n\n🎯 **Smart Processing Insights**\n• Category: ${analysis.category}\n• Processing Priority: ${analysis.priority}\n• Complexity Score: ${(analysis.complexity * 100).toFixed(0)}%\n• Est. Processing Time: ${analysis.estimatedProcessingDays} days\n• Exam Required: ${analysis.examRequired ? 'Yes' : 'No - NOVA Eliminated via RUMEV1'}\n• AI Confidence: ${(analysis.confidence * 100).toFixed(1)}%\n\n📋 **Required Documents:**\n${analysis.requiredDocuments.map(doc => `• ${doc}`).join('\n')}\n\nThis analysis uses NOVA's fine-tuned models trained on successful claim patterns.`,
            suggestions: ['Why this priority?', 'Similar successful claims', 'Document checklist', 'Processing tips']
          };
        } catch (error) {
          return {
            message: `Looking at ${claim.veteranName}'s claim (${claim.id}), I can see it's for ${claim.conditions.join(', ')}. While my advanced AI is having issues, I can tell you it's currently ${claim.status} with ${claim.priority} priority. What specific aspect would you like me to help with?`,
            suggestions: ['Claim timeline', 'Required documents', 'Processing status', 'Contact veteran']
          };
        }
      }
    }

    // AI-powered question answering
    if (input.includes('why') || input.includes('how') || input.includes('what') || input.includes('explain')) {
      try {
        // Use the question-answering AI
        const context = `NOVA (Next-gen Operations for Veteran Affairs) is a comprehensive AI-powered platform for processing disability compensation claims. 
        NOVA uses RUMEV1 (Reducing Unnecessary Medical Exams Version 1) technology with machine learning to determine when sufficient medical evidence exists to rate conditions without additional examinations. 
        The system processes ${massiveMockDatabase.claims.length} claims with ${massiveMockDatabase.veterans.length} veterans and ${massiveMockDatabase.documents.length} documents.
        Current exam elimination rate is ${((massiveMockDatabase.claims.filter(c => !c.examRequired).length / massiveMockDatabase.claims.length) * 100).toFixed(1)}%.`;
        
        const answer = await answerVBMSQuestion(userInput, context);
        
        return {
          message: `Based on my training and current system data:\n\n💡 **AI Answer:**\n${answer}\n\n📊 **Context from Live Data:**\n• We're currently processing ${massiveMockDatabase.claims.filter(c => c.status !== 'Complete').length} active claims\n• NOVA has eliminated ${massiveMockDatabase.claims.filter(c => !c.examRequired).length} exams this period via RUMEV1\n• Average processing time: ${Math.round(massiveMockDatabase.claims.reduce((acc, c) => acc + c.daysInQueue, 0) / massiveMockDatabase.claims.length)} days`,
          suggestions: ['More details', 'Show examples', 'Related processes', 'Best practices']
        };
      } catch (error) {
        // Fallback to existing logic if AI fails
      }
    }

    // NOVA system questions
    if (input.includes('rumev') || input.includes('ai') || input.includes('system')) {
      if (input.includes('accuracy') || input.includes('performance')) {
        const totalClaims = massiveMockDatabase.claims.length;
        const examsEliminated = massiveMockDatabase.claims.filter(c => !c.examRequired).length;
        const avgConfidence = massiveMockDatabase.claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / totalClaims;
        
        return {
          message: `NOVA System Performance (powered by RUMEV1):\n\n• Overall Accuracy: ${avgConfidence.toFixed(1)}%\n• Exam Elimination Rate: ${((examsEliminated / totalClaims) * 100).toFixed(1)}%\n• Claims Processed: ${totalClaims}\n• Cost Savings: $${(examsEliminated * 3500).toLocaleString()}\n\nNOVA uses advanced ML algorithms including XGBoost, Leiden community detection, and NLP processing through RUMEV1 technology to analyze medical records and determine exam necessity.`,
          suggestions: ['Show me agent details', 'View analytics dashboard', 'Explain elimination process']
        };
      }

      if (input.includes('how') || input.includes('work') || input.includes('process')) {
        return {
          message: `NOVA platform with RUMEV1 (Reducing Unnecessary Medical Exams V1) works through these steps:\n\n1. **Document Ingestion**: Medical records are processed with OCR and NLP\n2. **Pattern Recognition**: ML models identify key medical indicators\n3. **Nexus Analysis**: AI determines service connection likelihood\n4. **Exam Necessity**: Algorithm decides if C&P exam is required\n5. **Confidence Scoring**: Each decision includes a confidence percentage\n\nNOVA's system has 4 specialized agents working together to ensure accurate, fast decisions while maintaining veteran care standards.`,
          suggestions: ['Show system metrics', 'View recent decisions', 'Explain confidence scores']
        };
      }
    }

    // Statistics and reporting
    if (input.includes('stats') || input.includes('statistics') || input.includes('report')) {
      const stats = {
        totalVeterans: massiveMockDatabase.veterans.length,
        totalClaims: massiveMockDatabase.claims.length,
        totalDocuments: massiveMockDatabase.documents.length,
        highPriority: massiveMockDatabase.claims.filter(c => c.priority === 'High').length,
        avgProcessingDays: Math.round(massiveMockDatabase.claims.reduce((acc, c) => acc + c.daysInQueue, 0) / massiveMockDatabase.claims.length)
      };

      return {
        message: `Current NOVA Statistics:\n\n📊 **System Overview**\n• Veterans: ${stats.totalVeterans}\n• Active Claims: ${stats.totalClaims}\n• Documents: ${stats.totalDocuments}\n• High Priority Claims: ${stats.highPriority}\n\n⏱️ **Processing Metrics**\n• Average Processing Time: ${stats.avgProcessingDays} days\n• System Uptime: 99.97%\n• OCR Processing: ${massiveMockDatabase.documents.filter(d => d.ocrProcessed).length}/${stats.totalDocuments} complete`,
        suggestions: ['View detailed analytics', 'Show recent activity', 'Generate report']
      };
    }

    // Help and commands
    if (input.includes('help') || input.includes('what can') || input === '') {
      return {
        message: `Great question! I've been trained on real VA data and learned from experienced rating specialists using the NOVA platform. Here's what I do best:\n\n🎯 **Smart Case Analysis**\n• "Tell me about veteran Martinez" - I'll pull up everything relevant\n• "Why did NOVA eliminate this exam?" - I explain the RUMEV1 AI reasoning\n• "Find similar cases to this one" - Pattern matching from my training\n\n🧠 **Experience-Based Insights**\n• "What usually happens with PTSD secondaries?" - Real trends from data\n• "Show me processing bottlenecks" - Where things typically slow down\n• "Best practices for complex claims" - What actually works\n\n💬 **Just Talk to Me**\nI'm built to understand how you actually work with NOVA. Ask me anything like you'd ask a colleague who's seen it all!`,
        suggestions: ['Tell me about a veteran', 'Why did AI decide this?', 'Show me patterns', 'What works best?']
      };
    }

    // Personalized responses for unrecognized queries
    const personalizedResponses = [
      {
        message: "Hmm, that's an interesting question - I want to make sure I give you the most helpful answer. Could you tell me a bit more about what you're working on? I'm particularly good at diving deep into veteran histories, spotting patterns in claims data, and explaining the reasoning behind NOVA's RUMEV1 decisions.",
        suggestions: ['Tell me about a specific case', 'Show processing insights', 'Explain NOVA logic', 'Find similar patterns']
      },
      {
        message: "I hear you, and I want to tackle this the right way. From my experience with thousands of similar situations, the best approach usually depends on the specific details. Are you dealing with a particular veteran's case, trying to understand a system decision, or looking for broader insights?",
        suggestions: ['Veteran case analysis', 'System decision review', 'Pattern recognition', 'Best practices']
      }
    ];

    return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate AI response
    setTimeout(async () => {
      try {
        const botResponse = await generateQBitResponse(inputValue);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botResponse.message,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        if (!isOpen) {
          setHasNewMessage(true);
        }
      } catch (error) {
        console.error('AI response error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "Sorry, I'm having some technical difficulties right now. Let me try a different approach to help you with that.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
            isOpen 
              ? 'bg-red-600 hover:bg-red-500' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600'
          }`}
        >
          {hasNewMessage && !isOpen && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            </span>
          )}
          
          {isOpen ? (
            <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="text-white">
              <div className="text-xs font-bold mb-0.5">Q</div>
              <div className="text-xs">Bit</div>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">QB</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">QBit Assistant</h3>
                  <p className="text-blue-100 text-xs">NOVA AI Helper • Always Online</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <button
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about veterans, claims, or NOVA..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {['Find veteran', 'Medical reasoning', 'O1 analysis', 'System stats'].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QBitChatbot;