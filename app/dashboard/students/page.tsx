'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { students } from '@/lib/mock-data';
import type { Student } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

export default function StudentsPage() {
  const router = useRouter();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Get unique schools and classes for filters
  const uniqueSchools = Array.from(new Set(students.map(s => s.schoolName))).sort();
  const uniqueClasses = Array.from(new Set(students.map(s => s.class))).sort();

  // Apply filters
  const applyFilters = (school: string, classLevel: string, status: string) => {
    let filtered = students;

    if (school !== 'all') {
      filtered = filtered.filter(s => s.schoolName === school);
    }

    if (classLevel !== 'all') {
      filtered = filtered.filter(s => s.class === classLevel);
    }

    if (status !== 'all') {
      filtered = filtered.filter(s => s.status === status);
    }

    setFilteredStudents(filtered);
  };

  const handleSchoolChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedSchool(val);
    applyFilters(val, selectedClass, selectedStatus);
  };

  const handleClassChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedClass(val);
    applyFilters(selectedSchool, val, selectedStatus);
  };

  const handleStatusChange = (value: string | null) => {
    const val = value || 'all';
    setSelectedStatus(val);
    applyFilters(selectedSchool, selectedClass, val);
  };

  const columns: ColumnDef<Student>[] = [
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
      accessorKey: 'schoolName',
      header: 'School',
    },
    {
      accessorKey: 'class',
      header: 'Class',
    },
    {
      accessorKey: 'state',
      header: 'State',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  const handleExport = () => {
    // Simulate CSV export
    const csv = [
      ['Student ID', 'First Name', 'Last Name', 'School', 'Class', 'State', 'Status'],
      ...filteredStudents.map(s => [
        s.id,
        s.firstName,
        s.lastName,
        s.schoolName,
        s.class,
        s.state,
        s.status,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage all beneficiaries across all schools
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Link href="/dashboard/students/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </Link>
          </div>
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

          <Select value={selectedClass} onValueChange={handleClassChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map(classLevel => (
                <SelectItem key={classLevel} value={classLevel}>
                  {classLevel}
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Graduated">Graduated</SelectItem>
              <SelectItem value="Exited">Exited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data table */}
        <DataTable
          columns={columns}
          data={filteredStudents}
          searchKey="fullName"
          searchPlaceholder="Search by name or ID..."
          onRowClick={(student) => router.push(`/dashboard/students/${student.id}`)}
        />
      </div>
    </DashboardLayout>
  );
}
