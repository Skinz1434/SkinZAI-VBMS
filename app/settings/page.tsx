'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';
import { useAuth } from '../components/AuthProvider';

interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    claimUpdates: boolean;
    examReminders: boolean;
    systemAlerts: boolean;
    weeklyDigest: boolean;
  };
  display: {
    language: string;
    timezone: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    density: 'compact' | 'comfortable' | 'spacious';
  };
  privacy: {
    profileVisibility: 'public' | 'organization' | 'private';
    shareAnalytics: boolean;
    autoLogout: number; // minutes
    requireMFAForSensitive: boolean;
  };
  workflow: {
    defaultView: 'list' | 'kanban' | 'timeline';
    autoRefresh: boolean;
    refreshInterval: number; // seconds
    showTooltips: boolean;
    enableKeyboardShortcuts: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    screenReader: boolean;
  };
}

export default function SettingsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy' | 'security' | 'integrations'>('profile');
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      claimUpdates: true,
      examReminders: true,
      systemAlerts: false,
      weeklyDigest: true
    },
    display: {
      language: 'en-US',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      density: 'comfortable'
    },
    privacy: {
      profileVisibility: 'organization',
      shareAnalytics: false,
      autoLogout: 30,
      requireMFAForSensitive: true
    },
    workflow: {
      defaultView: 'list',
      autoRefresh: true,
      refreshInterval: 30,
      showTooltips: true,
      enableKeyboardShortcuts: true
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      screenReader: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user, updateUser, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
    loadUserPreferences();
  }, []);

  const loadUserPreferences = () => {
    const saved = localStorage.getItem('nova-user-preferences');
    if (saved) {
      try {
        const savedPrefs = JSON.parse(saved);
        setPreferences({ ...preferences, ...savedPrefs });
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('nova-user-preferences', JSON.stringify(preferences));
    
    // Update user preferences in auth context
    if (updateUser) {
      updateUser({ preferences: preferences as any });
    }
    
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const updatePreference = (section: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      setPreferences({
        theme: 'dark',
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          claimUpdates: true,
          examReminders: true,
          systemAlerts: false,
          weeklyDigest: true
        },
        display: {
          language: 'en-US',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          density: 'comfortable'
        },
        privacy: {
          profileVisibility: 'organization',
          shareAnalytics: false,
          autoLogout: 30,
          requireMFAForSensitive: true
        },
        workflow: {
          defaultView: 'list',
          autoRefresh: true,
          refreshInterval: 30,
          showTooltips: true,
          enableKeyboardShortcuts: true
        },
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium',
          screenReader: false
        }
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-slate-400 mb-6">Please sign in to access settings</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <WelcomeModal
        pageName="settings"
        title="User Settings & Preferences"
        description="Personalize your NOVA experience with comprehensive settings for notifications, privacy, accessibility, and workflow preferences. NOVA is powered by RUMEV1 AI technology for intelligent claims processing."
        features={[
          "Comprehensive notification and privacy controls",
          "Accessibility settings for enhanced usability",
          "Workflow customization and display preferences",
          "Security settings and multi-factor authentication"
        ]}
        demoActions={[
          { label: 'Configure Notifications', action: () => setSelectedTab('notifications') },
          { label: 'Privacy Settings', action: () => setSelectedTab('privacy') },
          { label: 'Accessibility Options', action: () => setSelectedTab('preferences') }
        ]}
      />

      <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Settings</h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {lastSaved && (
              <div className="text-sm text-slate-400">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
            >
              Reset to Defaults
            </button>
            <button
              onClick={savePreferences}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              {isSaving && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sticky top-24">
                <nav className="space-y-1">
                  {[
                    { id: 'profile', label: 'Profile & Account', icon: '👤' },
                    { id: 'preferences', label: 'Display & Accessibility', icon: '🎨' },
                    { id: 'notifications', label: 'Notifications', icon: '🔔' },
                    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
                    { id: 'security', label: 'Security Settings', icon: '🛡️' },
                    { id: 'integrations', label: 'Integrations', icon: '🔗' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTab === tab.id
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {selectedTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-slate-100 mb-6">Profile Information</h2>
                    
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-slate-400">{user?.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                            {user?.role}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{user?.organization}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                        <input
                          type="text"
                          value={user?.firstName || ''}
                          onChange={(e) => updateUser?.({ firstName: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={user?.lastName || ''}
                          onChange={(e) => updateUser?.({ lastName: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 opacity-50 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed. Contact your administrator.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                        <input
                          type="text"
                          value={user?.organization || ''}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 opacity-50 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-slate-500 mt-1">Organization managed by administrators.</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-slate-100 mb-6">Account Status</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-200">Account Status</p>
                          <p className="text-sm text-slate-400">Your account is active and in good standing</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-200">Last Login</p>
                          <p className="text-sm text-slate-400">Track your recent access</p>
                        </div>
                        <span className="text-sm text-slate-300">
                          {user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-200">Session Timeout</p>
                          <p className="text-sm text-slate-400">Automatic logout after inactivity</p>
                        </div>
                        <span className="text-sm text-slate-300">{preferences.privacy.autoLogout} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tab content would continue here... */}
              {selectedTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-slate-100 mb-6">Display Preferences</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['dark', 'light', 'auto'].map((theme) => (
                            <button
                              key={theme}
                              onClick={() => updatePreference('theme', 'theme', theme)}
                              className={`p-3 border rounded-lg transition-colors capitalize ${
                                preferences.theme === theme
                                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                  : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                          <select
                            value={preferences.display.language}
                            onChange={(e) => updatePreference('display', 'language', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="es-ES">Spanish</option>
                            <option value="fr-FR">French</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                          <select
                            value={preferences.display.timezone}
                            onChange={(e) => updatePreference('display', 'timezone', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}