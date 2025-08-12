import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkinZAI VBMS',
  description: 'Veterans Benefits Management System',
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-200">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-800 p-4">
            <h2 className="text-xl font-bold mb-4">SkinZAI VBMS</h2>
            <nav className="space-y-2">
              <a href="/" className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</a>
              <a href="/search" className="block px-3 py-2 rounded hover:bg-gray-700">Search</a>
              <a href="/claims" className="block px-3 py-2 rounded hover:bg-gray-700">Claims</a>
              <a href="/efolder" className="block px-3 py-2 rounded hover:bg-gray-700">eFolder</a>
              <a href="/development" className="block px-3 py-2 rounded hover:bg-gray-700">Development</a>
              <a href="/decisions" className="block px-3 py-2 rounded hover:bg-gray-700">Decisions</a>
              <a href="/queue" className="block px-3 py-2 rounded hover:bg-gray-700">Work Queue</a>
              <a href="/admin" className="block px-3 py-2 rounded hover:bg-gray-700">Admin</a>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
