'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <div className="pt-16 transition-all duration-300">
        <main className="ml-16 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}