'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { ConfirmModal } from '@/components/ui-custom/ConfirmModal';
import { getPaymentById, formatCurrency, formatDate } from '@/lib/mock-data';
import { ArrowLeft, CheckCircle, XCircle, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;
  const payment = getPaymentById(paymentId);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState(payment?.adminNotes || '');
  const [paymentReference, setPaymentReference] = useState(payment?.paymentReference || '');
  const [paymentDate, setPaymentDate] = useState(payment?.paymentDate || '');
  const [paymentMethod, setPaymentMethod] = useState<string>(payment?.paymentMethod || 'Bank Transfer');

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">Payment Request Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The payment request with ID {paymentId} could not be found.
          </p>
          <Link href="/dashboard/payments">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const canApprove = payment.status === 'Pending';
  const canMarkPaid = payment.status === 'Approved';
  const isFinalized = payment.status === 'Paid' || payment.status === 'Rejected';

  const handleApprove = () => {
    toast.success(`Payment request ${payment.id} has been approved`);
    setShowApproveModal(false);
    setTimeout(() => router.push('/dashboard/payments'), 1500);
  };

  const handleReject = () => {
    toast.error(`Payment request ${payment.id} has been rejected`);
    setShowRejectModal(false);
    setTimeout(() => router.push('/dashboard/payments'), 1500);
  };

  const handleMarkPaid = () => {
    if (!paymentReference || !paymentDate) {
      toast.error('Please provide payment reference and date');
      return;
    }
    toast.success(`Payment request ${payment.id} marked as paid`);
    setTimeout(() => router.push('/dashboard/payments'), 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back button */}
        <Link href="/dashboard/payments">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Payment Request {payment.id}</h1>
              <StatusBadge status={payment.status} />
            </div>
            <p className="text-muted-foreground">
              Submitted by {payment.schoolName} on {formatDate(payment.submittedDate)}
            </p>
          </div>

          {/* Actions */}
          {canApprove && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 text-danger border-danger hover:bg-danger hover:text-white"
                onClick={() => setShowRejectModal(true)}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                className="gap-2"
                onClick={() => setShowApproveModal(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Approve Request
              </Button>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">School</label>
                <p className="font-medium">{payment.schoolName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Academic Term</label>
                <p className="font-medium">{payment.term}, {payment.year}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Number of Students</label>
                <p className="font-medium">{payment.studentCount} students</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total Amount</label>
                <p className="text-2xl font-bold text-brand">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm whitespace-pre-wrap">
                  {payment.invoiceNote || 'No notes provided'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Breakdown */}
        {payment.breakdown && payment.breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fee Breakdown</CardTitle>
              <CardDescription>
                Individual student fees included in this request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Student Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Class</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment.breakdown.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.studentName}</td>
                        <td className="py-3 px-4">{item.class}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={2} className="py-3 px-4 text-right">Total:</td>
                      <td className="py-3 px-4 text-right text-brand">
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Notes & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add internal notes about this payment request..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={5}
                disabled={isFinalized}
              />
            </CardContent>
          </Card>

          {(canMarkPaid || payment.status === 'Paid') && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Reference Number</Label>
                  <Input
                    placeholder="e.g., TRF/1UMMAH/001/2025"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    disabled={!canMarkPaid}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    disabled={!canMarkPaid}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Input
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={!canMarkPaid}
                  />
                </div>
                {canMarkPaid && (
                  <Button
                    className="w-full mt-4"
                    onClick={handleMarkPaid}
                  >
                    Mark as Paid
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <ConfirmModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        title="Approve Payment Request"
        message={`Are you sure you want to approve this payment request for ${formatCurrency(payment.amount)}?`}
        confirmText="Approve"
        onConfirm={handleApprove}
      />

      {/* Reject Modal */}
      <ConfirmModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        title="Reject Payment Request"
        message="Are you sure you want to reject this payment request? The school will need to resubmit."
        confirmText="Reject"
        variant="destructive"
        onConfirm={handleReject}
      />
    </DashboardLayout>
  );
}
