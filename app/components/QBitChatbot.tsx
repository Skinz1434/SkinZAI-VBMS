'use client';

import { useState, useEffect, useRef } from 'react';
import { expandedMockDatabase } from '../lib/expandedMockData';

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
        content: 'Hello! I\'m QBit, your VBMS AI assistant. I can help you find veteran information, analyze claims, search documents, and answer questions about the RUMEV1 system. What can I help you with today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const generateQBitResponse = (userInput: string): QBitResponse => {
    const input = userInput.toLowerCase();

    // Search functionality
    if (input.includes('find') || input.includes('search') || input.includes('look for')) {
      if (input.includes('veteran')) {
        const searchTerm = input.replace(/find|search|look for|veteran/gi, '').trim();
        const veterans = expandedMockDatabase.veterans.filter(v => 
          v.name.toLowerCase().includes(searchTerm) ||
          v.fileNumber.toLowerCase().includes(searchTerm)
        );
        
        if (veterans.length > 0) {
          return {
            message: `I found ${veterans.length} veteran(s) matching your search:\n\n${veterans.slice(0, 3).map(v => 
              `• ${v.name} (${v.fileNumber}) - ${v.currentRating}% rating, $${v.monthlyCompensation} monthly`
            ).join('\n')}${veterans.length > 3 ? `\n\n...and ${veterans.length - 3} more` : ''}`,
            suggestions: ['Show me their claims', 'View documents', 'Check RUMEV1 analysis']
          };
        }
      }
      
      if (input.includes('claim')) {
        const claims = expandedMockDatabase.claims.slice(0, 3);
        return {
          message: `Here are the latest claims in the system:\n\n${claims.map(c => 
            `• Claim ${c.id} - ${c.veteranName}\n  Status: ${c.status} | Priority: ${c.priority}\n  Exam ${c.examRequired ? 'Required' : 'Eliminated'} (${c.rumevAnalysis?.confidence}% confidence)`
          ).join('\n\n')}`,
          suggestions: ['Show RUMEV1 analysis', 'Filter by status', 'View documents']
        };
      }

      if (input.includes('document')) {
        const docs = expandedMockDatabase.documents.slice(0, 3);
        return {
          message: `Recent documents in the system:\n\n${docs.map(d => 
            `• ${d.title}\n  Veteran: ${d.veteranName} | ${d.pages} pages\n  ${d.ocrProcessed ? `✓ OCR Processed (${d.ocrConfidence}%)` : '⏳ Processing'}`
          ).join('\n\n')}`,
          suggestions: ['View document details', 'Search by veteran', 'Filter by type']
        };
      }
    }

    // RUMEV1 system questions
    if (input.includes('rumev') || input.includes('ai') || input.includes('system')) {
      if (input.includes('accuracy') || input.includes('performance')) {
        const totalClaims = expandedMockDatabase.claims.length;
        const examsEliminated = expandedMockDatabase.claims.filter(c => !c.examRequired).length;
        const avgConfidence = expandedMockDatabase.claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / totalClaims;
        
        return {
          message: `RUMEV1 System Performance:\n\n• Overall Accuracy: ${avgConfidence.toFixed(1)}%\n• Exam Elimination Rate: ${((examsEliminated / totalClaims) * 100).toFixed(1)}%\n• Claims Processed: ${totalClaims}\n• Cost Savings: $${(examsEliminated * 3500).toLocaleString()}\n\nThe system uses advanced ML algorithms including XGBoost, Leiden community detection, and NLP processing to analyze medical records and determine exam necessity.`,
          suggestions: ['Show me agent details', 'View analytics dashboard', 'Explain elimination process']
        };
      }

      if (input.includes('how') || input.includes('work') || input.includes('process')) {
        return {
          message: `RUMEV1 (Reducing Unnecessary Medical Exams V1) works through these steps:\n\n1. **Document Ingestion**: Medical records are processed with OCR and NLP\n2. **Pattern Recognition**: ML models identify key medical indicators\n3. **Nexus Analysis**: AI determines service connection likelihood\n4. **Exam Necessity**: Algorithm decides if C&P exam is required\n5. **Confidence Scoring**: Each decision includes a confidence percentage\n\nThe system has 4 specialized agents working together to ensure accurate, fast decisions while maintaining veteran care standards.`,
          suggestions: ['Show system metrics', 'View recent decisions', 'Explain confidence scores']
        };
      }
    }

    // Statistics and reporting
    if (input.includes('stats') || input.includes('statistics') || input.includes('report')) {
      const stats = {
        totalVeterans: expandedMockDatabase.veterans.length,
        totalClaims: expandedMockDatabase.claims.length,
        totalDocuments: expandedMockDatabase.documents.length,
        highPriority: expandedMockDatabase.claims.filter(c => c.priority === 'High').length,
        avgProcessingDays: Math.round(expandedMockDatabase.claims.reduce((acc, c) => acc + c.daysInQueue, 0) / expandedMockDatabase.claims.length)
      };

      return {
        message: `Current VBMS Statistics:\n\n📊 **System Overview**\n• Veterans: ${stats.totalVeterans}\n• Active Claims: ${stats.totalClaims}\n• Documents: ${stats.totalDocuments}\n• High Priority Claims: ${stats.highPriority}\n\n⏱️ **Processing Metrics**\n• Average Processing Time: ${stats.avgProcessingDays} days\n• System Uptime: 99.97%\n• OCR Processing: ${expandedMockDatabase.documents.filter(d => d.ocrProcessed).length}/${stats.totalDocuments} complete`,
        suggestions: ['View detailed analytics', 'Show recent activity', 'Generate report']
      };
    }

    // Help and commands
    if (input.includes('help') || input.includes('what can') || input === '') {
      return {
        message: `I can help you with:\n\n🔍 **Search & Find**\n• Find veterans: "Find veteran John"\n• Search claims: "Show me claims"\n• Locate documents: "Find documents for veteran"\n\n📊 **Analytics & Reports**\n• System statistics: "Show me stats"\n• RUMEV1 performance: "How accurate is the AI?"\n• Processing metrics: "System performance"\n\n💡 **Information & Support**\n• Explain processes: "How does RUMEV1 work?"\n• Get help: "What can you do?"\n• Quick actions: "Show recent claims"\n\nJust ask me naturally - I understand conversational language!`,
        suggestions: ['Find a veteran', 'Show system stats', 'Explain RUMEV1', 'Recent activity']
      };
    }

    // Default responses for unrecognized queries
    const defaultResponses = [
      {
        message: "I'm not sure I understand that specific request. I can help you search for veterans, review claims, analyze documents, or explain how the RUMEV1 system works. What would you like to know?",
        suggestions: ['Search veterans', 'Show claims', 'System help', 'RUMEV1 info']
      },
      {
        message: "Let me help you with that. I can find veteran information, show claim statuses, search documents, or provide system analytics. What specific information are you looking for?",
        suggestions: ['Find veteran data', 'Claim analysis', 'Document search', 'View statistics']
      }
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateQBitResponse(inputValue);
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
                  <p className="text-blue-100 text-xs">VBMS AI Helper • Always Online</p>
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
                placeholder="Ask me about veterans, claims, or RUMEV1..."
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
              {['Find veteran', 'Show claims', 'System stats', 'How does RUMEV1 work?'].map((suggestion, i) => (
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