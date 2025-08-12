'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GlobalSearch from '../../components/GlobalSearch';
import { massiveMockDatabase } from '../../lib/massiveMockData';

export default function VeteranProfile() {
  const params = useParams();
  const router = useRouter();
  const [veteran, setVeteran] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const veteranId = params.id as string;
    const veteranData = massiveMockDatabase.veterans.find(v => v.id === veteranId);
    
    if (veteranData) {
      setVeteran(veteranData);
      const veteranClaims = massiveMockDatabase.claims.filter(c => c.veteranId === veteranId);
      setClaims(veteranClaims);
      const veteranDocs = massiveMockDatabase.documents.filter(d => d.veteranId === veteranId);
      setDocuments(veteranDocs);
      
      // Store current veteran context
      localStorage.setItem('vbms-current-veteran', JSON.stringify(veteranData));
    }
    
    setIsLoaded(true);
  }, [params.id]);

  if (!veteran) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
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
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
      {/* Professional Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-100">Veteran Profile</h1>
                <p className="text-sm text-slate-500">{veteran.name} • {veteran.fileNumber}</p>
              </div>
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
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Veteran Summary Header */}
        <section className="max-w-7xl mx-auto px-6 py-8">
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
          </div>
        </section>
      </main>
    </div>
  );
}