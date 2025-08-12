'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import { expandedMockDatabase } from '../lib/expandedMockData';

interface RatingScheduleItem {
  code: string;
  title: string;
  category: string;
  description: string;
  ratingCriteria: {
    rating: number;
    description: string;
    requirements: string[];
  }[];
  commonEvidence: string[];
  examRequirements: string[];
  averageRating: number;
  totalClaims: number;
}

const mockRatingSchedule: RatingScheduleItem[] = [
  {
    code: '5003',
    title: 'Degenerative Arthritis',
    category: 'Musculoskeletal',
    description: 'Arthritis as a residual of traumatic arthritis, pyogenic arthritis, other infectious arthritis, or crystal arthropathy.',
    ratingCriteria: [
      {
        rating: 10,
        description: 'Degenerative arthritis, if not compensable under the criteria for limitation of motion',
        requirements: ['X-ray evidence of arthritis', 'No functional limitations']
      },
      {
        rating: 20,
        description: 'With X-ray evidence of involvement of two or more major joints or two or more minor joint groups',
        requirements: ['X-ray evidence', 'Two or more joints involved', 'Some functional impact']
      }
    ],
    commonEvidence: ['X-rays', 'MRI scans', 'Service treatment records', 'Current medical treatment'],
    examRequirements: ['Range of motion measurements', 'X-ray review', 'Functional assessment'],
    averageRating: 20,
    totalClaims: 45
  },
  {
    code: '9434',
    title: 'Major Depressive Disorder',
    category: 'Mental Health',
    description: 'Major depressive disorder, including persistent depressive disorder (dysthymia) and other depressive disorders.',
    ratingCriteria: [
      {
        rating: 0,
        description: 'A mental condition has been formally diagnosed, but symptoms do not interfere with occupational and social functioning',
        requirements: ['Diagnosis confirmed', 'No occupational impairment', 'No social impairment']
      },
      {
        rating: 10,
        description: 'Occupational and social impairment due to mild or transient symptoms',
        requirements: ['Mild symptoms', 'Minimal occupational impact', 'Controlled by medication']
      },
      {
        rating: 30,
        description: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks',
        requirements: ['Occasional work impact', 'Intermittent symptoms', 'Some social impairment']
      },
      {
        rating: 50,
        description: 'Occupational and social impairment with reduced reliability and productivity',
        requirements: ['Reduced reliability', 'Decreased productivity', 'Significant symptoms']
      },
      {
        rating: 70,
        description: 'Occupational and social impairment with deficiencies in most areas',
        requirements: ['Major occupational impairment', 'Significant social dysfunction', 'Persistent symptoms']
      },
      {
        rating: 100,
        description: 'Total occupational and social impairment',
        requirements: ['Total occupational impairment', 'Complete social isolation', 'Severe persistent symptoms']
      }
    ],
    commonEvidence: ['Psychiatric treatment records', 'Medication records', 'Hospitalization records', 'GAF scores'],
    examRequirements: ['Mental status examination', 'Functional assessment', 'Symptom evaluation'],
    averageRating: 50,
    totalClaims: 38
  },
  {
    code: '6260',
    title: 'Tinnitus',
    category: 'Hearing',
    description: 'Tinnitus, recurrent',
    ratingCriteria: [
      {
        rating: 10,
        description: 'Recurrent tinnitus',
        requirements: ['Recurrent tinnitus present', 'Diagnosed by audiometry']
      }
    ],
    commonEvidence: ['Audiometry results', 'Service noise exposure records', 'Medical treatment records'],
    examRequirements: ['Audiometric testing', 'Tinnitus evaluation'],
    averageRating: 10,
    totalClaims: 52
  },
  {
    code: '5010',
    title: 'Traumatic Brain Injury',
    category: 'Neurological',
    description: 'Traumatic brain injury (TBI) with residual neurological deficits or symptoms.',
    ratingCriteria: [
      {
        rating: 0,
        description: 'Normal neurological examination',
        requirements: ['History of TBI', 'Normal neurological exam', 'No residual symptoms']
      },
      {
        rating: 10,
        description: 'With subjective symptoms but normal neurological examination',
        requirements: ['Subjective symptoms present', 'Normal neurological findings', 'Documented TBI history']
      },
      {
        rating: 40,
        description: 'With moderately severe TBI residuals',
        requirements: ['Moderate cognitive impairment', 'Some functional limitations', 'Objective findings']
      },
      {
        rating: 70,
        description: 'With severe TBI residuals',
        requirements: ['Severe cognitive impairment', 'Significant functional limitations', 'Major life impact']
      },
      {
        rating: 100,
        description: 'With total disability from TBI residuals',
        requirements: ['Total cognitive impairment', 'Complete functional disability', 'Requires constant care']
      }
    ],
    commonEvidence: ['Neuropsychological testing', 'MRI/CT scans', 'Military incident reports', 'Treatment records'],
    examRequirements: ['Neurological examination', 'Cognitive testing', 'Functional assessment'],
    averageRating: 30,
    totalClaims: 28
  },
  {
    code: '7101',
    title: 'Hypertension',
    category: 'Cardiovascular',
    description: 'Hypertensive vascular disease (essential hypertension)',
    ratingCriteria: [
      {
        rating: 10,
        description: 'Diastolic pressure predominantly 90 or more, or; systolic pressure predominantly 160 or more',
        requirements: ['BP readings documented', 'Requires medication', 'Controlled hypertension']
      },
      {
        rating: 20,
        description: 'Diastolic pressure predominantly 100 or more, or; systolic pressure predominantly 200 or more',
        requirements: ['Higher BP readings', 'Multiple medications', 'Some complications']
      },
      {
        rating: 60,
        description: 'Malignant hypertension (diastolic pressure predominantly 130 or more)',
        requirements: ['Malignant hypertension', 'End-organ damage', 'Hospitalization history']
      }
    ],
    commonEvidence: ['Blood pressure readings', 'Medication records', 'EKG results', 'Laboratory results'],
    examRequirements: ['Blood pressure measurements', 'Cardiovascular examination', 'Laboratory tests'],
    averageRating: 10,
    totalClaims: 41
  }
];

