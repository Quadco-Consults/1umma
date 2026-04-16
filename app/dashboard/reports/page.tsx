'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { students, schools, fees, payments, formatCurrency, formatDate, getGraduatedStudents } from '@/lib/mock-data';
import { Download, FileText, Users, School, DollarSign, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('students');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const graduatedStudents = getGraduatedStudents();

  const reportTypes = [
    { value: 'students', label: 'Student Summary', icon: Users },
    { value: 'fees', label: 'Fee Summary', icon: DollarSign },
    { value: 'graduation', label: 'Graduation Tracker', icon: GraduationCap },
    { value: 'schools', label: 'School Performance', icon: School },
  ];

  const handleExport = (format: 'pdf' | 'csv') => {
    toast.success(`Exporting ${selectedReport} report as ${format.toUpperCase()}...`);

    // Simulate file download
    setTimeout(() => {
      const filename = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.${format}`;
      toast.success(`Downloaded: ${filename}`);
    }, 1500);
  };

  const renderPreview = () => {
    switch (selectedReport) {
      case 'students':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Student Summary Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Students</div>
                <div className="text-2xl font-bold mt-1">{students.length}</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Active</div>
                <div className="text-2xl font-bold mt-1 text-green-600">
                  {students.filter(s => s.status === 'Active').length}
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Graduated</div>
                <div className="text-2xl font-bold mt-1 text-blue-600">
                  {students.filter(s => s.status === 'Graduated').length}
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Schools</div>
                <div className="text-2xl font-bold mt-1">{schools.length}</div>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Student ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">School</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 10).map(student => (
                    <tr key={student.id} className="border-b">
                      <td className="py-3 px-4">{student.id}</td>
                      <td className="py-3 px-4">{student.firstName} {student.lastName}</td>
                      <td className="py-3 px-4">{student.schoolName}</td>
                      <td className="py-3 px-4">{student.class}</td>
                      <td className="py-3 px-4">
                        <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-muted-foreground mt-4">
                Showing 10 of {students.length} students. Export for full list.
              </p>
            </div>
          </div>
        );

      case 'fees':
        const totalGenerated = fees.reduce((sum, f) => sum + f.amountDue, 0);
        const totalPaid = fees.reduce((sum, f) => sum + f.amountPaid, 0);
        const totalOutstanding = fees.reduce((sum, f) => sum + f.balance, 0);

        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Fee Summary Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Generated</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalGenerated)}</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Paid</div>
                <div className="text-2xl font-bold mt-1 text-green-600">
                  {formatCurrency(totalPaid)}
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Outstanding</div>
                <div className="text-2xl font-bold mt-1 text-warning">
                  {formatCurrency(totalOutstanding)}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">School</th>
                    <th className="text-left py-3 px-4 font-semibold">Records</th>
                    <th className="text-left py-3 px-4 font-semibold">Generated</th>
                    <th className="text-left py-3 px-4 font-semibold">Paid</th>
                    <th className="text-left py-3 px-4 font-semibold">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.slice(0, 8).map(school => {
                    const schoolFees = fees.filter(f => f.school === school.id);
                    const gen = schoolFees.reduce((sum, f) => sum + f.amountDue, 0);
                    const paid = schoolFees.reduce((sum, f) => sum + f.amountPaid, 0);
                    const out = schoolFees.reduce((sum, f) => sum + f.balance, 0);

                    return (
                      <tr key={school.id} className="border-b">
                        <td className="py-3 px-4">{school.name}</td>
                        <td className="py-3 px-4">{schoolFees.length}</td>
                        <td className="py-3 px-4">{formatCurrency(gen)}</td>
                        <td className="py-3 px-4 text-green-600">{formatCurrency(paid)}</td>
                        <td className="py-3 px-4 text-warning">{formatCurrency(out)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'graduation':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Graduation Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Track SS3 students and their higher education sponsorship status
            </p>

            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold">School</th>
                    <th className="text-left py-3 px-4 font-semibold">Graduation Year</th>
                    <th className="text-left py-3 px-4 font-semibold">Higher Institution</th>
                    <th className="text-left py-3 px-4 font-semibold">Sponsorship Status</th>
                  </tr>
                </thead>
                <tbody>
                  {graduatedStudents.map((grad, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{grad.name}</td>
                      <td className="py-3 px-4">{grad.school}</td>
                      <td className="py-3 px-4">{grad.graduationYear}</td>
                      <td className="py-3 px-4">{grad.higherInstitution}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{grad.sponsorshipStatus}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'schools':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">School Performance Report</h3>

            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">School</th>
                    <th className="text-left py-3 px-4 font-semibold">State</th>
                    <th className="text-left py-3 px-4 font-semibold">Students</th>
                    <th className="text-left py-3 px-4 font-semibold">Outstanding</th>
                    <th className="text-left py-3 px-4 font-semibold">Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map(school => {
                    const schoolPayments = payments.filter(p => p.school === school.id);
                    return (
                      <tr key={school.id} className="border-b">
                        <td className="py-3 px-4">{school.name}</td>
                        <td className="py-3 px-4">{school.state}</td>
                        <td className="py-3 px-4">{school.activeStudents}</td>
                        <td className="py-3 px-4 text-warning">
                          {formatCurrency(school.outstandingBalance)}
                        </td>
                        <td className="py-3 px-4">{schoolPayments.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive reports and export data
          </p>
        </div>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Select report type and date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReport} onValueChange={(val) => setSelectedReport(val || 'students')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => handleExport('pdf')} className="gap-2">
                <Download className="h-4 w-4" />
                Export as PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('csv')} className="gap-2">
                <FileText className="h-4 w-4" />
                Export as CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {renderPreview()}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
