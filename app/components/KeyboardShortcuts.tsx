'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
  category: 'navigation' | 'search' | 'actions' | 'ui';
}

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcuts] = useState<Shortcut[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if ((e.ctrlKey || e.metaKey)) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Search is handled by GlobalSearch component
            break;
          case '/':
            e.preventDefault();
            setIsOpen(true);
            break;
          case 'd':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'h':
            e.preventDefault();
            router.push('/');
            break;
          case ',':
            e.preventDefault();
            router.push('/settings');
            break;
        }
      }

      // Navigation shortcuts (no modifier)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';
        
        if (!isInputElement) {
          switch (e.key) {
            case '?':
              e.preventDefault();
              setIsOpen(true);
              break;
            case 'Escape':
              setIsOpen(false);
              break;
            case '1':
              e.preventDefault();
              router.push('/dashboard');
              break;
            case '2':
              e.preventDefault();
              router.push('/claims');
              break;
            case '3':
              e.preventDefault();
              router.push('/efolder');
              break;
            case '4':
              e.preventDefault();
              router.push('/exams');
              break;
            case '5':
              e.preventDefault();
              router.push('/analytics');
              break;
            case '6':
              e.preventDefault();
              router.push('/orchestration');
              break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const shortcutCategories = {
    navigation: [
      { keys: ['Ctrl', 'H'], description: 'Go to Home', shortcut: 'ctrl+h' },
      { keys: ['Ctrl', 'D'], description: 'Go to Dashboard', shortcut: 'ctrl+d' },
      { keys: ['1'], description: 'Dashboard', shortcut: '1' },
      { keys: ['2'], description: 'Claims', shortcut: '2' },
      { keys: ['3'], description: 'eFolder', shortcut: '3' },
      { keys: ['4'], description: 'Exams', shortcut: '4' },
      { keys: ['5'], description: 'Analytics', shortcut: '5' },
      { keys: ['6'], description: 'Orchestration', shortcut: '6' }
    ],
    search: [
      { keys: ['Ctrl', 'K'], description: 'Global Search', shortcut: 'ctrl+k' },
      { keys: ['/'], description: 'Focus Search', shortcut: '/' },
      { keys: ['Ctrl', 'F'], description: 'Find in Page', shortcut: 'ctrl+f' }
    ],
    ui: [
      { keys: ['?'], description: 'Show Shortcuts', shortcut: '?' },
      { keys: ['Escape'], description: 'Close Modal/Panel', shortcut: 'esc' },
      { keys: ['Ctrl', ','], description: 'Open Settings', shortcut: 'ctrl+,' }
    ],
    actions: [
      { keys: ['Ctrl', 'S'], description: 'Save Changes', shortcut: 'ctrl+s' },
      { keys: ['Ctrl', 'Enter'], description: 'Submit Form', shortcut: 'ctrl+enter' },
      { keys: ['Ctrl', 'R'], description: 'Refresh Data', shortcut: 'ctrl+r' }
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⌨️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Keyboard Shortcuts</h2>
                <p className="text-sm text-slate-400">Navigate faster with keyboard shortcuts</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Shortcuts Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(shortcutCategories).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-slate-100 mb-4 capitalize flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>{category}</span>
                </h3>
                
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-sm text-slate-300">{shortcut.description}</span>
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center">
                            <kbd className="px-2 py-1 text-xs font-semibold text-slate-200 bg-slate-700 border border-slate-600 rounded">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-slate-500">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 bg-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-slate-500">
              <span>Press <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">?</kbd> to show shortcuts</span>
              <span>Press <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">Esc</kbd> to close</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-slate-400">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs">Enable shortcuts</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}