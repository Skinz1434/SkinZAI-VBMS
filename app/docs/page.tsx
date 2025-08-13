'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface Documentation {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  lastUpdated: string;
  version: string;
  author: string;
  tags: string[];
  downloadUrl?: string;
  type: 'guide' | 'api' | 'reference' | 'tutorial' | 'policy';
}

export default function DocsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const documentation: Documentation[] = [
    {
      id: 'DOC-001',
      title: 'VBMS System Architecture',
      category: 'System Documentation',
      description: 'Comprehensive overview of VBMS system architecture, components, and data flow',
      content: `# VBMS System Architecture\n\n## Overview\n\nThe Veterans Benefits Management System (VBMS) is a comprehensive enterprise application designed to manage the entire lifecycle of veteran disability compensation claims.\n\n## System Components\n\n### Frontend Applications\n- **VBMS Web Application**: Primary user interface for claims processing\n- **eFolder Viewer**: Document management and viewing system\n- **Analytics Dashboard**: Real-time metrics and reporting interface\n- **Mobile Companion**: Limited mobile access for field operations\n\n### Backend Services\n- **Claims Processing Engine**: Core business logic for claim adjudication\n- **Document Management Service**: Handles document storage, retrieval, and processing\n- **Integration Gateway**: Manages external system connections\n- **Notification Service**: Handles email, SMS, and system notifications\n- **Audit and Logging Service**: Comprehensive activity tracking\n\n### AI/ML Components\n- **RUMEV1 Engine**: AI-powered medical exam necessity determination\n- **Natural Language Processing**: Document analysis and condition extraction\n- **Machine Learning Pipeline**: Continuous model training and improvement\n- **Predictive Analytics**: Workload forecasting and resource planning\n\n### Data Layer\n- **Primary Database**: PostgreSQL cluster for transactional data\n- **Document Store**: Enterprise content management system\n- **Data Warehouse**: Analytics and reporting data store\n- **Cache Layer**: Redis for session and performance optimization\n\n### Security & Infrastructure\n- **Identity Management**: PIV card authentication and SAML integration\n- **API Gateway**: Rate limiting, authentication, and routing\n- **Load Balancers**: High availability and traffic distribution\n- **Monitoring Stack**: Application performance and health monitoring\n\n## Data Flow\n\n1. **Claim Intake**: Claims enter through VA.gov or paper forms\n2. **Initial Processing**: Automatic veteran lookup and validation\n3. **Evidence Gathering**: Service records, medical documents collection\n4. **AI Analysis**: RUMEV1 processes medical evidence\n5. **Human Review**: Claims processor validates AI recommendations\n6. **Decision**: Rating determination and notification generation\n7. **Quality Assurance**: Random quality reviews and feedback\n\n## Integration Points\n\n### Internal VA Systems\n- **BGS (Benefits Gateway Service)**: Core veteran and benefits data\n- **MPI (Master Person Index)**: Veteran identity resolution\n- **VistA**: Electronic health records from VA medical centers\n- **CAPRI**: Clinical data repository\n- **Caseflow**: Appeals processing system\n\n### External Integrations\n- **DoD**: Military service records and personnel data\n- **Social Security Administration**: Disability determinations\n- **Private Medical Providers**: Third-party medical records\n- **Financial Systems**: Payment processing and banking\n\n## Security Architecture\n\n### Authentication & Authorization\n- Multi-factor authentication required\n- Role-based access control (RBAC)\n- PIV card integration for government users\n- SAML federation for partner organizations\n\n### Data Protection\n- Encryption at rest and in transit\n- Database-level encryption for sensitive fields\n- Network segmentation and VPN access\n- Regular security audits and penetration testing\n\n### Compliance\n- FISMA compliance requirements\n- HIPAA for protected health information\n- Privacy Act safeguards\n- FedRAMP authorization process\n\n## Performance & Scalability\n\n### Design Principles\n- Microservices architecture for independent scaling\n- Stateless application design\n- Horizontal scaling capabilities\n- Event-driven processing for async operations\n\n### Performance Metrics\n- Target response time: <500ms for web pages\n- Document loading: <2 seconds for typical files\n- Batch processing: 10,000 claims per hour capacity\n- System availability: 99.9% uptime requirement\n\n## Disaster Recovery\n\n### Backup Strategy\n- Real-time database replication\n- Daily full backups with point-in-time recovery\n- Geo-distributed backup storage\n- Automated backup verification\n\n### Recovery Procedures\n- Recovery Time Objective (RTO): 4 hours\n- Recovery Point Objective (RPO): 15 minutes\n- Automated failover for critical components\n- Regular disaster recovery testing`,
      lastUpdated: '2024-01-15',
      version: '2.1',
      author: 'System Architecture Team',
      tags: ['architecture', 'system design', 'infrastructure', 'security'],
      type: 'reference'
    },
    {
      id: 'DOC-002',
      title: 'RUMEV1 AI Implementation Guide',
      category: 'AI/ML Documentation',
      description: 'Technical documentation for RUMEV1 AI system implementation and usage',
      content: `# RUMEV1 AI Implementation Guide\n\n## Introduction\n\nRUMEV1 (Reducing Unnecessary Medical Exams Version 1) is an AI-powered system that analyzes medical evidence to determine whether a Compensation & Pension (C&P) examination is necessary for disability rating purposes.\n\n## System Components\n\n### Core AI Engine\n- **Medical NLP Processor**: Extracts medical concepts from documents\n- **Condition Classifier**: Identifies and categorizes medical conditions\n- **Severity Assessor**: Estimates condition severity from available evidence\n- **Exam Necessity Predictor**: Determines if additional medical evidence is needed\n\n### Training Pipeline\n- **Data Ingestion**: Historical claims and exam data processing\n- **Feature Engineering**: Medical concept extraction and encoding\n- **Model Training**: Machine learning algorithm optimization\n- **Validation Testing**: Performance evaluation and accuracy measurement\n\n### Inference Pipeline\n- **Document Processing**: Real-time medical record analysis\n- **Feature Extraction**: Relevant medical information identification\n- **Prediction Generation**: Exam necessity determination\n- **Confidence Scoring**: Reliability assessment of predictions\n\n## Implementation Architecture\n\n### Machine Learning Models\n\n#### Primary Models\n1. **XGBoost Classifier**: Main prediction engine for exam necessity\n2. **BERT-based NLP**: Medical text understanding and concept extraction\n3. **CNN Document Processor**: Scanned document analysis and OCR enhancement\n4. **Ensemble Combiner**: Aggregates predictions from multiple models\n\n#### Supporting Models\n1. **Condition Specific Models**: Specialized models for common conditions\n2. **Severity Regression**: Continuous severity scoring\n3. **Quality Assessor**: Evidence quality evaluation\n4. **Fraud Detection**: Identifies potential inconsistencies\n\n### Data Processing\n\n#### Input Data Types\n- Service Treatment Records (STR)\n- VA Medical Records (VHA)\n- Private Medical Records\n- C&P Examination Reports\n- Disability Benefit Questionnaires (DBQ)\n\n#### Processing Steps\n1. **Document Ingestion**: PDF, image, and text processing\n2. **OCR Enhancement**: Improve text extraction quality\n3. **Medical Concept Extraction**: Identify conditions, treatments, symptoms\n4. **Temporal Analysis**: Understand condition progression over time\n5. **Evidence Aggregation**: Combine information from multiple sources\n\n### API Integration\n\n#### Endpoints\n```\nPOST /api/v1/rumev1/analyze\n  - Analyzes claim documents for exam necessity\n  - Returns prediction with confidence score\n\nGET /api/v1/rumev1/status/{request_id}\n  - Checks analysis status for long-running requests\n\nPOST /api/v1/rumev1/feedback\n  - Submits user feedback on predictions\n  - Used for continuous model improvement\n```\n\n#### Request Format\n```json\n{\n  "claim_id": "CL-2024-123456",\n  "veteran_id": "V123456789",\n  "documents": [\n    {\n      "document_id": "DOC-001",\n      "type": "service_treatment_record",\n      "content_url": "/documents/DOC-001"\n    }\n  ],\n  "claimed_conditions": [\n    {\n      "condition": "Lower back strain",\n      "diagnostic_code": "5243"\n    }\n  ]\n}\n```\n\n#### Response Format\n```json\n{\n  "request_id": "REQ-789",\n  "claim_id": "CL-2024-123456",\n  "analysis_date": "2024-01-15T10:30:00Z",\n  "overall_recommendation": "no_exam_required",\n  "confidence_score": 0.94,\n  "condition_analyses": [\n    {\n      "condition": "Lower back strain",\n      "recommendation": "no_exam_required",\n      "confidence": 0.94,\n      "supporting_evidence": [\n        "Recent MRI shows clear herniated disc",\n        "Consistent symptom reporting over 2 years",\n        "Physical therapy records document limitations"\n      ],\n      "evidence_quality": "high"\n    }\n  ],\n  "processing_time_ms": 2340\n}\n```\n\n## Deployment Configuration\n\n### Infrastructure Requirements\n- **CPU**: 16 cores minimum for inference servers\n- **Memory**: 32GB RAM for model loading and processing\n- **Storage**: 1TB SSD for model files and temporary data\n- **GPU**: Optional NVIDIA Tesla for training acceleration\n\n### Environment Variables\n```bash\n# Model Configuration\nRUMEV1_MODEL_PATH=/opt/models/rumev1/\nRUMEV1_CONFIDENCE_THRESHOLD=0.85\nRUMEV1_BATCH_SIZE=32\n\n# Database Configuration\nRUMEV1_DB_HOST=rumev1-db.internal\nRUMEV1_DB_NAME=rumev1_production\nRUMEV1_DB_USER=rumev1_user\n\n# API Configuration\nRUMEV1_API_TIMEOUT=30000\nRUMEV1_MAX_CONCURRENT_REQUESTS=100\nRUMEV1_RATE_LIMIT=1000\n```\n\n### Docker Configuration\n```dockerfile\nFROM python:3.9-slim\n\nRUN apt-get update && apt-get install -y \\\n    libpq-dev gcc g++ \\\n    tesseract-ocr libtesseract-dev\n\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\n\nCOPY models/ /opt/models/\nCOPY src/ /app/\n\nWORKDIR /app\nCMD ["gunicorn", "--bind", "0.0.0.0:8000", "rumev1.wsgi:application"]\n```\n\n## Performance Optimization\n\n### Model Optimization\n- **Quantization**: Reduce model size by 75% with minimal accuracy loss\n- **Pruning**: Remove redundant neural network parameters\n- **Caching**: Store frequently accessed predictions\n- **Batch Processing**: Process multiple claims simultaneously\n\n### Monitoring & Alerting\n- **Prediction Accuracy**: Track model performance over time\n- **Response Latency**: Monitor API response times\n- **Error Rates**: Alert on processing failures\n- **Resource Utilization**: CPU, memory, and disk usage tracking\n\n## Continuous Improvement\n\n### Feedback Loop\n1. **User Feedback Collection**: Capture examiner agree/disagree decisions\n2. **Performance Analysis**: Regular accuracy and efficiency reviews\n3. **Model Retraining**: Monthly model updates with new data\n4. **A/B Testing**: Gradual rollout of model improvements\n\n### Quality Assurance\n- **Validation Dataset**: Hold-out test set for unbiased evaluation\n- **Cross-validation**: Ensure model generalization\n- **Bias Detection**: Monitor for demographic or geographic bias\n- **Explainability**: Provide clear reasoning for predictions`,
      lastUpdated: '2024-01-12',
      version: '1.3',
      author: 'AI Development Team',
      tags: ['AI', 'machine learning', 'RUMEV1', 'implementation'],
      type: 'guide'
    },
    {
      id: 'DOC-003',
      title: 'API Reference Documentation',
      category: 'API Documentation',
      description: 'Complete API reference for all VBMS system endpoints',
      content: `# VBMS API Reference\n\n## Authentication\n\nAll API endpoints require authentication using Bearer tokens obtained through the OAuth 2.0 flow.\n\n### OAuth 2.0 Flow\n1. Client registration with VA Identity Provider\n2. Authorization code request\n3. Access token exchange\n4. API access with Bearer token\n\n### Headers\n```\nAuthorization: Bearer {access_token}\nContent-Type: application/json\nX-VA-User: {user_id}\nX-VA-Session: {session_id}\n```\n\n## Claims API\n\n### Get Claims List\n```\nGET /api/v1/claims\n```\n\n**Query Parameters:**\n- `status` (string): Filter by claim status\n- `assigned_to` (string): Filter by assignee\n- `date_from` (string): Start date filter (ISO 8601)\n- `date_to` (string): End date filter (ISO 8601)\n- `limit` (integer): Number of results (default: 50, max: 1000)\n- `offset` (integer): Pagination offset\n\n**Response:**\n```json\n{\n  "claims": [\n    {\n      "id": "CL-2024-123456",\n      "veteran_id": "V123456789",\n      "status": "pending_review",\n      "date_received": "2024-01-15T10:30:00Z",\n      "assigned_to": "user123",\n      "priority": "normal",\n      "conditions": [\n        {\n          "condition": "Lower back strain",\n          "diagnostic_code": "5243",\n          "claimed_rating": null\n        }\n      ]\n    }\n  ],\n  "total_count": 1250,\n  "has_more": true\n}\n```\n\n### Get Claim Details\n```\nGET /api/v1/claims/{claim_id}\n```\n\n**Response:**\n```json\n{\n  "id": "CL-2024-123456",\n  "veteran": {\n    "id": "V123456789",\n    "name": "John Doe",\n    "ssn": "***-**-1234",\n    "dob": "1980-01-15"\n  },\n  "status": "pending_review",\n  "workflow_step": "evidence_gathering",\n  "dates": {\n    "received": "2024-01-15T10:30:00Z",\n    "last_updated": "2024-01-16T14:22:00Z",\n    "target_completion": "2024-02-15T10:30:00Z"\n  },\n  "conditions": [...],\n  "documents": [...],\n  "rumev1_analysis": {\n    "status": "completed",\n    "recommendation": "no_exam_required",\n    "confidence": 0.94\n  }\n}\n```\n\n### Update Claim Status\n```\nPUT /api/v1/claims/{claim_id}/status\n```\n\n**Request Body:**\n```json\n{\n  "status": "in_review",\n  "assigned_to": "user456",\n  "notes": "Beginning detailed medical review"\n}\n```\n\n## Documents API\n\n### Upload Document\n```\nPOST /api/v1/documents\n```\n\n**Request (multipart/form-data):**\n- `file`: Document file (PDF, TIFF, JPG)\n- `claim_id`: Associated claim ID\n- `document_type`: Type of document\n- `source`: Document source\n\n### Get Document\n```\nGET /api/v1/documents/{document_id}\n```\n\n**Response:**\nBinary document content with appropriate Content-Type header\n\n### Get Document Metadata\n```\nGET /api/v1/documents/{document_id}/metadata\n```\n\n## Veterans API\n\n### Search Veterans\n```\nGET /api/v1/veterans/search\n```\n\n**Query Parameters:**\n- `ssn`: Social Security Number (last 4 digits minimum)\n- `file_number`: VA file number\n- `first_name`: First name\n- `last_name`: Last name\n- `dob`: Date of birth\n\n### Get Veteran Profile\n```\nGET /api/v1/veterans/{veteran_id}\n```\n\n## RUMEV1 API\n\n### Analyze Claim\n```\nPOST /api/v1/rumev1/analyze\n```\n\n**Request Body:**\n```json\n{\n  "claim_id": "CL-2024-123456",\n  "conditions": ["lower back strain"],\n  "include_confidence": true\n}\n```\n\n**Response:**\n```json\n{\n  "analysis_id": "RUMEV1-789",\n  "recommendation": "no_exam_required",\n  "confidence": 0.94,\n  "reasoning": [\n    "Sufficient medical evidence available",\n    "Clear diagnostic imaging present",\n    "Consistent symptom documentation"\n  ]\n}\n```\n\n## Error Responses\n\nAll endpoints return standardized error responses:\n\n```json\n{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Invalid claim status provided",\n    "details": {\n      "field": "status",\n      "allowed_values": ["pending", "in_review", "completed"]\n    }\n  },\n  "timestamp": "2024-01-15T10:30:00Z",\n  "request_id": "req-123456"\n}\n```\n\n### HTTP Status Codes\n- `200`: Success\n- `201`: Created\n- `400`: Bad Request\n- `401`: Unauthorized\n- `403`: Forbidden\n- `404`: Not Found\n- `429`: Rate Limited\n- `500`: Internal Server Error\n\n## Rate Limiting\n\n- Default: 1000 requests per hour per user\n- Burst: 100 requests per minute\n- Headers returned with each response:\n  - `X-RateLimit-Limit`\n  - `X-RateLimit-Remaining`\n  - `X-RateLimit-Reset`\n\n## Webhooks\n\n### Claim Status Updates\n```\nPOST {webhook_url}\n```\n\n**Payload:**\n```json\n{\n  "event": "claim.status_changed",\n  "claim_id": "CL-2024-123456",\n  "old_status": "pending_review",\n  "new_status": "in_review",\n  "timestamp": "2024-01-15T10:30:00Z"\n}\n```\n\n## SDKs and Client Libraries\n\n### JavaScript/Node.js\n```javascript\nconst VBMS = require('@va/vbms-client');\n\nconst client = new VBMS.Client({\n  baseUrl: 'https://api.vbms.va.gov',\n  accessToken: 'your-token-here'\n});\n\nconst claims = await client.claims.list({\n  status: 'pending_review',\n  limit: 100\n});\n```\n\n### Python\n```python\nfrom vbms_client import VBMSClient\n\nclient = VBMSClient(\n    base_url='https://api.vbms.va.gov',\n    access_token='your-token-here'\n)\n\nclaims = client.claims.list(\n    status='pending_review',\n    limit=100\n)\n```\n\n### Java\n```java\nVBMSClient client = new VBMSClient.Builder()\n    .baseUrl("https://api.vbms.va.gov")\n    .accessToken("your-token-here")\n    .build();\n\nClaimsList claims = client.claims().list(\n    ClaimsListRequest.builder()\n        .status("pending_review")\n        .limit(100)\n        .build()\n);\n````,
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
      content: `# Claims Processing Procedures\n\n## Overview\n\nThis document outlines the standard operating procedures for processing disability compensation claims in VBMS.\n\n## Initial Claim Review\n\n### Step 1: Claim Assignment\n1. Claims are automatically assigned based on:\n   - Workload capacity\n   - Examiner expertise\n   - Geographic considerations\n   - Priority indicators\n\n2. Manual reassignment procedures:\n   - Supervisor approval required\n   - Document reason for reassignment\n   - Update system assignment logs\n\n### Step 2: Veteran Verification\n1. **Identity Confirmation**\n   - Verify SSN matches MPI records\n   - Confirm file number accuracy\n   - Check for duplicate claims\n\n2. **Service Verification**\n   - Review DD-214 or equivalent\n   - Confirm service dates\n   - Verify honorable discharge status\n\n### Step 3: Claimed Conditions Review\n1. **Condition Validation**\n   - Ensure conditions are claimed properly\n   - Check for related secondary conditions\n   - Verify diagnostic codes\n\n2. **Previous Ratings Review**\n   - Check for existing ratings\n   - Review previous decisions\n   - Identify potential increases\n\n## Evidence Development\n\n### Service Treatment Records (STR)\n1. **Automatic Requests**\n   - System generates NPRC requests\n   - 30-day standard processing time\n   - Follow-up on outstanding requests\n\n2. **Manual Review Process**\n   - Review all available STRs\n   - Identify relevant medical entries\n   - Document evidence timeline\n\n### C&P Examinations\n1. **RUMEV1 Analysis**\n   - Review AI recommendation\n   - Consider confidence score\n   - Document override rationale\n\n2. **Examination Scheduling**\n   - Select appropriate examiner\n   - Provide complete medical history\n   - Schedule within 30 days\n\n3. **Examination Review**\n   - Verify completion within 30 days\n   - Review for adequacy\n   - Request clarification if needed\n\n### Private Medical Records\n1. **Authorization Requirements**\n   - Signed VA Form 21-4142\n   - Specific provider information\n   - Date range limitations\n\n2. **Request Process**\n   - Send formal request to provider\n   - Follow up after 30 days\n   - Consider alternative sources\n\n## Rating Decisions\n\n### Medical Analysis\n1. **Condition Evaluation**\n   - Apply appropriate diagnostic code\n   - Use 38 CFR Part 4 criteria\n   - Consider functional limitations\n\n2. **Secondary Conditions**\n   - Evaluate service-connected disabilities\n   - Apply nexus requirements\n   - Rate secondary conditions\n\n### Effective Date Determination\n1. **Standard Rules**\n   - Date of claim receipt\n   - Date of reopened claim\n   - Special effective date rules\n\n2. **Earlier Effective Date**\n   - Clear and unmistakable error\n   - Liberalizing law or regulation\n   - New evidence with early effective date\n\n### Combined Rating Calculation\n1. **VA Math Application**\n   - Start with highest rating\n   - Apply efficiency formula\n   - Round to nearest 10%\n\n2. **Special Considerations**\n   - Bilateral conditions\n   - Unemployability ratings\n   - Temporary total ratings\n\n## Quality Assurance\n\n### Pre-Decision Review\n1. **Accuracy Check**\n   - Verify calculations\n   - Review evidence development\n   - Confirm regulatory compliance\n\n2. **Completeness Review**\n   - All conditions addressed\n   - Proper notifications included\n   - Supporting documentation attached\n\n### Decision Letter Generation\n1. **Template Selection**\n   - Choose appropriate template\n   - Customize for specific case\n   - Include all required elements\n\n2. **Review Process**\n   - Supervisor review if required\n   - Spell check and grammar\n   - Final accuracy verification\n\n## Special Situations\n\n### Presumptive Conditions\n1. **Agent Orange**\n   - Verify Vietnam service\n   - Check presumptive condition list\n   - Apply presumptive effective date\n\n2. **Gulf War Illness**\n   - Confirm Gulf War service\n   - Review chronic symptoms\n   - Apply presumptive criteria\n\n### Fully Developed Claims\n1. **Evidence Requirements**\n   - All evidence submitted\n   - No additional development needed\n   - Expedited processing timeline\n\n2. **Processing Benefits**\n   - Priority processing queue\n   - Reduced development time\n   - Faster decision turnaround\n\n## Appeals Prevention\n\n### Clear Communication\n1. **Decision Rationale**\n   - Explain rating decisions\n   - Reference specific evidence\n   - Use clear language\n\n2. **Next Steps Information**\n   - Appeal rights explanation\n   - Additional evidence options\n   - Contact information\n\n### Common Errors to Avoid\n1. **Medical Errors**\n   - Misinterpretation of evidence\n   - Incorrect diagnostic codes\n   - Inadequate examinations\n\n2. **Legal Errors**\n   - Wrong effective dates\n   - Incorrect burden of proof\n   - Missing due process\n\n## Training Requirements\n\n### Initial Certification\n- 40 hours basic claims training\n- 20 hours VBMS system training\n- Competency examination\n- Supervisor mentoring period\n\n### Continuing Education\n- Monthly regulation updates\n- Quarterly accuracy reviews\n- Annual recertification\n- Specialized condition training`,
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
      description: 'Security procedures and compliance requirements for VBMS users',
      content: `# VBMS Security and Compliance Guide\n\n## Security Overview\n\nThe Veterans Benefits Management System (VBMS) handles sensitive personal information and must comply with strict federal security requirements.\n\n## Access Control\n\n### User Authentication\n1. **PIV Card Requirements**\n   - Valid government-issued PIV card\n   - Current certificate not expired\n   - Proper card reader configuration\n\n2. **Multi-Factor Authentication**\n   - PIV card + PIN (something you have + something you know)\n   - Additional verification for high-privilege accounts\n   - Time-based session tokens\n\n### Role-Based Access Control (RBAC)\n1. **Principle of Least Privilege**\n   - Users granted minimum necessary access\n   - Regular access reviews and recertification\n   - Automatic deactivation of unused accounts\n\n2. **Role Definitions**\n   - Claims Processor: Basic claim processing functions\n   - Senior Processor: Advanced processing and approval\n   - Supervisor: Team management and quality review\n   - Administrator: System configuration and user management\n\n## Data Protection\n\n### Personally Identifiable Information (PII)\n1. **Identification and Handling**\n   - Social Security Numbers\n   - Medical record numbers\n   - Financial account information\n   - Contact information\n\n2. **Protection Requirements**\n   - Encryption at rest and in transit\n   - Access logging and monitoring\n   - Secure disposal procedures\n   - Privacy impact assessments\n\n### Protected Health Information (PHI)\n1. **HIPAA Compliance**\n   - Medical records and documents\n   - Health condition information\n   - Treatment and examination data\n   - Provider communications\n\n2. **Minimum Necessary Rule**\n   - Access only information needed for job function\n   - Time-limited access to sensitive records\n   - Audit trails for all PHI access\n\n## System Security\n\n### Network Security\n1. **VPN Requirements**\n   - All remote access through authorized VPN\n   - Multi-factor authentication for VPN access\n   - Encrypted tunnel protocols (IPSec/SSL)\n\n2. **Network Segmentation**\n   - Production systems isolated from development\n   - DMZ for external-facing services\n   - Internal network access controls\n\n### Endpoint Security\n1. **Approved Devices Only**\n   - Government-furnished equipment (GFE)\n   - Current security patches and updates\n   - Antivirus and endpoint detection\n\n2. **Configuration Management**\n   - Standardized security configurations\n   - Regular vulnerability scanning\n   - Automated patch management\n\n## Compliance Requirements\n\n### FISMA Compliance\n1. **Risk Management Framework**\n   - Continuous monitoring program\n   - Regular security assessments\n   - Risk-based security controls\n\n2. **Documentation Requirements**\n   - System security plans\n   - Risk assessment reports\n   - Security control assessments\n   - Plan of actions and milestones\n\n### FedRAMP Authorization\n1. **Cloud Security Requirements**\n   - Authorized cloud service providers\n   - Continuous monitoring requirements\n   - Incident response procedures\n\n2. **Security Control Baselines**\n   - Moderate impact level controls\n   - Additional VA-specific requirements\n   - Third-party assessment validation\n\n## Incident Response\n\n### Security Incident Types\n1. **Unauthorized Access**\n   - Failed authentication attempts\n   - Privilege escalation attempts\n   - Account compromise indicators\n\n2. **Data Breaches**\n   - Unauthorized data disclosure\n   - Loss of portable media\n   - Email misdirection\n\n### Response Procedures\n1. **Immediate Actions**\n   - Contain the incident\n   - Assess the scope and impact\n   - Notify security team\n   - Document all actions\n\n2. **Investigation Process**\n   - Forensic analysis if needed\n   - Root cause determination\n   - Impact assessment\n   - Corrective action planning\n\n## User Responsibilities\n\n### Account Security\n1. **Password/PIN Management**\n   - Never share PIV card PIN\n   - Report lost or stolen cards immediately\n   - Use secure PIN creation practices\n\n2. **Session Management**\n   - Lock screen when away from desk\n   - Log out at end of workday\n   - Never leave system unattended while logged in\n\n### Information Handling\n1. **Physical Security**\n   - Clean desk policy\n   - Secure storage of printed materials\n   - Proper disposal of sensitive documents\n\n2. **Electronic Security**\n   - No personal email for work purposes\n   - Approved file sharing methods only\n   - USB drive restrictions and encryption\n\n### Reporting Requirements\n1. **Security Incidents**\n   - Report immediately to supervisor\n   - Complete incident report within 2 hours\n   - Cooperate with investigation\n\n2. **Suspicious Activity**\n   - Unusual system behavior\n   - Social engineering attempts\n   - Potential fraud indicators\n\n## Training and Awareness\n\n### Initial Security Training\n- VA Security Awareness training\n- VBMS-specific security procedures\n- Role-based security requirements\n- Privacy and HIPAA training\n\n### Ongoing Requirements\n- Annual security awareness training\n- Monthly security updates and bulletins\n- Incident-based training as needed\n- Specialized training for system changes\n\n## Monitoring and Auditing\n\n### System Monitoring\n1. **Automated Monitoring**\n   - Real-time security event monitoring\n   - Anomaly detection systems\n   - Automated alerting for suspicious activity\n\n2. **Manual Reviews**\n   - Regular access reviews\n   - Periodic security assessments\n   - Compliance audits\n\n### Audit Requirements\n1. **Access Logging**\n   - All system access logged\n   - Detailed activity tracking\n   - Long-term log retention\n\n2. **Review Procedures**\n   - Regular log analysis\n   - Quarterly access reviews\n   - Annual compliance assessments\n\n## Sanctions and Enforcement\n\n### Policy Violations\n1. **Administrative Actions**\n   - Verbal counseling\n   - Written reprimand\n   - Suspension of system access\n   - Additional training requirements\n\n2. **Serious Violations**\n   - Immediate access suspension\n   - Investigation and adjudication\n   - Potential disciplinary action\n   - Possible criminal referral\n\n### Appeal Process\n- Right to appeal sanctions\n- Administrative review procedures\n- Due process protections\n- Union representation rights`,
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
          description="Comprehensive technical documentation, API references, user guides, and policy documents for the VBMS system and related processes."
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
                  <p className="text-sm text-slate-500">Technical Documentation & Guides</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors md:hidden"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
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
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex gap-8">
              {/* Sidebar */}
              <div className={`${sidebarExpanded ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sticky top-32">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Filters</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      >
                        {types.map(type => (
                          <option key={type} value={type}>
                            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="text-md font-medium text-slate-300 mb-3">Quick Links</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => { setSelectedType('api'); setSearchTerm(''); }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      >
                        🔗 API Reference
                      </button>
                      <button
                        onClick={() => { setSelectedType('guide'); setSearchTerm(''); }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      >
                        📚 User Guides
                      </button>
                      <button
                        onClick={() => { setSearchTerm('RUMEV1'); setSelectedType('all'); }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      >
                        🤖 AI Documentation
                      </button>
                      <button
                        onClick={() => { setSelectedType('policy'); setSearchTerm(''); }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      >
                        📜 Policies & Procedures
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Documentation Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-blue-300">Total Documents</h3>
                      <span className="text-2xl">📚</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {documentation.length}
                    </div>
                    <div className="text-xs text-blue-300/70">Comprehensive guides</div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-emerald-300">API Endpoints</h3>
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      47
                    </div>
                    <div className="text-xs text-emerald-300/70">REST API endpoints</div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-purple-300">Categories</h3>
                      <span className="text-2xl">🏷️</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      {categories.length - 1}
                    </div>
                    <div className="text-xs text-purple-300/70">Documentation categories</div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-yellow-300">Last Updated</h3>
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-400 mb-1">
                      Today
                    </div>
                    <div className="text-xs text-yellow-300/70">Most recent update</div>
                  </div>
                </div>

                {/* Documentation Grid */}
                <div className="space-y-6">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                            <h3 className="text-xl font-semibold text-slate-100">{doc.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                              {doc.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-400 mb-3">{doc.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {doc.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-sm text-slate-400 mb-1">Version {doc.version}</div>
                          <div className="text-sm text-slate-500">{new Date(doc.lastUpdated).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {doc.category}
                          </span>
                          <span className="text-slate-500 text-sm">by {doc.author}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {doc.downloadUrl && (
                            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition-colors">
                              Download PDF
                            </button>
                          )}
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
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
              </div>
            </div>
          </div>
        </main>

        {/* Documentation Detail Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getTypeIcon(selectedDoc.type)}</span>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-100">{selectedDoc.title}</h2>
                      <p className="text-slate-400">Version {selectedDoc.version} • {selectedDoc.category}</p>
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
              
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-slate-300 font-mono text-sm leading-relaxed">
                    {selectedDoc.content.replace(/\\n/g, '\n')}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-400 text-sm">Last updated: {new Date(selectedDoc.lastUpdated).toLocaleDateString()}</span>
                      <span className="text-slate-400 text-sm">by {selectedDoc.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedDoc.downloadUrl && (
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                          Download PDF
                        </button>
                      )}
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        Print Documentation
                      </button>
                    </div>
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