'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';
import { massiveMockDatabase } from '../../lib/massiveMockData';
import { DocumentMetadata } from '../../lib/documentDatabase';

export default function VeteranProfile() {
  const params = useParams();
  const router = useRouter();
  const [veteran, setVeteran] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [documentStats, setDocumentStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const veteranId = params.id as string;
    const veteranData = massiveMockDatabase.veterans.find(v => v.id === veteranId);
    
    if (veteranData) {
      setVeteran(veteranData);
      const veteranClaims = massiveMockDatabase.claims.filter(c => c.veteranId === veteranId);
      setClaims(veteranClaims);
      
      // Get comprehensive documents for this veteran
      const veteranDocs = massiveMockDatabase.comprehensiveDocuments.filter(
        (d: DocumentMetadata) => d.veteranId === veteranId
      );
      setDocuments(veteranDocs);
      
      // Calculate document statistics
      const stats = {
        totalDocuments: veteranDocs.length,
        totalPages: veteranDocs.reduce((acc: number, doc: DocumentMetadata) => acc + doc.pages, 0),
        reviewedCount: veteranDocs.filter((d: DocumentMetadata) => d.reviewStatus === 'reviewed').length,
        verifiedCount: veteranDocs.filter((d: DocumentMetadata) => d.authenticity === 'verified').length,
        categories: veteranDocs.reduce((acc: any, doc: DocumentMetadata) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1;
          return acc;
        }, {})
      };
      setDocumentStats(stats);
      
      // Store current veteran context
      localStorage.setItem('nova-current-veteran', JSON.stringify(veteranData));
    }
    
    setIsLoaded(true);
  }, [params.id]);

  if (!veteran) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-100 mb-2">Veteran Not Found</h1>
            <p className="text-slate-400 mb-4">The requested veteran profile could not be located.</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Inactive': return 'text-yellow-400';
      case 'Deceased': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Standard': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <AppLayout>
      <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Veteran Profile</h1>
            <p className="text-slate-400">{veteran.name} • {veteran.fileNumber}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${getStatusColor(veteran.status)}`}>
              {veteran.status}
            </span>
            <Link 
              href={`/efolder/${veteran.id}`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
            >
              View eFolder
            </Link>
          </div>
        </div>
        {/* Veteran Summary Header */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Veteran Photo & Basic Info */}
              <div className="md:col-span-1">
                <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center mb-4 border border-slate-700">
                  <span className="text-2xl font-semibold text-slate-300">
                    {veteran.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-100 mb-1">{veteran.name}</h2>
                <p className="text-sm text-slate-400 mb-2">{veteran.rank}</p>
                <p className="text-sm text-slate-500">{veteran.branch} • {veteran.serviceYears}</p>
              </div>

              {/* Service Information */}
              <div className="md:col-span-1">
                <h3 className="font-medium text-slate-100 mb-3">Service Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">File Number:</span>
                    <p className="text-slate-200 font-mono">{veteran.fileNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">MOS:</span>
                    <p className="text-slate-200">{veteran.mos}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Deployments:</span>
                    <p className="text-slate-200">{veteran.deployments.length} deployments</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Combat Service:</span>
                    <p className={veteran.combatService ? 'text-red-400' : 'text-slate-200'}>
                      {veteran.combatService ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Benefits */}
              <div className="md:col-span-1">
                <h3 className="font-medium text-slate-100 mb-3">Current Benefits</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Disability Rating:</span>
                    <p className="text-2xl font-bold text-emerald-400">{veteran.currentRating}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Monthly Compensation:</span>
                    <p className="text-lg font-semibold text-emerald-400">{veteran.monthlyCompensation}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Dependents:</span>
                    <p className="text-slate-200">{veteran.dependents}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="md:col-span-1">
                <h3 className="font-medium text-slate-100 mb-3">Profile Stats</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Active Claims:</span>
                    <p className="text-slate-200">{claims.length}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Documents:</span>
                    <p className="text-slate-200">{veteran.documentCount}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Last C&P Exam:</span>
                    <p className="text-slate-200">{new Date(veteran.lastC2PExam).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Flags */}
            {veteran.flags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-medium text-slate-100 mb-2">Special Considerations</h4>
                <div className="flex flex-wrap gap-2">
                  {veteran.flags.map((flag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-800 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'claims', name: 'Claims' },
                { id: 'documents', name: 'Documents' },
                { id: 'contact', name: 'Contact Info' },
                { id: 'history', name: 'History' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Service History */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Service History</h3>
                  <div className="space-y-4">
                    {veteran.deployments.map((deployment, index) => (
                      <div key={index} className="border-l-2 border-slate-700 pl-4">
                        <p className="text-slate-200">{deployment}</p>
                        <p className="text-xs text-slate-500">Deployment {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <div>
                        <p className="text-slate-200">Claim CL-2025-081201 updated</p>
                        <p className="text-xs text-slate-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <div>
                        <p className="text-slate-200">New document uploaded</p>
                        <p className="text-xs text-slate-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <div>
                        <p className="text-slate-200">Profile updated</p>
                        <p className="text-xs text-slate-500">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'claims' && (
              <div className="space-y-4">
                {claims.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                    <p className="text-slate-400">No active claims found.</p>
                  </div>
                ) : (
                  claims.map((claim) => (
                    <div key={claim.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-100">{claim.id}</h4>
                          <p className="text-sm text-slate-400">{claim.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getPriorityIcon(claim.priority)}</span>
                          <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Submitted:</span>
                          <p className="text-slate-200">{new Date(claim.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Days in Queue:</span>
                          <p className="text-slate-200">{claim.daysInQueue} days</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Exam Required:</span>
                          <p className={claim.examRequired ? 'text-red-400' : 'text-green-400'}>
                            {claim.examRequired ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <Link 
                          href={`/claims/${claim.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          View Claim Details →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-500">Address</label>
                      <div className="text-slate-200">
                        <p>{veteran.address.street}</p>
                        <p>{veteran.address.city}, {veteran.address.state} {veteran.address.zip}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500">Phone</label>
                      <p className="text-slate-200">{veteran.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500">Email</label>
                      <p className="text-slate-200">{veteran.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-500">Preferred Contact</label>
                      <p className="text-slate-200">{veteran.preferredContact}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500">Marital Status</label>
                      <p className="text-slate-200">{veteran.marriedStatus}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500">Date of Birth</label>
                      <p className="text-slate-200">{new Date(veteran.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Document Statistics */}
                {documentStats && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-100 mb-4">Document Overview</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <p className="text-2xl font-bold text-slate-100">{documentStats.totalDocuments}</p>
                        <p className="text-sm text-slate-400">Total Documents</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <p className="text-2xl font-bold text-emerald-400">{documentStats.totalPages}</p>
                        <p className="text-sm text-slate-400">Total Pages</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <p className="text-2xl font-bold text-blue-400">{documentStats.reviewedCount}</p>
                        <p className="text-sm text-slate-400">Reviewed</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <p className="text-2xl font-bold text-purple-400">{documentStats.verifiedCount}</p>
                        <p className="text-sm text-slate-400">Verified</p>
                      </div>
                    </div>
                    
                    {/* Document Categories */}
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <p className="text-sm font-medium text-slate-300 mb-3">Documents by Category</p>
                      <div className="grid md:grid-cols-3 gap-2">
                        {Object.entries(documentStats.categories).map(([category, count]) => (
                          <div key={category} className="flex justify-between text-sm">
                            <span className="text-slate-400">{category}:</span>
                            <span className="text-slate-200 font-medium">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Document List */}
                <div className="space-y-3">
                  {documents.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                      <p className="text-slate-400">No documents found.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-100">Medical Records & Evidence ({documents.length})</h3>
                        <Link 
                          href={`/efolder/${veteran.id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
                        >
                          Open Full eFolder →
                        </Link>
                      </div>
                      
                      {/* Group documents by type */}
                      {['DD214', 'Service Treatment Record', 'VA Medical Record', 'C&P Exam', 'DBQ', 'Nexus Letter', 'Private Medical Record', 'Imaging Report', 'Lab Report'].map(docType => {
                        const typeDocs = documents.filter((doc: any) => doc.type === docType);
                        if (typeDocs.length === 0) return null;
                        
                        return (
                          <div key={docType} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                            <h4 className="font-medium text-slate-100 mb-3 flex items-center justify-between">
                              <span>{docType} ({typeDocs.length})</span>
                              <span className="text-xs text-slate-500">
                                {typeDocs.reduce((acc: number, d: any) => acc + d.pages, 0)} pages
                              </span>
                            </h4>
                            
                            <div className="space-y-2">
                              {typeDocs.slice(0, 3).map((doc: any) => (
                                <div key={doc.id} className="bg-slate-800 border border-slate-700 rounded p-3 hover:border-slate-600 transition-colors">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-slate-200 mb-1">{doc.title}</p>
                                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                                        <span>{new Date(doc.documentDate).toLocaleDateString()}</span>
                                        <span>{doc.pages} pages</span>
                                        <span>{doc.fileSize}</span>
                                        {doc.relevanceScore && (
                                          <span className="text-emerald-400">{doc.relevanceScore}% relevant</span>
                                        )}
                                      </div>
                                      
                                      {doc.extractedData && (
                                        <div className="mt-2 text-xs">
                                          {doc.extractedData.diagnoses && (
                                            <p className="text-slate-500">
                                              Diagnoses: <span className="text-slate-300">{doc.extractedData.diagnoses.slice(0, 2).join(', ')}</span>
                                            </p>
                                          )}
                                          {doc.extractedData.serviceConnection && doc.extractedData.serviceConnection.length > 0 && (
                                            <p className="text-emerald-400 mt-1">✓ Service Connection Evidence</p>
                                          )}
                                          {doc.extractedData.disabilities && doc.extractedData.disabilities.length > 0 && (
                                            <p className="text-blue-400 mt-1">
                                              Rating: {doc.extractedData.disabilities[0].percentage}% - {doc.extractedData.disabilities[0].condition}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex flex-col items-end space-y-1">
                                      <span className={`px-2 py-0.5 text-xs rounded border ${
                                        doc.reviewStatus === 'reviewed' 
                                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                          : doc.reviewStatus === 'verified'
                                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                      }`}>
                                        {doc.reviewStatus}
                                      </span>
                                      <Link 
                                        href={`/efolder/${veteran.id}?doc=${doc.id}`}
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                      >
                                        View →
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {typeDocs.length > 3 && (
                                <p className="text-xs text-slate-500 text-center pt-1">
                                  +{typeDocs.length - 3} more {docType} documents
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Claims History</h3>
                <div className="space-y-4">
                  {claims.map((claim, index) => (
                    <div key={claim.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-200">{claim.id}</p>
                          <p className="text-sm text-slate-400">{claim.type} - {claim.status}</p>
                          <p className="text-xs text-slate-500">Submitted: {new Date(claim.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <Link 
                          href={`/claims/${claim.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}