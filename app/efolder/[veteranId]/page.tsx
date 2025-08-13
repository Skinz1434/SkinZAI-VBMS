'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';
import { massiveMockDatabase } from '../../lib/massiveMockData';
import { DocumentMetadata } from '../../lib/documentDatabase';

export default function VeteranEFolder() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [veteran, setVeteran] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMetadata | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'relevance' | 'type'>('date');
  const [filterReviewed, setFilterReviewed] = useState<'all' | 'reviewed' | 'unreviewed'>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('list');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [ocrProcessing, setOcrProcessing] = useState(false);

  useEffect(() => {
    const veteranId = params.veteranId as string;
    const veteranData = massiveMockDatabase.veterans.find(v => v.id === veteranId);
    
    if (veteranData) {
      setVeteran(veteranData);
      // Get comprehensive documents for this veteran
      const veteranDocs = massiveMockDatabase.comprehensiveDocuments.filter(
        doc => doc.veteranId === veteranId
      );
      setDocuments(veteranDocs);
      
      // Check if specific document was requested
      const docId = searchParams.get('doc');
      if (docId) {
        const doc = veteranDocs.find(d => d.id === docId);
        if (doc) setSelectedDoc(doc);
      }
    }
    
    setIsLoaded(true);
  }, [params.veteranId, searchParams]);

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesReviewStatus = filterReviewed === 'all' ||
        (filterReviewed === 'reviewed' && doc.reviewStatus === 'reviewed') ||
        (filterReviewed === 'unreviewed' && doc.reviewStatus === 'unreviewed');
      
      return matchesCategory && matchesSearch && matchesReviewStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime();
      }
    });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(documents.map(doc => doc.category)))];

  // Calculate statistics
  const stats = {
    totalDocuments: documents.length,
    totalPages: documents.reduce((acc, doc) => acc + doc.pages, 0),
    reviewedCount: documents.filter(d => d.reviewStatus === 'reviewed').length,
    averageRelevance: Math.round(
      documents.reduce((acc, doc) => acc + (doc.relevanceScore || 0), 0) / 
      documents.filter(d => d.relevanceScore).length || 1
    )
  };

  const performOCR = (doc: DocumentMetadata) => {
    setOcrProcessing(true);
    setTimeout(() => {
      // Simulate OCR processing
      doc.ocrStatus = 'completed';
      setOcrProcessing(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'reviewed': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      'unreviewed': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      'flagged': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
      'verified': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' }
    };
    return badges[status] || badges['unreviewed'];
  };

  const getDocumentIcon = (type: string) => {
    const icons: any = {
      'DD214': '🎖️',
      'Service Treatment Record': '⚕️',
      'VA Medical Record': '🏥',
      'Private Medical Record': '📋',
      'C&P Exam': '🔍',
      'DBQ': '📝',
      'Nexus Letter': '🔗',
      'Buddy Statement': '👥',
      'Personnel Record': '📁',
      'VA Decision': '⚖️',
      'Imaging Report': '🔬',
      'Lab Report': '🧪',
      'Mental Health Note': '🧠',
      'Pharmacy Records': '💊'
    };
    return icons[type] || '📄';
  };

  if (!veteran) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-100 mb-2">eFolder Not Found</h1>
            <p className="text-slate-400 mb-4">The requested eFolder could not be located.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
            >
              Return Home
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="text-slate-200">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-100">Electronic Folder (eFolder)</h1>
                <p className="text-sm text-slate-500">{veteran.name} • {veteran.fileNumber} • {stats.totalDocuments} Documents</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/veteran/${veteran.id}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                >
                  View Profile
                </Link>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Statistics Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">{stats.totalDocuments}</p>
                <p className="text-sm text-slate-400">Total Documents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.totalPages}</p>
                <p className="text-sm text-slate-400">Total Pages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.reviewedCount}</p>
                <p className="text-sm text-slate-400">Reviewed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.averageRelevance}%</p>
                <p className="text-sm text-slate-400">Avg Relevance</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'relevance' | 'type')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
                >
                  <option value="date">Sort by Date</option>
                  <option value="relevance">Sort by Relevance</option>
                  <option value="type">Sort by Type</option>
                </select>
              </div>
              <div>
                <select
                  value={filterReviewed}
                  onChange={(e) => setFilterReviewed(e.target.value as 'all' | 'reviewed' | 'unreviewed')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
                >
                  <option value="all">All Documents</option>
                  <option value="reviewed">Reviewed Only</option>
                  <option value="unreviewed">Unreviewed Only</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                  {category !== 'all' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({documents.filter(d => d.category === category).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Document List */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-100">
                    Documents ({filteredDocuments.length})
                  </h2>
                  <div className="flex items-center space-x-2">
                    {['list', 'grid', 'timeline'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode as 'grid' | 'list' | 'timeline')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === mode
                            ? 'bg-slate-700 text-slate-200'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {mode === 'list' && '☰'}
                        {mode === 'grid' && '⊞'}
                        {mode === 'timeline' && '📅'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  {filteredDocuments.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No documents found matching your criteria.
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4 p-4' : 'space-y-2 p-4'}>
                      {filteredDocuments.map(doc => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc)}
                          className={`bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all cursor-pointer ${
                            selectedDoc?.id === doc.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                              <div className="flex-1">
                                <h3 className="font-medium text-slate-200 text-sm mb-1">
                                  {doc.title}
                                </h3>
                                <p className="text-xs text-slate-400">
                                  {doc.type} • {doc.pages} pages • {doc.fileSize}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(doc.documentDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className={`px-2 py-1 text-xs rounded border ${getStatusBadge(doc.reviewStatus).bg} ${getStatusBadge(doc.reviewStatus).text} ${getStatusBadge(doc.reviewStatus).border}`}>
                                {doc.reviewStatus}
                              </span>
                              {doc.relevanceScore && (
                                <span className="text-xs text-slate-400">
                                  {doc.relevanceScore}% relevant
                                </span>
                              )}
                            </div>
                          </div>

                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 3 && (
                                <span className="text-xs text-slate-500">+{doc.tags.length - 3}</span>
                              )}
                            </div>
                          )}

                          {doc.extractedData && (
                            <div className="mt-2 pt-2 border-t border-slate-700">
                              {doc.extractedData.diagnoses && (
                                <p className="text-xs text-slate-400">
                                  <span className="text-slate-500">Diagnoses:</span> {doc.extractedData.diagnoses.slice(0, 2).join(', ')}
                                </p>
                              )}
                              {doc.extractedData.serviceConnection && (
                                <p className="text-xs text-emerald-400 mt-1">
                                  ✓ Service Connection Established
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Preview/Details */}
            <div className="lg:col-span-1">
              {selectedDoc ? (
                <div className="bg-slate-900 border border-slate-800 rounded-lg sticky top-24">
                  <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-100">Document Details</h3>
                      <button
                        onClick={() => setSelectedDoc(null)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-slate-400">{selectedDoc.title}</p>
                  </div>

                  <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                    {/* Document Metadata */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Type:</span>
                        <span className="text-slate-200">{selectedDoc.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-200">{selectedDoc.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Source:</span>
                        <span className="text-slate-200">{selectedDoc.source}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Document Date:</span>
                        <span className="text-slate-200">
                          {new Date(selectedDoc.documentDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Upload Date:</span>
                        <span className="text-slate-200">
                          {new Date(selectedDoc.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Pages:</span>
                        <span className="text-slate-200">{selectedDoc.pages}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">File Size:</span>
                        <span className="text-slate-200">{selectedDoc.fileSize}</span>
                      </div>
                    </div>

                    {/* OCR Status */}
                    <div className="bg-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">OCR Status</span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          selectedDoc.ocrStatus === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : selectedDoc.ocrStatus === 'processing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {selectedDoc.ocrStatus}
                        </span>
                      </div>
                      {selectedDoc.ocrStatus !== 'completed' && (
                        <button
                          onClick={() => performOCR(selectedDoc)}
                          disabled={ocrProcessing}
                          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors disabled:opacity-50"
                        >
                          {ocrProcessing ? 'Processing...' : 'Run OCR'}
                        </button>
                      )}
                    </div>

                    {/* Extracted Data */}
                    {selectedDoc.extractedData && (
                      <div className="bg-slate-800 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Extracted Information</h4>
                        
                        {selectedDoc.extractedData.diagnoses && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Diagnoses:</p>
                            <div className="space-y-1">
                              {selectedDoc.extractedData.diagnoses.map((diagnosis, i) => (
                                <div key={i} className="text-xs text-slate-300 bg-slate-700 rounded px-2 py-1">
                                  {diagnosis}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedDoc.extractedData.medications && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Medications:</p>
                            <div className="space-y-1">
                              {selectedDoc.extractedData.medications.slice(0, 3).map((med, i) => (
                                <div key={i} className="text-xs text-slate-300">
                                  <span className="font-medium">{med.name}</span> - {med.dosage}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedDoc.extractedData.disabilities && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Disability Ratings:</p>
                            <div className="space-y-1">
                              {selectedDoc.extractedData.disabilities.map((disability, i) => (
                                <div key={i} className="text-xs text-slate-300 bg-slate-700 rounded px-2 py-1">
                                  {disability.condition}: <span className="font-medium text-emerald-400">{disability.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedDoc.extractedData.serviceConnection && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Service Connection:</p>
                            {selectedDoc.extractedData.serviceConnection.map((conn, i) => (
                              <div key={i} className="text-xs bg-emerald-900/20 border border-emerald-700/50 rounded p-2 mt-1">
                                <p className="text-emerald-400 font-medium">{conn.condition}</p>
                                <p className="text-slate-400 mt-1">Type: {conn.connectionType}</p>
                                <p className="text-slate-400">Basis: {conn.evidenceBasis}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Notes */}
                    {selectedDoc.reviewNotes && (
                      <div className="bg-slate-800 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Review Notes</h4>
                        <p className="text-xs text-slate-400">{selectedDoc.reviewNotes}</p>
                        {selectedDoc.reviewedBy && (
                          <p className="text-xs text-slate-500 mt-2">
                            Reviewed by: {selectedDoc.reviewedBy}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                        View Full Document
                      </button>
                      <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm">
                        Download PDF
                      </button>
                      {showAnnotations && (
                        <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm">
                          Add Annotation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-slate-400">Select a document to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </main>
      </div>
    </AppLayout>
  );
}