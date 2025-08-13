'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface DocItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  lastUpdated: string;
  version: string;
  author: string;
  tags: string[];
  type: 'guide' | 'api' | 'reference' | 'tutorial' | 'policy';
}

export default function DocsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const documentation: DocItem[] = [
    {
      id: 'DOC-001',
      title: 'NOVA Platform Overview',
      category: 'Getting Started',
      description: 'Comprehensive introduction to the NOVA platform and its capabilities',
      content: `# NOVA Platform Overview

## Introduction

NOVA (Next-gen Operations for Veteran Affairs) is a cutting-edge platform that revolutionizes veteran benefits processing through artificial intelligence and streamlined workflows. Powered by RUMEV1 AI technology, NOVA transforms how disability compensation claims are evaluated and processed.

## Core Features

### AI-Powered Analysis
- **RUMEV1 Technology**: Our proprietary AI model that reduces unnecessary medical examinations by 62%
- **Multi-Agent Architecture**: Specialized AI agents working in concert for comprehensive analysis
- **96.4% Accuracy**: Industry-leading accuracy in claim processing decisions
- **Real-time Processing**: Average claim analysis time of 4.2 minutes

### Claims Management
- Unified dashboard for all active claims
- Automated workflow assignment
- Evidence development tracking
- Quality review integration

### Document Processing
- Intelligent OCR and data extraction
- Automated categorization
- Evidence synthesis
- Version control and audit trails

## System Architecture

### Technology Stack
- **Frontend**: Next.js 14 with React 18
- **UI Framework**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: OAuth 2.0 with PIV card support
- **API**: RESTful services with GraphQL support

### Security Features
- End-to-end encryption
- FISMA compliance
- FedRAMP authorization
- Continuous monitoring
- Role-based access control

## Getting Started

### Access Requirements
1. Valid government-issued PIV card
2. Authorized NOVA account
3. Completed security training
4. System access approval

### First Login
1. Navigate to the NOVA portal
2. Insert PIV card into reader
3. Select appropriate certificate
4. Enter PIN when prompted
5. Complete two-factor authentication

### Navigation
- **Dashboard**: Real-time metrics and quick stats
- **Claims**: Active claim management
- **Analytics**: Performance tracking
- **AI Orchestration**: Monitor AI system performance
- **Settings**: User preferences and configuration

## Support

For technical assistance, contact the NOVA support team:
- Phone: 1-800-NOVA-HELP
- Email: support@nova.va.gov
- Portal: Access through Help Center`,
      lastUpdated: '2024-01-12',
      version: '1.0',
      author: 'NOVA Documentation Team',
      tags: ['overview', 'getting started', 'introduction', 'platform'],
      type: 'guide'
    },
    {
      id: 'DOC-002',
      title: 'RUMEV1 AI Implementation Guide',
      category: 'AI Documentation',
      description: 'Technical guide for understanding and implementing RUMEV1 AI capabilities',
      content: `# RUMEV1 AI Implementation Guide

## Overview

RUMEV1 (Reducing Unnecessary Medical Evaluations Version 1) is the AI engine powering NOVA's intelligent claim analysis. This guide covers technical implementation details and best practices.

## Architecture

### Multi-Agent System
1. **Leiden Detection Agent**: Pattern recognition and anomaly detection
2. **XGBoost Agent**: Predictive modeling and risk assessment
3. **NLP Agent**: Natural language processing for document analysis
4. **Synthesis Agent**: Combines outputs for final recommendations

### Data Pipeline
- Real-time data ingestion
- Preprocessing and normalization
- Feature extraction
- Model inference
- Result aggregation

## Implementation

### API Integration
Use the RUMEV1 API to analyze claims:

POST /api/v1/rumev1/analyze
{
  "claim_id": "CL-2024-123456",
  "conditions": ["lower back strain"],
  "include_confidence": true
}

### Response Handling
{
  "analysis_id": "RUMEV1-789",
  "recommendation": "no_exam_required",
  "confidence": 0.94,
  "reasoning": [...]
}

## Performance Metrics

### Accuracy
- Overall: 96.4%
- False Positive Rate: 2.1%
- False Negative Rate: 1.5%

### Processing Speed
- Average: 4.2 minutes per claim
- Peak capacity: 10,000 claims/hour
- Latency: <100ms for API calls

## Best Practices

### When to Use RUMEV1
1. Standard disability claims
2. Claims with sufficient medical evidence
3. Routine condition evaluations
4. High-volume processing scenarios

### When to Override
1. Complex multi-system conditions
2. Rare or unusual presentations
3. Conflicting medical opinions
4. Special circumstances

## Monitoring

### Key Metrics
- Confidence scores distribution
- Processing time trends
- Override frequency
- Accuracy by condition type

### Alerts
- Low confidence scores (<70%)
- Processing delays
- System errors
- Unusual patterns

## Training and Updates

### Model Training
- Continuous learning from outcomes
- Monthly model updates
- A/B testing for improvements
- Feedback loop integration

### Staff Training
- Understanding AI recommendations
- Proper override procedures
- Confidence score interpretation
- Error identification`,
      lastUpdated: '2024-01-11',
      version: '2.0',
      author: 'AI Development Team',
      tags: ['AI', 'machine learning', 'RUMEV1', 'implementation'],
      type: 'guide'
    },
    {
      id: 'DOC-003',
      title: 'API Reference Documentation',
      category: 'API Documentation',
      description: 'Complete API reference for all NOVA system endpoints',
      content: `# NOVA API Reference

## Authentication

All API endpoints require authentication using Bearer tokens obtained through the OAuth 2.0 flow.

### OAuth 2.0 Flow
1. Client registration with VA Identity Provider
2. Authorization code request
3. Access token exchange
4. API access with Bearer token

### Headers
Authorization: Bearer {access_token}
Content-Type: application/json
X-VA-User: {user_id}
X-VA-Session: {session_id}

## Claims API

### Get Claims List
GET /api/v1/claims

Query Parameters:
- status (string): Filter by claim status
- assigned_to (string): Filter by assignee
- date_from (string): Start date filter (ISO 8601)
- date_to (string): End date filter (ISO 8601)
- limit (integer): Number of results (default: 50, max: 1000)
- offset (integer): Pagination offset

### Get Claim Details
GET /api/v1/claims/{claim_id}

### Update Claim Status
PUT /api/v1/claims/{claim_id}/status

Request Body:
{
  "status": "in_review",
  "assigned_to": "user456",
  "notes": "Beginning detailed medical review"
}

## Documents API

### Upload Document
POST /api/v1/documents

Request (multipart/form-data):
- file: Document file (PDF, TIFF, JPG)
- claim_id: Associated claim ID
- document_type: Type of document
- source: Document source

### Get Document
GET /api/v1/documents/{document_id}

Response:
Binary document content with appropriate Content-Type header

### Get Document Metadata
GET /api/v1/documents/{document_id}/metadata

## Veterans API

### Search Veterans
GET /api/v1/veterans/search

Query Parameters:
- ssn: Social Security Number (last 4 digits minimum)
- file_number: VA file number
- first_name: First name
- last_name: Last name
- dob: Date of birth

### Get Veteran Profile
GET /api/v1/veterans/{veteran_id}

## RUMEV1 API

### Analyze Claim
POST /api/v1/rumev1/analyze

Request Body:
{
  "claim_id": "CL-2024-123456",
  "conditions": ["lower back strain"],
  "include_confidence": true
}

Response:
{
  "analysis_id": "RUMEV1-789",
  "recommendation": "no_exam_required",
  "confidence": 0.94,
  "reasoning": [
    "Sufficient medical evidence available",
    "Clear diagnostic imaging present",
    "Consistent symptom documentation"
  ]
}

## Error Responses

All endpoints return standardized error responses:

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid claim status provided",
    "details": {
      "field": "status",
      "allowed_values": ["pending", "in_review", "completed"]
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req-123456"
}

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Rate Limited
- 500: Internal Server Error

## Rate Limiting

- Default: 1000 requests per hour per user
- Burst: 100 requests per minute
- Headers returned with each response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Webhooks

### Claim Status Updates
POST {webhook_url}

Payload:
{
  "event": "claim.status_changed",
  "claim_id": "CL-2024-123456",
  "old_status": "pending_review",
  "new_status": "in_review",
  "timestamp": "2024-01-15T10:30:00Z"
}

## SDKs and Client Libraries

### JavaScript/Node.js
const NOVA = require('@va/nova-client');

const client = new NOVA.Client({
  baseUrl: 'https://api.nova.va.gov',
  accessToken: 'your-token-here'
});

const claims = await client.claims.list({
  status: 'pending_review',
  limit: 100
});

### Python
from nova_client import NOVAClient

client = NOVAClient(
    base_url='https://api.nova.va.gov',
    access_token='your-token-here'
)

claims = client.claims.list(
    status='pending_review',
    limit=100
)

### Java
NOVAClient client = new NOVAClient.Builder()
    .baseUrl("https://api.nova.va.gov")
    .accessToken("your-token-here")
    .build();

ClaimsList claims = client.claims().list(
    ClaimsListRequest.builder()
        .status("pending_review")
        .limit(100)
        .build()
);`,
      lastUpdated: '2024-01-10',
      version: '1.2',
      author: 'API Documentation Team',
      tags: ['API', 'reference', 'endpoints', 'integration'],
      type: 'api'
    },
    {
      id: 'DOC-004',
      title: 'Claims Processing Procedures',
      category: 'Process Documentation',
      description: 'Detailed procedures and workflows for claims processing staff',
      content: `# Claims Processing Procedures

## Overview

This document outlines the standard operating procedures for processing disability compensation claims in NOVA.

## Initial Claim Review

### Step 1: Claim Assignment
1. Claims are automatically assigned based on:
   - Workload capacity
   - Examiner expertise
   - Geographic considerations
   - Priority indicators

2. Manual reassignment procedures:
   - Supervisor approval required
   - Document reason for reassignment
   - Update system assignment logs

### Step 2: Veteran Verification
1. **Identity Confirmation**
   - Verify SSN matches MPI records
   - Confirm file number accuracy
   - Check for duplicate claims

2. **Service Verification**
   - Review DD-214 or equivalent
   - Confirm service dates
   - Verify honorable discharge status

### Step 3: Claimed Conditions Review
1. **Condition Validation**
   - Ensure conditions are claimed properly
   - Check for related secondary conditions
   - Verify diagnostic codes

2. **Previous Ratings Review**
   - Check for existing ratings
   - Review previous decisions
   - Identify potential increases

## Evidence Development

### Service Treatment Records (STR)
1. **Automatic Requests**
   - System generates NPRC requests
   - 30-day standard processing time
   - Follow-up on outstanding requests

2. **Manual Review Process**
   - Review all available STRs
   - Identify relevant medical entries
   - Document evidence timeline

### C&P Examinations
1. **RUMEV1 Analysis**
   - Review AI recommendation
   - Consider confidence score
   - Document override rationale

2. **Examination Scheduling**
   - Select appropriate examiner
   - Provide complete medical history
   - Schedule within 30 days

3. **Examination Review**
   - Verify completion within 30 days
   - Review for adequacy
   - Request clarification if needed

### Private Medical Records
1. **Authorization Requirements**
   - Signed VA Form 21-4142
   - Specific provider information
   - Date range limitations

2. **Request Process**
   - Send formal request to provider
   - Follow up after 30 days
   - Consider alternative sources

## Rating Decisions

### Medical Analysis
1. **Condition Evaluation**
   - Apply appropriate diagnostic code
   - Use 38 CFR Part 4 criteria
   - Consider functional limitations

2. **Secondary Conditions**
   - Evaluate service-connected disabilities
   - Apply nexus requirements
   - Rate secondary conditions

### Effective Date Determination
1. **Standard Rules**
   - Date of claim receipt
   - Date of reopened claim
   - Special effective date rules

2. **Earlier Effective Date**
   - Clear and unmistakable error
   - Liberalizing law or regulation
   - New evidence with early effective date

### Combined Rating Calculation
1. **VA Math Application**
   - Start with highest rating
   - Apply efficiency formula
   - Round to nearest 10%

2. **Special Considerations**
   - Bilateral conditions
   - Unemployability ratings
   - Temporary total ratings

## Quality Assurance

### Pre-Decision Review
1. **Accuracy Check**
   - Verify calculations
   - Review evidence development
   - Confirm regulatory compliance

2. **Completeness Review**
   - All conditions addressed
   - Proper notifications included
   - Supporting documentation attached

### Decision Letter Generation
1. **Template Selection**
   - Choose appropriate template
   - Customize for specific case
   - Include all required elements

2. **Review Process**
   - Supervisor review if required
   - Spell check and grammar
   - Final accuracy verification

## Special Situations

### Presumptive Conditions
1. **Agent Orange**
   - Verify Vietnam service
   - Check presumptive condition list
   - Apply presumptive effective date

2. **Gulf War Illness**
   - Confirm Gulf War service
   - Review chronic symptoms
   - Apply presumptive criteria

### Fully Developed Claims
1. **Evidence Requirements**
   - All evidence submitted
   - No additional development needed
   - Expedited processing timeline

2. **Processing Benefits**
   - Priority processing queue
   - Reduced development time
   - Faster decision turnaround

## Appeals Prevention

### Clear Communication
1. **Decision Rationale**
   - Explain rating decisions
   - Reference specific evidence
   - Use clear language

2. **Next Steps Information**
   - Appeal rights explanation
   - Additional evidence options
   - Contact information

### Common Errors to Avoid
1. **Medical Errors**
   - Misinterpretation of evidence
   - Incorrect diagnostic codes
   - Inadequate examinations

2. **Legal Errors**
   - Wrong effective dates
   - Incorrect burden of proof
   - Missing due process

## Training Requirements

### Initial Certification
- 40 hours basic claims training
- 20 hours NOVA system training
- Competency examination
- Supervisor mentoring period

### Continuing Education
- Monthly regulation updates
- Quarterly accuracy reviews
- Annual recertification
- Specialized condition training`,
      lastUpdated: '2024-01-08',
      version: '3.1',
      author: 'VBA Training Division',
      tags: ['procedures', 'claims', 'processing', 'workflow'],
      type: 'policy'
    },
    {
      id: 'DOC-005',
      title: 'Security and Compliance Guide',
      category: 'Security Documentation',
      description: 'Security procedures and compliance requirements for NOVA users',
      content: `# NOVA Security and Compliance Guide

## Security Overview

The NOVA platform handles sensitive personal information and must comply with strict federal security requirements.

## Access Control

### User Authentication
1. **PIV Card Requirements**
   - Valid government-issued PIV card
   - Current certificate not expired
   - Proper card reader configuration

2. **Multi-Factor Authentication**
   - PIV card + PIN (something you have + something you know)
   - Additional verification for high-privilege accounts
   - Time-based session tokens

### Role-Based Access Control (RBAC)
1. **Principle of Least Privilege**
   - Users granted minimum necessary access
   - Regular access reviews and recertification
   - Automatic deactivation of unused accounts

2. **Role Definitions**
   - Claims Processor: Basic claim processing functions
   - Senior Processor: Advanced processing and approval
   - Supervisor: Team management and quality review
   - Administrator: System configuration and user management

## Data Protection

### Personally Identifiable Information (PII)
1. **Identification and Handling**
   - Social Security Numbers
   - Medical record numbers
   - Financial account information
   - Contact information

2. **Protection Requirements**
   - Encryption at rest and in transit
   - Access logging and monitoring
   - Secure disposal procedures
   - Privacy impact assessments

### Protected Health Information (PHI)
1. **HIPAA Compliance**
   - Medical records and documents
   - Health condition information
   - Treatment and examination data
   - Provider communications

2. **Minimum Necessary Rule**
   - Access only information needed for job function
   - Time-limited access to sensitive records
   - Audit trails for all PHI access

## System Security

### Network Security
1. **VPN Requirements**
   - All remote access through authorized VPN
   - Multi-factor authentication for VPN access
   - Encrypted tunnel protocols (IPSec/SSL)

2. **Network Segmentation**
   - Production systems isolated from development
   - DMZ for external-facing services
   - Internal network access controls

### Endpoint Security
1. **Approved Devices Only**
   - Government-furnished equipment (GFE)
   - Current security patches and updates
   - Antivirus and endpoint detection

2. **Configuration Management**
   - Standardized security configurations
   - Regular vulnerability scanning
   - Automated patch management

## Compliance Requirements

### FISMA Compliance
1. **Risk Management Framework**
   - Continuous monitoring program
   - Regular security assessments
   - Risk-based security controls

2. **Documentation Requirements**
   - System security plans
   - Risk assessment reports
   - Security control assessments
   - Plan of actions and milestones

### FedRAMP Authorization
1. **Cloud Security Requirements**
   - Authorized cloud service providers
   - Continuous monitoring requirements
   - Incident response procedures

2. **Security Control Baselines**
   - Moderate impact level controls
   - Additional VA-specific requirements
   - Third-party assessment validation

## Incident Response

### Security Incident Types
1. **Unauthorized Access**
   - Failed authentication attempts
   - Privilege escalation attempts
   - Account compromise indicators

2. **Data Breaches**
   - Unauthorized data disclosure
   - Loss of portable media
   - Email misdirection

### Response Procedures
1. **Immediate Actions**
   - Contain the incident
   - Assess the scope and impact
   - Notify security team
   - Document all actions

2. **Investigation Process**
   - Forensic analysis if needed
   - Root cause determination
   - Impact assessment
   - Corrective action planning

## User Responsibilities

### Account Security
1. **Password/PIN Management**
   - Never share PIV card PIN
   - Report lost or stolen cards immediately
   - Use secure PIN creation practices

2. **Session Management**
   - Lock screen when away from desk
   - Log out at end of workday
   - Never leave system unattended while logged in

### Information Handling
1. **Physical Security**
   - Clean desk policy
   - Secure storage of printed materials
   - Proper disposal of sensitive documents

2. **Electronic Security**
   - No personal email for work purposes
   - Approved file sharing methods only
   - USB drive restrictions and encryption

### Reporting Requirements
1. **Security Incidents**
   - Report immediately to supervisor
   - Complete incident report within 2 hours
   - Cooperate with investigation

2. **Suspicious Activity**
   - Unusual system behavior
   - Social engineering attempts
   - Potential fraud indicators

## Training and Awareness

### Initial Security Training
- VA Security Awareness training
- NOVA-specific security procedures
- Role-based security requirements
- Privacy and HIPAA training

### Ongoing Requirements
- Annual security awareness training
- Monthly security updates and bulletins
- Incident-based training as needed
- Specialized training for system changes

## Monitoring and Auditing

### System Monitoring
1. **Automated Monitoring**
   - Real-time security event monitoring
   - Anomaly detection systems
   - Automated alerting for suspicious activity

2. **Manual Reviews**
   - Regular access reviews
   - Periodic security assessments
   - Compliance audits

### Audit Requirements
1. **Access Logging**
   - All system access logged
   - Detailed activity tracking
   - Long-term log retention

2. **Review Procedures**
   - Regular log analysis
   - Quarterly access reviews
   - Annual compliance assessments

## Sanctions and Enforcement

### Policy Violations
1. **Administrative Actions**
   - Verbal counseling
   - Written reprimand
   - Suspension of system access
   - Additional training requirements

2. **Serious Violations**
   - Immediate access suspension
   - Investigation and adjudication
   - Potential disciplinary action
   - Possible criminal referral

### Appeal Process
- Right to appeal sanctions
- Administrative review procedures
- Due process protections
- Union representation rights`,
      lastUpdated: '2024-01-05',
      version: '2.3',
      author: 'VA Information Security Office',
      tags: ['security', 'compliance', 'procedures', 'privacy'],
      type: 'policy'
    }
  ];

  const categories = ['all', ...Array.from(new Set(documentation.map(doc => doc.category)))];
  const types = ['all', 'guide', 'api', 'reference', 'tutorial', 'policy'];

  const filteredDocs = documentation.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'text-blue-400 bg-blue-400/10';
      case 'api': return 'text-emerald-400 bg-emerald-400/10';
      case 'reference': return 'text-purple-400 bg-purple-400/10';
      case 'tutorial': return 'text-yellow-400 bg-yellow-400/10';
      case 'policy': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return '📚';
      case 'api': return '🔗';
      case 'reference': return '📋';
      case 'tutorial': return '🎓';
      case 'policy': return '📜';
      default: return '📄';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="docs"
          title="Documentation Portal"
          description="Comprehensive technical documentation, API references, user guides, and policy documents for the NOVA system and related processes."
          features={[
            "Complete system documentation with technical specifications",
            "Interactive API reference with code examples",
            "Step-by-step user guides and procedural documentation",
            "Searchable knowledge base with version control"
          ]}
          demoActions={[
            { label: "Browse API Docs", action: () => setSelectedType('api') },
            { label: "View User Guides", action: () => setSelectedType('guide') },
            { label: "Search Documentation", action: () => setSearchTerm('RUMEV1') }
          ]}
        />
        
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-slate-100">Documentation Portal</h1>
                  <p className="text-sm text-slate-500">Technical Docs & API Reference</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search documentation..."
                    className="w-64 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <svg className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  Download All Docs
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Total Documents</h3>
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {documentation.length}
                </div>
                <div className="text-xs text-blue-300/70">Available articles</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">Categories</h3>
                  <span className="text-2xl">📚</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {categories.length - 1}
                </div>
                <div className="text-xs text-emerald-300/70">Documentation types</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Last Updated</h3>
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="text-xl font-bold text-purple-400 mb-1">
                  Jan 12, 2024
                </div>
                <div className="text-xs text-purple-300/70">Latest revision</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">API Version</h3>
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  v1.2
                </div>
                <div className="text-xs text-yellow-300/70">Current release</div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Filter by Type</h3>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedType === type
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Documentation Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-slate-800/20 hover:scale-[1.02]"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{getTypeIcon(doc.type)}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                      {doc.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{doc.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{doc.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">v{doc.version}</span>
                    <span className="text-xs text-slate-500">
                      Updated {new Date(doc.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="text-xs text-slate-500">+{doc.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredDocs.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400 mb-4">No documentation matches your search criteria.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedType('all'); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Document Detail Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl">{getTypeIcon(selectedDoc.type)}</span>
                      <h2 className="text-2xl font-semibold text-slate-100">{selectedDoc.title}</h2>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Version {selectedDoc.version}</span>
                      <span>By {selectedDoc.author}</span>
                      <span>Updated {new Date(selectedDoc.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-slate-300">
                    {selectedDoc.content}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                      Print
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                      Share
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showTableOfContents && (
                      <button
                        onClick={() => setShowTableOfContents(!showTableOfContents)}
                        className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}