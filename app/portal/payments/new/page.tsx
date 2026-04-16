'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getStudentsBySchool, getSchoolById, formatCurrency } from '@/lib/mock-data';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewPaymentRequestPage() {
  const router = useRouter();

  // Hardcode to Eqraah College for demo (SCH-001)
  const schoolId = 'SCH-001';
  const school = getSchoolById(schoolId);
  const allStudents = getStudentsBySchool(schoolId).filter(s => s.status === 'Active');

  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [invoiceNote, setInvoiceNote] = useState('');
  const [fileName, setFileName] = useState('');

  const terms = ['Term 1', 'Term 2', 'Term 3'];
  const years = ['2025/2026', '2026/2027'];

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === allStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(allStudents.map(s => s.id));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  // Calculate total amount
  const totalAmount = selectedStudents.reduce((sum, studentId) => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student || !school) return sum;

    const feeStructure = school.feeStructure.find(f => f.classLevel === student.class);
    return sum + (feeStructure?.termlyFee || 0);
  }, 0);

  const canSubmit =
    selectedTerm && selectedYear && selectedStudents.length > 0 && invoiceNote;

  const handleSubmit = () => {
    if (!canSubmit) return;

    toast.success(
      `Payment request submitted successfully for ${formatCurrency(totalAmount)}`
    );
    setTimeout(() => {
      router.push('/portal/dashboard');
    }, 2000);
  };

  if (!school) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p>School information not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Link href="/portal/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Payment Request</h1>
          <p className="text-muted-foreground mt-1">
            Request payment for student fees from 1Ummah
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Academic Term Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Period</CardTitle>
              <CardDescription>
                Select the term and year for this payment request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select value={selectedTerm} onValueChange={(val) => setSelectedTerm(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term} value={term}>
                          {term}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Students</CardTitle>
                  <CardDescription>
                    Choose which students to include in this payment request
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedStudents.length === allStudents.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allStudents.map(student => {
                  const feeStructure = school.feeStructure.find(f => f.classLevel === student.class);
                  const fee = feeStructure?.termlyFee || 0;

                  return (
                    <div
                      key={student.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleStudentToggle(student.id)}
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleStudentToggle(student.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.class} · {student.id}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {formatCurrency(fee)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Invoice Notes</Label>
                <Textarea
                  placeholder="Add any relevant notes or details about this payment request..."
                  value={invoiceNote}
                  onChange={(e) => setInvoiceNote(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Attach Invoice (Optional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="invoice-upload"
                  />
                  <label htmlFor="invoice-upload" className="cursor-pointer">
                    <Button variant="outline" className="gap-2" type="button">
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                  </label>
                  {fileName && (
                    <span className="text-sm text-muted-foreground">{fileName}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {selectedStudents.length > 0 && (
            <Card className="border-brand bg-brand-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand" />
                  Request Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Students Selected</div>
                    <div className="text-2xl font-bold text-brand">
                      {selectedStudents.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Academic Period</div>
                    <div className="text-lg font-semibold text-brand">
                      {selectedTerm && selectedYear ? `${selectedTerm}, ${selectedYear}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold text-brand">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/portal/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit Payment Request
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
