'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchVeterans, searchClaims, searchDocuments } from '../lib/mockData';

interface SearchResult {
  type: 'veteran' | 'claim' | 'document';
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  details?: any;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('vbms-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search function
  const performSearch = (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchResults: SearchResult[] = [];

    // Search veterans
    const veterans = searchVeterans(term);
    veterans.forEach(veteran => {
      searchResults.push({
        type: 'veteran',
        id: veteran.id,
        title: veteran.name,
        subtitle: `${veteran.fileNumber} • ${veteran.branch} • ${veteran.serviceYears}`,
        icon: '🎖️',
        link: `/veteran/${veteran.id}`,
        details: veteran
      });
    });

    // Search claims
    const claims = searchClaims(term);
    claims.forEach(claim => {
      searchResults.push({
        type: 'claim',
        id: claim.id,
        title: `Claim ${claim.id}`,
        subtitle: `${claim.veteranName} • ${claim.status}`,
        icon: '📋',
        link: `/claims/${claim.id}`,
        details: claim
      });
    });

    // Search documents
    const documents = searchDocuments(term);
    documents.forEach(doc => {
      searchResults.push({
        type: 'document',
        id: doc.id,
        title: doc.title,
        subtitle: `${doc.veteranName} • ${doc.type}`,
        icon: '📄',
        link: `/efolder/${doc.veteranId}?doc=${doc.id}`,
        details: doc
      });
    });

    setResults(searchResults);
    setIsSearching(false);
  };

  // Handle search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('vbms-recent-searches', JSON.stringify(newRecent));
    
    // Store current veteran context if selecting a veteran
    if (result.type === 'veteran') {
      localStorage.setItem('vbms-current-veteran', JSON.stringify(result.details));
    }

    // Navigate to result
    router.push(result.link);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {/* Search Button - Always Visible */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="fixed top-4 right-4 z-[60] bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline font-medium">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-200 bg-blue-800/50 rounded-lg">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div ref={searchRef} className="w-full max-w-3xl mx-4">
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
              {/* Search Input */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by veteran name, file number, claim ID, or document..."
                  className="w-full px-6 py-5 text-lg text-white bg-transparent border-b border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  {isSearching && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <kbd className="px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-800 rounded">ESC</kbd>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchTerm === '' && recentSearches.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Recent Searches</p>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(search)}
                        className="block w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{search}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
                      {results.length} Results
                    </p>
                    {results.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultSelect(result)}
                        className="block w-full text-left p-4 hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl mt-1">{result.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {result.title}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                result.type === 'veteran' ? 'bg-emerald-500/20 text-emerald-400' :
                                result.type === 'claim' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {result.type}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{result.subtitle}</p>
                            {result.details && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {result.type === 'veteran' && (
                                  <>
                                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                      Rating: {result.details.currentRating}%
                                    </span>
                                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                      {result.details.monthlyCompensation}/month
                                    </span>
                                  </>
                                )}
                                {result.type === 'claim' && (
                                  <>
                                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                      {result.details.conditions.length} conditions
                                    </span>
                                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                      Exam: {result.details.examRequired ? 'Required' : 'Not Required'}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchTerm !== '' && results.length === 0 && !isSearching && (
                  <div className="p-8 text-center">
                    <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-400">No results found for "{searchTerm}"</p>
                    <p className="text-sm text-slate-500 mt-2">Try searching by veteran name, file number, or claim ID</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↑↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↵</kbd>
                      <span>Select</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">ESC</kbd>
                      <span>Close</span>
                    </span>
                  </div>
                  <button
                    onClick={() => router.push('/search')}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Advanced Search →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}