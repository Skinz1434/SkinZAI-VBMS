import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkinZAI VBMS - Revolutionary AI-Powered Veterans Benefits',
  description: 'Eliminating $4.2 billion in unnecessary medical exams through revolutionary AI, Leiden community detection, and XGBoost prediction engines. The future of Veterans Benefits Management.',
  keywords: ['Veterans Benefits', 'AI', 'Medical Exams', 'RUMEV1', 'Leiden Algorithm', 'XGBoost', 'VA', 'Healthcare'],
  openGraph: {
    title: 'SkinZAI VBMS - The Future of Veterans Benefits',
    description: 'Revolutionary AI-Powered Veterans Benefits Management System',
    type: 'website',
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
        {children}
      </body>
    </html>
  );
}
