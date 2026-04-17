'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { payments, formatCurrency, formatDate } from '@/lib/mock-data';
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Users,
  School as SchoolIcon,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
  Download,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function PortalPaymentDetailPage({ params }: { params: { id: string } }) {
  const payment = payments.find(p => p.id === params.id);

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-brand mb-2">Payment Request Not Found</h2>
          <p className="text-muted-foreground mb-4">The payment request you're looking for doesn't exist.</p>
          <Link href="/portal/payments">
            <Button className="bg-brand hover:bg-brand/90">Back to Payments</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'Pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'Approved':
        return <CheckCircle2 className="h-6 w-6 text-blue-600" />;
      case 'Paid':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-6 w-6 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'Pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'Approved':
        return 'bg-blue-50 border-blue-200';
      case 'Paid':
        return 'bg-green-50 border-green-200';
      case 'Rejected':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/portal/payments">
              <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-brand">{payment.id}</h1>
                <StatusBadge status={payment.status} />
              </div>
              <p className="text-muted-foreground mt-1">
                Payment Request · {formatDate(payment.submittedDate)}
              </p>
            </div>
          </div>
          <Button className="gap-2 bg-brand hover:bg-brand/90">
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>

        {/* Status Alert */}
        <Card className={`border-2 ${getStatusColor()}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                {getStatusIcon()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  {payment.status === 'Pending' && 'Payment Request Pending'}
                  {payment.status === 'Approved' && 'Payment Request Approved'}
                  {payment.status === 'Paid' && 'Payment Completed'}
                  {payment.status === 'Rejected' && 'Payment Request Rejected'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {payment.status === 'Pending' && 'Your payment request is being reviewed by 1Ummah admin.'}
                  {payment.status === 'Approved' && 'Your payment request has been approved and is scheduled for payment.'}
                  {payment.status === 'Paid' && `Payment was completed on ${payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}.`}
                  {payment.status === 'Rejected' && 'Your payment request was rejected. Please contact admin for details.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Details */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>Request information and breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Request ID</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-mono font-medium">{payment.id}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>School</Label>
                    <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                      <SchoolIcon className="h-4 w-4 text-brand" />
                      <p className="text-sm font-medium">{payment.schoolName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Term</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{payment.term}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand" />
                      <p className="text-sm font-medium">{payment.year}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Students</Label>
                    <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand" />
                      <p className="text-sm font-medium">{payment.studentCount}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Amount</Label>
                    <div className="p-3 bg-brand/10 border border-brand/20 rounded-md">
                      <p className="text-2xl font-bold text-brand">{formatCurrency(payment.amount)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Submission Date</Label>
                  <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand" />
                    <p className="text-sm font-medium">{formatDate(payment.submittedDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Breakdown */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Breakdown
                </CardTitle>
                <CardDescription>List of students included in this payment request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.breakdown.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-brand/10 bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center">
                          <span className="text-brand font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.studentName}</p>
                          <p className="text-xs text-muted-foreground">{student.class}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand">{formatCurrency(student.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <p className="font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-brand">{formatCurrency(payment.amount)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notes & Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Invoice Note</Label>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">{payment.invoiceNote || 'No notes provided'}</p>
                  </div>
                </div>

                {payment.adminNotes && (
                  <div className="space-y-2">
                    <Label>Admin Notes</Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-900">{payment.adminNotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Payment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    {getStatusIcon()}
                  </div>
                </div>
                <div className="text-center">
                  <StatusBadge status={payment.status} />
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-brand" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">Submitted</p>
                      <p className="font-medium">{formatDate(payment.submittedDate)}</p>
                    </div>
                  </div>

                  {payment.paymentDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Paid</p>
                        <p className="font-medium">{formatDate(payment.paymentDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            {payment.paymentReference && (
              <Card className="border-brand/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-brand text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payment.paymentMethod && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="font-medium">{payment.paymentMethod}</p>
                    </div>
                  )}

                  {payment.paymentReference && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
                      <p className="font-mono text-xs bg-brand/5 p-2 rounded break-all">
                        {payment.paymentReference}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Summary */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="text-lg font-bold text-brand">{payment.studentCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Term</span>
                  <span className="font-medium">{payment.term}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Year</span>
                  <span className="font-medium">{payment.year}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-xl font-bold text-brand">{formatCurrency(payment.amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-brand">{children}</label>;
}
