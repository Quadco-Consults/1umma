'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
import { Textarea } from '@/components/ui/textarea';
import { roles } from '@/lib/mock-data-users';
import { UserStatus } from '@/lib/types';
import { ArrowLeft, UserPlus, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: '',
    status: 'Active' as UserStatus,
    customApprovalLimit: '',
    schoolId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Creating user:', formData);
    router.push('/dashboard/users');
  };

  const selectedRole = roles.find(r => r.id === formData.roleId);
  const showSchoolField = selectedRole?.name === 'School Portal User';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">Add New User</h1>
            <p className="text-muted-foreground mt-1">
              Create a new user account and assign role & permissions
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 max-w-4xl">
            {/* Personal Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic user details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name"
                      className="border-brand/30 focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name"
                      className="border-brand/30 focus:border-brand"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@1ummahng.org"
                      className="border-brand/30 focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 XXX XXX XXXX"
                      className="border-brand/30 focus:border-brand"
                    />
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
                <CardDescription>Assign user role and configure access permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleId">User Role *</Label>
                    <Select
                      value={formData.roleId}
                      onValueChange={(value) => setFormData({ ...formData, roleId: value || '' })}
                      required
                    >
                      <SelectTrigger className="border-brand/30 focus:border-brand">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter(r => r.status === 'Active')
                          .map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{role.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  Approval Limit: {role.approvalLimit === 0 ? 'None' : `₦${role.approvalLimit.toLocaleString()}`}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {selectedRole && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedRole.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Account Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: (value || 'Active') as UserStatus })}
                      required
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customApprovalLimit">Custom Approval Limit (Optional)</Label>
                  <Input
                    id="customApprovalLimit"
                    type="number"
                    value={formData.customApprovalLimit}
                    onChange={(e) => setFormData({ ...formData, customApprovalLimit: e.target.value })}
                    placeholder={selectedRole ? `Default: ₦${selectedRole.approvalLimit.toLocaleString()}` : 'Enter amount in Naira'}
                    className="border-brand/30 focus:border-brand"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use role's default approval limit. Enter custom amount to override.
                  </p>
                </div>

                {showSchoolField && (
                  <div className="space-y-2">
                    <Label htmlFor="schoolId">Assigned School *</Label>
                    <Select
                      value={formData.schoolId}
                      onValueChange={(value) => setFormData({ ...formData, schoolId: value || '' })}
                      required={showSchoolField}
                    >
                      <SelectTrigger className="border-brand/30 focus:border-brand">
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCH001">Al-Iman International School</SelectItem>
                        <SelectItem value="SCH002">Noor Islamic Academy</SelectItem>
                        <SelectItem value="SCH003">Al-Furqan College</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      School portal users can only access data for their assigned school
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Link href="/dashboard/users">
                <Button type="button" variant="outline" className="border-brand/30 text-brand hover:bg-brand/10">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-brand hover:bg-brand/90 text-white gap-2">
                <UserPlus className="h-4 w-4" />
                Create User
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
