'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { schools, students, formatCurrency } from '@/lib/mock-data';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function GenerateFeesPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const academicYears = ['2025/2026', '2026/2027'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  const handleSchoolToggle = (schoolId: string) => {
    setSelectedSchools(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSchools.length === schools.length) {
      setSelectedSchools([]);
    } else {
      setSelectedSchools(schools.map(s => s.id));
    }
  };

  // Calculate preview stats
  const affectedSchools = schools.filter(s => selectedSchools.includes(s.id));
  const affectedStudents = students.filter(s =>
    selectedSchools.includes(s.school) && s.status === 'Active'
  );
  const estimatedTotal = affectedStudents.reduce((sum, student) => {
    const school = schools.find(s => s.id === student.school);
    const feeStructure = school?.feeStructure.find(f => f.classLevel === student.class);
    return sum + (feeStructure?.termlyFee || 0);
  }, 0);

  const canGenerate =
    selectedYear && selectedTerm && selectedSchools.length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;

    toast.success(
      `Successfully generated ${affectedStudents.length} fee records totaling ${formatCurrency(estimatedTotal)}`
    );
    setTimeout(() => {
      router.push('/dashboard/fees');
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Link href="/dashboard/fees">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Fees
          </Button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Fees</h1>
          <p className="text-muted-foreground mt-1">
            Bulk generate fee records for a new academic term
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-6">
          {/* Step 1: Select Term */}
          <Card>
            <CardHeader>
              <CardTitle>Select Academic Term</CardTitle>
              <CardDescription>
                Choose the academic year and term for fee generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Academic Year</label>
                  <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Term</label>
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

          {/* Step 2: Select Schools */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Schools</CardTitle>
                  <CardDescription>
                    Choose which schools to include in fee generation
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedSchools.length === schools.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schools.map(school => (
                  <div
                    key={school.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSchoolToggle(school.id)}
                  >
                    <Checkbox
                      checked={selectedSchools.includes(school.id)}
                      onCheckedChange={() => handleSchoolToggle(school.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{school.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {school.state} · {school.activeStudents} active students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {canGenerate && (
            <Card className="border-brand bg-brand-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand" />
                  Generation Preview
                </CardTitle>
                <CardDescription>
                  Review the estimated impact before generating fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Schools Selected</div>
                    <div className="text-2xl font-bold text-brand">
                      {affectedSchools.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Students</div>
                    <div className="text-2xl font-bold text-brand">
                      {affectedStudents.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Total</div>
                    <div className="text-2xl font-bold text-brand">
                      {formatCurrency(estimatedTotal)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/dashboard/fees">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              Generate Fee Records
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
