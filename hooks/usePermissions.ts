import { useRole } from '@/contexts/RoleContext';
import { getPermissionsForRole, userHasPermission, users } from '@/lib/mock-data-users';
import { PermissionModule, PermissionAction } from '@/lib/types';

/**
 * Hook to check if the current user has specific permissions
 */
export function usePermissions() {
  const { currentUser } = useRole();

  // In a real app, this would come from auth context
  // For now, we'll use the first user (Muhammad Ilu - Super Admin)
  const userId = currentUser?.id || 'U001';
  const user = users.find(u => u.id === userId);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (module: PermissionModule, action: PermissionAction): boolean => {
    return userHasPermission(userId, module, action);
  };

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = (permissions: Array<{ module: PermissionModule; action: PermissionAction }>): boolean => {
    return permissions.some(({ module, action }) => hasPermission(module, action));
  };

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = (permissions: Array<{ module: PermissionModule; action: PermissionAction }>): boolean => {
    return permissions.every(({ module, action }) => hasPermission(module, action));
  };

  /**
   * Check if user can approve up to a certain amount
   */
  const canApprove = (amount: number): boolean => {
    if (!user) return false;
    return user.approvalLimit >= amount;
  };

  /**
   * Get all permissions for the current user
   */
  const getAllPermissions = () => {
    if (!user) return [];
    return getPermissionsForRole(user.roleId);
  };

  /**
   * Check if user has access to a module (has any permission in that module)
   */
  const hasModuleAccess = (module: PermissionModule): boolean => {
    const permissions = getAllPermissions();
    return permissions.some(p => p.module === module);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canApprove,
    getAllPermissions,
    hasModuleAccess,
    approvalLimit: user?.approvalLimit || 0,
    roleName: user?.roleName || '',
  };
}

/**
 * Helper function for conditional rendering based on permissions
 */
export function withPermission<T>(
  hasPermission: boolean,
  component: T,
  fallback: T | null = null
): T | null {
  return hasPermission ? component : fallback;
}
