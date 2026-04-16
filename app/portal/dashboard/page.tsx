'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui-custom/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { getStudentsBySchool, getPaymentsBySchool, formatCurrency, formatDate } from '@/lib/mock-data';
import { Users, DollarSign, FileText, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SchoolPortalDashboard() {
  // Hardcode to Eqraah College for demo (SCH-001)
  const schoolId = 'SCH-001';
  const schoolName = 'Eqraah College';

  const students = getStudentsBySchool(schoolId);
  const paymentRequests = getPaymentsBySchool(schoolId);

  // Calculate stats
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const recentPayments = paymentRequests.slice(0, 5).sort((a, b) =>
    new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
  );
  const lastPaymentStatus = recentPayments[0]?.status || 'No payments';
  const currentTermFees = students.filter(s => s.status === 'Active').length * 25000; // Estimate

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{schoolName} Portal</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your school management dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="My Students"
            value={activeStudents}
            icon={Users}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Fees This Term"
            value={formatCurrency(currentTermFees)}
            icon={DollarSign}
            iconColor="text-brand"
          />
          <StatCard
            title="Payment Requests"
            value={paymentRequests.length}
            icon={FileText}
            iconColor="text-purple-600"
          />
        </div>

        {/* Quick Action */}
        <Card className="border-brand bg-brand-light">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Submit Payment Request</h3>
                <p className="text-sm text-muted-foreground">
                  Request payment for student fees from 1Ummah
                </p>
              </div>
              <Link href="/portal/payments/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Payment Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payment Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Payment Requests</CardTitle>
              <Link href="/portal/payments">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentPayments.length > 0 ? (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{payment.id}</span>
                        <StatusBadge status={payment.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.term}, {payment.year} · {payment.studentCount} students
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {formatDate(payment.submittedDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No payment requests yet. Submit your first request to get started.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Student Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Summary</CardTitle>
              <Link href="/portal/students">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Active Students</div>
                <div className="text-2xl font-bold">{activeStudents}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">By Gender</div>
                <div className="text-sm">
                  <span className="font-semibold">
                    {students.filter(s => s.gender === 'Male').length}
                  </span> Male ·
                  <span className="font-semibold ml-1">
                    {students.filter(s => s.gender === 'Female').length}
                  </span> Female
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Vulnerability</div>
                <div className="text-xs space-y-1">
                  <div>Orphan: {students.filter(s => s.vulnerabilityStatus === 'Orphan').length}</div>
                  <div>IDP: {students.filter(s => s.vulnerabilityStatus === 'IDP').length}</div>
                  <div>Less Privileged: {students.filter(s => s.vulnerabilityStatus === 'Less Privileged').length}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
