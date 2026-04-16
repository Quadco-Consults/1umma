'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { roles, permissions, getRoleById } from '@/lib/mock-data-users';
import { RoleStatus, PermissionModule } from '@/lib/types';
import { ArrowLeft, Save, Shield, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RoleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const role = getRoleById(params.id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    status: (role?.status || 'Active') as RoleStatus,
    approvalLimit: role?.approvalLimit.toString() || '',
    permissionIds: role?.permissions.map(p => p.id) || [],
  });

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-brand mb-2">Role Not Found</h2>
          <p className="text-muted-foreground mb-4">The role you're looking for doesn't exist.</p>
          <Link href="/dashboard/roles">
            <Button className="bg-brand hover:bg-brand/90">Back to Roles</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating role:', formData);
    setIsEditing(false);
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permId)
        ? prev.permissionIds.filter(id => id !== permId)
        : [...prev.permissionIds, permId]
    }));
  };

  const toggleModule = (module: PermissionModule) => {
    const modulePermissions = permissions.filter(p => p.module === module);
    const allSelected = modulePermissions.every(p => formData.permissionIds.includes(p.id));

    setFormData(prev => ({
      ...prev,
      permissionIds: allSelected
        ? prev.permissionIds.filter(id => !modulePermissions.map(p => p.id).includes(id))
        : [...new Set([...prev.permissionIds, ...modulePermissions.map(p => p.id)])]
    }));
  };

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<PermissionModule, typeof permissions>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/roles">
              <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-brand/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-brand">{role.name}</h1>
                <p className="text-muted-foreground mt-1">{role.description}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-brand hover:bg-brand/90 text-white"
              >
                Edit Role
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: role.name,
                      description: role.description,
                      status: role.status,
                      approvalLimit: role.approvalLimit.toString(),
                      permissionIds: role.permissions.map(p => p.id),
                    });
                  }}
                  className="border-brand/30 text-brand hover:bg-brand/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-brand hover:bg-brand/90 text-white gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand">Basic Information</CardTitle>
                <CardDescription>Role details and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                    />
                  ) : (
                    <p className="text-sm font-medium py-2">{role.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm py-2">{role.description}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="approvalLimit">Approval Limit</Label>
                    {isEditing ? (
                      <Input
                        id="approvalLimit"
                        type="number"
                        value={formData.approvalLimit}
                        onChange={(e) => setFormData({ ...formData, approvalLimit: e.target.value })}
                        className="border-brand/30 focus:border-brand"
                        placeholder="Enter amount in Naira"
                      />
                    ) : (
                      <p className="text-sm font-medium py-2 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-brand" />
                        {role.approvalLimit === 0 ? 'None' : `₦${role.approvalLimit.toLocaleString()}`}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    {isEditing ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as RoleStatus })}
                      >
                        <SelectTrigger className="border-brand/30 focus:border-brand">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="py-2">
                        <StatusBadge status={role.status} />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Permissions
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Select which permissions this role should have'
                    : 'Permissions assigned to this role'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(permissionsByModule).map(([module, perms]) => {
                  const allSelected = perms.every(p =>
                    isEditing ? formData.permissionIds.includes(p.id) : role.permissions.some(rp => rp.id === p.id)
                  );
                  const someSelected = perms.some(p =>
                    isEditing ? formData.permissionIds.includes(p.id) : role.permissions.some(rp => rp.id === p.id)
                  );

                  return (
                    <div key={module} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleModule(module as PermissionModule)}
                            className="border-brand data-[state=checked]:bg-brand"
                          />
                        )}
                        <h4 className="font-semibold text-brand capitalize">{module}</h4>
                        <span className="text-xs text-muted-foreground">
                          ({perms.filter(p => isEditing ? formData.permissionIds.includes(p.id) : role.permissions.some(rp => rp.id === p.id)).length}/{perms.length})
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 ml-6">
                        {perms.map(perm => {
                          const isChecked = isEditing
                            ? formData.permissionIds.includes(perm.id)
                            : role.permissions.some(rp => rp.id === perm.id);

                          return (
                            <div key={perm.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-brand/5">
                              {isEditing && (
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                  className="border-brand data-[state=checked]:bg-brand mt-0.5"
                                />
                              )}
                              {!isEditing && isChecked && (
                                <div className="h-2 w-2 rounded-full bg-brand mt-1.5" />
                              )}
                              <div className={!isEditing && !isChecked ? 'hidden' : ''}>
                                <p className="text-sm font-medium">{perm.name}</p>
                                <p className="text-xs text-muted-foreground">{perm.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Separator />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Role Summary */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Role Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Permissions</p>
                  <p className="text-2xl font-bold text-brand">
                    {isEditing ? formData.permissionIds.length : role.permissions.length}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Modules Covered</p>
                  <p className="text-2xl font-bold text-brand">
                    {isEditing
                      ? [...new Set(permissions.filter(p => formData.permissionIds.includes(p.id)).map(p => p.module))].length
                      : [...new Set(role.permissions.map(p => p.module))].length
                    }
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm font-medium">{new Date(role.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-sm font-medium">{new Date(role.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Users with this role */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Assigned Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-brand">2</p>
                  <p className="text-xs text-muted-foreground mt-1">users have this role</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
