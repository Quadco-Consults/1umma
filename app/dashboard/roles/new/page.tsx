'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
import { permissions } from '@/lib/mock-data-users';
import { RoleStatus, PermissionModule } from '@/lib/types';
import { ArrowLeft, Shield, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewRolePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active' as RoleStatus,
    approvalLimit: '',
    permissionIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating role:', formData);
    router.push('/dashboard/roles');
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/roles">
            <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">Create New Role</h1>
            <p className="text-muted-foreground mt-1">
              Define a new role and assign permissions
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-brand/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-brand flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Role Information
                  </CardTitle>
                  <CardDescription>Basic details about this role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Finance Manager"
                      className="border-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the role and its responsibilities..."
                      className="border-brand/30 focus:border-brand"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="approvalLimit">Approval Limit (₦) *</Label>
                      <Input
                        id="approvalLimit"
                        type="number"
                        required
                        value={formData.approvalLimit}
                        onChange={(e) => setFormData({ ...formData, approvalLimit: e.target.value })}
                        placeholder="Enter amount (0 for no approval rights)"
                        className="border-brand/30 focus:border-brand"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum amount this role can approve in Naira
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as RoleStatus })}
                        required
                      >
                        <SelectTrigger className="border-brand/30 focus:border-brand">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card className="border-brand/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-brand flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Assign Permissions
                  </CardTitle>
                  <CardDescription>
                    Select which permissions this role should have
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(permissionsByModule).map(([module, perms]) => {
                    const allSelected = perms.every(p => formData.permissionIds.includes(p.id));
                    const selectedCount = perms.filter(p => formData.permissionIds.includes(p.id)).length;

                    return (
                      <div key={module} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleModule(module as PermissionModule)}
                            className="border-brand data-[state=checked]:bg-brand"
                          />
                          <h4 className="font-semibold text-brand capitalize">{module}</h4>
                          <span className="text-xs text-muted-foreground">
                            ({selectedCount}/{perms.length} selected)
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 ml-6">
                          {perms.map(perm => {
                            const isChecked = formData.permissionIds.includes(perm.id);

                            return (
                              <div key={perm.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-brand/5">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                  className="border-brand data-[state=checked]:bg-brand mt-0.5"
                                />
                                <div>
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

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Link href="/dashboard/roles">
                  <Button type="button" variant="outline" className="border-brand/30 text-brand hover:bg-brand/10">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-brand hover:bg-brand/90 text-white gap-2"
                  disabled={formData.permissionIds.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  Create Role
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Summary */}
              <Card className="border-brand/20 shadow-md sticky top-6">
                <CardHeader>
                  <CardTitle className="text-brand text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Selected Permissions</p>
                    <p className="text-3xl font-bold text-brand">{formData.permissionIds.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">out of {permissions.length} total</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Modules Covered</p>
                    <p className="text-3xl font-bold text-brand">
                      {[...new Set(permissions.filter(p => formData.permissionIds.includes(p.id)).map(p => p.module))].length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">out of {Object.keys(permissionsByModule).length} modules</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Approval Limit</p>
                    <p className="text-lg font-bold text-brand">
                      {formData.approvalLimit
                        ? `₦${parseInt(formData.approvalLimit).toLocaleString()}`
                        : 'Not set'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-brand/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-brand text-sm">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• Click module names to select all permissions in that module</p>
                  <p>• Set approval limit to 0 if role shouldn't approve payments</p>
                  <p>• At least one permission must be selected</p>
                  <p>• Role can be assigned to users after creation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
