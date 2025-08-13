'use client';

import { ReactNode, useState, useEffect } from 'react';
import Navigation from './Navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState('ml-64');

  useEffect(() => {
    // Check sidebar state to set proper margin
    const checkSidebarState = () => {
      const sidebarOpen = localStorage.getItem('nova-sidebar-open');
      if (sidebarOpen !== null) {
        setSidebarWidth(JSON.parse(sidebarOpen) ? 'ml-64' : 'ml-16');
      }
    };

    checkSidebarState();
    // Listen for storage changes
    window.addEventListener('storage', checkSidebarState);
    
    return () => {
      window.removeEventListener('storage', checkSidebarState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <div className="pt-16 transition-all duration-300">
        <main className={`${sidebarWidth} transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}