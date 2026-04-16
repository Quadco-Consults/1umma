'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRole } from '@/contexts/RoleContext';
import { ChevronDown, Shield, Users, School } from 'lucide-react';

export function RoleSwitcher() {
  const { currentRole, setRole } = useRole();

  const roles = [
    { value: 'admin' as const, label: '1Ummah Admin', icon: Shield },
    { value: 'staff' as const, label: '1Ummah Staff', icon: Users },
    { value: 'school' as const, label: 'School User', icon: School },
  ];

  const currentRoleLabel =
    roles.find((r) => r.value === currentRole)?.label || 'Select Role';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        Viewing as: <span className="font-semibold">{currentRoleLabel}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <DropdownMenuItem
                key={role.value}
                onClick={() => setRole(role.value)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {role.label}
                {currentRole === role.value && (
                  <span className="ml-auto text-brand">✓</span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
