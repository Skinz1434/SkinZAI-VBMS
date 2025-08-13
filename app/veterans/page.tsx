'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import { massiveMockDatabase } from '../lib/massiveMockData';

export default function VeteransPage() {
  const [veterans, setVeterans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setVeterans(massiveMockDatabase.veterans);
    setIsLoaded(true);
  }, []);

  const filteredVeterans = veterans
    .filter(veteran => {
      const matchesSearch = searchTerm === '' || 
        veteran.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veteran.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veteran.ssn.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || veteran.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.currentRating - a.currentRating;
        case 'claims': return b.claimCount - a.claimCount;
        default: return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'text-emerald-400';
      case 'Inactive': return 'text-yellow-400';
      case 'Deceased': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Standard': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  return (
    <AppLayout>
      <div className={`p-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Veterans Registry</h1>
          <p className="text-slate-400">Comprehensive veteran profiles and service records</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🎖️</span>
              <span className="text-xs text-emerald-400">+12 this week</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{veterans.length}</p>
            <p className="text-sm text-slate-400">Total Veterans</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-xs text-blue-400">87% active</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{veterans.filter(v => v.status === 'Active').length}</p>
            <p className="text-sm text-slate-400">Active Cases</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs text-purple-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{massiveMockDatabase.claims.length}</p>
            <p className="text-sm text-slate-400">Total Claims</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💯</span>
              <span className="text-xs text-yellow-400">Average</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">
              {Math.round(veterans.reduce((acc, v) => acc + v.currentRating, 0) / veterans.length)}%
            </p>
            <p className="text-sm text-slate-400">Avg Rating</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name, file number, or SSN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="claims">Sort by Claims</option>
              </select>
            </div>
          </div>
        </div>

        {/* Veterans List/Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-slate-100">
              {filteredVeterans.length} Veterans Found
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
              >
                ☰
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
              >
                ⊞
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4' : 'divide-y divide-slate-800'}>
            {filteredVeterans.map((veteran) => (
              <Link
                key={veteran.id}
                href={`/veteran/${veteran.id}`}
                className={viewMode === 'grid' 
                  ? 'bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all cursor-pointer'
                  : 'block px-6 py-4 hover:bg-slate-800/50 transition-colors'
                }
              >
                <div className={viewMode === 'grid' ? '' : 'flex items-center justify-between'}>
                  <div className={viewMode === 'grid' ? '' : 'flex items-center space-x-4'}>
                    {/* Avatar */}
                    <div className={`${viewMode === 'grid' ? 'w-16 h-16 mb-3' : 'w-12 h-12'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold">
                        {veteran.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Veteran Info */}
                    <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                      <h3 className="font-semibold text-slate-100">{veteran.name}</h3>
                      <div className={`${viewMode === 'grid' ? 'space-y-1 mt-2' : 'flex items-center space-x-4'} text-sm text-slate-400`}>
                        <span>{veteran.fileNumber}</span>
                        <span className={viewMode === 'grid' ? '' : 'hidden md:inline'}>•</span>
                        <span className={viewMode === 'grid' ? '' : 'hidden md:inline'}>{veteran.branch}</span>
                        <span className={viewMode === 'grid' ? '' : 'hidden md:inline'}>•</span>
                        <span className={viewMode === 'grid' ? '' : 'hidden md:inline'}>{veteran.rank}</span>
                      </div>
                      {viewMode === 'grid' && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Rating:</span>
                            <span className="text-emerald-400 font-semibold">{veteran.currentRating}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-slate-500">Claims:</span>
                            <span className="text-slate-300">{veteran.claimCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Info (List View) */}
                  {viewMode === 'list' && (
                    <div className="flex items-center space-x-6">
                      <div className="text-center hidden lg:block">
                        <p className="text-2xl font-bold text-emerald-400">{veteran.currentRating}%</p>
                        <p className="text-xs text-slate-500">Disability Rating</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-lg font-semibold text-slate-200">{veteran.claimCount}</p>
                        <p className="text-xs text-slate-500">Active Claims</p>
                      </div>
                      <div className="text-center">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityBadge(veteran.priority)}`}>
                          {veteran.priority} Priority
                        </span>
                      </div>
                      <div className="text-center">
                        <span className={`text-sm font-medium ${getStatusColor(veteran.status)}`}>
                          {veteran.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid View Status */}
                {viewMode === 'grid' && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadge(veteran.priority)}`}>
                      {veteran.priority}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(veteran.status)}`}>
                      {veteran.status}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}