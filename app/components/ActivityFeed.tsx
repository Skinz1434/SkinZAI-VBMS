'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { massiveMockDatabase } from '../lib/massiveMockData';

export interface ActivityItem {
  id: string;
  type: 'claim_created' | 'claim_updated' | 'exam_scheduled' | 'exam_completed' | 'decision_rendered' | 'document_uploaded' | 'user_login' | 'ai_analysis' | 'exam_eliminated';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  veteranId?: string;
  veteranName?: string;
  claimId?: string;
  entityType: 'claim' | 'exam' | 'document' | 'user' | 'system';
  importance: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  limit?: number;
  showFilters?: boolean;
  compact?: boolean;
  autoRefresh?: boolean;
}

export default function ActivityFeed({ 
  limit = 20, 
  showFilters = true, 
  compact = false,
  autoRefresh = true 
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'claims' | 'exams' | 'system' | 'user'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    generateActivityFeed();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        addRealtimeActivity();
        setLastUpdate(new Date());
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const generateActivityFeed = () => {
    const activityTemplates = [
      {
        type: 'claim_created' as const,
        entityType: 'claim' as const,
        importance: 'medium' as const,
        titles: ['New Claim Submitted', 'Disability Claim Filed'],
        descriptions: [
          'Initial claim for PTSD and hearing loss submitted',
          'Increase claim filed for existing conditions',
          'New disability compensation claim initiated'
        ]
      },
      {
        type: 'claim_updated' as const,
        entityType: 'claim' as const,
        importance: 'medium' as const,
        titles: ['Claim Status Updated', 'Claim Progress'],
        descriptions: [
          'Moved to Evidence Gathering phase',
          'Additional evidence requested from veteran',
          'Claim moved to Ready for Decision status'
        ]
      },
      {
        type: 'ai_analysis' as const,
        entityType: 'system' as const,
        importance: 'high' as const,
        titles: ['RUMEV1 Analysis Complete', 'AI Processing Finished'],
        descriptions: [
          'RUMEV1 determined exam not required with 94% confidence',
          'AI analysis suggests 70% rating for PTSD condition',
          'Machine learning model identified favorable evidence'
        ]
      },
      {
        type: 'exam_eliminated' as const,
        entityType: 'exam' as const,
        importance: 'high' as const,
        titles: ['C&P Exam Eliminated', 'Exam Waived by AI'],
        descriptions: [
          'RUMEV1 eliminated need for C&P exam - saved $3,500',
          'Sufficient evidence found to proceed without exam',
          'AI confidence level allows exam elimination'
        ]
      },
      {
        type: 'decision_rendered' as const,
        entityType: 'claim' as const,
        importance: 'high' as const,
        titles: ['Rating Decision Complete', 'Claim Decision Rendered'],
        descriptions: [
          'Favorable decision: 70% service connected for PTSD',
          'Increase granted: 30% to 50% for hearing loss',
          'New service connection established'
        ]
      },
      {
        type: 'document_uploaded' as const,
        entityType: 'document' as const,
        importance: 'low' as const,
        titles: ['New Document Received', 'Evidence Uploaded'],
        descriptions: [
          'Medical records from private physician received',
          'Service treatment records uploaded to eFolder',
          'VA examination report added to claim file'
        ]
      },
      {
        type: 'user_login' as const,
        entityType: 'user' as const,
        importance: 'low' as const,
        titles: ['User Activity', 'System Access'],
        descriptions: [
          'Rating Specialist logged into system',
          'Supervisor accessed claim for quality review',
          'Contract examiner reviewed pending exams'
        ]
      }
    ];

    const generatedActivities: ActivityItem[] = [];
    const randomClaims = massiveMockDatabase.claims.slice(0, 30);
    const randomVeterans = massiveMockDatabase.veterans.slice(0, 20);
    
    for (let i = 0; i < limit * 2; i++) {
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      const claim = randomClaims[Math.floor(Math.random() * randomClaims.length)];
      const veteran = randomVeterans[Math.floor(Math.random() * randomVeterans.length)];
      
      generatedActivities.push({
        id: `activity-${i + 1}`,
        type: template.type,
        title: template.titles[Math.floor(Math.random() * template.titles.length)],
        description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        entityType: template.entityType,
        importance: template.importance,
        claimId: claim?.id,
        veteranId: veteran?.id,
        veteranName: veteran?.name,
        userName: [
          'Rating Specialist Johnson', 'Rating Specialist Davis', 'Supervisor Williams',
          'Quality Review Specialist', 'RUMEV1 AI System', 'Contract Examiner'
        ][Math.floor(Math.random() * 6)],
        metadata: {
          confidence: template.type === 'ai_analysis' ? Math.floor(Math.random() * 20) + 80 : undefined,
          rating: template.type === 'decision_rendered' ? [10, 20, 30, 40, 50, 70, 100][Math.floor(Math.random() * 7)] : undefined,
          savings: template.type === 'exam_eliminated' ? 3500 : undefined
        }
      });
    }

    setActivities(generatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit));
    setIsLoading(false);
  };

  const addRealtimeActivity = () => {
    const realtimeTemplates = [
      {
        type: 'ai_analysis' as const,
        title: 'RUMEV1 Analysis Complete',
        description: `AI determined exam not required with ${90 + Math.floor(Math.random() * 10)}% confidence`,
        entityType: 'system' as const,
        importance: 'high' as const
      },
      {
        type: 'claim_updated' as const,
        title: 'Claim Status Updated',
        description: 'Automatically moved to development phase',
        entityType: 'claim' as const,
        importance: 'medium' as const
      },
      {
        type: 'exam_eliminated' as const,
        title: 'C&P Exam Eliminated',
        description: 'RUMEV1 saved $3,500 by eliminating unnecessary exam',
        entityType: 'exam' as const,
        importance: 'high' as const
      }
    ];

    if (Math.random() < 0.4) {
      const template = realtimeTemplates[Math.floor(Math.random() * realtimeTemplates.length)];
      const newActivity: ActivityItem = {
        id: `activity-realtime-${Date.now()}`,
        ...template,
        timestamp: new Date(),
        userName: 'RUMEV1 AI System'
      };

      setActivities(prev => [newActivity, ...prev.slice(0, limit - 1)]);
    }
  };

  const filteredActivities = activities.filter(activity => {
    switch (filter) {
      case 'claims': return activity.entityType === 'claim';
      case 'exams': return activity.entityType === 'exam' || activity.type === 'exam_eliminated';
      case 'system': return activity.entityType === 'system' || activity.type === 'ai_analysis';
      case 'user': return activity.entityType === 'user';
      default: return true;
    }
  });

  const getActivityIcon = (type: string) => {
    const icons = {
      'claim_created': '📝',
      'claim_updated': '📋',
      'exam_scheduled': '🩺',
      'exam_completed': '✅',
      'exam_eliminated': '🚫',
      'decision_rendered': '⚖️',
      'document_uploaded': '📄',
      'user_login': '👤',
      'ai_analysis': '🤖'
    };
    return icons[type] || '📄';
  };

  const getImportanceColor = (importance: string) => {
    const colors = {
      'low': 'text-slate-500',
      'medium': 'text-blue-400',
      'high': 'text-emerald-400'
    };
    return colors[importance] || colors.medium;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📊</span>
          </div>
          <div>
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-slate-100`}>
              Activity Feed
            </h3>
            <p className="text-xs text-slate-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
              {autoRefresh && <span className="ml-2">🔄 Live</span>}
            </p>
          </div>
        </div>

        {showFilters && (
          <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'claims', label: 'Claims' },
              { key: 'exams', label: 'Exams' },
              { key: 'system', label: 'AI' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`space-y-${compact ? '3' : '4'} max-h-96 overflow-y-auto`}>
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 group">
            <div className={`w-${compact ? '6' : '8'} h-${compact ? '6' : '8'} bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700 transition-colors`}>
              <span className={compact ? 'text-sm' : 'text-base'}>
                {getActivityIcon(activity.type)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`${compact ? 'text-sm' : 'text-sm'} font-medium text-slate-100 group-hover:text-blue-400 transition-colors`}>
                  {activity.title}
                </h4>
                <span className={`text-xs ${getImportanceColor(activity.importance)} flex-shrink-0`}>
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              
              <p className={`${compact ? 'text-xs' : 'text-sm'} text-slate-400 mt-1`}>
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  {activity.veteranName && (
                    <span>👤 {activity.veteranName}</span>
                  )}
                  {activity.claimId && (
                    <Link 
                      href={`/claims/${activity.claimId}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      📋 {activity.claimId}
                    </Link>
                  )}
                  {activity.userName && (
                    <span>👨‍💼 {activity.userName}</span>
                  )}
                </div>
                
                {activity.metadata && (
                  <div className="flex items-center space-x-2 text-xs">
                    {activity.metadata.confidence && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                        {activity.metadata.confidence}% confidence
                      </span>
                    )}
                    {activity.metadata.rating && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {activity.metadata.rating}% rating
                      </span>
                    )}
                    {activity.metadata.savings && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                        ${activity.metadata.savings.toLocaleString()} saved
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredActivities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-2">No activities found</p>
          <p className="text-xs text-slate-500">Try adjusting your filter</p>
        </div>
      )}
    </div>
  );
}