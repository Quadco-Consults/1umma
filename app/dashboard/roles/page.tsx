'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { roles } from '@/lib/mock-data-users';
import type { Role } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Shield, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RolesPage() {
  const router = useRouter();

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Role Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-brand" />
          </div>
          <div>
            <div className="font-medium text-brand">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'approvalLimit',
      header: 'Approval Limit',
      cell: ({ row }) => {
        const limit = row.original.approvalLimit;
        return (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand" />
            <span className="font-medium">
              {limit === 0 ? 'None' : `₦${limit.toLocaleString()}`}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permCount = row.original.permissions.length;
        const modules = [...new Set(row.original.permissions.map(p => p.module))];
        return (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <span className="font-medium text-brand">{permCount} permissions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {modules.slice(0, 3).map((module) => (
                <Badge key={module} variant="outline" className="text-xs border-brand/30 text-brand">
                  {module}
                </Badge>
              ))}
              {modules.length > 3 && (
                <Badge variant="outline" className="text-xs border-brand/30 text-muted-foreground">
                  +{modules.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        return <span className="text-sm">{date.toLocaleDateString()}</span>;
      },
    },
  ];

  const activeRoles = roles.filter(r => r.status === 'Active').length;
  const inactiveRoles = roles.filter(r => r.status !== 'Active').length;
  const totalPermissions = [...new Set(roles.flatMap(r => r.permissions.map(p => p.id)))].length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">Role Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage user roles and configure permissions
            </p>
          </div>
          <Link href="/dashboard/roles/new">
            <Button className="gap-2 bg-brand hover:bg-brand/90 shadow-md">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Total Roles</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-brand" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{roles.length}</div>
              <p className="text-xs text-muted-foreground">
                System-wide roles
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Active Roles</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{activeRoles}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Total Permissions</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{totalPermissions}</div>
              <p className="text-xs text-muted-foreground">
                Available permissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data table */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand">All Roles</CardTitle>
            <CardDescription>View and manage roles and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={roles}
              searchKey="name"
              searchPlaceholder="Search roles..."
              onRowClick={(role) => router.push(`/dashboard/roles/${role.id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
