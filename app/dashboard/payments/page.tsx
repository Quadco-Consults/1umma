'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { payments, formatCurrency, formatDate } from '@/lib/mock-data';
import type { PaymentRequest } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PaymentsPage() {
  const router = useRouter();
  const [filteredPayments, setFilteredPayments] = useState<PaymentRequest[]>(payments);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Get unique schools
  const uniqueSchools = Array.from(new Set(payments.map(p => p.schoolName))).sort();

  // Apply filters
  const applyFilters = (school: string, status: string) => {
    let filtered = payments;

    if (school !== 'all') {
      filtered = filtered.filter(p => p.schoolName === school);
    }

    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    setFilteredPayments(filtered);
  };

  const handleSchoolChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedSchool(val);
    applyFilters(val, selectedStatus);
  };

  const handleStatusChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedStatus(val);
    applyFilters(selectedSchool, val);
  };

  const columns: ColumnDef<PaymentRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Request ID',
    },
    {
      accessorKey: 'schoolName',
      header: 'School',
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
      cell: ({ row }) => (
        <span className="font-medium">{row.original.studentCount}</span>
      ),
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Requests</h1>
          <p className="text-muted-foreground mt-1">
            Review and process payment requests from schools
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-2xl font-bold mt-1">{filteredPayments.length}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold mt-1 text-warning">
              {filteredPayments.filter(p => p.status === 'Pending').length}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              {filteredPayments.filter(p => p.status === 'Approved').length}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {filteredPayments.filter(p => p.status === 'Paid').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedSchool} onValueChange={handleSchoolChange}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {uniqueSchools.map(school => (
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredPayments}
          searchKey="schoolName"
          searchPlaceholder="Search by school name or ID..."
          onRowClick={(payment) => router.push(`/dashboard/payments/${payment.id}`)}
        />
      </div>
    </DashboardLayout>
  );
}
