// Role-Based Access Control (RBAC) System for VBMS

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'claims' | 'veterans' | 'exams' | 'documents' | 'reports' | 'admin' | 'system';
  level: 'read' | 'write' | 'delete' | 'approve' | 'admin';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number; // 1-10 hierarchy level
  permissions: Permission[];
  canDelegate: boolean;
  maxUsers?: number;
  organizationTypes: string[];
}

export interface Organization {
  id: string;
  name: string;
  type: 'Regional Office' | 'Headquarters' | 'Contract Office' | 'Medical Center' | 'Field Office';
  region: string;
  state: string;
  parentOrg?: string;
  settings: {
    allowExternalAccess: boolean;
    requireMFA: boolean;
    dataRetentionDays: number;
    maxConcurrentUsers: number;
  };
  activeUsers: number;
  totalClaims: number;
  monthlyVolume: number;
}

// Define all available permissions
export const PERMISSIONS: Permission[] = [
  // Claims Permissions
  {
    id: 'claims.view',
    name: 'View Claims',
    description: 'View basic claim information and status',
    category: 'claims',
    level: 'read'
  },
  {
    id: 'claims.edit',
    name: 'Edit Claims',
    description: 'Modify claim details and status',
    category: 'claims',
    level: 'write'
  },
  {
    id: 'claims.create',
    name: 'Create Claims',
    description: 'Initiate new disability claims',
    category: 'claims',
    level: 'write'
  },
  {
    id: 'claims.approve',
    name: 'Approve Claims',
    description: 'Approve rating decisions and payments',
    category: 'claims',
    level: 'approve'
  },
  {
    id: 'claims.delete',
    name: 'Delete Claims',
    description: 'Remove claims from system (administrative)',
    category: 'claims',
    level: 'delete'
  },
  
  // Veterans Permissions
  {
    id: 'veterans.view',
    name: 'View Veteran Data',
    description: 'Access veteran personal and service information',
    category: 'veterans',
    level: 'read'
  },
  {
    id: 'veterans.edit',
    name: 'Edit Veteran Data',
    description: 'Modify veteran information and records',
    category: 'veterans',
    level: 'write'
  },
  {
    id: 'veterans.sensitive',
    name: 'View Sensitive Data',
    description: 'Access SSN, medical records, and confidential information',
    category: 'veterans',
    level: 'admin'
  },
  
  // Exams Permissions
  {
    id: 'exams.view',
    name: 'View Exams',
    description: 'View C&P exam schedules and results',
    category: 'exams',
    level: 'read'
  },
  {
    id: 'exams.schedule',
    name: 'Schedule Exams',
    description: 'Create and modify exam appointments',
    category: 'exams',
    level: 'write'
  },
  {
    id: 'exams.eliminate',
    name: 'Eliminate Exams',
    description: 'Use RUMEV1 to eliminate unnecessary exams',
    category: 'exams',
    level: 'approve'
  },
  
  // Documents Permissions
  {
    id: 'documents.view',
    name: 'View Documents',
    description: 'Access eFolder documents and evidence',
    category: 'documents',
    level: 'read'
  },
  {
    id: 'documents.upload',
    name: 'Upload Documents',
    description: 'Add new documents to eFolders',
    category: 'documents',
    level: 'write'
  },
  {
    id: 'documents.delete',
    name: 'Delete Documents',
    description: 'Remove documents from system',
    category: 'documents',
    level: 'delete'
  },
  
  // Reports Permissions
  {
    id: 'reports.view',
    name: 'View Reports',
    description: 'Access standard analytics and reports',
    category: 'reports',
    level: 'read'
  },
  {
    id: 'reports.create',
    name: 'Create Reports',
    description: 'Generate custom reports and analytics',
    category: 'reports',
    level: 'write'
  },
  {
    id: 'reports.export',
    name: 'Export Data',
    description: 'Export data to external formats',
    category: 'reports',
    level: 'admin'
  },
  
  // Admin Permissions
  {
    id: 'admin.users',
    name: 'Manage Users',
    description: 'Create, modify, and deactivate user accounts',
    category: 'admin',
    level: 'admin'
  },
  {
    id: 'admin.roles',
    name: 'Manage Roles',
    description: 'Create and modify user roles and permissions',
    category: 'admin',
    level: 'admin'
  },
  {
    id: 'admin.system',
    name: 'System Administration',
    description: 'Access system settings and configurations',
    category: 'admin',
    level: 'admin'
  },
  
  // System Permissions
  {
    id: 'system.ai',
    name: 'AI System Access',
    description: 'Monitor and configure RUMEV1 AI systems',
    category: 'system',
    level: 'admin'
  },
  {
    id: 'system.audit',
    name: 'Audit Logs',
    description: 'View system audit logs and security events',
    category: 'system',
    level: 'admin'
  }
];

