'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { roles, users, getUserById, getPermissionsForRole } from '@/lib/mock-data-users';
import { UserStatus } from '@/lib/types';
import { ArrowLeft, Save, Shield, Clock, Mail, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = getUserById(params.id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    roleId: user?.roleId || '',
    status: (user?.status || 'Active') as UserStatus,
    customApprovalLimit: user?.approvalLimit.toString() || '',
  });

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-brand mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
          <Link href="/dashboard/users">
            <Button className="bg-brand hover:bg-brand/90">Back to Users</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Updating user:', formData);
    setIsEditing(false);
  };

  const selectedRole = roles.find(r => r.id === formData.roleId);
  const userPermissions = getPermissionsForRole(user.roleId);
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/users">
              <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-brand text-white text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-brand">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-brand hover:bg-brand/90 text-white"
              >
                Edit User
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      phone: user.phone,
                      roleId: user.roleId,
                      status: user.status,
                      customApprovalLimit: user.approvalLimit.toString(),
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
            {/* Personal Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand">Personal Information</CardTitle>
                <CardDescription>User's basic details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="border-brand/30 focus:border-brand"
                      />
                    ) : (
                      <p className="text-sm font-medium py-2">{user.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="border-brand/30 focus:border-brand"
                      />
                    ) : (
                      <p className="text-sm font-medium py-2">{user.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-brand/30 focus:border-brand"
                      />
                    ) : (
                      <p className="text-sm font-medium py-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-brand" />
                        {user.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-brand/30 focus:border-brand"
                      />
                    ) : (
                      <p className="text-sm font-medium py-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-brand" />
                        {user.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Permissions */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role & Permissions
                </CardTitle>
                <CardDescription>User role and access permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleId">User Role</Label>
                    {isEditing ? (
                      <Select
                        value={formData.roleId}
                        onValueChange={(value) => setFormData({ ...formData, roleId: value || '' })}
                      >
                        <SelectTrigger className="border-brand/30 focus:border-brand">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles
                            .filter(r => r.status === 'Active')
                            .map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium py-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-brand" />
                        {user.roleName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Account Status</Label>
                    {isEditing ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                      >
                        <SelectTrigger className="border-brand/30 focus:border-brand">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="py-2">
                        <StatusBadge status={user.status} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customApprovalLimit">Approval Limit</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="customApprovalLimit"
                        type="number"
                        value={formData.customApprovalLimit}
                        onChange={(e) => setFormData({ ...formData, customApprovalLimit: e.target.value })}
                        className="border-brand/30 focus:border-brand"
                      />
                      <p className="text-xs text-muted-foreground">
                        Role default: ₦{selectedRole?.approvalLimit.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium py-2">
                      {user.approvalLimit === 0 ? 'None' : `₦${user.approvalLimit.toLocaleString()}`}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-brand">Assigned Permissions</h4>
                      <div className="grid gap-2">
                        {userPermissions.slice(0, 5).map((perm) => (
                          <div key={perm.id} className="flex items-center gap-2 text-sm p-2 bg-brand/5 rounded-md">
                            <div className="h-2 w-2 rounded-full bg-brand" />
                            <span className="font-medium">{perm.name}</span>
                            <span className="text-muted-foreground">- {perm.description}</span>
                          </div>
                        ))}
                        {userPermissions.length > 5 && (
                          <p className="text-xs text-muted-foreground px-2">
                            +{userPermissions.length - 5} more permissions
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Overview */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-muted-foreground text-xs">Created</p>
                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-brand" />
                    <div>
                      <p className="text-muted-foreground text-xs">Last Login</p>
                      <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs mb-1">User ID</p>
                  <p className="font-mono text-xs bg-brand/5 p-2 rounded">{user.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Approvals Given</span>
                  <span className="text-lg font-bold text-brand">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Actions</span>
                  <span className="text-lg font-bold text-brand">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="text-lg font-bold text-brand">47</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
