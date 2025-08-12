'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EFolderManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Comprehensive eFolder documents data for Jordan R. Sampleton
  const veteranDocuments = [
    {
      id: 'DOC-2025-081201',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      documentType: 'Service Medical Records',
      category: 'Medical',
      title: 'Navy Medical Records - PTSD Diagnosis',
      uploadDate: '2025-07-15',
      receivedDate: '2025-07-12',
      pages: 47,
      size: '12.3 MB',
      source: 'Navy Personnel Command',
      status: 'Processed',
      confidential: true,
      reviewedBy: 'Medical Examiner Thompson',
      tags: ['PTSD', 'Mental Health', 'Service Connected'],
      summary: 'Comprehensive medical records documenting PTSD diagnosis during active duty service including treatment history and symptom progression.',
      s3Path: 'veterans/F31605305/medical/navy-medical-records-2025.pdf'
    },
    {
      id: 'DOC-2025-081145',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      documentType: 'Private Medical Records',
      category: 'Medical',
      title: 'Civilian Therapy Records - Dr. Martinez',
      uploadDate: '2025-07-18',
      receivedDate: '2025-07-16',
      pages: 23,
      size: '5.7 MB',
      source: 'Private Provider',
      status: 'Under Review',
      confidential: true,
      reviewedBy: 'Rating Specialist Johnson',
      tags: ['PTSD', 'Therapy', 'Private Treatment'],
      summary: 'Ongoing therapy records from civilian provider showing continued PTSD treatment and symptom management post-service.',
      s3Path: 'veterans/F31605305/medical/civilian-therapy-martinez-2025.pdf'
    },
    {
      id: 'DOC-2025-081089',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      documentType: 'Lay Statement',
      category: 'Supporting Evidence',
      title: 'Spouse Statement - Sarah Sampleton',
      uploadDate: '2025-07-20',
      receivedDate: '2025-07-19',
      pages: 3,
      size: '0.8 MB',
      source: 'Family Member',
      status: 'Processed',
      confidential: false,
      reviewedBy: 'Claims Processor Davis',
      tags: ['Lay Statement', 'Family', 'PTSD Symptoms'],
      summary: 'Detailed statement from spouse describing observed PTSD symptoms and their impact on daily life and relationships.',
      s3Path: 'veterans/F31605305/statements/spouse-statement-2025.pdf'
    },
    {
      id: 'DOC-2025-080923',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      documentType: 'Service Personnel Records',
      category: 'Service Records',
      title: 'DD-214 - Certificate of Release',
      uploadDate: '2025-07-10',
      receivedDate: '2025-07-08',
      pages: 2,
      size: '1.2 MB',
      source: 'Department of Navy',
      status: 'Processed',
      confidential: false,
      reviewedBy: 'Administrative Clerk Wilson',
      tags: ['DD-214', 'Discharge', 'Service History'],
      summary: 'Official military discharge document confirming honorable service from 2002-2014 with deployment history.',
      s3Path: 'veterans/F31605305/service/dd214-2025.pdf'
    },
    {
      id: 'DOC-2025-080856',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      documentType: 'MRI Report',
      category: 'Medical',
      title: 'Lower Back MRI - Regional Medical Center',
      uploadDate: '2025-07-22',
      receivedDate: '2025-07-21',
      pages: 8,
      size: '15.4 MB',
      source: 'Regional Medical Center',
      status: 'Pending Review',
      confidential: true,
      reviewedBy: null,
      tags: ['MRI', 'Back Condition', 'Imaging'],
      summary: 'Recent MRI imaging of lumbar spine showing degenerative disc disease consistent with service-connected back strain.',
      s3Path: 'veterans/F31605305/medical/mri-lower-back-2025.pdf'
    },
    {
      id: 'DOC-2025-080734',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      documentType: 'Audiometry Report',
      category: 'Medical',
      title: 'Hearing Test Results - VA Medical Center',
      uploadDate: '2025-07-14',
      receivedDate: '2025-07-13',
      pages: 4,
      size: '2.1 MB',
      source: 'VA Medical Center Houston',
      status: 'Processed',
      confidential: true,
      reviewedBy: 'Audiologist Roberts',
      tags: ['Hearing Loss', 'Tinnitus', 'C&P Exam'],
      summary: 'Comprehensive audiometry examination confirming bilateral hearing loss and tinnitus consistent with military noise exposure.',
      s3Path: 'veterans/F31605305/medical/audiometry-2025.pdf'
    }
  ];

  // Filter documents
  const filteredDocuments = veteranDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || doc.category.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortBy === 'type') {
      return a.documentType.localeCompare(b.documentType);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Processed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Under Review': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Pending Review': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Medical': '🏥',
      'Service Records': '🎖️',
      'Supporting Evidence': '📝'
    };
    return icons[category] || '📄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 neural-grid opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Professional Header */}
      <header className="relative z-50 glass-strong border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* VA Logo & System Name */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg mirror-effect group-hover:scale-110 transition-all duration-300">
                <div className="text-white font-bold text-xl">VA</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-display group-hover:text-emerald-400 transition-colors">
                  eFolder Management
                </h1>
                <p className="text-sm text-slate-400 font-medium">Digital Document Management System</p>
              </div>
            </Link>

            {/* System Status & Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 group">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">Document System Online</span>
                  <div className="group-hover:visible invisible bg-slate-800 text-white text-xs px-3 py-1 rounded-lg absolute top-full mt-2 whitespace-nowrap">
                    eFolder system fully operational
                  </div>
                </div>
                <div className="text-slate-400 font-mono border-l border-slate-600 pl-4">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-4">
                {[
                  { name: 'Dashboard', icon: '📊', href: '/dashboard' },
                  { name: 'Analytics', icon: '📈', href: '/analytics' },
                  { name: 'Claims', icon: '📋', href: '/claims' },
                  { name: 'eFolder', icon: '📁', href: '/efolder', active: true },
                  { name: 'Orchestration', icon: '🤖', href: '/orchestration' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center space-x-2 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg ${
                      item.active 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5 hover:shadow-lg'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Enhanced Tooltip */}
                    <div className="invisible group-hover:visible absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-2xl border border-slate-600 whitespace-nowrap z-50">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-slate-400">
                        {item.name === 'Dashboard' ? 'System overview & metrics' :
                         item.name === 'Analytics' ? 'Performance analytics' :
                         item.name === 'Claims' ? 'Active claims management' :
                         item.name === 'eFolder' ? 'Document management' :
                         'AI agent orchestration'}
                      </div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600 rotate-45"></div>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Enhanced Header Section */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="glass-strong rounded-3xl p-8 border border-slate-700/50 mb-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 font-display">
                  Veteran eFolder Management
                </h2>
                <p className="text-slate-400 text-lg">
                  Comprehensive digital document management for veteran Jordan R. Sampleton (F31605305)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    {sortedDocuments.length}
                  </div>
                  <div className="text-slate-400 text-sm">Total Documents</div>
                </div>
                <button className="group skinzai-button px-6 py-3 hover:shadow-2xl">
                  <div className="flex items-center space-x-2">
                    <span>Upload Document</span>
                    <svg className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Enhanced Search and Filter Controls */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Search Documents</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search by title, type, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Filter by Category</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="medical">Medical Records</option>
                  <option value="service records">Service Records</option>
                  <option value="supporting evidence">Supporting Evidence</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300"
                >
                  <option value="date">Upload Date</option>
                  <option value="type">Document Type</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Documents List */}
        <section className="max-w-7xl mx-auto px-6 mb-6">
          <div className="space-y-4">
            {sortedDocuments.map((document) => (
              <div
                key={document.id}
                className="group glass-strong rounded-3xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer"
                onClick={() => setSelectedDocument(document)}
              >
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Document Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">{getCategoryIcon(document.category)}</div>
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                          {document.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{document.documentType}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Document ID:</span>
                        <span className="text-white font-mono">{document.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Source:</span>
                        <span className="text-white">{document.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pages/Size:</span>
                        <span className="text-white">{document.pages} pages • {document.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status & Dates */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                        {document.status}
                      </div>
                      {document.confidential && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Confidential
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400">Uploaded:</span>
                        <p className="text-white">{new Date(document.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Received:</span>
                        <p className="text-white">{new Date(document.receivedDate).toLocaleDateString()}</p>
                      </div>
                      {document.reviewedBy && (
                        <div>
                          <span className="text-slate-400">Reviewed by:</span>
                          <p className="text-white text-xs">{document.reviewedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tags & Actions */}
                  <div>
                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full border border-slate-600/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-lg text-sm hover:bg-emerald-500/30 transition-all">
                        View
                      </button>
                      <button className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-all">
                        Download
                      </button>
                    </div>
                    
                    <div className="mt-3 text-xs text-slate-400">
                      <p className="truncate">Path: {document.s3Path}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Enhanced Floating Actions */}
      <div className="fixed bottom-8 right-8 z-50 space-y-4">
        {/* Document Scanner */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-emerald-600 to-green-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600 shadow-2xl">
            <div className="font-semibold">Document Scanner</div>
            <div className="text-slate-400 text-xs">Scan & upload documents</div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="group relative">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 mirror-effect">
            <div className="relative">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600 shadow-2xl">
            <div className="font-semibold">Document AI Assistant</div>
            <div className="text-slate-400 text-xs">Smart document analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
}