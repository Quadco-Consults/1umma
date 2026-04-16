'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { getStudentsBySchool } from '@/lib/mock-data';
import { Search, Users, Download, Filter, GraduationCap, User } from 'lucide-react';
import { useState } from 'react';

export default function PortalStudentsPage() {
  // Hardcode to Eqraah College for demo (SCH-001)
  const schoolId = 'SCH-001';
  const schoolName = 'Eqraah College';

  const allStudents = getStudentsBySchool(schoolId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Graduated' | 'Exited'>('All');

  // Filter students
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allStudents.length,
    active: allStudents.filter(s => s.status === 'Active').length,
    male: allStudents.filter(s => s.gender === 'Male').length,
    female: allStudents.filter(s => s.gender === 'Female').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">My Students</h1>
            <p className="text-muted-foreground mt-1">
              {schoolName} - Manage and view your sponsored students
            </p>
          </div>
          <Button className="gap-2 bg-brand hover:bg-brand/90">
            <Download className="h-4 w-4" />
            Export List
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-brand/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-brand">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-brand" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Male</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.male}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Female</p>
                  <p className="text-3xl font-bold text-pink-600">{stats.female}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-brand/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-brand/30 focus:border-brand"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {(['All', 'Active', 'Graduated', 'Exited'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'bg-brand hover:bg-brand/90' : 'border-brand/30 text-brand hover:bg-brand/10'}
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="border-brand/20">
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students ({filteredStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-brand/10 hover:bg-brand/5 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand font-semibold">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-brand">
                            {student.firstName} {student.lastName}
                          </h3>
                          <StatusBadge status={student.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.id} · {student.class} · {student.gender}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {student.vulnerabilityStatus} · Enrolled: {new Date(student.enrolledDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Guardian Info */}
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-sm font-medium">{student.guardianName}</p>
                      <p className="text-xs text-muted-foreground">{student.guardianRelationship}</p>
                      <p className="text-xs text-muted-foreground">{student.guardianPhone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No students found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
