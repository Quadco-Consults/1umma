// User roles
export type UserRole = 'admin' | 'staff' | 'school';

// Student types
export type StudentStatus = 'Active' | 'Graduated' | 'Exited';
export type VulnerabilityStatus = 'Orphan' | 'IDP' | 'Less Privileged';
export type Gender = 'Male' | 'Female';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  state: string;
  vulnerabilityStatus: VulnerabilityStatus;
  school: string;
  schoolName: string;
  class: string;
  status: StudentStatus;
  enrolledDate: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianAddress: string;
  photo: string | null;
}

// School types
export interface FeeStructure {
  classLevel: string;
  termlyFee: number;
}

export interface School {
  id: string;
  name: string;
  state: string;
  region: string;
  address: string;
  contactName: string;
  contactPhone: string;
  activeStudents: number;
  outstandingBalance: number;
  feeStructure: FeeStructure[];
  enrolledDate: string;
}

// Fee types
export type FeeStatus = 'Paid' | 'Pending' | 'Overdue';

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  school: string;
  schoolName: string;
  class: string;
  term: string;
  year: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  status: FeeStatus;
  paidDate: string | null;
}

// Payment types
export type PaymentStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';
export type PaymentMethod = 'Bank Transfer' | 'Cheque' | 'Cash';

export interface PaymentBreakdown {
  studentName: string;
  class: string;
  amount: number;
}

export interface PaymentRequest {
  id: string;
  school: string;
  schoolName: string;
  submittedDate: string;
  amount: number;
  term: string;
  year: string;
  studentCount: number;
  status: PaymentStatus;
  invoiceNote: string;
  adminNotes: string | null;
  paymentReference: string | null;
  paymentDate: string | null;
  paymentMethod: PaymentMethod | null;
  breakdown: PaymentBreakdown[];
}

// Permission types
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve';
export type PermissionModule = 'students' | 'schools' | 'fees' | 'payments' | 'reports' | 'users' | 'roles';

export interface Permission {
  id: string;
  module: PermissionModule;
  action: PermissionAction;
  name: string;
  description: string;
}

// Role types
export type RoleStatus = 'Active' | 'Inactive';

export interface Role {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  approvalLimit: number; // Maximum amount user can approve (in Naira)
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// User types
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  roleName: string;
  status: UserStatus;
  approvalLimit: number;
  schoolId?: string;
  schoolName?: string;
  createdAt: string;
  lastLogin?: string;
}

// Approval Workflow types
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type ApprovalType = 'Payment' | 'Scholarship' | 'Fee Waiver';

export interface ApprovalWorkflow {
  id: string;
  type: ApprovalType;
  requestId: string;
  requestTitle: string;
  requestedBy: string;
  requestedByName: string;
  amount: number;
  currentLevel: number;
  totalLevels: number;
  status: ApprovalStatus;
  createdAt: string;
  approvals: ApprovalStep[];
}

export interface ApprovalStep {
  level: number;
  approverId: string;
  approverName: string;
  approverRole: string;
  status: ApprovalStatus;
  approvedAt?: string;
  comments?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalStudents: number;
  activeSchools: number;
  totalFeesThisTerm: string;
  pendingPayments: number;
}

export interface ChartData {
  school: string;
  paid: number;
  outstanding: number;
}

export interface RecentActivity {
  type: 'student' | 'payment' | 'school';
  name: string;
  date: string;
  school?: string;
}

// Form types
export interface StudentFormData {
  // Step 1: Personal Details
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  state: string;
  vulnerabilityStatus: VulnerabilityStatus;
  photo?: File | null;

  // Step 2: School Assignment
  school: string;
  class: string;
  academicYear: string;
  region: string;

  // Step 3: Guardian Info
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianAddress: string;
}

export interface SchoolFormData {
  name: string;
  state: string;
  region: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

export interface FeeGenerationFormData {
  academicYear: string;
  term: string;
  selectedSchools: string[];
}

export interface PaymentSubmissionFormData {
  term: string;
  academicYear: string;
  selectedStudents: string[];
  totalAmount: number;
  invoiceNote: string;
  invoiceFile?: File | null;
}

// Class levels
export const CLASS_LEVELS = [
  'Primary 1',
  'Primary 2',
  'Primary 3',
  'Primary 4',
  'Primary 5',
  'Primary 6',
  'JSS1',
  'JSS2',
  'JSS3',
  'SS1',
  'SS2',
  'SS3',
] as const;

export type ClassLevel = typeof CLASS_LEVELS[number];

// States
export const STATES = ['FCT', 'Borno', 'Adamawa', 'Nasarawa'] as const;
export type State = typeof STATES[number];

// Regions
export const REGIONS = ['North Central', 'Northeast'] as const;
export type Region = typeof REGIONS[number];

// Academic terms
export const TERMS = ['Term 1', 'Term 2', 'Term 3'] as const;
export type Term = typeof TERMS[number];
