'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { schools } from '@/lib/mock-data';

export default function NewPaymentRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    schoolId: '',
    term: '',
    academicYear: '',
    amount: '',
    studentCount: '',
    description: '',
    invoice: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.schoolId || !formData.term || !formData.academicYear || !formData.amount || !formData.studentCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('Creating payment request:', formData);
    toast.success('Payment request submitted successfully');
    router.push('/dashboard/payments');
  };

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/payments">
            <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">New Payment Request</h1>
            <p className="text-muted-foreground mt-1">
              Submit a payment request for school fees
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Information */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-brand flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Information
              </CardTitle>
              <CardDescription>
                Provide details about the payment request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School *</Label>
                  <Select
                    value={formData.schoolId}
                    onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
                    required
                  >
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Term *</Label>
                  <Select
                    value={formData.term}
                    onValueChange={(value) => setFormData({ ...formData, term: value })}
                    required
                  >
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First Term">First Term</SelectItem>
                      <SelectItem value="Second Term">Second Term</SelectItem>
                      <SelectItem value="Third Term">Third Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select
                    value={formData.academicYear}
                    onValueChange={(value) => setFormData({ ...formData, academicYear: value })}
                    required
                  >
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount (₦) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="border-brand/30 focus:border-brand"
                    placeholder="e.g., 250000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCount">Number of Students *</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="border-brand/30 focus:border-brand"
                    placeholder="e.g., 25"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice">Invoice/Receipt (Optional)</Label>
                  <Input
                    id="invoice"
                    type="file"
                    onChange={(e) => setFormData({ ...formData, invoice: e.target.files?.[0] || null })}
                    className="border-brand/30 focus:border-brand"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload invoice or receipt (PDF, JPG, PNG)
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description / Notes</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-brand/30 focus:border-brand"
                    placeholder="Add any additional notes or details about this payment request..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/payments">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-brand hover:bg-brand/90">
              Submit Payment Request
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
