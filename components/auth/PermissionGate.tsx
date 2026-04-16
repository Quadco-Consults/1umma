'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { PermissionModule, PermissionAction } from '@/lib/types';
import { ReactNode } from 'react';

interface PermissionGateProps {
  /** Module to check permission for */
  module?: PermissionModule;
  /** Action to check permission for */
  action?: PermissionAction;
  /** Array of permissions where user needs ANY one */
  anyOf?: Array<{ module: PermissionModule; action: PermissionAction }>;
  /** Array of permissions where user needs ALL */
  allOf?: Array<{ module: PermissionModule; action: PermissionAction }>;
  /** Minimum approval amount required */
  approvalAmount?: number;
  /** Content to render if user has permission */
  children: ReactNode;
  /** Optional fallback content if user doesn't have permission */
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 *
 * @example
 * // Check single permission
 * <PermissionGate module="students" action="create">
 *   <Button>Add Student</Button>
 * </PermissionGate>
 *
 * @example
 * // Check if user has any of multiple permissions
 * <PermissionGate anyOf={[
 *   { module: 'students', action: 'create' },
 *   { module: 'students', action: 'update' }
 * ]}>
 *   <StudentForm />
 * </PermissionGate>
 *
 * @example
 * // Check approval limit
 * <PermissionGate approvalAmount={500000}>
 *   <Button>Approve Payment</Button>
 * </PermissionGate>
 */
export function PermissionGate({
  module,
  action,
  anyOf,
  allOf,
  approvalAmount,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canApprove } = usePermissions();

  let hasAccess = false;

  if (module && action) {
    hasAccess = hasPermission(module, action);
  } else if (anyOf) {
    hasAccess = hasAnyPermission(anyOf);
  } else if (allOf) {
    hasAccess = hasAllPermissions(allOf);
  } else if (approvalAmount !== undefined) {
    hasAccess = canApprove(approvalAmount);
  } else {
    // If no permission check specified, allow access
    hasAccess = true;
  }

  return <>{hasAccess ? children : fallback}</>;
}
