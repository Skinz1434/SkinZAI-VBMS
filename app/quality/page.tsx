'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { massiveMockDatabase } from '../lib/massiveMockData';

interface QualityReview {
  id: string;
  claimId: string;
  reviewerName: string;
  reviewDate: string;
  score: number;
  status: 'pending' | 'in-review' | 'completed' | 'failed';
  category: 'accuracy' | 'timeliness' | 'completeness' | 'documentation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  findings: string[];
  recommendations: string[];
  veteranName: string;
  conditions: string[];
}

export default function QualityPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('reviewDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedReview, setSelectedReview] = useState<QualityReview | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Generate quality review data from existing claims
  const qualityReviews: QualityReview[] = massiveMockDatabase.claims.slice(0, 75).map((claim, index) => {
    const veteran = massiveMockDatabase.veterans.find(v => v.id === claim.veteranId);
    const categories = ['accuracy', 'timeliness', 'completeness', 'documentation'] as const;
    const statuses = ['pending', 'in-review', 'completed', 'failed'] as const;
    const priorities = ['low', 'medium', 'high', 'critical'] as const;
    
    const reviewers = [
      'Dr. Sarah Johnson', 'Mark Rodriguez', 'Jennifer Chen', 'Michael Torres',
      'Lisa Williams', 'David Kim', 'Rachel Martinez', 'Thomas Anderson',
      'Emily Davis', 'James Wilson', 'Amanda Brown', 'Robert Garcia'
    ];

    const findings = [
      'Medical evidence properly reviewed and documented',
      'C&P examination findings align with medical records',
      'Rating decision follows CFR guidelines accurately',
      'All required evidence collected and verified',
      'Proper nexus establishment documented',
      'Timeline compliance maintained throughout process',
      'Veteran notification protocols followed correctly',
      'Decision rationale clearly documented',
      'Secondary conditions properly evaluated',
      'Private medical records adequately reviewed'
    ];

    const recommendations = [
      'Continue current quality standards',
      'Enhance documentation for complex cases',
      'Implement additional training on specific conditions',
      'Review nexus determination procedures',
      'Strengthen evidence collection protocols',
      'Improve veteran communication processes',
      'Update decision templates for clarity',
      'Consider additional medical consultations',
      'Enhance quality assurance checkpoints'
    ];

    return {
      id: `QR-${String(index + 1).padStart(4, '0')}`,
      claimId: claim.id,
      reviewerName: reviewers[Math.floor(Math.random() * reviewers.length)],
      reviewDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      score: Math.floor(Math.random() * 30) + 70, // 70-100 score range
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      findings: findings.slice(0, Math.floor(Math.random() * 4) + 2).sort(() => 0.5 - Math.random()),
      recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 1).sort(() => 0.5 - Math.random()),
      veteranName: veteran?.name || claim.veteranName || 'Unknown Veteran',
      conditions: claim.conditions.map(c => c.name)
    };
  });

  // Filter and sort reviews
  const filteredReviews = qualityReviews
    .filter(review => {
      const matchesSearch = searchTerm === '' || 
        review.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || review.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortBy as keyof QualityReview];
      let bVal: any = b[sortBy as keyof QualityReview];
      
      if (sortBy === 'reviewDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortBy === 'score') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate metrics
  const totalReviews = qualityReviews.length;
  const completedReviews = qualityReviews.filter(r => r.status === 'completed').length;
  const averageScore = qualityReviews.reduce((acc, r) => acc + r.score, 0) / totalReviews;
  const criticalIssues = qualityReviews.filter(r => r.priority === 'critical').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'in-review': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accuracy': return 'text-purple-400 bg-purple-400/10';
      case 'timeliness': return 'text-blue-400 bg-blue-400/10';
      case 'completeness': return 'text-emerald-400 bg-emerald-400/10';
      case 'documentation': return 'text-orange-400 bg-orange-400/10';
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

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-400';
    if (score >= 85) return 'text-blue-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="quality"
          title="Quality Review"
          description="Comprehensive quality assurance system for reviewing claim decisions, ensuring accuracy, and maintaining high standards across all VBMS operations."
          features={[
            "Quality review tracking and scoring system",
            "Multi-dimensional review categories and priority levels",
            "Detailed findings and recommendations management",
            "Performance analytics and trend monitoring"
          ]}
          demoActions={[
            { label: "View Quality Metrics", action: () => setSelectedCategory('accuracy') },
            { label: "Filter Critical Issues", action: () => setSelectedStatus('failed') },
            { label: "Search Reviews", action: () => setSearchTerm('Johnson') }
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
                  <h1 className="text-xl font-semibold text-slate-100">Quality Review</h1>
                  <p className="text-sm text-slate-500">Quality Assurance & Performance Monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg transition-colors border ${
                    showFilters 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Quality Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Total Reviews</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {totalReviews}
                </div>
                <div className="text-xs text-emerald-300/70">Active quality assessments</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Completion Rate</h3>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {Math.round((completedReviews / totalReviews) * 100)}%
                </div>
                <div className="text-xs text-blue-300/70">{completedReviews} of {totalReviews} completed</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Average Score</h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {averageScore.toFixed(1)}
                </div>
                <div className="text-xs text-purple-300/70">Overall quality rating</div>
              </div>

              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-red-300">Critical Issues</h3>
                  <span className="text-2xl">🚨</span>
                </div>
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {criticalIssues}
                </div>
                <div className="text-xs text-red-300/70">Requiring immediate attention</div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Filter & Search</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by veteran, claim, or reviewer..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="accuracy">Accuracy</option>
                      <option value="timeliness">Timeliness</option>
                      <option value="completeness">Completeness</option>
                      <option value="documentation">Documentation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                    <div className="flex space-x-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="reviewDate">Review Date</option>
                        <option value="score">Score</option>
                        <option value="veteranName">Veteran Name</option>
                        <option value="status">Status</option>
                        <option value="priority">Priority</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Reviews List */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-100">
                  Quality Reviews ({filteredReviews.length})
                </h2>
              </div>
              
              <div className="divide-y divide-slate-800">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {review.veteranName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                            {review.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(review.category)}`}>
                            {review.category.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(review.priority)}`}>
                            {review.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-400">Claim ID</p>
                            <p className="text-sm font-mono text-slate-300">{review.claimId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Reviewer</p>
                            <p className="text-sm text-slate-300">{review.reviewerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Review Date</p>
                            <p className="text-sm text-slate-300">{new Date(review.reviewDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">Conditions:</span>
                            <div className="flex flex-wrap gap-1">
                              {review.conditions.slice(0, 3).map((condition, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-800 text-xs text-slate-300 rounded">
                                  {condition}
                                </span>
                              ))}
                              {review.conditions.length > 3 && (
                                <span className="text-xs text-slate-400">+{review.conditions.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-3xl font-bold mb-2 ${getScoreColor(review.score)}`}>
                          {review.score}
                        </div>
                        <div className="text-xs text-slate-500">Quality Score</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredReviews.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No quality reviews match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Review Detail Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">{selectedReview.veteranName}</h2>
                    <p className="text-slate-400">Quality Review Details - {selectedReview.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 mb-3">Review Information</h3>
                      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Claim ID</span>
                          <span className="text-slate-200 font-mono">{selectedReview.claimId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Reviewer</span>
                          <span className="text-slate-200">{selectedReview.reviewerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Review Date</span>
                          <span className="text-slate-200">{new Date(selectedReview.reviewDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedReview.category)}`}>
                            {selectedReview.category.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Priority</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedReview.priority)}`}>
                            {selectedReview.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                            {selectedReview.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Quality Score</h3>
                    <div className="bg-slate-800 rounded-lg p-6 text-center">
                      <div className={`text-6xl font-bold mb-2 ${getScoreColor(selectedReview.score)}`}>
                        {selectedReview.score}
                      </div>
                      <div className="text-slate-400">out of 100</div>
                      <div className="mt-4">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              selectedReview.score >= 95 ? 'bg-emerald-400' :
                              selectedReview.score >= 85 ? 'bg-blue-400' :
                              selectedReview.score >= 75 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${selectedReview.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Key Findings</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <ul className="space-y-3">
                        {selectedReview.findings.map((finding, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span className="text-slate-300 text-sm">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Recommendations</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <ul className="space-y-3">
                        {selectedReview.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">→</span>
                            <span className="text-slate-300 text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Reviewed Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReview.conditions.map((condition, index) => (
                      <span key={index} className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href={`/claims?claimId=${selectedReview.claimId}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    View Claim Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}