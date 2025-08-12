// Massive Mock Data System - Production-Scale Demonstration
// This creates a comprehensive, enterprise-level VBMS dataset

import { Veteran, Claim, Document, ClaimCondition, EvidenceItem, ClaimNote, TrackedItem } from './mockData';
import { createDocumentDatabase, DocumentMetadata, getDocumentStatistics } from './documentDatabase';

// Generate 50+ comprehensive veteran profiles
export const massiveVeterans: Veteran[] = [
  // Copy existing veterans first
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
    status: 'Active',
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
    preferredContact: 'Email',
    dependents: 3,
    marriedStatus: 'Married',
    lastC2PExam: '2024-03-15',
    nextScheduledExam: null,
    claimIds: ['CL-2025-081201', 'CL-2024-045678', 'CL-2023-012345'],
    documentCount: 247,
    flags: ['Combat Veteran', 'Purple Heart Recipient', 'Priority Group 1']
  },
  // Generate 49 more veterans with varied profiles
  ...Array.from({ length: 49 }, (_, i) => {
    const veteranId = `V${String(i + 2).padStart(3, '0')}`;
    const fileNum = `F${Math.random().toString().slice(2, 10)}`;
    
    const firstNames = [
      'Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Lisa', 'William', 'Maria',
      'James', 'Patricia', 'John', 'Linda', 'Richard', 'Barbara', 'Joseph', 'Elizabeth',
      'Thomas', 'Jessica', 'Christopher', 'Ashley', 'Daniel', 'Donna', 'Paul', 'Carol',
      'Mark', 'Ruth', 'Donald', 'Sharon', 'Steven', 'Michelle', 'Kenneth', 'Laura',
      'Andrew', 'Amy', 'Joshua', 'Angela', 'Kevin', 'Kimberly', 'Brian', 'Brenda',
      'George', 'Emma', 'Timothy', 'Olivia', 'Ronald', 'Cynthia', 'Jason', 'Marie',
      'Edward', 'Janet', 'Jeffrey', 'Frances', 'Ryan', 'Catherine', 'Jacob', 'Christine'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
      'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
      'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
      'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
      'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
      'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner'
    ];
    
    const branches = ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force'];
    const ranks = [
      'E-4 Specialist', 'E-5 Sergeant', 'E-6 Staff Sergeant', 'E-7 Sergeant First Class',
      'E-8 Master Sergeant', 'E-9 Sergeant Major', 'O-1 Second Lieutenant', 'O-2 First Lieutenant',
      'O-3 Captain', 'O-4 Major', 'O-5 Lieutenant Colonel', 'W-1 Warrant Officer'
    ];
    
    const mosOptions = [
      'Infantry', 'Artillery', 'Armor', 'Engineer', 'Signal', 'Military Police',
      'Intelligence', 'Logistics', 'Aviation', 'Medical', 'Cyber Operations',
      'Special Operations', 'Transportation', 'Maintenance', 'Supply'
    ];
    
    const deploymentOptions = [
      'Iraq 2003-2004', 'Iraq 2005-2006', 'Iraq 2007-2008', 'Afghanistan 2001-2002',
      'Afghanistan 2009-2010', 'Afghanistan 2011-2012', 'Afghanistan 2015-2016',
      'Kuwait 2010-2011', 'Qatar 2014-2015', 'Syria 2018-2019', 'Somalia 1995',
      'Bosnia 1998-1999', 'Kosovo 2000', 'Libya 2011', 'Jordan 2016-2017'
    ];
    
    const cities = [
      { city: 'Atlanta', state: 'GA' }, { city: 'Houston', state: 'TX' }, 
      { city: 'Phoenix', state: 'AZ' }, { city: 'Los Angeles', state: 'CA' },
      { city: 'Chicago', state: 'IL' }, { city: 'New York', state: 'NY' },
      { city: 'Denver', state: 'CO' }, { city: 'Seattle', state: 'WA' },
      { city: 'Miami', state: 'FL' }, { city: 'Dallas', state: 'TX' },
      { city: 'Boston', state: 'MA' }, { city: 'Las Vegas', state: 'NV' },
      { city: 'Nashville', state: 'TN' }, { city: 'Portland', state: 'OR' }
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];
    const serviceStartYear = 1990 + Math.floor(Math.random() * 25);
    const serviceLength = 4 + Math.floor(Math.random() * 16);
    const numDeployments = Math.floor(Math.random() * 4) + 1;
    const selectedDeployments = deploymentOptions
      .sort(() => 0.5 - Math.random())
      .slice(0, numDeployments);
    
    const currentRating = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 11)];
    const monthlyComp = getMonthlyCompensation(currentRating);
    
    const flags = [];
    if (selectedDeployments.some(d => d.includes('Iraq') || d.includes('Afghanistan'))) {
      flags.push('Combat Veteran');
    }
    if (Math.random() < 0.1) flags.push('Purple Heart Recipient');
    if (Math.random() < 0.15) flags.push('Bronze Star Recipient');
    if (Math.random() < 0.05) flags.push('Silver Star Recipient');
    if (currentRating >= 70) flags.push('Priority Group 1');
    else if (currentRating >= 30) flags.push('Priority Group 2');
    else flags.push('Priority Group 8');
    if (Math.random() < 0.08) flags.push('MST Survivor');
    if (Math.random() < 0.12) flags.push('TBI');
    if (Math.random() < 0.18) flags.push('PTSD');
    if (Math.random() < 0.06) flags.push('Homeless Veteran');
    
    return {
      id: veteranId,
      fileNumber: fileNum,
      ssn: `***-**-${Math.random().toString().slice(2, 6)}`,
      name: `${firstName} ${Math.random() < 0.3 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '. ' : ''}${lastName}`,
      dob: `${1950 + Math.floor(Math.random() * 40)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() < 0.15 ? 'Female' : 'Male',
      branch,
      serviceYears: `${serviceStartYear}-${serviceStartYear + serviceLength}`,
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      mos: mosOptions[Math.floor(Math.random() * mosOptions.length)],
      deployments: selectedDeployments,
      combatService: selectedDeployments.some(d => d.includes('Iraq') || d.includes('Afghanistan') || d.includes('Syria')),
      status: Math.random() < 0.95 ? 'Active' : 'Inactive',
      currentRating,
      monthlyCompensation: monthlyComp,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Maple', 'First', 'Second', 'Park', 'Washington', 'Lincoln', 'Jefferson'][Math.floor(Math.random() * 9)]} ${ ['St', 'Ave', 'Blvd', 'Dr', 'Way', 'Rd'][Math.floor(Math.random() * 6)]}`,
        city: location.city,
        state: location.state,
        zip: `${Math.floor(Math.random() * 90000) + 10000}`
      },
      phone: `(${Math.floor(Math.random() * 900) + 100}) 555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      preferredContact: Math.random() < 0.6 ? 'Email' : 'Phone',
      dependents: Math.floor(Math.random() * 6),
      marriedStatus: ['Single', 'Married', 'Divorced', 'Widowed'][Math.floor(Math.random() * 4)],
      lastC2PExam: Math.random() < 0.7 ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null,
      nextScheduledExam: Math.random() < 0.3 ? `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null,
      claimIds: generateClaimIds(2 + Math.floor(Math.random() * 4)),
      documentCount: 50 + Math.floor(Math.random() * 400),
      flags
    } as Veteran;
  })
];

