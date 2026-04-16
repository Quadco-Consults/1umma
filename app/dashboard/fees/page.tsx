'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fees, schools, formatCurrency, formatDate } from '@/lib/mock-data';
import type { FeeRecord } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Download, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function FeesPage() {
  const [filteredFees, setFilteredFees] = useState<FeeRecord[]>(fees);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Get unique values for filters
  const uniqueSchools = Array.from(new Set(fees.map(f => f.schoolName))).sort();
  const uniqueTerms = Array.from(new Set(fees.map(f => f.term))).sort();
  const uniqueYears = Array.from(new Set(fees.map(f => f.year))).sort();

  // Apply filters
  const applyFilters = (school: string, term: string, year: string, status: string) => {
    let filtered = fees;

    if (school !== 'all') {
      filtered = filtered.filter(f => f.schoolName === school);
    }

    if (term !== 'all') {
      filtered = filtered.filter(f => f.term === term);
    }

    if (year !== 'all') {
      filtered = filtered.filter(f => f.year === year);
    }

    if (status !== 'all') {
      filtered = filtered.filter(f => f.status === status);
    }

    setFilteredFees(filtered);
  };

  const handleSchoolChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedSchool(val);
    applyFilters(val, selectedTerm, selectedYear, selectedStatus);
  };

  const handleTermChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedTerm(val);
    applyFilters(selectedSchool, val, selectedYear, selectedStatus);
  };

  const handleYearChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedYear(val);
    applyFilters(selectedSchool, selectedTerm, val, selectedStatus);
  };

  const handleStatusChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedStatus(val);
    applyFilters(selectedSchool, selectedTerm, selectedYear, val);
  };

  // Calculate stats
  const totalDue = filteredFees.reduce((sum, f) => sum + f.amountDue, 0);
  const totalPaid = filteredFees.reduce((sum, f) => sum + f.amountPaid, 0);
  const totalOutstanding = filteredFees.reduce((sum, f) => sum + f.balance, 0);

  const columns: ColumnDef<FeeRecord>[] = [
    {
      accessorKey: 'studentName',
      header: 'Student Name',
    },
    {
      accessorKey: 'schoolName',
      header: 'School',
    },
    {
      accessorKey: 'class',
      header: 'Class',
    },
    {
      accessorKey: 'term',
      header: 'Term',
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'amountDue',
      header: 'Amount Due',
      cell: ({ row }) => formatCurrency(row.original.amountDue),
    },
    {
      accessorKey: 'amountPaid',
      header: 'Paid',
      cell: ({ row }) => formatCurrency(row.original.amountPaid),
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      cell: ({ row }) => (
        <span className={row.original.balance > 0 ? 'text-warning font-semibold' : ''}>
          {formatCurrency(row.original.balance)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  const handleExport = () => {
    const csv = [
      ['Student Name', 'School', 'Class', 'Term', 'Year', 'Amount Due', 'Amount Paid', 'Balance', 'Status'],
      ...filteredFees.map(f => [
        f.studentName,
        f.schoolName,
        f.class,
        f.term,
        f.year,
        f.amountDue.toString(),
        f.amountPaid.toString(),
        f.balance.toString(),
        f.status,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fees-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage school fees across all beneficiaries
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Link href="/dashboard/fees/generate">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Fees
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Generated
              </CardTitle>
              <DollarSign className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalDue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredFees.length} fee records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Paid
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredFees.filter(f => f.status === 'Paid').length} paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Outstanding
              </CardTitle>
              <DollarSign className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{formatCurrency(totalOutstanding)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredFees.filter(f => f.status !== 'Paid').length} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedSchool} onValueChange={handleSchoolChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
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

          <Select value={selectedTerm} onValueChange={handleTermChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              {uniqueTerms.map(term => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredFees}
          searchKey="studentName"
          searchPlaceholder="Search by student name..."
        />
      </div>
    </DashboardLayout>
  );
}
