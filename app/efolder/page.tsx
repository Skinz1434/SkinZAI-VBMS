'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import { expandedMockDatabase } from '../lib/expandedMockData';
import { Document } from '../lib/mockData';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const DocumentViewer = ({ document, onClose }: DocumentViewerProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{document.title}</h3>
          <p className="text-sm text-slate-400">{document.veteranName} • {document.fileNumber}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Document Type</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                document.type === 'Service Medical Records' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : document.type === 'VA Medical Records'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}>
                {document.type}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Pages</label>
              <p className="text-slate-200">{document.pages} pages • {document.size}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Source</label>
              <p className="text-slate-200">{document.source}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Review Status</label>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${document.reviewed ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                <span className="text-slate-200">
                  {document.reviewed ? 'Reviewed' : 'Pending Review'}
                </span>
              </div>
              {document.reviewed && document.reviewedBy && (
                <p className="text-sm text-slate-400 mt-1">
                  Reviewed by {document.reviewedBy} on {new Date(document.reviewDate!).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {document.ocrProcessed && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">OCR Processing</label>
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 text-sm">✓ Processed</span>
                    <span className="text-sm text-slate-400">{document.ocrConfidence}% confidence</span>
                  </div>
                  {document.extractedData && (
                    <div className="text-xs text-slate-400 space-y-1">
                      {Object.entries(document.extractedData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-slate-200">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Document Summary</label>
          <p className="text-sm text-slate-300 leading-relaxed">{document.summary}</p>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Download PDF
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            View in S3
          </button>
          {!document.reviewed && (
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
              Mark as Reviewed
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function EFolderPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVeteran, setFilterVeteran] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const documents = expandedMockDatabase.documents;
  const veterans = expandedMockDatabase.veterans;

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || doc.type.toLowerCase() === filterType.toLowerCase();
    const matchesCategory = filterCategory === 'all' || doc.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesVeteran = filterVeteran === 'all' || doc.veteranId === filterVeteran;
    
    return matchesSearch && matchesType && matchesCategory && matchesVeteran;
  });

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      'Service Medical Records': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'VA Medical Records': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Personnel Records': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'C&P Exam Report': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'DBQ Form': 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    };
    return colors[type] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
      {selectedDocument && (
        <DocumentViewer 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
      
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
                <h1 className="text-lg font-semibold text-slate-100">Digital eFolder System</h1>
                <p className="text-sm text-slate-500">Veterans Affairs Document Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                {filteredDocuments.length} of {documents.length} documents
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Document Search & Filters</h2>
            
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Search Documents</label>
                <input
                  type="text"
                  placeholder="Search by title, veteran, file number, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Document Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="service medical records">Service Medical Records</option>
                  <option value="va medical records">VA Medical Records</option>
                  <option value="personnel records">Personnel Records</option>
                  <option value="c&p exam report">C&P Exam Report</option>
                  <option value="dbq form">DBQ Form</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="medical">Medical</option>
                  <option value="administrative">Administrative</option>
                  <option value="evidence">Evidence</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Veteran</label>
                <select
                  value={filterVeteran}
                  onChange={(e) => setFilterVeteran(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Veterans</option>
                  {veterans.map(veteran => (
                    <option key={veteran.id} value={veteran.id}>
                      {veteran.name} ({veteran.fileNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-slate-100">{documents.length}</p>
                <p className="text-sm text-slate-400">Total Documents</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-emerald-400">
                  {documents.filter(d => d.ocrProcessed).length}
                </p>
                <p className="text-sm text-slate-400">OCR Processed</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-blue-400">
                  {documents.filter(d => d.reviewed).length}
                </p>
                <p className="text-sm text-slate-400">Reviewed</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-2xl font-semibold text-purple-400">
                  {Math.round(documents.reduce((acc, d) => acc + d.pages, 0) / 1000)}K
                </p>
                <p className="text-sm text-slate-400">Total Pages</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredDocuments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400">No documents found matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedDocument(document)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2 leading-snug">
                          {document.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDocumentTypeColor(document.type)}`}>
                            {document.type}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className={`w-3 h-3 rounded-full ${document.reviewed ? 'bg-emerald-400' : 'bg-yellow-400'}`}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Veteran:</span>
                        <span className="text-slate-200 font-medium">{document.veteranName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">File #:</span>
                        <span className="text-slate-200 font-mono text-xs">{document.fileNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Pages:</span>
                        <span className="text-slate-200">{document.pages} • {document.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Source:</span>
                        <span className="text-slate-200 text-xs">{document.source}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-slate-400 line-clamp-3">
                        {document.summary}
                      </p>
                    </div>
                    
                    {document.ocrProcessed && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400">✓ OCR Processed</span>
                        <span className="text-slate-400">{document.ocrConfidence}% confidence</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {document.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {document.tags.length > 3 && (
                        <span className="text-xs text-slate-500">+{document.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
