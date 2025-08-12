'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlobalSearch from '../components/GlobalSearch';
import { expandedMockDatabase } from '../lib/expandedMockData';
import { Claim } from '../lib/mockData';

interface ExamSchedule {
  id: string;
  veteranId: string;
  veteranName: string;
  fileNumber: string;
  claimId: string;
  examType: string;
  examiner: string;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'No Show' | 'Cancelled' | 'Rescheduled';
  conditions: string[];
  estimatedDuration: string;
  specialRequirements?: string[];
  priority: 'High' | 'Standard' | 'Low';
}

const mockExamSchedules: ExamSchedule[] = [
  {
    id: 'EX-2025-001',
    veteranId: 'V002',
    veteranName: 'Michael J. Thompson',
    fileNumber: 'F89432105',
    claimId: 'CL-2025-080845',
    examType: 'Orthopedic',
    examiner: 'Dr. Smith - Contract Examiner',
    scheduledDate: '2025-09-15',
    scheduledTime: '10:00 AM',
    location: 'Atlanta VA Medical Center',
    status: 'Scheduled',
    conditions: ['Right Knee Strain'],
    estimatedDuration: '90 minutes',
    specialRequirements: ['X-ray required', 'Range of motion testing'],
    priority: 'Standard'
  },
  {
    id: 'EX-2025-002',
    veteranId: 'V004',
    veteranName: 'Robert E. Harrison',
    fileNumber: 'F67890234',
    claimId: 'CL-2025-072234',
    examType: 'Mental Health',
    examiner: 'Dr. Sarah Chen - Staff Psychiatrist',
    scheduledDate: '2025-08-20',
    scheduledTime: '2:00 PM',
    location: 'Los Angeles VA Medical Center',
    status: 'Completed',
    conditions: ['PTSD', 'Depression'],
    estimatedDuration: '120 minutes',
    specialRequirements: ['Quiet room', 'Trauma-informed approach'],
    priority: 'High'
  },
  {
    id: 'EX-2025-003',
    veteranId: 'V006',
    veteranName: 'David A. Rodriguez',
    fileNumber: 'F12345678',
    claimId: 'CL-2025-070123',
    examType: 'Neurological',
    examiner: 'Dr. Johnson - Neurologist',
    scheduledDate: '2025-08-25',
    scheduledTime: '9:30 AM',
    location: 'San Antonio VA Medical Center',
    status: 'Scheduled',
    conditions: ['TBI', 'Chronic Headaches'],
    estimatedDuration: '150 minutes',
    specialRequirements: ['Cognitive testing', 'MRI review'],
    priority: 'High'
  }
];

