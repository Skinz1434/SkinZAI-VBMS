import './globals.css';
import type { Metadata } from 'next';
import QBitChatbot from './components/QBitChatbot';
import { AuthProvider } from './components/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://skinzai-nova.vercel.app'
  ),
  title: 'NOVA Platform - Next-Gen Operations for Veteran Affairs | Powered by RUMEV1 AI',
  description:
    'NOVA is a comprehensive next-generation platform transforming veteran affairs operations. Powered by the revolutionary RUMEV1 AI model, NOVA eliminates $4.2 billion in unnecessary medical exams through advanced Leiden community detection and XGBoost prediction engines. Streamline claims processing, reduce backlogs by 78%, and deliver faster, more accurate benefits decisions for our nations heroes.',
  keywords: [
    'Veterans Benefits',
    'AI',
    'Medical Exams',
    'RUMEV1',
    'Leiden Algorithm',
    'XGBoost',
    'VA',
    'Healthcare',
  ],
  openGraph: {
    title: 'NOVA Platform - Revolutionizing Veteran Affairs Operations',
    description: 'Next-Generation Operations Platform for Veteran Affairs - Featuring RUMEV1 AI for intelligent claims processing, automated medical evaluations, and comprehensive benefits management',
    type: 'website',
    url: '/',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
          <QBitChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