export default function ConditionManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState<RatingScheduleItem | null>(null);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredConditions = mockRatingSchedule.filter(condition => {
    const matchesSearch = searchTerm === '' || 
      condition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || condition.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get condition statistics from actual claims
  const getConditionStats = () => {
    const conditionStats: Record<string, { count: number; totalRequested: number; examRequired: number }> = {};
    expandedMockDatabase.claims.forEach(claim => {
      claim.conditions.forEach(condition => {
        const category = condition.category;
        if (!conditionStats[category]) {
          conditionStats[category] = {
            count: 0,
            totalRequested: 0,
            examRequired: 0
          };
        }
        conditionStats[category].count++;
        conditionStats[category].totalRequested += condition.requestedRating || 0;
        if (claim.examRequired) conditionStats[category].examRequired++;
      });
    });
    
    return Object.entries(conditionStats).map(([category, stats]) => ({
      category,
      count: stats.count,
      totalRequested: stats.totalRequested,
      examRequired: stats.examRequired,
      averageRating: Math.round(stats.totalRequested / stats.count),
      examRate: ((stats.examRequired / stats.count) * 100).toFixed(1)
    }));
  };

  const conditionStats = getConditionStats();

  const getCategoryColor = (category: string) => {
    const colors = {
      'Musculoskeletal': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Mental Health': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'Hearing': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'Neurological': 'bg-red-500/10 text-red-400 border-red-500/30',
      'Cardiovascular': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Respiratory': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
    return colors[category] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const getRatingColor = (rating: number) => {
    if (rating === 0) return 'text-slate-400';
    if (rating <= 20) return 'text-green-400';
    if (rating <= 50) return 'text-yellow-400';
    if (rating <= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlobalSearch />
      
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
                <h1 className="text-lg font-semibold text-slate-100">Condition & Rating Management</h1>
                <p className="text-sm text-slate-500">38 CFR Schedule for Rating Disabilities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {[
                  { key: 'schedule', label: 'Rating Schedule' },
                  { key: 'statistics', label: 'Statistics' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <section className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'schedule' && (
            <>
              {/* Search and Filter */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">Rating Schedule Search</h2>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Search Conditions</label>
                    <input
                      type="text"
                      placeholder="Search by condition name, code, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="all">All Categories</option>
                      <option value="musculoskeletal">Musculoskeletal</option>
                      <option value="mental health">Mental Health</option>
                      <option value="hearing">Hearing</option>
                      <option value="neurological">Neurological</option>
                      <option value="cardiovascular">Cardiovascular</option>
                      <option value="respiratory">Respiratory</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-2xl font-semibold text-slate-100">{mockRatingSchedule.length}</p>
                    <p className="text-sm text-slate-400">Total Conditions</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-2xl font-semibold text-blue-400">
                      {mockRatingSchedule.filter(c => c.category === 'Mental Health').length}
                    </p>
                    <p className="text-sm text-slate-400">Mental Health</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-2xl font-semibold text-emerald-400">
                      {mockRatingSchedule.filter(c => c.category === 'Musculoskeletal').length}
                    </p>
                    <p className="text-sm text-slate-400">Musculoskeletal</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-2xl font-semibold text-purple-400">
                      {Math.round(mockRatingSchedule.reduce((acc, c) => acc + c.averageRating, 0) / mockRatingSchedule.length)}%
                    </p>
                    <p className="text-sm text-slate-400">Avg Rating</p>
                  </div>
                </div>
              </div>

              {/* Conditions List */}
              <div className="space-y-4">
                {filteredConditions.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                    <p className="text-slate-400">No conditions found matching your search criteria.</p>
                  </div>
                ) : (
                  filteredConditions.map((condition) => (
                    <div
                      key={condition.code}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Condition Info */}
                        <div className="lg:col-span-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-100 mb-1">{condition.title}</h3>
                              <p className="text-sm text-slate-400 font-mono">Code: {condition.code}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(condition.category)}`}>
                              {condition.category}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-300 leading-relaxed mb-4">{condition.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Average Rating:</span>
                              <span className={`font-semibold ${getRatingColor(condition.averageRating)}`}>
                                {condition.averageRating}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Total Claims:</span>
                              <span className="text-slate-200">{condition.totalClaims}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Rating Criteria */}
                        <div className="lg:col-span-1">
                          <h4 className="font-medium text-slate-200 mb-3">Rating Criteria</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {condition.ratingCriteria.map((criteria, i) => (
                              <div key={i} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`font-bold text-lg ${getRatingColor(criteria.rating)}`}>
                                    {criteria.rating}%
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 mb-2">{criteria.description}</p>
                                <div className="space-y-1">
                                  {criteria.requirements.slice(0, 2).map((req, j) => (
                                    <div key={j} className="flex items-center space-x-2">
                                      <span className="text-blue-400">•</span>
                                      <span className="text-xs text-slate-400">{req}</span>
                                    </div>
                                  ))}
                                  {criteria.requirements.length > 2 && (
                                    <span className="text-xs text-slate-500">+{criteria.requirements.length - 2} more</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Evidence & Exam Requirements */}
                        <div className="lg:col-span-1">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-slate-200 mb-2">Common Evidence</h4>
                              <div className="space-y-1">
                                {condition.commonEvidence.map((evidence, i) => (
                                  <div key={i} className="flex items-center space-x-2">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-sm text-slate-300">{evidence}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-slate-200 mb-2">Exam Requirements</h4>
                              <div className="space-y-1">
                                {condition.examRequirements.map((exam, i) => (
                                  <div key={i} className="flex items-center space-x-2">
                                    <span className="text-yellow-400">⚡</span>
                                    <span className="text-sm text-slate-300">{exam}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                        <div className="text-sm text-slate-500">
                          38 CFR § 4.{condition.code}
                        </div>
                        <button 
                          onClick={() => setSelectedCondition(condition)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View Full Details →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">Condition Category Statistics</h2>
                
                <div className="grid gap-6">
                  {conditionStats.map((stat, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-100">{stat.category}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(stat.category)}`}>
                          {stat.count} claims
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400 mb-1">
                            {stat.averageRating}%
                          </div>
                          <div className="text-sm text-slate-400">Average Rating</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-400 mb-1">
                            {(100 - parseFloat(stat.examRate)).toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-400">Exam Elimination</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400 mb-1">
                            {stat.count}
                          </div>
                          <div className="text-sm text-slate-400">Total Claims</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}