'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import { massiveMockDatabase } from '../lib/massiveMockData';
import { DocumentMetadata } from '../lib/documentDatabase';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMetadata | null>(null);
  const [bulkActions, setBulkActions] = useState<string[]>([]);

  useEffect(() => {
    setDocuments(massiveMockDatabase.comprehensiveDocuments);
    setIsLoaded(true);
  }, []);

  const documentTypes = Array.from(new Set(documents.map(d => d.type)));
  
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesStatus = filterStatus === 'all' || doc.reviewStatus === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date': return new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime();
        case 'relevance': return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        case 'name': return a.title.localeCompare(b.title);
        case 'size': return parseInt(b.fileSize) - parseInt(a.fileSize);
        default: return 0;
      }
    });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'reviewed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'verified': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'unreviewed': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  const getDocIcon = (type: string) => {
    const icons: any = {
      'DD214': '🎖️',
      'Service Treatment Record': '⚕️',
      'VA Medical Record': '🏥',
      'C&P Exam': '🔍',
      'DBQ': '📝',
      'Nexus Letter': '🔗',
      'Private Medical Record': '📋',
      'Imaging Report': '🔬',
      'Lab Report': '🧪'
    };
    return icons[type] || '📄';
  };

  const handleBulkAction = (action: string) => {
    switch(action) {
      case 'review':
        console.log('Marking selected documents as reviewed');
        break;
      case 'export':
        console.log('Exporting selected documents');
        break;
      case 'archive':
        console.log('Archiving selected documents');
        break;
    }
    setBulkActions([]);
  };

  const toggleBulkSelect = (docId: string) => {
    setBulkActions(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  // Calculate statistics
  const stats = {
    total: documents.length,
    reviewed: documents.filter(d => d.reviewStatus === 'reviewed' || d.reviewStatus === 'verified').length,
    pages: documents.reduce((acc, d) => acc + d.pages, 0),
    avgRelevance: Math.round(documents.reduce((acc, d) => acc + (d.relevanceScore || 0), 0) / documents.filter(d => d.relevanceScore).length)
  };

  return (
    <AppLayout>
      <div className={`p-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Document Management</h1>
          <p className="text-slate-400">Centralized document review and processing system</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border border-blue-600/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📄</span>
              <span className="text-xs text-blue-400">All Documents</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.total.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Total Documents</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 border border-emerald-600/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-xs text-emerald-400">{Math.round(stats.reviewed / stats.total * 100)}%</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.reviewed.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Reviewed</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-600/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📑</span>
              <span className="text-xs text-purple-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.pages.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Pages Processed</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 border border-amber-600/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xs text-amber-400">Average</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.avgRelevance}%</p>
            <p className="text-sm text-slate-400">Relevance Score</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
          <div className="grid md:grid-cols-5 gap-4 mb-4">
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
              >
                <option value="all">All Types</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
              >
                <option value="all">All Status</option>
                <option value="reviewed">Reviewed</option>
                <option value="verified">Verified</option>
                <option value="unreviewed">Unreviewed</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
              >
                <option value="date">Sort by Date</option>
                <option value="relevance">Sort by Relevance</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {bulkActions.length > 0 && (
            <div className="flex items-center space-x-4 pt-4 border-t border-slate-800">
              <span className="text-sm text-slate-400">{bulkActions.length} selected</span>
              <button
                onClick={() => handleBulkAction('review')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
              >
                Export
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => setBulkActions([])}
                className="px-3 py-1 text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Documents Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 border-b border-slate-800">
                <h2 className="font-semibold text-slate-100">
                  {filteredDocuments.length} Documents
                </h2>
              </div>
              
              <div className="max-h-[800px] overflow-y-auto">
                {filteredDocuments.slice(0, 50).map((doc) => (
                  <div
                    key={doc.id}
                    className="border-b border-slate-800 p-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={bulkActions.includes(doc.id)}
                        onChange={() => toggleBulkSelect(doc.id)}
                        className="mt-1 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                      />
                      
                      {/* Icon */}
                      <span className="text-2xl">{getDocIcon(doc.type)}</span>
                      
                      {/* Document Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-slate-200 hover:text-blue-400 cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                              {doc.title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">
                              {doc.type} • {doc.pages} pages • {doc.fileSize}
                            </p>
                            <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
                              <Link href={`/veteran/${doc.veteranId}`} className="hover:text-blue-400">
                                {doc.veteranName}
                              </Link>
                              <span>•</span>
                              <span>{new Date(doc.documentDate).toLocaleDateString()}</span>
                              {doc.relevanceScore && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400">{doc.relevanceScore}% relevant</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(doc.reviewStatus)}`}>
                            {doc.reviewStatus}
                          </span>
                        </div>
                        
                        {/* Tags */}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-1">
            {selectedDoc ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg sticky top-6">
                <div className="p-4 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-100">Document Preview</h3>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4 max-h-[700px] overflow-y-auto">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">{selectedDoc.title}</h4>
                    <p className="text-xs text-slate-500">{selectedDoc.type}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Veteran:</span>
                      <Link href={`/veteran/${selectedDoc.veteranId}`} className="text-blue-400 hover:text-blue-300">
                        {selectedDoc.veteranName}
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Document Date:</span>
                      <span className="text-slate-300">{new Date(selectedDoc.documentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pages:</span>
                      <span className="text-slate-300">{selectedDoc.pages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">File Size:</span>
                      <span className="text-slate-300">{selectedDoc.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">OCR Status:</span>
                      <span className={`text-sm ${selectedDoc.ocrStatus === 'completed' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {selectedDoc.ocrStatus}
                      </span>
                    </div>
                  </div>
                  
                  {selectedDoc.extractedData && (
                    <div className="bg-slate-800 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Extracted Data</h4>
                      {selectedDoc.extractedData.diagnoses && (
                        <div className="mb-2">
                          <p className="text-xs text-slate-500 mb-1">Diagnoses:</p>
                          {selectedDoc.extractedData.diagnoses.map((d, i) => (
                            <span key={i} className="inline-block px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded mr-1 mb-1">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedDoc.extractedData.serviceConnection && (
                        <div>
                          <p className="text-xs text-emerald-400">✓ Service Connection Evidence</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Link
                      href={`/efolder/${selectedDoc.veteranId}?doc=${selectedDoc.id}`}
                      className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-center rounded-lg transition-colors text-sm"
                    >
                      View in eFolder
                    </Link>
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400">Select a document to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}