function getMonthlyCompensation(rating: number): string {
  const rates = {
    0: '$0.00', 10: '$165.92', 20: '$327.99', 30: '$508.05',
    40: '$733.13', 50: '$1,041.82', 60: '$1,319.65', 70: '$1,663.06',
    80: '$1,933.15', 90: '$2,172.39', 100: '$3,737.85'
  };
  return rates[rating as keyof typeof rates] || '$0.00';
}

function generateClaimIds(count: number): string[] {
  const ids = [];
  for (let i = 0; i < count; i++) {
    const year = Math.random() < 0.7 ? '2025' : Math.random() < 0.5 ? '2024' : '2023';
    const num = String(Math.floor(Math.random() * 900000) + 100000);
    ids.push(`CL-${year}-${num}`);
  }
  return ids;
}

// Generate 100+ comprehensive claims
export const massiveClaims: Claim[] = [
  // Start with existing expanded claims
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
  },
  // Generate 99+ more claims with comprehensive data
  ...Array.from({ length: 120 }, (_, i) => {
    const claimIndex = i + 2;
    const claimId = `CL-2025-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    const veteranIndex = Math.floor(Math.random() * 50);
    const veteran = massiveVeterans[veteranIndex];
    
    const claimTypes = [
      'Disability Compensation', 'Dependency and Indemnity Compensation', 
      'Pension', 'Burial Benefits', 'Education Benefits'
    ];
    
    const statuses = [
      'Claim Received', 'Initial Review', 'Evidence Gathering', 'Development', 
      'Ready for Decision', 'Preparation for Notification', 'Complete',
      'Pending Form 9', 'Pending Certification'
    ];
    
    const priorities = ['High', 'Standard', 'Low'];
    const regionalOffices = [
      'Atlanta Regional Office', 'Houston Regional Office', 'Phoenix Regional Office',
      'Los Angeles Regional Office', 'Chicago Regional Office', 'New York Regional Office',
      'Denver Regional Office', 'Seattle Regional Office', 'Nashville Regional Office'
    ];
    
    const ratingSpecialists = [
      'Rating Specialist Johnson', 'Rating Specialist Davis', 'Rating Specialist Martinez',
      'Rating Specialist Chen', 'Rating Specialist Williams', 'Rating Specialist Brown',
      'Rating Specialist Garcia', 'Rating Specialist Miller', 'Rating Specialist Taylor'
    ];
    
    const conditions = generateRandomConditions(1 + Math.floor(Math.random() * 4));
    const examRequired = Math.random() < 0.35; // 35% require exams
    const confidence = 75 + Math.random() * 20; // 75-95% confidence
    
    const submittedDate = new Date(2025, 0, Math.floor(Math.random() * 200));
    const daysInQueue = Math.floor((new Date().getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
    const lastUpdateDate = new Date(submittedDate.getTime() + Math.random() * daysInQueue * 24 * 60 * 60 * 1000);
    const targetDate = new Date(submittedDate.getTime() + (125 + Math.random() * 100) * 24 * 60 * 60 * 1000);
    
    return {
      id: claimId,
      veteranId: veteran.id,
      veteranName: veteran.name,
      fileNumber: veteran.fileNumber,
      type: claimTypes[Math.floor(Math.random() * claimTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      submittedDate: submittedDate.toISOString().split('T')[0],
      lastUpdateDate: lastUpdateDate.toISOString().split('T')[0],
      targetCompletionDate: targetDate.toISOString().split('T')[0],
      daysInQueue,
      conditions,
      examRequired,
      rumevAnalysis: {
        examEliminated: !examRequired,
        reason: examRequired 
          ? 'Insufficient medical evidence. Additional C&P examination required for accurate rating.'
          : 'Sufficient medical evidence exists in current records to support rating decision.',
        confidence: Math.round(confidence * 10) / 10,
        estimatedRating: generateEstimatedRating(conditions),
        estimatedMonthlyBenefit: generateEstimatedBenefit(conditions),
        recommendedActions: generateRecommendedActions(conditions, examRequired)
      },
      evidence: generateEvidence(claimId, 1 + Math.floor(Math.random() * 3)),
      notes: generateNotes(claimId, Math.floor(Math.random() * 3)),
      assignedTo: ratingSpecialists[Math.floor(Math.random() * ratingSpecialists.length)],
      regionalOffice: regionalOffices[Math.floor(Math.random() * regionalOffices.length)],
      trackedItems: generateTrackedItems(claimId, Math.floor(Math.random() * 2))
    } as Claim;
  })
];

function generateRandomConditions(count: number): ClaimCondition[] {
  const conditionTemplates = [
    { name: 'Post-Traumatic Stress Disorder', category: 'Mental Health', icd10: 'F43.10' },
    { name: 'Major Depressive Disorder', category: 'Mental Health', icd10: 'F33.9' },
    { name: 'Anxiety Disorder', category: 'Mental Health', icd10: 'F41.9' },
    { name: 'Lower Back Strain', category: 'Musculoskeletal', icd10: 'M54.5' },
    { name: 'Cervical Spine Strain', category: 'Musculoskeletal', icd10: 'M54.2' },
    { name: 'Right Knee Strain', category: 'Musculoskeletal', icd10: 'M25.561' },
    { name: 'Left Knee Strain', category: 'Musculoskeletal', icd10: 'M25.562' },
    { name: 'Right Shoulder Impingement', category: 'Musculoskeletal', icd10: 'M75.31' },
    { name: 'Bilateral Hearing Loss', category: 'Hearing', icd10: 'H90.3' },
    { name: 'Tinnitus', category: 'Hearing', icd10: 'H93.1' },
    { name: 'Hypertension', category: 'Cardiovascular', icd10: 'I10' },
    { name: 'Sleep Apnea', category: 'Respiratory', icd10: 'G47.33' },
    { name: 'Traumatic Brain Injury', category: 'Neurological', icd10: 'S06.9' },
    { name: 'Migraine Headaches', category: 'Neurological', icd10: 'G43.9' },
    { name: 'Diabetes Type II', category: 'Endocrine', icd10: 'E11.9' },
    { name: 'Gastroesophageal Reflux Disease', category: 'Digestive', icd10: 'K21.9' }
  ];
  
  const severities: ('Mild' | 'Moderate' | 'Severe' | 'Total')[] = ['Mild', 'Moderate', 'Severe', 'Total'];
  const statuses = ['Pending', 'Under Review', 'Evidence Review', 'Ready for Rating', 'Deferred'];
  
  const selectedConditions = conditionTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
    
  return selectedConditions.map(template => ({
    name: template.name,
    category: template.category,
    requestedRating: [10, 20, 30, 40, 50, 70, 100][Math.floor(Math.random() * 7)],
    currentRating: Math.random() < 0.3 ? [10, 20, 30][Math.floor(Math.random() * 3)] : 0,
    icd10Code: template.icd10,
    dbqCompleted: Math.random() < 0.8,
    nexusEstablished: Math.random() < 0.7,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    severity: severities[Math.floor(Math.random() * severities.length)]
  }));
}

function generateEstimatedRating(conditions: ClaimCondition[]): string {
  const ratings = conditions.map(c => `${c.requestedRating}% ${c.name.split(' ')[0]}`);
  const combinedRating = Math.min(100, conditions.reduce((acc, c) => {
    return acc + c.requestedRating * (1 - acc / 100);
  }, 0));
  
  return `${ratings.join(', ')} (Combined: ${Math.round(combinedRating)}%)`;
}

function generateEstimatedBenefit(conditions: ClaimCondition[]): string {
  const totalRating = Math.min(100, conditions.reduce((acc, c) => acc + c.requestedRating, 0));
  const benefit = getMonthlyCompensation(Math.round(totalRating / 10) * 10);
  return benefit;
}

function generateRecommendedActions(conditions: ClaimCondition[], examRequired: boolean): string[] {
  const actions = [];
  
  if (examRequired) {
    actions.push('Schedule C&P examination for medical evaluation');
    actions.push('Obtain current medical evidence from treating sources');
  } else {
    actions.push('Review existing medical evidence for rating determination');
    actions.push('Verify service connection documentation is complete');
  }
  
  if (conditions.some(c => c.category === 'Mental Health')) {
    actions.push('Review mental health treatment records and DBQ');
  }
  
  if (conditions.some(c => c.category === 'Musculoskeletal')) {
    actions.push('Verify range of motion measurements and functional limitations');
  }
  
  return actions;
}

function generateEvidence(claimId: string, count: number): EvidenceItem[] {
  const evidenceTypes = [
    'Service Medical Records', 'VA Medical Records', 'Private Medical Records',
    'DBQ Form', 'C&P Exam Report', 'Lay Statement', 'Buddy Statement'
  ];
  
  const sources = [
    'National Personnel Records Center', 'VA Medical Center', 'Private Physician',
    'Contract Medical Examiner', 'Veteran Service Organization', 'Family Member'
  ];
  
  const reviewers = [
    'Rating Specialist Johnson', 'Medical Examiner Smith', 'Rating Specialist Davis',
    'Dr. Chen - Psychiatrist', 'Rating Specialist Martinez', 'Medical Officer Brown'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `EV${claimId.slice(-3)}-${i + 1}`,
    type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
    description: `Medical evidence for claim ${claimId}`,
    dateReceived: new Date(2025, 0, Math.floor(Math.random() * 200)).toISOString().split('T')[0],
    source: sources[Math.floor(Math.random() * sources.length)],
    reviewed: Math.random() < 0.8,
    reviewedBy: reviewers[Math.floor(Math.random() * reviewers.length)],
    reviewDate: new Date(2025, 0, Math.floor(Math.random() * 200)).toISOString().split('T')[0],
    relevant: Math.random() < 0.9,
    documentIds: [`DOC-${claimId}`, `DOC-${claimId}-${i + 1}`]
  }));
}

function generateNotes(claimId: string, count: number): ClaimNote[] {
  const noteTypes: ('System' | 'User' | 'Medical' | 'Administrative')[] = ['System', 'User', 'Medical', 'Administrative'];
  const authors = [
    'Rating Specialist Johnson', 'Rating Specialist Davis', 'Supervisor Williams',
    'Rating Specialist Martinez', 'Quality Review Specialist', 'Team Lead Brown'
  ];
  
  const noteTemplates = [
    'Claim requires additional development for complete evaluation.',
    'Medical evidence supports service connection for claimed condition.',
    'Veteran contacted regarding missing documentation.',
    'C&P examination scheduled for comprehensive evaluation.',
    'Favorable evidence warrants grant of service connection.',
    'Additional medical opinions needed for nexus determination.'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `N${claimId.slice(-3)}-${i + 1}`,
    date: new Date(2025, 0, Math.floor(Math.random() * 200)).toISOString().split('T')[0],
    author: authors[Math.floor(Math.random() * authors.length)],
    type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
    content: noteTemplates[Math.floor(Math.random() * noteTemplates.length)],
    important: Math.random() < 0.3
  }));
}

function generateTrackedItems(claimId: string, count: number): TrackedItem[] {
  const itemTypes = [
    'Evidence Review', 'C&P Exam', 'Medical Opinion', 'Development Letter',
    'Quality Review', 'Legal Review', 'Rating Decision'
  ];
  
  const assignees = [
    'Rating Specialist Johnson', 'Rating Specialist Davis', 'Contract Examiner',
    'Quality Review Team', 'Supervisor Williams', 'Medical Officer'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `T${claimId.slice(-3)}-${i + 1}`,
    type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
    description: `Tracked item for claim ${claimId}`,
    dueDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: Math.random() < 0.7 ? 'Open' : Math.random() < 0.5 ? 'Closed' : 'Overdue',
    assignedTo: assignees[Math.floor(Math.random() * assignees.length)]
  }));
}

// Generate 500+ comprehensive documents
export const massiveDocuments: Document[] = [
  // Start with existing documents
  {
    id: 'DOC-2025-081201',
    veteranId: 'V001',
    veteranName: 'Jordan R. Sampleton',
    fileNumber: 'F31605305',
    title: 'Navy Service Treatment Records - Complete File',
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
    tags: ['Combat Deployment', 'PTSD', 'Back Injury', 'Hearing Loss', 'Iraq War', 'Afghanistan War'],
    summary: 'Complete service medical records including pre-deployment health assessments, combat injury documentation, mental health evaluations, and post-deployment screenings. Documents PTSD symptoms, back strain from IED blast, and noise-induced hearing loss.',
    s3Path: 'veterans/F31605305/medical/str-complete-2025.pdf',
    ocrProcessed: true,
    ocrConfidence: 98.5,
    extractedData: {
      deployments: 3,
      combatInjuries: 2,
      mentalHealthVisits: 15,
      physicalTherapySessions: 23
    }
  },
  // Generate 500+ more documents
  ...Array.from({ length: 550 }, (_, i) => {
    const docIndex = i + 2;
    const veteranIndex = Math.floor(Math.random() * 50);
    const veteran = massiveVeterans[veteranIndex];
    const claimIndex = Math.floor(Math.random() * massiveClaims.length);
    const claim = massiveClaims[claimIndex];
    
    const docTypes = [
      'Service Medical Records', 'VA Medical Records', 'Private Medical Records',
      'DBQ Form', 'C&P Exam Report', 'Personnel Records', 'DD Form 214',
      'Statement in Support of Claim', 'Buddy Statement', 'Lay Evidence',
      'Medical Opinion', 'Vocational Rehabilitation Records', 'Social Security Records'
    ];
    
    const categories = ['Medical', 'Administrative', 'Evidence', 'Legal'];
    
    const sources = [
      'National Personnel Records Center', 'VA Medical Center', 'Private Hospital',
      'Contract Medical Examiner', 'Veteran Service Organization', 'Department of Defense',
      'Social Security Administration', 'State Veterans Affairs', 'University Hospital',
      'Military Treatment Facility', 'Community Health Center', 'Specialist Clinic'
    ];
    
    const reviewers = [
      'Medical Examiner Thompson', 'Rating Specialist Johnson', 'Dr. Sarah Chen',
      'Rating Specialist Davis', 'Medical Officer Williams', 'Quality Reviewer Martinez',
      'Supervisor Brown', 'Rating Specialist Garcia', 'Medical Examiner Lee'
    ];
    
    const docType = docTypes[Math.floor(Math.random() * docTypes.length)];
    const isConfidential = Math.random() < 0.8;
    const isReviewed = Math.random() < 0.85;
    const isOcrProcessed = Math.random() < 0.95;
    const pages = Math.floor(Math.random() * 200) + 1;
    const sizeInKB = pages * (50 + Math.random() * 200);
    const sizeInMB = sizeInKB > 1024 ? (sizeInKB / 1024).toFixed(1) + ' MB' : sizeInKB.toFixed(0) + ' KB';
    
    const tagOptions = [
      'Combat Service', 'Deployment', 'PTSD', 'TBI', 'Back Injury', 'Hearing Loss',
      'Mental Health', 'Orthopedic', 'Cardiovascular', 'Neurological', 'Respiratory',
      'MST', 'Agent Orange', 'Gulf War', 'Burn Pits', 'Radiation Exposure',
      'C&P Exam', 'DBQ', 'Treatment Records', 'Nexus Opinion', 'Rating Decision'
    ];
    
    const numTags = Math.floor(Math.random() * 6) + 2;
    const selectedTags = tagOptions
      .sort(() => 0.5 - Math.random())
      .slice(0, numTags);
    
    const summaryTemplates = [
      `Comprehensive ${docType.toLowerCase()} documenting service-connected conditions and treatment history.`,
      `Medical documentation supporting disability compensation claim for ${veteran.name}.`,
      `Clinical evaluation and diagnostic findings related to claimed disabilities.`,
      `Treatment records showing ongoing medical care and symptom progression.`,
      `Examination report providing medical opinion on service connection and severity.`,
      `Administrative documentation supporting veteran's disability claim process.`
    ];
    
    return {
      id: `DOC-2025-${String(docIndex).padStart(6, '0')}`,
      veteranId: veteran.id,
      veteranName: veteran.name,
      fileNumber: veteran.fileNumber,
      title: `${docType} - ${veteran.name.split(' ')[0]} ${veteran.name.split(' ')[veteran.name.split(' ').length - 1]}`,
      type: docType,
      category: categories[Math.floor(Math.random() * categories.length)],
      uploadDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      receivedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      source: sources[Math.floor(Math.random() * sources.length)],
      pages,
      size: sizeInMB,
      format: Math.random() < 0.9 ? 'PDF' : Math.random() < 0.5 ? 'DOC' : 'TIF',
      confidential: isConfidential,
      reviewed: isReviewed,
      reviewedBy: isReviewed ? reviewers[Math.floor(Math.random() * reviewers.length)] : undefined,
      reviewDate: isReviewed ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : undefined,
      tags: selectedTags,
      summary: summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)],
      s3Path: `veterans/${veteran.fileNumber}/${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}/${docType.toLowerCase().replace(/\s+/g, '-')}-${docIndex}.pdf`,
      ocrProcessed: isOcrProcessed,
      ocrConfidence: isOcrProcessed ? 85 + Math.random() * 15 : undefined,
      extractedData: isOcrProcessed ? generateExtractedData(docType) : undefined
    } as Document;
  })
];

