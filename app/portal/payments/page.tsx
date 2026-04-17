'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { getPaymentsBySchool, formatCurrency, formatDate } from '@/lib/mock-data';
import { Search, FileText, Plus, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { PaymentStatus } from '@/lib/types';

export default function PortalPaymentsPage() {
  // Hardcode to Eqraah College for demo (SCH-001)
  const schoolId = 'SCH-001';
  const schoolName = 'Eqraah College';

  const allPayments = getPaymentsBySchool(schoolId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'All'>('All');

  // Filter payments
  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.year.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: allPayments.length,
    pending: allPayments.filter(p => p.status === 'Pending').length,
    approved: allPayments.filter(p => p.status === 'Approved').length,
    paid: allPayments.filter(p => p.status === 'Paid').length,
    rejected: allPayments.filter(p => p.status === 'Rejected').length,
    totalAmount: allPayments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: allPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Approved':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case 'Paid':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">Payment Requests</h1>
            <p className="text-muted-foreground mt-1">
              {schoolName} - View and manage your payment requests
            </p>
          </div>
          <Link href="/portal/payments/new">
            <Button className="gap-2 bg-brand hover:bg-brand/90">
              <Plus className="h-4 w-4" />
              New Payment Request
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-brand/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold text-brand">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-brand" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-brand">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-brand" />
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
                  placeholder="Search by ID, term, or year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-brand/30 focus:border-brand"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {(['All', 'Pending', 'Approved', 'Paid', 'Rejected'] as const).map((status) => (
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

        {/* Payments List */}
        <Card className="border-brand/20">
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payment Requests ({filteredPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="space-y-3">
                {filteredPayments
                  .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                  .map((payment) => (
                    <Link
                      key={payment.id}
                      href={`/portal/payments/${payment.id}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-brand/10 hover:bg-brand/5 hover:border-brand/30 transition-all cursor-pointer group">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Status Icon */}
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-brand/10 transition-colors">
                            {getStatusIcon(payment.status)}
                          </div>

                          {/* Payment Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-brand group-hover:underline">{payment.id}</h3>
                              <StatusBadge status={payment.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {payment.term}, {payment.year} · {payment.studentCount} students
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Submitted: {formatDate(payment.submittedDate)}
                            </p>
                            {payment.paymentDate && (
                              <p className="text-xs text-green-600 mt-1">
                                Paid: {formatDate(payment.paymentDate)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="mt-4 md:mt-0 md:text-right flex md:flex-col items-center gap-2">
                          <div className="flex-1 text-left md:text-right">
                            <p className="text-2xl font-bold text-brand">
                              {formatCurrency(payment.amount)}
                            </p>
                            {payment.paymentMethod && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {payment.paymentMethod}
                              </p>
                            )}
                            {payment.paymentReference && (
                              <p className="text-xs text-muted-foreground">
                                Ref: {payment.paymentReference}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-brand transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No payment requests found matching your criteria</p>
                <Link href="/portal/payments/new">
                  <Button className="gap-2 bg-brand hover:bg-brand/90">
                    <Plus className="h-4 w-4" />
                    Create Your First Request
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
