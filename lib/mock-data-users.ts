import {
  Permission,
  PermissionAction,
  PermissionModule,
  Role,
  RoleStatus,
  User,
  UserStatus,
  ApprovalWorkflow,
  ApprovalStatus,
  ApprovalStep,
} from './types';

// ==========================
// PERMISSIONS
// ==========================

export const permissions: Permission[] = [
  // Students module
  { id: 'P001', module: 'students', action: 'create', name: 'Create Student', description: 'Create new student records' },
  { id: 'P002', module: 'students', action: 'read', name: 'View Students', description: 'View student information' },
  { id: 'P003', module: 'students', action: 'update', name: 'Edit Student', description: 'Edit student records' },
  { id: 'P004', module: 'students', action: 'delete', name: 'Delete Student', description: 'Delete student records' },

  // Schools module
  { id: 'P005', module: 'schools', action: 'create', name: 'Create School', description: 'Add new partner schools' },
  { id: 'P006', module: 'schools', action: 'read', name: 'View Schools', description: 'View school information' },
  { id: 'P007', module: 'schools', action: 'update', name: 'Edit School', description: 'Edit school records' },
  { id: 'P008', module: 'schools', action: 'delete', name: 'Delete School', description: 'Remove schools' },

  // Fees module
  { id: 'P009', module: 'fees', action: 'create', name: 'Generate Fees', description: 'Generate fee records' },
  { id: 'P010', module: 'fees', action: 'read', name: 'View Fees', description: 'View fee information' },
  { id: 'P011', module: 'fees', action: 'update', name: 'Edit Fees', description: 'Edit fee records' },
  { id: 'P012', module: 'fees', action: 'delete', name: 'Delete Fees', description: 'Delete fee records' },

  // Payments module
  { id: 'P013', module: 'payments', action: 'create', name: 'Create Payment', description: 'Initiate payment requests' },
  { id: 'P014', module: 'payments', action: 'read', name: 'View Payments', description: 'View payment records' },
  { id: 'P015', module: 'payments', action: 'approve', name: 'Approve Payments', description: 'Approve payment requests' },
  { id: 'P016', module: 'payments', action: 'update', name: 'Process Payments', description: 'Process approved payments' },

  // Reports module
  { id: 'P017', module: 'reports', action: 'read', name: 'View Reports', description: 'Access reports and analytics' },
  { id: 'P018', module: 'reports', action: 'create', name: 'Generate Reports', description: 'Generate custom reports' },

  // Users module
  { id: 'P019', module: 'users', action: 'create', name: 'Create User', description: 'Add new users to the system' },
  { id: 'P020', module: 'users', action: 'read', name: 'View Users', description: 'View user information' },
  { id: 'P021', module: 'users', action: 'update', name: 'Edit User', description: 'Edit user records' },
  { id: 'P022', module: 'users', action: 'delete', name: 'Deactivate User', description: 'Deactivate user accounts' },

  // Roles module
  { id: 'P023', module: 'roles', action: 'create', name: 'Create Role', description: 'Create new roles' },
  { id: 'P024', module: 'roles', action: 'read', name: 'View Roles', description: 'View role information' },
  { id: 'P025', module: 'roles', action: 'update', name: 'Edit Role', description: 'Edit role configurations' },
  { id: 'P026', module: 'roles', action: 'delete', name: 'Delete Role', description: 'Delete roles' },
];

// ==========================
// ROLES
// ==========================

