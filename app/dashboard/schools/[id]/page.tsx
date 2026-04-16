'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function SchoolProfilePage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.id as string;
  const school = getSchoolById(schoolId);
  const students = getStudentsBySchool(schoolId);
  const fees = getFeesBySchool(schoolId);
  const paymentRequests = getPaymentsBySchool(schoolId);

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
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{school.name}</h1>
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
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit School
              </Button>
            </div>
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
              <CardHeader>
                <CardTitle>Termly Fee Structure</CardTitle>
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
                      {school.feeStructure.map((fee, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{fee.classLevel}</td>
                          <td className="py-3 px-4 font-semibold">
                            {formatCurrency(fee.termlyFee)}
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