function generateExtractedData(docType: string): Record<string, any> {
  const baseData = {
    pageCount: Math.floor(Math.random() * 100) + 1,
    dateRange: `${2010 + Math.floor(Math.random() * 15)}-${2015 + Math.floor(Math.random() * 10)}`,
    processingDate: new Date().toISOString().split('T')[0]
  };
  
  switch (docType) {
    case 'Service Medical Records':
      return {
        ...baseData,
        medicalVisits: Math.floor(Math.random() * 50) + 10,
        deployments: Math.floor(Math.random() * 4) + 1,
        vaccinations: Math.floor(Math.random() * 20) + 5,
        injuries: Math.floor(Math.random() * 8) + 1
      };
    case 'C&P Exam Report':
      return {
        ...baseData,
        examDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        examiner: 'Contract Medical Examiner',
        conditionsExamined: Math.floor(Math.random() * 4) + 1,
        ratingRecommendation: [0, 10, 20, 30, 40, 50, 70, 100][Math.floor(Math.random() * 8)]
      };
    case 'DBQ Form':
      return {
        ...baseData,
        formType: 'DBQ',
        completedBy: 'VA Physician',
        conditionEvaluated: 'Service-Connected Disability',
        nexusOpinion: ['Yes', 'No', 'At least as likely as not'][Math.floor(Math.random() * 3)]
      };
    default:
      return baseData;
  }
}

// Create comprehensive document database with real medical records
const comprehensiveDocuments: DocumentMetadata[] = createDocumentDatabase(massiveVeterans, massiveClaims);

// Get document statistics for analytics
export const documentStats = getDocumentStatistics(comprehensiveDocuments);

// Export massive mock database with enhanced document system
export const massiveMockDatabase = {
  veterans: massiveVeterans,
  claims: massiveClaims,
  documents: massiveDocuments,
  comprehensiveDocuments: comprehensiveDocuments,
  documentStats: documentStats
};