export const roles: Role[] = [
  {
    id: 'R001',
    name: 'Super Admin',
    description: 'Full system access with unlimited approval authority',
    status: 'Active',
    approvalLimit: 10000000, // ₦10M
    permissions: permissions, // All permissions
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'R002',
    name: 'Program Manager',
    description: 'Manage students, schools, and approve payments up to ₦500K',
    status: 'Active',
    approvalLimit: 500000, // ₦500K
    permissions: permissions.filter(p =>
      ['students', 'schools', 'fees', 'payments', 'reports'].includes(p.module) &&
      p.action !== 'delete'
    ),
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'R003',
    name: 'Finance Officer',
    description: 'Handle payments and fees, approve up to ₦200K',
    status: 'Active',
    approvalLimit: 200000, // ₦200K
    permissions: permissions.filter(p =>
      ['fees', 'payments', 'reports'].includes(p.module)
    ),
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'R004',
    name: 'Data Entry Officer',
    description: 'Create and update student records, view-only access to other modules',
    status: 'Active',
    approvalLimit: 0, // No approval authority
    permissions: permissions.filter(p =>
      (p.module === 'students' && ['create', 'read', 'update'].includes(p.action)) ||
      (p.module !== 'students' && p.action === 'read')
    ),
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'R005',
    name: 'School Portal User',
    description: 'School staff can submit payment requests and view their students',
    status: 'Active',
    approvalLimit: 0,
    permissions: permissions.filter(p =>
      (p.module === 'payments' && p.action === 'create') ||
      (p.module === 'students' && p.action === 'read')
    ),
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'R006',
    name: 'Accountant',
    description: 'Process approved payments and manage financial records',
    status: 'Active',
    approvalLimit: 100000, // ₦100K
    permissions: permissions.filter(p =>
      ['payments', 'fees', 'reports'].includes(p.module) &&
      p.action !== 'delete'
    ),
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
];

// ==========================
// USERS
// ==========================

export const users: User[] = [
  {
    id: 'U001',
    firstName: 'Muhammad',
    lastName: 'Ilu',
    email: 'muhammad@1ummahng.org',
    phone: '+234 812 949 6666',
    roleId: 'R001',
    roleName: 'Super Admin',
    status: 'Active',
    approvalLimit: 10000000,
    createdAt: '2025-01-01',
    lastLogin: '2026-04-16T10:30:00Z',
  },
  {
    id: 'U002',
    firstName: 'Aisha',
    lastName: 'Ibrahim',
    email: 'aisha.ibrahim@1ummahng.org',
    phone: '+234 803 123 4567',
    roleId: 'R002',
    roleName: 'Program Manager',
    status: 'Active',
    approvalLimit: 500000,
    createdAt: '2025-01-15',
    lastLogin: '2026-04-15T14:20:00Z',
  },
  {
    id: 'U003',
    firstName: 'Usman',
    lastName: 'Abdullahi',
    email: 'usman.abdullahi@1ummahng.org',
    phone: '+234 806 789 0123',
    roleId: 'R003',
    roleName: 'Finance Officer',
    status: 'Active',
    approvalLimit: 200000,
    createdAt: '2025-02-01',
    lastLogin: '2026-04-16T08:45:00Z',
  },
  {
    id: 'U004',
    firstName: 'Fatima',
    lastName: 'Yusuf',
    email: 'fatima.yusuf@1ummahng.org',
    phone: '+234 805 456 7890',
    roleId: 'R004',
    roleName: 'Data Entry Officer',
    status: 'Active',
    approvalLimit: 0,
    createdAt: '2025-02-10',
    lastLogin: '2026-04-16T09:15:00Z',
  },
  {
    id: 'U005',
    firstName: 'Maryam',
    lastName: 'Hassan',
    email: 'maryam@alimancollege.edu.ng',
    phone: '+234 807 234 5678',
    roleId: 'R005',
    roleName: 'School Portal User',
    status: 'Active',
    approvalLimit: 0,
    schoolId: 'SCH001',
    schoolName: 'Al-Iman International School',
    createdAt: '2025-02-20',
    lastLogin: '2026-04-14T16:00:00Z',
  },
  {
    id: 'U006',
    firstName: 'Ibrahim',
    lastName: 'Musa',
    email: 'ibrahim.musa@1ummahng.org',
    phone: '+234 809 876 5432',
    roleId: 'R006',
    roleName: 'Accountant',
    status: 'Active',
    approvalLimit: 100000,
    createdAt: '2025-03-01',
    lastLogin: '2026-04-16T07:30:00Z',
  },
  {
    id: 'U007',
    firstName: 'Zainab',
    lastName: 'Ahmad',
    email: 'zainab.ahmad@1ummahng.org',
    phone: '+234 808 111 2222',
    roleId: 'R004',
    roleName: 'Data Entry Officer',
    status: 'Inactive',
    approvalLimit: 0,
    createdAt: '2025-01-20',
    lastLogin: '2026-03-10T11:00:00Z',
  },
];

// ==========================
// APPROVAL WORKFLOWS
// ==========================

export const approvalWorkflows: ApprovalWorkflow[] = [
  {
    id: 'AW001',
    type: 'Payment',
    requestId: 'PR001',
    requestTitle: 'Al-Iman School Payment Request - Term 2',
    requestedBy: 'U005',
    requestedByName: 'Maryam Hassan',
    amount: 750000,
    currentLevel: 2,
    totalLevels: 3,
    status: 'Pending',
    createdAt: '2026-04-15T10:00:00Z',
    approvals: [
      {
        level: 1,
        approverId: 'U004',
        approverName: 'Fatima Yusuf',
        approverRole: 'Data Entry Officer',
        status: 'Approved',
        approvedAt: '2026-04-15T11:30:00Z',
        comments: 'Records verified, all students enrolled',
      },
      {
        level: 2,
        approverId: 'U003',
        approverName: 'Usman Abdullahi',
        approverRole: 'Finance Officer',
        status: 'Pending',
      },
      {
        level: 3,
        approverId: 'U002',
        approverName: 'Aisha Ibrahim',
        approverRole: 'Program Manager',
        status: 'Pending',
      },
    ],
  },
  {
    id: 'AW002',
    type: 'Payment',
    requestId: 'PR002',
    requestTitle: 'Noor Islamic Academy - Term 2',
    requestedBy: 'U003',
    requestedByName: 'Usman Abdullahi',
    amount: 450000,
    currentLevel: 2,
    totalLevels: 2,
    status: 'Pending',
    createdAt: '2026-04-14T14:00:00Z',
    approvals: [
      {
        level: 1,
        approverId: 'U006',
        approverName: 'Ibrahim Musa',
        approverRole: 'Accountant',
        status: 'Approved',
        approvedAt: '2026-04-14T16:20:00Z',
        comments: 'Budget allocation confirmed',
      },
      {
        level: 2,
        approverId: 'U002',
        approverName: 'Aisha Ibrahim',
        approverRole: 'Program Manager',
        status: 'Pending',
      },
    ],
  },
  {
    id: 'AW003',
    type: 'Scholarship',
    requestId: 'SS001',
    requestTitle: 'New Scholarship Application - 50 Students',
    requestedBy: 'U004',
    requestedByName: 'Fatima Yusuf',
    amount: 2500000,
    currentLevel: 1,
    totalLevels: 3,
    status: 'Approved',
    createdAt: '2026-04-10T09:00:00Z',
    approvals: [
      {
        level: 1,
        approverId: 'U002',
        approverName: 'Aisha Ibrahim',
        approverRole: 'Program Manager',
        status: 'Approved',
        approvedAt: '2026-04-10T15:00:00Z',
        comments: 'All applicants meet criteria',
      },
      {
        level: 2,
        approverId: 'U003',
        approverName: 'Usman Abdullahi',
        approverRole: 'Finance Officer',
        status: 'Approved',
        approvedAt: '2026-04-11T10:30:00Z',
        comments: 'Funds available for disbursement',
      },
      {
        level: 3,
        approverId: 'U001',
        approverName: 'Muhammad Ilu',
        approverRole: 'Super Admin',
        status: 'Approved',
        approvedAt: '2026-04-11T14:00:00Z',
        comments: 'Approved for processing',
      },
    ],
  },
  {
    id: 'AW004',
    type: 'Payment',
    requestId: 'PR003',
    requestTitle: 'Al-Furqan College - Term 2',
    requestedBy: 'U003',
    requestedByName: 'Usman Abdullahi',
    amount: 150000,
    currentLevel: 1,
    totalLevels: 1,
    status: 'Rejected',
    createdAt: '2026-04-13T08:00:00Z',
    approvals: [
      {
        level: 1,
        approverId: 'U006',
        approverName: 'Ibrahim Musa',
        approverRole: 'Accountant',
        status: 'Rejected',
        approvedAt: '2026-04-13T10:00:00Z',
        comments: 'Missing supporting documents. Please resubmit with invoice.',
      },
    ],
  },
];

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

// Helper function to get role by ID
export function getRoleById(id: string): Role | undefined {
  return roles.find(r => r.id === id);
}

// Helper function to get permissions for a role
export function getPermissionsForRole(roleId: string): Permission[] {
  const role = roles.find(r => r.id === roleId);
  return role?.permissions || [];
}

// Helper function to check if user has permission
export function userHasPermission(
  userId: string,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  const permissions = getPermissionsForRole(user.roleId);
  return permissions.some(p => p.module === module && p.action === action);
}

// Helper function to get pending approvals for a user
export function getPendingApprovalsForUser(userId: string): ApprovalWorkflow[] {
  return approvalWorkflows.filter(workflow => {
    const currentStep = workflow.approvals[workflow.currentLevel - 1];
    return currentStep?.approverId === userId && currentStep.status === 'Pending';
  });
}
