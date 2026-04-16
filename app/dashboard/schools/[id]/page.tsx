'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import {
  getSchoolById,
  getStudentsBySchool,
  getFeesBySchool,
  getPaymentsBySchool,
  formatDate,
  formatCurrency,
} from '@/lib/mock-data';
import type { Student, PaymentRequest } from '@/lib/types';
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Users, DollarSign, X, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SchoolProfilePage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.id as string;
  const school = getSchoolById(schoolId);
  const students = getStudentsBySchool(schoolId);
  const fees = getFeesBySchool(schoolId);
  const paymentRequests = getPaymentsBySchool(schoolId);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingFees, setIsEditingFees] = useState(false);
  const [formData, setFormData] = useState({
    name: school?.name || '',
    address: school?.address || '',
    state: school?.state || '',
    region: school?.region || '',
    contactName: school?.contactName || '',
    contactPhone: school?.contactPhone || '',
    contactEmail: school?.contactEmail || '',
  });
  const [feeStructure, setFeeStructure] = useState(school?.feeStructure || []);

  const handleSave = () => {
    // In production, this would make an API call to update the school
    console.log('Saving school data:', formData);
    toast.success('School information updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original school data
    setFormData({
      name: school?.name || '',
      address: school?.address || '',
      state: school?.state || '',
      region: school?.region || '',
      contactName: school?.contactName || '',
      contactPhone: school?.contactPhone || '',
      contactEmail: school?.contactEmail || '',
    });
    setIsEditing(false);
  };

  const handleSaveFees = () => {
    // In production, this would make an API call to update the fee structure
    console.log('Saving fee structure:', feeStructure);
    toast.success('Fee structure updated successfully');
    setIsEditingFees(false);
  };

  const handleCancelFees = () => {
    // Reset fee structure to original data
    setFeeStructure(school?.feeStructure || []);
    setIsEditingFees(false);
  };

  const updateFee = (classLevel: string, newAmount: number) => {
    setFeeStructure(
      feeStructure.map((fee) =>
        fee.classLevel === classLevel ? { ...fee, termlyFee: newAmount } : fee
      )
    );
  };

  const nigerianStates = [
    'Abuja FCT', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const regions = ['North Central', 'Northeast', 'Northwest', 'South East', 'South South', 'South West'];

  if (!school) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">School Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The school with ID {schoolId} could not be found.
          </p>
          <Link href="/dashboard/schools">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Student columns
  const studentColumns: ColumnDef<Student>[] = [
    {
      accessorKey: 'photo',
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
      accessorKey: 'id',
      header: 'Student ID',
    },
    {
      accessorKey: 'fullName',
      header: 'Full Name',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'class',
      header: 'Class',
    },
    {
      accessorKey: 'vulnerabilityStatus',
      header: 'Status Type',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  // Payment columns
  const paymentColumns: ColumnDef<PaymentRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Request ID',
    },
    {
      accessorKey: 'submittedDate',
      header: 'Date Submitted',
      cell: ({ row }) => formatDate(row.original.submittedDate),
    },
    {
      accessorKey: 'term',
      header: 'Term',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: 'studentCount',
      header: 'Students',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/dashboard/schools">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Schools
          </Button>
        </Link>

        {/* School header */}
        <Card>
          <CardContent className="pt-6">
            {!isEditing ? (
              // View Mode
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-3 text-brand">{school.name}</h1>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {school.address}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {school.contactPhone} ({school.contactName})
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {school.contactEmail}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Enrolled in SILP: {formatDate(school.enrolledDate)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Active Students
                      </div>
                      <p className="text-2xl font-bold mt-1">{school.activeStudents}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Outstanding Balance
                      </div>
                      <p className="text-2xl font-bold text-warning mt-1">
                        {formatCurrency(school.outstandingBalance)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  className="gap-2 border-brand/30 text-brand hover:bg-brand/10"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit School
                </Button>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-brand">Edit School Information</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      className="gap-2 bg-brand hover:bg-brand/90"
                      onClick={handleSave}
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                      placeholder="Enter school name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Primary Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger className="border-brand/30 focus:border-brand">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData({ ...formData, region: value })}
                    >
                      <SelectTrigger className="border-brand/30 focus:border-brand">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                      placeholder="Enter complete school address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="fees">Fee Structure</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={studentColumns}
                  data={students}
                  searchKey="fullName"
                  searchPlaceholder="Search students..."
                  onRowClick={(student) => router.push(`/dashboard/students/${student.id}`)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fee Structure Tab */}
          <TabsContent value="fees">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Termly Fee Structure</CardTitle>
                {!isEditingFees ? (
                  <Button
                    variant="outline"
                    className="gap-2 border-brand/30 text-brand hover:bg-brand/10"
                    onClick={() => setIsEditingFees(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Fees
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleCancelFees}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      className="gap-2 bg-brand hover:bg-brand/90"
                      onClick={handleSaveFees}
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Class Level</th>
                        <th className="text-left py-3 px-4 font-semibold">Fee Per Term</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeStructure.map((fee, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{fee.classLevel}</td>
                          <td className="py-3 px-4">
                            {!isEditingFees ? (
                              <span className="font-semibold">
                                {formatCurrency(fee.termlyFee)}
                              </span>
                            ) : (
                              <Input
                                type="number"
                                value={fee.termlyFee}
                                onChange={(e) =>
                                  updateFee(fee.classLevel, parseFloat(e.target.value) || 0)
                                }
                                className="max-w-[200px] border-brand/30 focus:border-brand"
                                placeholder="Enter fee amount"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Request History</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentRequests.length > 0 ? (
                  <DataTable
                    columns={paymentColumns}
                    data={paymentRequests}
                    onRowClick={(payment) => router.push(`/dashboard/payments/${payment.id}`)}
                  />
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No payment requests found for this school.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
