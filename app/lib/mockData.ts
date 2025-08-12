// Comprehensive Mock Data System for VBMS
// This will be replaced with a real database in production

export interface Veteran {
  id: string;
  fileNumber: string;
  ssn: string;
  name: string;
  dob: string;
  gender: string;
  branch: string;
  serviceYears: string;
  rank: string;
  mos: string; // Military Occupational Specialty
  deployments: string[];
  combatService: boolean;
  status: 'Active' | 'Inactive' | 'Deceased';
  currentRating: number;
  monthlyCompensation: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
  preferredContact: 'Phone' | 'Email' | 'Mail';
  dependents: number;
  marriedStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  lastC2PExam: string;
  nextScheduledExam: string | null;
  claimIds: string[];
  documentCount: number;
  flags: string[]; // Special considerations or alerts
}

export interface Claim {
  id: string;
  veteranId: string;
  veteranName: string;
  fileNumber: string;
  type: 'Disability Compensation' | 'Pension' | 'DIC' | 'Appeal' | 'Increase';
  status: 'Pending' | 'Development' | 'Evidence Gathering' | 'Ready for Decision' | 'Preparation for Notification' | 'Complete';
  priority: 'High' | 'Standard' | 'Low';
  submittedDate: string;
  lastUpdateDate: string;
  targetCompletionDate: string;
  daysInQueue: number;
  conditions: ClaimCondition[];
  examRequired: boolean;
  rumevAnalysis: {
    examEliminated: boolean;
    reason: string;
    confidence: number;
    estimatedRating: string;
    estimatedMonthlyBenefit: string;
    recommendedActions: string[];
  };
  evidence: EvidenceItem[];
  notes: ClaimNote[];
  assignedTo: string;
  regionalOffice: string;
  trackedItems: TrackedItem[];
}

export interface ClaimCondition {
  name: string;
  category: string;
  requestedRating: number;
  currentRating: number;
  icd10Code: string;
  dbqCompleted: boolean;
  nexusEstablished: boolean;
  status: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Total';
}

export interface EvidenceItem {
  id: string;
  type: string;
  description: string;
  dateReceived: string;
  source: string;
  reviewed: boolean;
  reviewedBy: string | null;
  reviewDate: string | null;
  relevant: boolean;
  documentIds: string[];
}

export interface ClaimNote {
  id: string;
  date: string;
  author: string;
  type: 'System' | 'User' | 'Medical' | 'Administrative';
  content: string;
  important: boolean;
}

export interface TrackedItem {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  status: 'Open' | 'Closed' | 'Overdue';
  assignedTo: string;
}

export interface Document {
  id: string;
  veteranId: string;
  veteranName: string;
  fileNumber: string;
  title: string;
  type: 'Service Medical Records' | 'Private Medical Records' | 'VA Medical Records' | 'Personnel Records' | 'Lay Statement' | 'DBQ' | 'C&P Exam' | 'Correspondence' | 'Other';
  category: 'Medical' | 'Service Records' | 'Supporting Evidence' | 'Administrative';
  uploadDate: string;
  receivedDate: string;
  source: string;
  pages: number;
  size: string;
  format: 'PDF' | 'TXT' | 'DOC' | 'IMG';
  confidential: boolean;
  reviewed: boolean;
  reviewedBy: string | null;
  reviewDate: string | null;
  tags: string[];
  summary: string;
  s3Path: string;
  ocrProcessed: boolean;
  ocrConfidence: number | null;
  extractedData: any;
}