export default function ExamManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredExams = mockExamSchedules.filter(exam => {
    const matchesSearch = searchTerm === '' || 
      exam.veteranName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examiner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === 'all' || exam.examType.toLowerCase() === filterType.toLowerCase();
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const examDate = new Date(exam.scheduledDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      switch (filterDate) {
        case 'today':
          matchesDate = examDate.toDateString() === today.toDateString();
          break;
        case 'week':
          matchesDate = examDate >= today && examDate <= weekFromNow;
          break;
        case 'month':
          matchesDate = examDate >= today && examDate <= monthFromNow;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Scheduled': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'No Show': 'bg-red-500/10 text-red-400 border-red-500/30',
      'Cancelled': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      'Rescheduled': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    };
    return colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-500/10 text-red-400 border-red-500/30',
      'Standard': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'Low': 'bg-green-500/10 text-green-400 border-green-500/30'
    };
    return colors[priority] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const getExamTypeIcon = (type: string) => {
    const icons = {
      'Orthopedic': '🦴',
      'Mental Health': '🧠',
      'Neurological': '⚡',
      'Cardiovascular': '❤️',
      'Respiratory': '🫁',
      'Hearing': '👂',
      'Vision': '👁️'
    };
    return icons[type] || '🏥';
  };

  // Calculate statistics
  const stats = {
    total: mockExamSchedules.length,
    scheduled: mockExamSchedules.filter(e => e.status === 'Scheduled').length,
    completed: mockExamSchedules.filter(e => e.status === 'Completed').length,
    highPriority: mockExamSchedules.filter(e => e.priority === 'High').length
  };

  // Claims requiring exams
  const claimsRequiringExams = expandedMockDatabase.claims.filter(claim => claim.examRequired);

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
                <h1 className="text-lg font-semibold text-slate-100">C&P Exam Management</h1>
                <p className="text-sm text-slate-500">Compensation & Pension Medical Examinations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                {filteredExams.length} of {mockExamSchedules.length} exams
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Stats Overview */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Total Exams</h3>
                <span className="text-2xl">🏥</span>
              </div>
              <div className="text-2xl font-bold text-slate-100">{stats.total}</div>
              <p className="text-xs text-slate-500">All scheduled exams</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Scheduled</h3>
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{stats.scheduled}</div>
              <p className="text-xs text-slate-500">Upcoming exams</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Completed</h3>
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
              <p className="text-xs text-slate-500">Finished exams</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">High Priority</h3>
                <span className="text-2xl">🔴</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{stats.highPriority}</div>
              <p className="text-xs text-slate-500">Priority cases</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Exam Schedule & Filters</h2>
            
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Search Exams</label>
                <input
                  type="text"
                  placeholder="Search by veteran, examiner, or exam ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="no show">No Show</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Exam Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="orthopedic">Orthopedic</option>
                  <option value="mental health">Mental Health</option>
                  <option value="neurological">Neurological</option>
                  <option value="cardiovascular">Cardiovascular</option>
                  <option value="respiratory">Respiratory</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Date Range</label>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Claims Requiring Exams */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Claims Requiring C&P Exams</h3>
            <div className="space-y-3">
              {claimsRequiringExams.slice(0, 5).map((claim) => (
                <div key={claim.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-200">{claim.veteranName}</h4>
                      <p className="text-sm text-slate-400">Claim {claim.id} • {claim.conditions.length} conditions</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(claim.priority)}`}>
                        {claim.priority}
                      </span>
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors">
                        Schedule Exam
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {claimsRequiringExams.length > 5 && (
                <div className="text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View all {claimsRequiringExams.length} claims requiring exams →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Exam Schedule List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">Scheduled Examinations</h2>
            
            {filteredExams.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400">No exams found matching your search criteria.</p>
              </div>
            ) : (
              filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Exam Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
                          {getExamTypeIcon(exam.examType)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-100">{exam.examType} Exam</h3>
                          <p className="text-sm text-slate-400 font-mono">{exam.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(exam.priority)}`}>
                          {exam.priority}
                        </span>
                      </div>
                    </div>
                    
                    {/* Veteran & Claim Details */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-500 text-sm">Veteran:</span>
                          <Link 
                            href={`/veteran/${exam.veteranId}`}
                            className="block font-semibold text-slate-100 hover:text-blue-400 transition-colors"
                          >
                            {exam.veteranName}
                          </Link>
                          <p className="text-sm text-slate-400 font-mono">{exam.fileNumber}</p>
                        </div>
                        
                        <div>
                          <span className="text-slate-500 text-sm">Related Claim:</span>
                          <Link 
                            href={`/claims/${exam.claimId}`}
                            className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            {exam.claimId}
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Schedule Details */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-500 text-sm">Date & Time:</span>
                          <p className="text-slate-200 font-medium">
                            {new Date(exam.scheduledDate).toLocaleDateString()}
                          </p>
                          <p className="text-slate-400 text-sm">{exam.scheduledTime}</p>
                        </div>
                        
                        <div>
                          <span className="text-slate-500 text-sm">Duration:</span>
                          <p className="text-slate-200">{exam.estimatedDuration}</p>
                        </div>
                        
                        <div>
                          <span className="text-slate-500 text-sm">Examiner:</span>
                          <p className="text-slate-200 text-sm">{exam.examiner}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conditions & Requirements */}
                    <div className="lg:col-span-1">
                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-500 text-sm mb-2 block">Conditions:</span>
                          <div className="flex flex-wrap gap-1">
                            {exam.conditions.map((condition, i) => (
                              <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {exam.specialRequirements && exam.specialRequirements.length > 0 && (
                          <div>
                            <span className="text-slate-500 text-sm mb-2 block">Requirements:</span>
                            <div className="space-y-1">
                              {exam.specialRequirements.map((req, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <span className="text-yellow-400">•</span>
                                  <span className="text-xs text-slate-400">{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                      Location: {exam.location}
                    </div>
                    <div className="flex space-x-2">
                      {exam.status === 'Scheduled' && (
                        <>
                          <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded transition-colors">
                            Reschedule
                          </button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors">
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}