// Define organizational roles
export const ROLES: Role[] = [
  {
    id: 'rating-specialist',
    name: 'Rating Specialist',
    description: 'Processes disability compensation claims and makes rating decisions',
    level: 3,
    canDelegate: false,
    organizationTypes: ['Regional Office', 'Field Office'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'claims.edit', 'claims.create', 'veterans.view', 'veterans.edit', 
       'exams.view', 'exams.schedule', 'documents.view', 'documents.upload', 'reports.view'].includes(p.id)
    )
  },
  {
    id: 'vsr',
    name: 'Veterans Service Representative (VSR)',
    description: 'Develops claims and gathers evidence for rating decisions',
    level: 2,
    canDelegate: false,
    organizationTypes: ['Regional Office', 'Field Office'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'claims.edit', 'veterans.view', 'veterans.edit',
       'exams.view', 'documents.view', 'documents.upload', 'reports.view'].includes(p.id)
    )
  },
  {
    id: 'rvsr',
    name: 'Rating Veterans Service Representative (RVSR)',
    description: 'Senior specialist for complex claims and quality review',
    level: 4,
    canDelegate: true,
    organizationTypes: ['Regional Office', 'Headquarters'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'claims.edit', 'claims.create', 'claims.approve', 'veterans.view', 'veterans.edit',
       'exams.view', 'exams.schedule', 'exams.eliminate', 'documents.view', 'documents.upload', 
       'reports.view', 'reports.create'].includes(p.id)
    )
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Oversees rating teams and ensures quality standards',
    level: 5,
    canDelegate: true,
    maxUsers: 50,
    organizationTypes: ['Regional Office', 'Field Office'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'claims.edit', 'claims.create', 'claims.approve', 'veterans.view', 'veterans.edit',
       'veterans.sensitive', 'exams.view', 'exams.schedule', 'exams.eliminate', 'documents.view', 
       'documents.upload', 'documents.delete', 'reports.view', 'reports.create', 'admin.users'].includes(p.id)
    )
  },
  {
    id: 'administrator',
    name: 'System Administrator',
    description: 'Manages system settings, users, and organizational configuration',
    level: 8,
    canDelegate: true,
    maxUsers: 10,
    organizationTypes: ['Regional Office', 'Headquarters', 'Contract Office'],
    permissions: PERMISSIONS // All permissions
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyzes performance metrics and generates reports',
    level: 3,
    canDelegate: false,
    organizationTypes: ['Regional Office', 'Headquarters'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'veterans.view', 'exams.view', 'documents.view',
       'reports.view', 'reports.create', 'reports.export', 'system.ai'].includes(p.id)
    )
  },
  {
    id: 'contract-examiner',
    name: 'Contract Examiner',
    description: 'External medical examiner for C&P evaluations',
    level: 2,
    canDelegate: false,
    organizationTypes: ['Contract Office', 'Medical Center'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'veterans.view', 'exams.view', 'documents.view', 'documents.upload'].includes(p.id)
    )
  },
  {
    id: 'quality-reviewer',
    name: 'Quality Review Specialist',
    description: 'Reviews decisions for accuracy and compliance',
    level: 6,
    canDelegate: false,
    organizationTypes: ['Regional Office', 'Headquarters'],
    permissions: PERMISSIONS.filter(p => 
      ['claims.view', 'claims.edit', 'veterans.view', 'veterans.sensitive', 'exams.view',
       'documents.view', 'reports.view', 'reports.create', 'system.audit'].includes(p.id)
    )
  }
];