// Expanded Mock Database
export const mockDatabase = {
  veterans: [
    {
      id: 'V001',
      fileNumber: 'F31605305',
      ssn: '***-**-5390',
      name: 'Jordan R. Sampleton',
      dob: '1980-03-15',
      gender: 'Male',
      branch: 'Navy',
      serviceYears: '2002-2014',
      rank: 'E-6 Petty Officer First Class',
      mos: 'Hospital Corpsman',
      deployments: ['Iraq 2003-2004', 'Afghanistan 2008-2009', 'Afghanistan 2011-2012'],
      combatService: true,
      status: 'Active' as const,
      currentRating: 70,
      monthlyCompensation: '$1,847.00',
      address: {
        street: '1234 Veteran Way',
        city: 'Houston',
        state: 'TX',
        zip: '77002'
      },
      phone: '(713) 555-0123',
      email: 'jordan.sampleton@email.com',
      preferredContact: 'Email' as const,
      dependents: 3,
      marriedStatus: 'Married' as const,
      lastC2PExam: '2024-03-15',
      nextScheduledExam: null,
      claimIds: ['CL-2025-081201', 'CL-2024-045678', 'CL-2023-012345'],
      documentCount: 247,
      flags: ['Combat Veteran', 'Purple Heart Recipient', 'Priority Group 1']
    },
    {
      id: 'V002',
      fileNumber: 'F89432105',
      ssn: '***-**-7821',
      name: 'Michael J. Thompson',
      dob: '1985-11-22',
      gender: 'Male',
      branch: 'Army',
      serviceYears: '2003-2011',
      rank: 'E-5 Sergeant',
      mos: 'Infantry',
      deployments: ['Iraq 2004-2005', 'Iraq 2007-2008'],
      combatService: true,
      status: 'Active' as const,
      currentRating: 50,
      monthlyCompensation: '$1,235.00',
      address: {
        street: '5678 Military Rd',
        city: 'Atlanta',
        state: 'GA',
        zip: '30301'
      },
      phone: '(404) 555-0456',
      email: 'michael.thompson@email.com',
      preferredContact: 'Phone' as const,
      dependents: 2,
      marriedStatus: 'Married' as const,
      lastC2PExam: '2025-01-10',
      nextScheduledExam: '2025-09-15',
      claimIds: ['CL-2025-080845'],
      documentCount: 156,
      flags: ['Combat Veteran', 'Hearing Loss']
    },
    {
      id: 'V003',
      fileNumber: 'F23156789',
      ssn: '***-**-4563',
      name: 'Sarah K. Williams',
      dob: '1987-06-08',
      gender: 'Female',
      branch: 'Air Force',
      serviceYears: '2006-2018',
      rank: 'E-7 Master Sergeant',
      mos: 'Aircraft Maintenance',
      deployments: ['Kuwait 2010-2011', 'Qatar 2014-2015'],
      combatService: false,
      status: 'Active' as const,
      currentRating: 40,
      monthlyCompensation: '$524.00',
      address: {
        street: '9012 Airman Ave',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85001'
      },
      phone: '(602) 555-0789',
      email: 'sarah.williams@email.com',
      preferredContact: 'Email' as const,
      dependents: 1,
      marriedStatus: 'Single' as const,
      lastC2PExam: '2024-11-20',
      nextScheduledExam: null,
      claimIds: ['CL-2025-081156', 'CL-2024-067890'],
      documentCount: 98,
      flags: ['MST Survivor', 'Priority Group 2']
    },
    {
      id: 'V004',
      fileNumber: 'F67890234',
      ssn: '***-**-9876',
      name: 'Robert E. Harrison',
      dob: '1975-12-03',
      gender: 'Male',
      branch: 'Marines',
      serviceYears: '1994-2014',
      rank: 'E-8 Master Sergeant',
      mos: 'Artillery',
      deployments: ['Somalia 1995', 'Iraq 2003', 'Iraq 2005-2006', 'Afghanistan 2010-2011'],
      combatService: true,
      status: 'Active' as const,
      currentRating: 70,
      monthlyCompensation: '$1,847.00',
      address: {
        street: '3456 Semper Fi Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001'
      },
      phone: '(213) 555-0234',
      email: 'robert.harrison@email.com',
      preferredContact: 'Phone' as const,
      dependents: 4,
      marriedStatus: 'Married' as const,
      lastC2PExam: '2024-06-30',
      nextScheduledExam: '2025-10-01',
      claimIds: ['CL-2025-072234', 'CL-2024-089012', 'CL-2023-056789'],
      documentCount: 312,
      flags: ['Combat Veteran', 'TBI', 'Bronze Star Recipient', 'Priority Group 1']
    },
    {
      id: 'V005',
      fileNumber: 'F45678901',
      ssn: '***-**-3456',
      name: 'Jennifer L. Martinez',
      dob: '1990-07-21',
      gender: 'Female',
      branch: 'Coast Guard',
      serviceYears: '2008-2020',
      rank: 'E-6 Petty Officer First Class',
      mos: 'Maritime Enforcement',
      deployments: ['Bahrain 2015-2016', 'Guantanamo Bay 2018-2019'],
      combatService: false,
      status: 'Active' as const,
      currentRating: 60,
      monthlyCompensation: '$1,562.00',
      address: {
        street: '7890 Harbor View Dr',
        city: 'Seattle',
        state: 'WA',
        zip: '98101'
      },
      phone: '(206) 555-0567',
      email: 'jennifer.martinez@email.com',
      preferredContact: 'Email' as const,
      dependents: 2,
      marriedStatus: 'Divorced' as const,
      lastC2PExam: '2025-02-28',
      nextScheduledExam: null,
      claimIds: ['CL-2025-081234', 'CL-2025-081235'],
      documentCount: 189,
      flags: ['MST Survivor', 'Priority Group 2']
    }
  ] as Veteran[],

  claims: [
    {
      id: 'CL-2025-081201',
      veteranId: 'V001',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      type: 'Disability Compensation',
      status: 'Development',
      priority: 'High',
      submittedDate: '2025-07-15',
      lastUpdateDate: '2025-08-10',
      targetCompletionDate: '2025-09-15',
      daysInQueue: 28,
      conditions: [
        {
          name: 'Post-Traumatic Stress Disorder',
          category: 'Mental Health',
          requestedRating: 70,
          currentRating: 0,
          icd10Code: 'F43.10',
          dbqCompleted: true,
          nexusEstablished: true,
          status: 'Under Review',
          severity: 'Severe'
        },
        {
          name: 'Lower Back Strain',
          category: 'Musculoskeletal',
          requestedRating: 40,
          currentRating: 0,
          icd10Code: 'M54.5',
          dbqCompleted: true,
          nexusEstablished: true,
          status: 'Evidence Review',
          severity: 'Moderate'
        },
        {
          name: 'Tinnitus',
          category: 'Hearing',
          requestedRating: 10,
          currentRating: 0,
          icd10Code: 'H93.1',
          dbqCompleted: true,
          nexusEstablished: true,
          status: 'Ready for Rating',
          severity: 'Mild'
        }
      ],
      examRequired: false,
      rumevAnalysis: {
        examEliminated: true,
        reason: 'Sufficient medical evidence exists in service treatment records and recent VA treatment records',
        confidence: 94.7,
        estimatedRating: '70% PTSD, 20% Back, 10% Tinnitus (Combined: 80%)',
        estimatedMonthlyBenefit: '$2,106.00',
        recommendedActions: [
          'Review service treatment records from deployment periods',
          'Confirm nexus between combat service and PTSD symptoms',
          'Verify lumbar spine ROM measurements from recent VA exam'
        ]
      },
      evidence: [
        {
          id: 'EV001',
          type: 'Service Medical Records',
          description: 'Complete service treatment records 2002-2014',
          dateReceived: '2025-07-20',
          source: 'National Personnel Records Center',
          reviewed: true,
          reviewedBy: 'Rating Specialist Johnson',
          reviewDate: '2025-07-25',
          relevant: true,
          documentIds: ['DOC-2025-081201', 'DOC-2025-081202']
        },
        {
          id: 'EV002',
          type: 'VA Medical Records',
          description: 'VA Houston PTSD treatment records',
          dateReceived: '2025-07-22',
          source: 'VA Houston Medical Center',
          reviewed: true,
          reviewedBy: 'Rating Specialist Johnson',
          reviewDate: '2025-07-28',
          relevant: true,
          documentIds: ['DOC-2025-081203']
        }
      ],
      notes: [
        {
          id: 'N001',
          date: '2025-08-10',
          author: 'Rating Specialist Johnson',
          type: 'Medical',
          content: 'PTSD diagnosis well documented with clear nexus to combat service. Recommend favorable decision.',
          important: true
        },
        {
          id: 'N002',
          date: '2025-08-08',
          author: 'RUMEV1 System',
          type: 'System',
          content: 'AI analysis indicates 94.7% confidence that sufficient evidence exists to rate without additional C&P exam.',
          important: true
        }
      ],
      assignedTo: 'Rating Specialist Johnson',
      regionalOffice: 'Houston Regional Office',
      trackedItems: [
        {
          id: 'T001',
          type: 'Evidence Review',
          description: 'Review private therapy records',
          dueDate: '2025-08-20',
          status: 'Open',
          assignedTo: 'Rating Specialist Johnson'
        }
      ]
    } as Claim
  ] as Claim[],

  documents: [
    // Service Medical Records
    {
      id: 'DOC-2025-081201',
      veteranId: 'V001',
      veteranName: 'Jordan R. Sampleton',
      fileNumber: 'F31605305',
      title: 'Navy Service Treatment Records - Complete',
      type: 'Service Medical Records',
      category: 'Medical',
      uploadDate: '2025-07-15',
      receivedDate: '2025-07-12',
      source: 'National Personnel Records Center',
      pages: 247,
      size: '62.3 MB',
      format: 'PDF',
      confidential: true,
      reviewed: true,
      reviewedBy: 'Medical Examiner Thompson',
      reviewDate: '2025-07-20',
      tags: ['Combat Deployment', 'PTSD', 'Back Injury', 'Hearing Loss'],
      summary: 'Complete service medical records including deployment health assessments, combat injury documentation, and mental health evaluations.',
      s3Path: 'veterans/F31605305/medical/str-complete-2025.pdf',
      ocrProcessed: true,
      ocrConfidence: 98.5,
      extractedData: {
        deployments: 3,
        combatInjuries: 2,
        mentalHealthVisits: 15
      }
    }
  ] as Document[]
};

