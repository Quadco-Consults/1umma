# User Management & Role-Based Access Control (RBAC)

This document explains the user management system and role-based access control implementation in the 1Ummah SILP platform.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Concepts](#core-concepts)
4. [Using Permission Gates](#using-permission-gates)
5. [Approval Workflows](#approval-workflows)
6. [Pages & Components](#pages--components)
7. [Mock Data](#mock-data)

## Overview

The 1Ummah SILP platform implements a comprehensive Role-Based Access Control (RBAC) system that includes:

- **User Management**: Create, edit, and manage system users
- **Role Management**: Define roles with specific permissions and approval limits
- **Permission System**: Granular control over what users can do
- **Approval Workflows**: Multi-level approval system with monetary limits

## Architecture

### Type Definitions

All types are defined in `lib/types/index.ts`:

```typescript
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
export interface Role {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  approvalLimit: number;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// User types
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
```

### Permission System Structure

The permission system is organized into **modules** and **actions**:

**Modules:**
- `students` - Student/beneficiary management
- `schools` - Partner school management
- `fees` - Fee/scholarship generation
- `payments` - Payment request processing
- `reports` - Report viewing and generation
- `users` - User account management
- `roles` - Role configuration

**Actions:**
- `create` - Create new records
- `read` - View existing records
- `update` - Modify existing records
- `delete` - Remove records
- `approve` - Approve payment requests

## Core Concepts

### 1. Permissions

Permissions are the atomic unit of access control. Each permission grants the ability to perform a specific action on a specific module.

Example permissions:
- `students.create` - Can create student records
- `payments.approve` - Can approve payment requests
- `users.read` - Can view user information

### 2. Roles

Roles are collections of permissions with an associated approval limit. Roles define what a group of users can do in the system.

**Built-in Roles:**

| Role | Approval Limit | Description |
|------|---------------|-------------|
| Super Admin | ₦10,000,000 | Full system access |
| Program Manager | ₦500,000 | Manage students, schools, approve mid-level payments |
| Finance Officer | ₦200,000 | Handle payments and fees |
| Accountant | ₦100,000 | Process approved payments |
| Data Entry Officer | ₦0 | Create/update student records |
| School Portal User | ₦0 | Submit payment requests, view students |

### 3. Approval Limits

Each role has an approval limit - the maximum amount they can approve for payment requests. This creates a natural approval hierarchy:

- Requests under ₦100K: Accountant can approve
- Requests ₦100K - ₦200K: Requires Finance Officer
- Requests ₦200K - ₦500K: Requires Program Manager
- Requests over ₦500K: Requires Super Admin

### 4. Approval Workflows

When a payment request is created, it flows through multiple approval levels:

```
Payment Request (₦750,000)
    ↓
Level 1: Data Entry Officer (Verification)
    ↓
Level 2: Finance Officer (₦200K limit - exceeded, escalates)
    ↓
Level 3: Program Manager (₦500K limit - can approve)
    ↓
APPROVED
```

## Using Permission Gates

### The `usePermissions` Hook

The `usePermissions` hook provides utilities for checking user permissions:

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canApprove,
    getAllPermissions,
    hasModuleAccess,
    approvalLimit,
    roleName
  } = usePermissions();

  // Check single permission
  const canCreateStudents = hasPermission('students', 'create');

  // Check if user has any of multiple permissions
  const canManageStudents = hasAnyPermission([
    { module: 'students', action: 'create' },
    { module: 'students', action: 'update' }
  ]);

  // Check approval limit
  const canApprovePayment = canApprove(500000);

  return (
    <div>
      {canCreateStudents && <button>Add Student</button>}
    </div>
  );
}
```

### The `PermissionGate` Component

The `PermissionGate` component conditionally renders children based on permissions:

```typescript
import { PermissionGate } from '@/components/auth/PermissionGate';

// Check single permission
<PermissionGate module="students" action="create">
  <Button>Add Student</Button>
</PermissionGate>

// Check if user has any of multiple permissions
<PermissionGate anyOf={[
  { module: 'students', action: 'create' },
  { module: 'students', action: 'update' }
]}>
  <StudentForm />
</PermissionGate>

// Check all permissions required
<PermissionGate allOf={[
  { module: 'payments', action: 'create' },
  { module: 'payments', action: 'approve' }
]}>
  <PaymentApprovalButton />
</PermissionGate>

// Check approval limit
<PermissionGate approvalAmount={500000}>
  <Button>Approve ₦500K Payment</Button>
</PermissionGate>

// With fallback
<PermissionGate
  module="users"
  action="create"
  fallback={<p>You don't have permission to add users</p>}
>
  <AddUserButton />
</PermissionGate>
```

## Approval Workflows

### Approval Workflow Structure

```typescript
export interface ApprovalWorkflow {
  id: string;
  type: ApprovalType; // 'Payment' | 'Scholarship' | 'Fee Waiver'
  requestId: string;
  requestTitle: string;
  requestedBy: string;
  requestedByName: string;
  amount: number;
  currentLevel: number;
  totalLevels: number;
  status: ApprovalStatus; // 'Pending' | 'Approved' | 'Rejected'
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
```

### Viewing Approvals

Navigate to `/dashboard/approvals` to see:
- **Pending**: Requests awaiting your approval
- **Completed**: Requests you've already reviewed

### Approving/Rejecting Requests

1. Click on a pending request
2. Review the request details and approval chain
3. Add optional comments
4. Click "Approve" or "Reject"

**Note:** If the amount exceeds your approval limit, you'll see a warning but can still approve (it may require additional approval from a higher authority).

## Pages & Components

### User Management Pages

#### `/dashboard/users`
**Purpose:** List all system users with stats
**Permissions Required:** `users.read`
**Features:**
- View all users with their roles and approval limits
- Search and filter users
- Click to view user details
- Stats: Total Users, Active Users, Inactive Users

#### `/dashboard/users/new`
**Purpose:** Create a new user account
**Permissions Required:** `users.create`
**Features:**
- Personal information form
- Role assignment
- Custom approval limit override
- School assignment (for School Portal Users)

#### `/dashboard/users/[id]`
**Purpose:** View and edit user details
**Permissions Required:** `users.read` (view), `users.update` (edit)
**Features:**
- View/edit personal information
- View/edit role and permissions
- Activity statistics
- Account overview

### Role Management Pages

#### `/dashboard/roles`
**Purpose:** List all system roles
**Permissions Required:** `roles.read`
**Features:**
- View all roles with permissions count
- Stats: Total Roles, Active Roles, Total Permissions
- Click to view role details

#### `/dashboard/roles/new`
**Purpose:** Create a new role
**Permissions Required:** `roles.create`
**Features:**
- Define role name and description
- Set approval limit
- Assign permissions by module
- Real-time summary of selected permissions

#### `/dashboard/roles/[id]`
**Purpose:** View and edit role details
**Permissions Required:** `roles.read` (view), `roles.update` (edit)
**Features:**
- View/edit basic information
- View/edit permission assignments
- Module-based permission selection
- Role summary statistics

### Approval Workflow Pages

#### `/dashboard/approvals`
**Purpose:** Review and approve pending requests
**Permissions Required:** `payments.approve`
**Features:**
- Pending vs. Completed tabs
- Approval chain visualization
- Approval limit warnings
- Comment functionality
- Approve/reject actions

## Mock Data

### Location: `lib/mock-data-users.ts`

The mock data file contains:

- **26 Permissions** across 7 modules
- **6 Roles** with varying approval limits
- **7 Sample Users** with different roles
- **4 Approval Workflows** in various states

### Helper Functions

```typescript
// Get user by ID
const user = getUserById('U001');

// Get role by ID
const role = getRoleById('R001');

// Get permissions for a role
const permissions = getPermissionsForRole('R001');

// Check if user has permission
const hasPermission = userHasPermission('U001', 'students', 'create');

// Get pending approvals for user
const pendingApprovals = getPendingApprovalsForUser('U003');
```

## Implementation Examples

### Protecting a Page

```typescript
// app/dashboard/users/page.tsx
export default function UsersPage() {
  const { hasPermission } = usePermissions();

  if (!hasPermission('users', 'read')) {
    return <div>Access Denied</div>;
  }

  return <UserList />;
}
```

### Conditional Button Rendering

```typescript
// Show button only if user can create students
<PermissionGate module="students" action="create">
  <Link href="/dashboard/students/new">
    <Button>Add Student</Button>
  </Link>
</PermissionGate>
```

### Checking Multiple Permissions

```typescript
// Show form if user can either create or update
<PermissionGate anyOf={[
  { module: 'students', action: 'create' },
  { module: 'students', action: 'update' }
]}>
  <StudentForm />
</PermissionGate>
```

### Approval Limit Check

```typescript
const { canApprove } = usePermissions();

function ApproveButton({ amount }: { amount: number }) {
  return (
    <PermissionGate approvalAmount={amount}>
      <Button>Approve ₦{amount.toLocaleString()}</Button>
    </PermissionGate>
  );
}
```

## Next Steps for Production

When implementing this in a real production environment:

1. **Replace Mock Data**: Connect to a real database (PostgreSQL, MySQL, etc.)
2. **Add Authentication**: Implement JWT or session-based auth
3. **API Integration**: Create API endpoints for CRUD operations
4. **Audit Logging**: Track all permission changes and approvals
5. **Role Templates**: Add ability to clone existing roles
6. **Permission Inheritance**: Implement hierarchical permissions
7. **Two-Factor Authentication**: For sensitive operations
8. **Activity Monitoring**: Real-time alerts for suspicious activity

## Support

For questions or issues with the user management system, please contact the development team.
