'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { users } from '@/lib/mock-data-users';
import type { User } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, UserCog, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function UsersPage() {
  const router = useRouter();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => {
        const initials = `${row.original.firstName[0]}${row.original.lastName[0]}`.toUpperCase();
        return (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'fullName',
      header: 'User Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-brand">
            {`${row.original.firstName} ${row.original.lastName}`}
          </div>
          <div className="text-xs text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'roleName',
      header: 'Role',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand" />
          <span className="font-medium">{row.original.roleName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'approvalLimit',
      header: 'Approval Limit',
      cell: ({ row }) => {
        const limit = row.original.approvalLimit;
        return (
          <span className="font-medium">
            {limit === 0 ? 'None' : `₦${limit.toLocaleString()}`}
          </span>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        if (!row.original.lastLogin) return <span className="text-muted-foreground">Never</span>;
        const date = new Date(row.original.lastLogin);
        return (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
  ];

  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status !== 'Active').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage system users, roles, and access permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/roles">
              <Button variant="outline" className="gap-2 border-brand/30 text-brand hover:bg-brand/10">
                <Shield className="h-4 w-4" />
                Manage Roles
              </Button>
            </Link>
            <Link href="/dashboard/users/new">
              <Button className="gap-2 bg-brand hover:bg-brand/90 shadow-md">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Total Users</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-brand" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                System-wide user accounts
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Active Users</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-brand">Inactive Users</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{inactiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                Suspended or inactive
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data table */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand">All Users</CardTitle>
            <CardDescription>View and manage all system users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={users}
              searchKey="fullName"
              searchPlaceholder="Search by name or email..."
              onRowClick={(user) => router.push(`/dashboard/users/${user.id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