// Helper functions
export function getVeteranById(id: string): Veteran | undefined {
  return mockDatabase.veterans.find(v => v.id === id);
}

export function getVeteranByFileNumber(fileNumber: string): Veteran | undefined {
  return mockDatabase.veterans.find(v => v.fileNumber === fileNumber);
}

export function getClaimsByVeteranId(veteranId: string): Claim[] {
  return mockDatabase.claims.filter(c => c.veteranId === veteranId);
}

export function getDocumentsByVeteranId(veteranId: string): Document[] {
  return mockDatabase.documents.filter(d => d.veteranId === veteranId);
}

export function searchVeterans(query: string): Veteran[] {
  const lowerQuery = query.toLowerCase();
  return mockDatabase.veterans.filter(v => 
    v.name.toLowerCase().includes(lowerQuery) ||
    v.fileNumber.toLowerCase().includes(lowerQuery) ||
    v.ssn.includes(query)
  );
}

export function searchClaims(query: string): Claim[] {
  const lowerQuery = query.toLowerCase();
  return mockDatabase.claims.filter(c => 
    c.id.toLowerCase().includes(lowerQuery) ||
    c.veteranName.toLowerCase().includes(lowerQuery) ||
    c.conditions.some(cond => cond.name.toLowerCase().includes(lowerQuery))
  );
}

export function searchDocuments(query: string): Document[] {
  const lowerQuery = query.toLowerCase();
  return mockDatabase.documents.filter(d => 
    d.title.toLowerCase().includes(lowerQuery) ||
    d.id.toLowerCase().includes(lowerQuery) ||
    d.veteranName.toLowerCase().includes(lowerQuery) ||
    d.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}