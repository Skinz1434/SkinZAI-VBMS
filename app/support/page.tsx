'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  createdDate: string;
  lastUpdated: string;
  assignedTo?: string;
  responses: number;
}

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  availability: string;
  responseTime: string;
  contact: string;
}

export default function SupportPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'tickets' | 'resources'>('contact');
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const contactMethods: ContactMethod[] = [
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with a technical support specialist for immediate assistance',
      icon: '📞',
      availability: 'Monday - Friday, 7:00 AM - 7:00 PM ET',
      responseTime: 'Immediate',
      contact: '1-800-VA-VBMS1 (1-800-828-2671)'
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send detailed technical questions and receive comprehensive written responses',
      icon: '📧',
      availability: '24/7 submission, responses during business hours',
      responseTime: '4-8 hours',
      contact: 'vbms-support@va.gov'
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Real-time chat with support agents for quick questions and guidance',
      icon: '💬',
      availability: 'Monday - Friday, 8:00 AM - 6:00 PM ET',
      responseTime: '2-5 minutes',
      contact: 'Available in system'
    },
    {
      id: 'portal',
      title: 'Support Portal',
      description: 'Submit and track support tickets through our comprehensive help desk system',
      icon: '🎫',
      availability: '24/7',
      responseTime: '1-2 business days',
      contact: 'VBMS Support Portal'
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'TKT-2024-001',
      title: 'Unable to access eFolder documents',
      description: 'Documents are not loading in the eFolder viewer. Getting timeout errors when trying to open PDF files.',
      category: 'Technical Issue',
      priority: 'high',
      status: 'in-progress',
      createdDate: '2024-01-12T09:15:00Z',
      lastUpdated: '2024-01-13T14:30:00Z',
      assignedTo: 'Tech Support - Level 2',
      responses: 3
    },
    {
      id: 'TKT-2024-002',
      title: 'RUMEV1 AI not providing recommendations',
      description: 'The AI analysis is not appearing for new claims. The "Analyze with RUMEV1" button is not responding.',
      category: 'AI/ML Tools',
      priority: 'medium',
      status: 'waiting',
      createdDate: '2024-01-10T16:42:00Z',
      lastUpdated: '2024-01-12T11:20:00Z',
      assignedTo: 'AI Support Team',
      responses: 2
    },
    {
      id: 'TKT-2024-003',
      title: 'Request for additional user permissions',
      description: 'Need access to quality review functions for new role assignment. Current permissions do not include QA modules.',
      category: 'Access Request',
      priority: 'low',
      status: 'resolved',
      createdDate: '2024-01-08T13:25:00Z',
      lastUpdated: '2024-01-10T09:45:00Z',
      assignedTo: 'Access Management',
      responses: 4
    },
    {
      id: 'TKT-2024-004',
      title: 'System performance slow during peak hours',
      description: 'VBMS is significantly slower between 10 AM - 2 PM. Pages take 10+ seconds to load.',
      category: 'Performance',
      priority: 'medium',
      status: 'open',
      createdDate: '2024-01-15T08:30:00Z',
      lastUpdated: '2024-01-15T08:30:00Z',
      responses: 0
    }
  ];

  const categories = [
    { value: 'technical', label: 'Technical Issue', description: 'System errors, bugs, or technical problems' },
    { value: 'access', label: 'Access Request', description: 'Permission changes or account access issues' },
    { value: 'training', label: 'Training Support', description: 'Help with system usage or training materials' },
    { value: 'ai', label: 'AI/ML Tools', description: 'RUMEV1 AI system or machine learning features' },
    { value: 'performance', label: 'Performance', description: 'System speed or performance concerns' },
    { value: 'integration', label: 'Integration', description: 'External system connections or data sync issues' },
    { value: 'other', label: 'Other', description: 'General questions or other support needs' }
  ];

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = searchTerm === '' || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400 bg-blue-400/10';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10';
      case 'waiting': return 'text-purple-400 bg-purple-400/10';
      case 'resolved': return 'text-emerald-400 bg-emerald-400/10';
      case 'closed': return 'text-slate-400 bg-slate-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate ticket submission
    setShowTicketModal(false);
    setTicketForm({ title: '', description: '', category: 'technical', priority: 'medium' });
    // In real implementation, this would make an API call
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="support"
          title="Contact Support"
          description="Comprehensive support system with multiple contact methods, ticket tracking, and self-service resources to help resolve issues quickly and efficiently."
          features={[
            "Multiple contact channels including phone, email, and live chat",
            "Ticket tracking system with priority and status management",
            "Self-service resources and knowledge base integration",
            "Real-time support availability and response time information"
          ]}
          demoActions={[
            { label: "View Contact Methods", action: () => setActiveTab('contact') },
            { label: "Create Support Ticket", action: () => setShowTicketModal(true) },
            { label: "Check Ticket Status", action: () => setActiveTab('tickets') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Contact Support</h1>
                  <p className="text-sm text-slate-500">Technical Support & Help Desk</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-sm font-medium">Support Available</span>
                  </div>
                  <div className="text-xs text-slate-500">Monday - Friday, 7:00 AM - 7:00 PM ET</div>
                </div>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Ticket
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Support Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Avg Response Time</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  2.3 hrs
                </div>
                <div className="text-xs text-emerald-300/70">For all support channels</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Open Tickets</h3>
                  <span className="text-2xl">🎫</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {supportTickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length}
                </div>
                <div className="text-xs text-blue-300/70">Currently active</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Resolution Rate</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  94.2%
                </div>
                <div className="text-xs text-purple-300/70">First contact resolution</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Satisfaction</h3>
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  4.7/5
                </div>
                <div className="text-xs text-yellow-300/70">Average user rating</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Contact Methods
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'tickets'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                My Tickets
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'resources'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Self-Service Resources
              </button>
            </div>

            {/* Contact Methods Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-slate-100 mb-2">Get the Help You Need</h2>
                  <p className="text-slate-400">Choose the support method that works best for your situation</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {contactMethods.map((method) => (
                    <div key={method.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-100 mb-2">{method.title}</h3>
                          <p className="text-slate-400 mb-4">{method.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500 text-sm">Availability:</span>
                              <span className="text-slate-300 text-sm">{method.availability}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500 text-sm">Response Time:</span>
                              <span className="text-emerald-400 text-sm font-medium">{method.responseTime}</span>
                            </div>
                          </div>
                          
                          <div className="bg-slate-800 rounded-lg p-3 mb-4">
                            <p className="text-blue-400 font-mono text-sm">{method.contact}</p>
                          </div>
                          
                          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                            {method.id === 'phone' ? 'Call Now' :
                             method.id === 'email' ? 'Send Email' :
                             method.id === 'chat' ? 'Start Chat' : 'Open Portal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Emergency Support</h3>
                  <p className="text-slate-300 mb-4">
                    For system outages or critical issues affecting multiple users, contact our emergency hotline:
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-mono font-semibold">
                      🚨 1-800-VA-EMRG1 (1-800-823-6741)
                    </div>
                    <span className="text-slate-400 text-sm">Available 24/7 for critical issues</span>
                  </div>
                </div>
              </div>
            )}

            {/* My Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-slate-100">My Support Tickets</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tickets..."
                        className="w-64 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <svg className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id} className="p-6 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-100">{ticket.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-slate-400 mb-3">{ticket.description}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-slate-500">Ticket ID</p>
                                <p className="text-sm font-mono text-slate-300">{ticket.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Category</p>
                                <p className="text-sm text-slate-300">{ticket.category}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Assigned To</p>
                                <p className="text-sm text-slate-300">{ticket.assignedTo || 'Unassigned'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>Created: {new Date(ticket.createdDate).toLocaleString()}</span>
                              <span>Updated: {new Date(ticket.lastUpdated).toLocaleString()}</span>
                              <span>{ticket.responses} response{ticket.responses !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredTickets.length === 0 && (
                      <div className="p-12 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <p className="mb-4">No support tickets found.</p>
                        <button
                          onClick={() => setShowTicketModal(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                          Create Your First Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Self-Service Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-slate-100 mb-2">Self-Service Resources</h2>
                  <p className="text-slate-400">Find answers and solve common issues on your own</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/help" className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Help Center</h3>
                    <p className="text-slate-400 text-sm mb-4">Comprehensive guides and tutorials for all VBMS features</p>
                    <span className="text-blue-400 text-sm hover:underline">Browse Articles →</span>
                  </Link>
                  
                  <Link href="/docs" className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="text-4xl mb-4">📖</div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Documentation</h3>
                    <p className="text-slate-400 text-sm mb-4">Technical documentation and API references</p>
                    <span className="text-blue-400 text-sm hover:underline">View Documentation →</span>
                  </Link>
                  
                  <Link href="/training" className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors">
                    <div className="text-4xl mb-4">🎓</div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Training Center</h3>
                    <p className="text-slate-400 text-sm mb-4">Interactive training modules and certification programs</p>
                    <span className="text-blue-400 text-sm hover:underline">Start Learning →</span>
                  </Link>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Common Issues & Quick Fixes</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="text-slate-200 font-medium mb-2">🔐 Login Issues</h4>
                      <p className="text-slate-400 text-sm mb-2">Can't access VBMS or having PIV card problems?</p>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Ensure PIV card is properly inserted</li>
                        <li>• Try a different card reader</li>
                        <li>• Clear browser cache and cookies</li>
                        <li>• Contact your local IT support for card issues</li>
                      </ul>
                    </div>
                    
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="text-slate-200 font-medium mb-2">🐌 Slow Performance</h4>
                      <p className="text-slate-400 text-sm mb-2">System running slowly or timing out?</p>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Close unnecessary browser tabs</li>
                        <li>• Clear browser cache</li>
                        <li>• Check your internet connection</li>
                        <li>• Try using a different browser</li>
                      </ul>
                    </div>
                    
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="text-slate-200 font-medium mb-2">📄 Document Issues</h4>
                      <p className="text-slate-400 text-sm mb-2">Documents not loading or displaying incorrectly?</p>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Refresh the page</li>
                        <li>• Try a different browser</li>
                        <li>• Check if Adobe Acrobat is up to date</li>
                        <li>• Contact support if documents are consistently failing</li>
                      </ul>
                    </div>
                    
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="text-slate-200 font-medium mb-2">🤖 AI/RUMEV1 Issues</h4>
                      <p className="text-slate-400 text-sm mb-2">RUMEV1 AI not working or providing unexpected results?</p>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Ensure sufficient medical evidence is available</li>
                        <li>• Check that claim conditions are properly coded</li>
                        <li>• Review AI confidence scores before proceeding</li>
                        <li>• Override AI recommendations when clinically appropriate</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Still Need Help?</h3>
                  <p className="text-slate-300 mb-4">
                    If you can't find the answer you're looking for in our self-service resources, don't hesitate to contact our support team.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                    >
                      Contact Support
                    </button>
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Create Ticket Modal */}
        {showTicketModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-2xl border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-slate-100">Create Support Ticket</h2>
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmitTicket} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Issue Title</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {categories.find(c => c.value === ticketForm.category)?.description}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low - General questions or minor issues</option>
                    <option value="medium">Medium - Standard support request</option>
                    <option value="high">High - Urgent issue affecting work</option>
                    <option value="critical">Critical - System down or major blocker</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
                  <textarea
                    required
                    rows={6}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Please provide a detailed description of the issue, including:
• What you were trying to do
• What happened instead
• Any error messages you saw
• Steps to reproduce the issue
• Your browser and operating system"
                  />
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-slate-200 font-medium mb-2">Before submitting:</h4>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>✓ Have you tried the basic troubleshooting steps?</li>
                    <li>✓ Have you checked our Help Center for similar issues?</li>
                    <li>✓ Do you have any screenshots or error messages to attach?</li>
                  </ul>
                </div>
                
                <div className="flex space-x-4 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Submit Support Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}