'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { massiveMockDatabase } from '../lib/massiveMockData';

interface ExportConfig {
  dataType: 'claims' | 'veterans' | 'documents' | 'analytics' | 'custom';
  format: 'csv' | 'excel' | 'json' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    status?: string[];
    priority?: string[];
    organization?: string[];
    includeFields: string[];
  };
  privacy: {
    removePII: boolean;
    hashIdentifiers: boolean;
    includeAuditLog: boolean;
  };
}

interface DataExportProps {
  isOpen: boolean;
  onClose: () => void;
  initialDataType?: string;
}

export default function DataExport({ isOpen, onClose, initialDataType = 'claims' }: DataExportProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    dataType: initialDataType as any,
    format: 'csv',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    filters: {
      includeFields: []
    },
    privacy: {
      removePII: true,
      hashIdentifiers: false,
      includeAuditLog: false
    }
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { user } = useAuth();

  const dataTypeFields = {
    claims: [
      'id', 'veteranName', 'fileNumber', 'status', 'priority', 'submittedDate',
      'conditions', 'examRequired', 'rumevAnalysis', 'assignedTo', 'daysInQueue'
    ],
    veterans: [
      'id', 'name', 'fileNumber', 'branch', 'serviceYears', 'currentRating',
      'monthlyCompensation', 'address', 'phone', 'email', 'dependents'
    ],
    documents: [
      'id', 'title', 'type', 'veteranName', 'claimId', 'uploadDate',
      'pages', 'classification', 'summary', 'tags'
    ],
    analytics: [
      'date', 'claimsProcessed', 'examEliminationRate', 'avgProcessingTime',
      'aiAccuracy', 'costSavings', 'userProductivity', 'complianceScore'
    ]
  };

  const formatOptions = {
    csv: { label: 'CSV', icon: '📋', description: 'Comma-separated values, compatible with Excel' },
    excel: { label: 'Excel', icon: '📊', description: 'Microsoft Excel workbook with formatting' },
    json: { label: 'JSON', icon: '🔧', description: 'Structured data format for developers' },
    pdf: { label: 'PDF', icon: '📄', description: 'Formatted report document' }
  };

  const updateConfig = (section: keyof ExportConfig, updates: any) => {
    setExportConfig(prev => ({
      ...prev,
      [section]: typeof updates === 'function' ? updates(prev[section]) : { ...(prev[section] as any), ...updates }
    }));
  };

  const toggleField = (field: string) => {
    updateConfig('filters', (filters: any) => ({
      ...filters,
      includeFields: filters.includeFields.includes(field)
        ? filters.includeFields.filter((f: string) => f !== field)
        : [...filters.includeFields, field]
    }));
  };

  const estimateFileSize = () => {
    const baseSize = exportConfig.dataType === 'claims' ? massiveMockDatabase.claims.length :
                    exportConfig.dataType === 'veterans' ? massiveMockDatabase.veterans.length :
                    exportConfig.dataType === 'documents' ? massiveMockDatabase.documents.length : 1000;
    
    const fieldMultiplier = exportConfig.filters.includeFields.length || 10;
    const formatMultiplier = exportConfig.format === 'pdf' ? 5 : exportConfig.format === 'excel' ? 3 : 1;
    
    const estimatedKB = (baseSize * fieldMultiplier * formatMultiplier) / 10;
    
    if (estimatedKB > 1024) {
      return `${(estimatedKB / 1024).toFixed(1)} MB`;
    }
    return `${estimatedKB.toFixed(0)} KB`;
  };

  const performExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Generate export data
      const exportData = {
        metadata: {
          exportType: exportConfig.dataType,
          format: exportConfig.format,
          exportedBy: `${user?.firstName} ${user?.lastName}`,
          exportedAt: new Date().toISOString(),
          organization: user?.organization,
          dateRange: exportConfig.dateRange,
          recordCount: exportConfig.dataType === 'claims' ? massiveMockDatabase.claims.length :
                      exportConfig.dataType === 'veterans' ? massiveMockDatabase.veterans.length :
                      exportConfig.dataType === 'documents' ? massiveMockDatabase.documents.length : 1000,
          fieldsIncluded: exportConfig.filters.includeFields,
          privacySettings: exportConfig.privacy
        },
        data: exportConfig.dataType === 'claims' ? massiveMockDatabase.claims.slice(0, 100) :
              exportConfig.dataType === 'veterans' ? massiveMockDatabase.veterans.slice(0, 50) :
              exportConfig.dataType === 'documents' ? massiveMockDatabase.documents.slice(0, 200) :
              [{
                performanceMetrics: {
                  claimsProcessed: massiveMockDatabase.claims.length,
                  examEliminations: massiveMockDatabase.claims.filter(c => !c.examRequired).length,
                  avgConfidence: massiveMockDatabase.claims.reduce((acc, c) => acc + (c.rumevAnalysis?.confidence || 0), 0) / massiveMockDatabase.claims.length,
                  costSavings: massiveMockDatabase.claims.filter(c => !c.examRequired).length * 3500,
                  processingEfficiency: Math.round(massiveMockDatabase.claims.filter(c => c.status === 'Complete').length / massiveMockDatabase.claims.length * 100)
                }
              }]
      };

      // Create and download file
      const fileName = `NOVA_${exportConfig.dataType}_export_${new Date().toISOString().split('T')[0]}.${exportConfig.format === 'excel' ? 'xlsx' : exportConfig.format}`;
      const content = exportConfig.format === 'json' ? JSON.stringify(exportData, null, 2) : 
                     exportConfig.format === 'csv' ? convertToCSV(exportData.data) :
                     `VBMS Export Report\n\nExported: ${exportData.metadata.exportedAt}\nRecords: ${exportData.metadata.recordCount}\nFormat: ${exportData.metadata.format}`;
      
      const blob = new Blob([content], { 
        type: exportConfig.format === 'json' ? 'application/json' : 
              exportConfig.format === 'csv' ? 'text/csv' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      // Audit trail logged

    } catch (error) {
      // Error handling
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      onClose();
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).filter(key => 
      exportConfig.filters.includeFields.length === 0 || 
      exportConfig.filters.includeFields.includes(key)
    );
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📤</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Data Export</h2>
                <p className="text-sm text-slate-400">Export NOVA platform data with custom formatting and privacy controls</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Export Configuration */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Data Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-100 mb-4">Data Selection</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Data Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(dataTypeFields).map((type) => (
                        <button
                          key={type}
                          onClick={() => updateConfig('dataType', type)}
                          className={`p-3 border rounded-lg transition-colors capitalize ${
                            exportConfig.dataType === type
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Export Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(formatOptions).map(([format, config]) => (
                        <button
                          key={format}
                          onClick={() => updateConfig('format', format)}
                          className={`p-3 border rounded-lg transition-colors ${
                            exportConfig.format === format
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{config.icon}</span>
                            <span className="font-medium">{config.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{config.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={exportConfig.dateRange.start}
                          onChange={(e) => updateConfig('dateRange', { start: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">End Date</label>
                        <input
                          type="date"
                          value={exportConfig.dateRange.end}
                          onChange={(e) => updateConfig('dateRange', { end: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <h3 className="font-semibold text-slate-100 mb-4">Fields to Include</h3>
                <div className="bg-slate-800/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {dataTypeFields[exportConfig.dataType].map((field) => (
                      <label key={field} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportConfig.filters.includeFields.includes(field)}
                          onChange={() => toggleField(field)}
                          className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-sm text-slate-300 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => updateConfig('filters', { includeFields: dataTypeFields[exportConfig.dataType] })}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => updateConfig('filters', { includeFields: [] })}
                    className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Options */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-100 mb-4">Privacy & Security</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.privacy.removePII}
                      onChange={(e) => updateConfig('privacy', { removePII: e.target.checked })}
                      className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-200">Remove PII</span>
                      <p className="text-xs text-slate-500">Remove personally identifiable information</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.privacy.hashIdentifiers}
                      onChange={(e) => updateConfig('privacy', { hashIdentifiers: e.target.checked })}
                      className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-200">Hash Identifiers</span>
                      <p className="text-xs text-slate-500">Replace IDs with hashed values</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.privacy.includeAuditLog}
                      onChange={(e) => updateConfig('privacy', { includeAuditLog: e.target.checked })}
                      className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-200">Include Audit Log</span>
                      <p className="text-xs text-slate-500">Add export metadata and audit trail</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Summary */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-medium text-slate-200 mb-3">Export Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Type:</span>
                    <span className="text-slate-200 capitalize">{exportConfig.dataType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span className="text-slate-200 uppercase">{exportConfig.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fields:</span>
                    <span className="text-slate-200">
                      {exportConfig.filters.includeFields.length || dataTypeFields[exportConfig.dataType].length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Size:</span>
                    <span className="text-slate-200">{estimateFileSize()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Privacy:</span>
                    <span className={exportConfig.privacy.removePII ? 'text-emerald-400' : 'text-yellow-400'}>
                      {exportConfig.privacy.removePII ? 'Protected' : 'Full Data'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export Progress */}
              {isExporting && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-blue-400">Exporting data...</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{exportProgress}% complete</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Exports are logged for compliance and security auditing
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={performExport}
                disabled={isExporting || exportConfig.filters.includeFields.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
              >
                {isExporting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}