// Define sample organizations
export const ORGANIZATIONS: Organization[] = [
  {
    id: 'ro-atlanta',
    name: 'Atlanta Regional Office',
    type: 'Regional Office',
    region: 'Southeast',
    state: 'Georgia',
    settings: {
      allowExternalAccess: true,
      requireMFA: true,
      dataRetentionDays: 2555, // 7 years
      maxConcurrentUsers: 500
    },
    activeUsers: 347,
    totalClaims: 45892,
    monthlyVolume: 3247
  },
  {
    id: 'ro-denver',
    name: 'Denver Regional Office',
    type: 'Regional Office',
    region: 'Rocky Mountain',
    state: 'Colorado',
    settings: {
      allowExternalAccess: true,
      requireMFA: true,
      dataRetentionDays: 2555,
      maxConcurrentUsers: 400
    },
    activeUsers: 289,
    totalClaims: 38574,
    monthlyVolume: 2856
  },
  {
    id: 'hq-washington',
    name: 'VA Central Office',
    type: 'Headquarters',
    region: 'National',
    state: 'Washington DC',
    settings: {
      allowExternalAccess: false,
      requireMFA: true,
      dataRetentionDays: 3650, // 10 years
      maxConcurrentUsers: 200
    },
    activeUsers: 156,
    totalClaims: 0, // Policy and oversight
    monthlyVolume: 0
  },
  {
    id: 'contract-qic',
    name: 'QIC Contract Medical Examiners',
    type: 'Contract Office',
    region: 'National',
    state: 'Various',
    settings: {
      allowExternalAccess: true,
      requireMFA: true,
      dataRetentionDays: 1825, // 5 years
      maxConcurrentUsers: 1000
    },
    activeUsers: 678,
    totalClaims: 0, // Examinations only
    monthlyVolume: 4567
  },
  {
    id: 'fo-phoenix',
    name: 'Phoenix Field Office',
    type: 'Field Office',
    region: 'Southwest',
    state: 'Arizona',
    parentOrg: 'ro-denver',
    settings: {
      allowExternalAccess: true,
      requireMFA: false,
      dataRetentionDays: 2555,
      maxConcurrentUsers: 100
    },
    activeUsers: 67,
    totalClaims: 12847,
    monthlyVolume: 892
  }
];

// Permission checking utilities
export class PermissionManager {
  static hasPermission(userRole: string, permissionId: string): boolean {
    const role = ROLES.find(r => r.id === userRole);
    if (!role) return false;
    
    return role.permissions.some(p => p.id === permissionId);
  }
  
  static hasAnyPermission(userRole: string, permissionIds: string[]): boolean {
    return permissionIds.some(permissionId => this.hasPermission(userRole, permissionId));
  }
  
  static hasAllPermissions(userRole: string, permissionIds: string[]): boolean {
    return permissionIds.every(permissionId => this.hasPermission(userRole, permissionId));
  }
  
  static canAccessPage(userRole: string, page: string): boolean {
    const pagePermissions = {
      '/claims': ['claims.view'],
      '/veterans': ['veterans.view'],
      '/exams': ['exams.view'],
      '/documents': ['documents.view'],
      '/reports': ['reports.view'],
      '/analytics': ['reports.view'],
      '/admin': ['admin.users', 'admin.roles', 'admin.system'],
      '/orchestration': ['system.ai']
    };
    
    const requiredPermissions = pagePermissions[page];
    if (!requiredPermissions) return true; // Public page
    
    return this.hasAnyPermission(userRole, requiredPermissions);
  }
  
  static getRoleHierarchy(userRole: string): number {
    const role = ROLES.find(r => r.id === userRole);
    return role?.level || 0;
  }
  
  static canManageUser(managerRole: string, targetRole: string): boolean {
    const managerLevel = this.getRoleHierarchy(managerRole);
    const targetLevel = this.getRoleHierarchy(targetRole);
    
    return managerLevel > targetLevel;
  }
  
  static getAvailableRoles(userRole: string, organizationType: string): Role[] {
    const userLevel = this.getRoleHierarchy(userRole);
    
    return ROLES.filter(role => 
      role.level < userLevel && 
      role.organizationTypes.includes(organizationType)
    );
  }
  
  static getPermissionsByCategory(roleId: string): Record<string, Permission[]> {
    const role = ROLES.find(r => r.id === roleId);
    if (!role) return {};
    
    const grouped: Record<string, Permission[]> = {};
    
    role.permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    
    return grouped;
  }
}

// Audit logging for permission changes
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'role_assigned' | 'role_removed' | 'permission_granted' | 'permission_revoked' | 'org_changed';
  target: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  private static logs: AuditLog[] = [];
  
  static log(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLog = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    this.logs.push(auditEntry);
    
    // In production, this would be sent to a secure audit service
    // Audit entry recorded
  }
  
  static getLogs(userId?: string, action?: string): AuditLog[] {
    let filtered = this.logs;
    
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId || log.target === userId);
    }
    
    if (action) {
      filtered = filtered.filter(log => log.action === action);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}