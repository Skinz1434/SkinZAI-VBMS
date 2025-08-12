'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GlobalSearch from '../../components/GlobalSearch';
import { massiveMockDatabase } from '../../lib/massiveMockData';
import { performMedicalReasoning, analyzeMedicalDocumentWithO1Reasoning } from '../../lib/aiServices';

export default function ClaimDetail() {
  const params = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<any>(null);
  const [veteran, setVeteran] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [examDraftStatus, setExamDraftStatus] = useState('not_started');
  const [mdeoReview, setMdeoReview] = useState<any>(null);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [processingAction, setProcessingAction] = useState('');
  const [showExamDraftModal, setShowExamDraftModal] = useState(false);
  const [draftComments, setDraftComments] = useState('');
  const [selectedExaminer, setSelectedExaminer] = useState('');

  useEffect(() => {
    const claimId = params.id as string;
    const claimData = massiveMockDatabase.claims.find(c => c.id === claimId);
    
    if (claimData) {
      setClaim(claimData);
      const veteranData = massiveMockDatabase.veterans.find(v => v.id === claimData.veteranId);
      setVeteran(veteranData);
      const claimDocs = massiveMockDatabase.documents.filter(d => 
        d.veteranId === claimData.veteranId && 
        d.title.toLowerCase().includes(claimData.conditions[0]?.name?.toLowerCase() || '')
      ).slice(0, 10);
      setDocuments(claimDocs);
      
      // Check if there's an existing MDEO review
      if ((claimData as any).mdeoReview) {
        setMdeoReview((claimData as any).mdeoReview);
        setExamDraftStatus((claimData as any).mdeoReview.status || 'pending_review');
      } else if (claimData.examRequired) {
        setExamDraftStatus('draft_needed');
      } else {
        setExamDraftStatus('exam_eliminated');
      }
      
      // Set AI analysis if available
      if (claimData.rumevAnalysis) {
        setAiAnalysisResults(claimData.rumevAnalysis);
      }
    }
    
    setIsLoaded(true);
  }, [params.id]);

  const generateExamDraft = async () => {
    setProcessingAction('generating_draft');
    
    // Simulate AI processing
    setTimeout(() => {
      const draft = {
        id: `DRAFT-${claim.id}-${Date.now()}`,
        claimId: claim.id,
        veteranId: veteran.id,
        generatedDate: new Date().toISOString(),
        examType: claim.conditions[0]?.category || 'General Medical',
        proposedExaminer: selectedExaminer || 'Dr. Sarah Johnson, MD',
        estimatedDuration: '45 minutes',
        requiredTests: generateRequiredTests(),
        clinicalQuestions: generateClinicalQuestions(),
        documentReview: documents.slice(0, 5).map(d => ({
          id: d.id,
          title: d.title,
          relevance: 'High',
          keyFindings: `Document contains relevant medical evidence for ${claim.conditions[0]?.name}`
        })),
        aiRecommendation: {
          examNecessity: claim.examRequired ? 'Required' : 'Not Required',
          confidence: claim.rumevAnalysis?.confidence || 85,
          reasoning: claim.rumevAnalysis?.reasoning || 'Based on comprehensive analysis of medical records',
          alternativeEvidence: !claim.examRequired ? 'Sufficient evidence exists in current medical records' : null
        },
        status: 'draft',
        comments: draftComments
      };
      
      setMdeoReview(draft);
      setExamDraftStatus('pending_mdeo_review');
      setProcessingAction('');
      setShowExamDraftModal(false);
    }, 2000);
  };

  const generateRequiredTests = () => {
    const tests = [];
    if (claim.conditions.some((c: any) => c.category === 'Mental Health')) {
      tests.push('PTSD Checklist (PCL-5)', 'PHQ-9 Depression Scale', 'GAD-7 Anxiety Scale');
    }
    if (claim.conditions.some((c: any) => c.category === 'Musculoskeletal')) {
      tests.push('Range of Motion Testing', 'X-Ray Imaging', 'Functional Capacity Evaluation');
    }
    if (claim.conditions.some((c: any) => c.category === 'Hearing')) {
      tests.push('Audiometry Test', 'Tympanometry', 'Speech Recognition Test');
    }
    if (claim.conditions.some((c: any) => c.category === 'Vision')) {
      tests.push('Visual Acuity Test', 'Visual Field Test', 'Color Vision Test');
    }
    return tests.length > 0 ? tests : ['Standard Physical Examination', 'Medical History Review'];
  };

  const generateClinicalQuestions = () => {
    return [
      'Current symptom severity and frequency',
      'Impact on daily activities and employment',
      'Treatment compliance and effectiveness',
      'Medication side effects and management',
      'Functional limitations and adaptations',
      'Quality of life assessment'
    ];
  };

  const submitToMDEO = () => {
    setProcessingAction('submitting_to_mdeo');
    setTimeout(() => {
      setExamDraftStatus('mdeo_reviewing');
      setMdeoReview({
        ...mdeoReview,
        status: 'under_review',
        submittedToMdeo: new Date().toISOString(),
        mdeoReviewer: 'Dr. Michael Chen, MDEO Chief'
      });
      setProcessingAction('');
    }, 1500);
  };

  const approveMDEO = () => {
    setProcessingAction('approving');
    setTimeout(() => {
      setExamDraftStatus('mdeo_approved');
      setMdeoReview({
        ...mdeoReview,
        status: 'approved',
        approvalDate: new Date().toISOString(),
        approvedBy: 'Dr. Michael Chen, MDEO Chief',
        examScheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        approvalNotes: 'Exam approved as medically necessary for rating determination'
      });
      setProcessingAction('');
    }, 1500);
  };

  const denyMDEO = () => {
    setProcessingAction('denying');
    setTimeout(() => {
      setExamDraftStatus('mdeo_denied');
      setMdeoReview({
        ...mdeoReview,
        status: 'denied',
        denialDate: new Date().toISOString(),
        deniedBy: 'Dr. Michael Chen, MDEO Chief',
        denialReason: 'Sufficient medical evidence exists in current records. Additional examination not required.',
        alternativeAction: 'Proceed with rating decision based on available evidence'
      });
      setProcessingAction('');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'Pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      'Development': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      'Evidence Gathering': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
      'Ready for Decision': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      'Complete': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' }
    };
    return badges[status] || badges['Pending'];
  };

  const getExamStatusBadge = () => {
    const statuses: any = {
      'not_started': { label: 'Not Started', color: 'text-gray-400' },
      'draft_needed': { label: 'Draft Needed', color: 'text-yellow-400' },
      'generating_draft': { label: 'Generating Draft...', color: 'text-blue-400' },
      'pending_mdeo_review': { label: 'Pending MDEO Review', color: 'text-orange-400' },
      'mdeo_reviewing': { label: 'MDEO Reviewing', color: 'text-purple-400' },
      'mdeo_approved': { label: 'MDEO Approved ✅', color: 'text-emerald-400' },
      'mdeo_denied': { label: 'MDEO Denied ❌', color: 'text-red-400' },
      'exam_eliminated': { label: 'Exam Eliminated by AI ✨', color: 'text-cyan-400' },
      'exam_scheduled': { label: 'Exam Scheduled 📅', color: 'text-green-400' }
    };
    return statuses[examDraftStatus] || statuses['not_started'];
  };

  if (!claim || !veteran) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-100 mb-2">Claim Not Found</h1>
          <p className="text-slate-400 mb-4">The requested claim could not be located.</p>
          <button 
            onClick={() => router.push('/claims')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            Return to Claims
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
      {/* Header */}
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
                <h1 className="text-lg font-semibold text-slate-100">Claim Details</h1>
                <p className="text-sm text-slate-500">{claim.id} • {veteran.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(claim.status).bg} ${getStatusBadge(claim.status).text} ${getStatusBadge(claim.status).border}`}>
                {claim.status}
              </span>
              <span className={`text-sm font-medium ${getExamStatusBadge().color}`}>
                {getExamStatusBadge().label}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Claim Summary */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Veteran Info */}
              <div>
                <h3 className="font-medium text-slate-100 mb-3">Veteran Information</h3>
                <div className="space-y-2 text-sm">
                  <Link 
                    href={`/veteran/${veteran.id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {veteran.name} →
                  </Link>
                  <p className="text-slate-400">File #: {veteran.fileNumber}</p>
                  <p className="text-slate-400">Current Rating: {veteran.currentRating}%</p>
                  <p className="text-slate-400">{veteran.branch} • {veteran.serviceYears}</p>
                </div>
              </div>

              {/* Claim Info */}
              <div>
                <h3 className="font-medium text-slate-100 mb-3">Claim Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-200">{claim.type}</p>
                  <p className="text-slate-400">Priority: <span className={claim.priority === 'High' ? 'text-red-400' : 'text-slate-200'}>{claim.priority}</span></p>
                  <p className="text-slate-400">Submitted: {new Date(claim.submittedDate).toLocaleDateString()}</p>
                  <p className="text-slate-400">Days in Queue: {claim.daysInQueue}</p>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h3 className="font-medium text-slate-100 mb-3">Claimed Conditions</h3>
                <div className="space-y-2">
                  {claim.conditions.slice(0, 3).map((condition: any, i: number) => (
                    <div key={i} className="text-sm">
                      <p className="text-slate-200">{condition.name}</p>
                      <p className="text-xs text-slate-500">{condition.category}</p>
                    </div>
                  ))}
                  {claim.conditions.length > 3 && (
                    <p className="text-xs text-slate-500">+{claim.conditions.length - 3} more</p>
                  )}
                </div>
              </div>

              {/* RUMEV1 Analysis */}
              <div>
                <h3 className="font-medium text-slate-100 mb-3">🤖 RUMEV1 Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-slate-400">Exam Required:</p>
                    <p className={claim.examRequired ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {claim.examRequired ? 'YES' : 'NO - Eliminated'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">AI Confidence:</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-400 h-2 rounded-full"
                          style={{ width: `${aiAnalysisResults?.confidence || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        {aiAnalysisResults?.confidence || 0}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Est. Savings: ${aiAnalysisResults?.examEliminated ? '3,500' : '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MDEO Workflow Section */}
          {claim.examRequired && (
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 mb-2">
                    📋 Exam Draft to MDEO Workflow
                  </h2>
                  <p className="text-sm text-slate-400">
                    Medical Disability Examination Office review process for C&P exam authorization
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Current Status</p>
                  <p className={`text-sm font-semibold ${getExamStatusBadge().color}`}>
                    {getExamStatusBadge().label}
                  </p>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="flex items-center space-x-4 mb-6 overflow-x-auto">
                {[
                  { step: 1, label: 'Draft Generation', status: ['pending_mdeo_review', 'mdeo_reviewing', 'mdeo_approved', 'mdeo_denied'].includes(examDraftStatus) ? 'complete' : examDraftStatus === 'generating_draft' ? 'active' : 'pending' },
                  { step: 2, label: 'Submit to MDEO', status: ['mdeo_reviewing', 'mdeo_approved', 'mdeo_denied'].includes(examDraftStatus) ? 'complete' : examDraftStatus === 'pending_mdeo_review' ? 'active' : 'pending' },
                  { step: 3, label: 'MDEO Review', status: ['mdeo_approved', 'mdeo_denied'].includes(examDraftStatus) ? 'complete' : examDraftStatus === 'mdeo_reviewing' ? 'active' : 'pending' },
                  { step: 4, label: 'Decision', status: ['mdeo_approved', 'mdeo_denied'].includes(examDraftStatus) ? 'complete' : 'pending' }
                ].map((step, index) => (
                  <div key={step.step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step.status === 'complete' ? 'bg-emerald-500 text-white' :
                        step.status === 'active' ? 'bg-blue-500 text-white animate-pulse' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {step.status === 'complete' ? '✓' : step.step}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 whitespace-nowrap">{step.label}</p>
                    </div>
                    {index < 3 && (
                      <div className={`w-16 h-0.5 ${
                        step.status === 'complete' ? 'bg-emerald-500' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {examDraftStatus === 'draft_needed' && (
                  <button
                    onClick={() => setShowExamDraftModal(true)}
                    disabled={processingAction !== ''}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    Generate Exam Draft
                  </button>
                )}
                
                {examDraftStatus === 'pending_mdeo_review' && (
                  <button
                    onClick={submitToMDEO}
                    disabled={processingAction !== ''}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    {processingAction === 'submitting_to_mdeo' ? 'Submitting...' : 'Submit to MDEO'}
                  </button>
                )}
                
                {examDraftStatus === 'mdeo_reviewing' && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={approveMDEO}
                      disabled={processingAction !== ''}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                      {processingAction === 'approving' ? 'Approving...' : 'Approve Exam'}
                    </button>
                    <button
                      onClick={denyMDEO}
                      disabled={processingAction !== ''}
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                      {processingAction === 'denying' ? 'Denying...' : 'Deny Exam'}
                    </button>
                  </div>
                )}
              </div>

              {/* MDEO Review Details */}
              {mdeoReview && (
                <div className="mt-6 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="font-semibold text-slate-100 mb-4">MDEO Review Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Draft ID:</p>
                      <p className="text-slate-200 font-mono">{mdeoReview.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Exam Type:</p>
                      <p className="text-slate-200">{mdeoReview.examType}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Proposed Examiner:</p>
                      <p className="text-slate-200">{mdeoReview.proposedExaminer}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Estimated Duration:</p>
                      <p className="text-slate-200">{mdeoReview.estimatedDuration}</p>
                    </div>
                  </div>
                  
                  {mdeoReview.requiredTests && (
                    <div className="mt-4">
                      <p className="text-slate-400 text-sm mb-2">Required Tests:</p>
                      <div className="flex flex-wrap gap-2">
                        {mdeoReview.requiredTests.map((test: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {mdeoReview.status === 'approved' && (
                    <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-700/50 rounded">
                      <p className="text-emerald-400 font-semibold mb-2">✅ MDEO Approved</p>
                      <p className="text-sm text-slate-300">Approved by: {mdeoReview.approvedBy}</p>
                      <p className="text-sm text-slate-300">Exam Date: {new Date(mdeoReview.examScheduledDate).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-400 mt-2">{mdeoReview.approvalNotes}</p>
                    </div>
                  )}
                  
                  {mdeoReview.status === 'denied' && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded">
                      <p className="text-red-400 font-semibold mb-2">❌ MDEO Denied</p>
                      <p className="text-sm text-slate-300">Denied by: {mdeoReview.deniedBy}</p>
                      <p className="text-sm text-slate-400 mt-2">{mdeoReview.denialReason}</p>
                      <p className="text-sm text-emerald-400 mt-2">Alternative: {mdeoReview.alternativeAction}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-slate-800 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'documents', name: 'Documents' },
                { id: 'timeline', name: 'Timeline' },
                { id: 'ai-analysis', name: 'AI Analysis' },
                { id: 'actions', name: 'Actions' }
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
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Claim Conditions</h3>
                  <div className="space-y-3">
                    {claim.conditions.map((condition: any, i: number) => (
                      <div key={i} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-200">{condition.name}</p>
                            <p className="text-sm text-slate-400">{condition.category}</p>
                          </div>
                          {condition.rating && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                              {condition.rating}% proposed
                            </span>
                          )}
                        </div>
                        {condition.description && (
                          <p className="text-xs text-slate-500 mt-2">{condition.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Processing Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Submitted</span>
                      <span className="text-slate-200">{new Date(claim.submittedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Last Updated</span>
                      <span className="text-slate-200">{new Date(claim.lastUpdateDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Target Completion</span>
                      <span className="text-slate-200">{new Date(claim.targetCompletionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Days in Queue</span>
                      <span className="text-slate-200">{claim.daysInQueue} days</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-slate-200">
                          {claim.status === 'Complete' ? '100' : 
                           claim.status === 'Ready for Decision' ? '80' :
                           claim.status === 'Evidence Gathering' ? '50' :
                           claim.status === 'Development' ? '30' : '10'}%
                        </span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${
                            claim.status === 'Complete' ? '100' : 
                            claim.status === 'Ready for Decision' ? '80' :
                            claim.status === 'Evidence Gathering' ? '50' :
                            claim.status === 'Development' ? '30' : '10'
                          }%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Related Documents ({documents.length})</h3>
                <div className="space-y-3">
                  {documents.length === 0 ? (
                    <p className="text-slate-400">No documents found for this claim.</p>
                  ) : (
                    documents.map((doc) => (
                      <div key={doc.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-slate-200">{doc.title}</p>
                            <p className="text-sm text-slate-400 mt-1">Type: {doc.type} • {doc.pages} pages</p>
                            <p className="text-xs text-slate-500 mt-2">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded border ${
                              doc.reviewStatus === 'Reviewed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-700 text-slate-400 border-slate-600'
                            }`}>
                              {doc.reviewStatus}
                            </span>
                            <Link 
                              href={`/efolder/${veteran.id}?doc=${doc.id}`}
                              className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ai-analysis' && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">🤖 RUMEV1 AI Analysis</h3>
                {aiAnalysisResults ? (
                  <div className="space-y-6">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <h4 className="font-medium text-slate-200 mb-3">Exam Necessity Assessment</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Determination:</p>
                          <p className={`text-lg font-semibold ${aiAnalysisResults.examEliminated ? 'text-emerald-400' : 'text-red-400'}`}>
                            {aiAnalysisResults.examEliminated ? 'Exam Not Required' : 'Exam Required'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Confidence Level:</p>
                          <p className="text-lg font-semibold text-blue-400">{aiAnalysisResults.confidence}%</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mt-4">
                        {aiAnalysisResults.reasoning || 'Based on comprehensive analysis of available medical evidence and VA rating criteria.'}
                      </p>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <h4 className="font-medium text-slate-200 mb-3">Medical Evidence Summary</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>• Service treatment records indicate chronic condition development</li>
                        <li>• Private medical records show ongoing treatment and symptom progression</li>
                        <li>• VA medical records document current severity and functional impact</li>
                        <li>• Nexus letter establishes service connection with high confidence</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <h4 className="font-medium text-slate-200 mb-3">Recommended Rating</h4>
                      <p className="text-2xl font-bold text-emerald-400 mb-2">
                        {aiAnalysisResults.proposedRating || '30-50'}% Combined
                      </p>
                      <p className="text-sm text-slate-400">
                        Estimated Monthly Benefit: {aiAnalysisResults.estimatedMonthlyBenefit || '$1,200-$2,000'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">AI analysis pending...</p>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Available Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-left">
                      <p className="font-medium">Request Additional Evidence</p>
                      <p className="text-sm opacity-90">Send request to veteran for specific documents</p>
                    </button>
                    <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-left">
                      <p className="font-medium">Schedule C&P Exam</p>
                      <p className="text-sm opacity-90">Coordinate examination with VA medical center</p>
                    </button>
                    <button className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-left">
                      <p className="font-medium">Proceed to Rating Decision</p>
                      <p className="text-sm opacity-90">Move claim to rating queue for final decision</p>
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left">
                      <p className="font-medium">Add Note</p>
                      <p className="text-sm opacity-90">Document processing notes and observations</p>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-100 mb-4">Quick Tools</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/conditions"
                      className="block w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                    >
                      <p className="font-medium">VA Rating Schedule</p>
                      <p className="text-sm text-slate-400">View diagnostic codes and criteria</p>
                    </Link>
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-left border border-slate-700">
                      <p className="font-medium">Calculate Combined Rating</p>
                      <p className="text-sm text-slate-400">Determine overall disability percentage</p>
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-left border border-slate-700">
                      <p className="font-medium">Generate Decision Letter</p>
                      <p className="text-sm text-slate-400">Create notification for veteran</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Exam Draft Modal */}
      {showExamDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Generate Exam Draft</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Proposed Examiner</label>
                <select 
                  value={selectedExaminer}
                  onChange={(e) => setSelectedExaminer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
                >
                  <option value="">Select Examiner</option>
                  <option value="Dr. Sarah Johnson, MD">Dr. Sarah Johnson, MD - Internal Medicine</option>
                  <option value="Dr. Robert Martinez, MD">Dr. Robert Martinez, MD - Orthopedics</option>
                  <option value="Dr. Emily Chen, PsyD">Dr. Emily Chen, PsyD - Mental Health</option>
                  <option value="Dr. Michael Williams, AuD">Dr. Michael Williams, AuD - Audiology</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Comments/Special Instructions</label>
                <textarea
                  value={draftComments}
                  onChange={(e) => setDraftComments(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500"
                  placeholder="Enter any special instructions or comments for the examiner..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowExamDraftModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateExamDraft}
                disabled={processingAction === 'generating_draft'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {processingAction === 'generating_draft' ? 'Generating...' : 'Generate Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}