'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const pathname = usePathname();
  const router = useRouter();
  const navScrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // Load sidebar preference and scroll position
  useEffect(() => {
    const saved = localStorage.getItem('nova-sidebar-open');
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    }
    
    // Restore scroll position
    const savedScrollPosition = sessionStorage.getItem('nova-nav-scroll');
    if (savedScrollPosition && navScrollRef.current) {
      navScrollRef.current.scrollTop = parseInt(savedScrollPosition, 10);
    }
  }, []);

  // Preserve scroll position on route change
  useEffect(() => {
    if (navScrollRef.current && scrollPositionRef.current > 0) {
      navScrollRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [pathname]);

  // Save sidebar preference
  useEffect(() => {
    localStorage.setItem('nova-sidebar-open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Save scroll position on scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollPositionRef.current = e.currentTarget.scrollTop;
    sessionStorage.setItem('nova-nav-scroll', String(e.currentTarget.scrollTop));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navigationItems = [
    {
      category: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: '🏠', badge: null },
        { name: 'Claims Management', href: '/claims', icon: '📋', badge: '121' },
        { name: 'Veterans', href: '/veterans', icon: '🎖️', badge: '50+' },
        { name: 'AI Orchestration', href: '/ai-orchestration', icon: '🤖', badge: 'Live' },
      ]
    },
    {
      category: 'Processing',
      items: [
        { name: 'Document Review', href: '/documents', icon: '📄', badge: '551' },
        { name: 'MDEO Workflow', href: '/mdeo', icon: '🔄', badge: null },
        { name: 'Quality Review', href: '/quality', icon: '✅', badge: '12' },
        { name: 'Appeals', href: '/appeals', icon: '⚖️', badge: '8' },
      ]
    },
    {
      category: 'Analytics',
      items: [
        { name: 'Performance', href: '/analytics', icon: '📊', badge: null },
        { name: 'Reports', href: '/reports', icon: '📈', badge: null },
        { name: 'Audit Logs', href: '/audit', icon: '🔍', badge: null },
        { name: 'Metrics', href: '/metrics', icon: '📉', badge: null },
      ]
    },
    {
      category: 'Administration',
      items: [
        { name: 'Organizations', href: '/organizations', icon: '🏢', badge: null },
        { name: 'Users & Roles', href: '/users', icon: '👥', badge: null },
        { name: 'Settings', href: '/settings', icon: '⚙️', badge: null },
        { name: 'Integrations', href: '/integrations', icon: '🔗', badge: null },
      ]
    },
    {
      category: 'Support',
      items: [
        { name: 'Help Center', href: '/help', icon: '❓', badge: null },
        { name: 'Documentation', href: '/docs', icon: '📚', badge: null },
        { name: 'Training', href: '/training', icon: '🎓', badge: null },
        { name: 'Contact Support', href: '/support', icon: '💬', badge: null },
      ]
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NV</span>
              </div>
              <span className="text-lg font-semibold text-slate-100 hidden md:block">NOVA Platform</span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-400">
              <span>/</span>
              <span className="text-slate-200">{pathname === '/' ? 'Dashboard' : pathname.slice(1).split('/')[0].charAt(0).toUpperCase() + pathname.slice(1).split('/')[0].slice(1)}</span>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search veterans, claims, documents..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors hidden md:block">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Help */}
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors hidden md:block">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slate-800/50 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <svg className="w-4 h-4 text-slate-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-2">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-sm font-medium text-slate-200">John Doe</p>
                    <p className="text-xs text-slate-400">john.doe@va.gov</p>
                    <p className="text-xs text-emerald-400">Administrator</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                    Profile Settings
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                    Preferences
                  </Link>
                  <Link href="/activity" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                    Activity Log
                  </Link>
                  <div className="border-t border-slate-800 mt-2 pt-2">
                    <button className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div ref={navScrollRef} onScroll={handleScroll} className="h-full overflow-y-auto scroll-smooth">
          <nav className="p-4 space-y-6">
            {navigationItems.map((section) => (
              <div key={section.category}>
                {sidebarOpen && (
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {section.category}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg ${!sidebarOpen && 'mx-auto'}`}>{item.icon}</span>
                          {sidebarOpen && (
                            <span className="text-sm font-medium">{item.name}</span>
                          )}
                        </div>
                        {sidebarOpen && item.badge && (
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>System Status</span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-emerald-400">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Version</span>
                  <span>v2.4.1</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}