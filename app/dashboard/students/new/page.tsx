'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, GraduationCap, Heart, User, School as SchoolIcon, MapPin, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    state: '',
    lga: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: '',
    schoolId: '',
    class: '',
    admissionDate: '',
    status: 'Active',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission
    console.log('Form data:', formData);
    alert('Student sponsored successfully!');
    router.push('/dashboard/students');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nigerianStates = [
    'Abuja FCT', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const schools = [
    { id: 'SCH001', name: 'Al-Iman International School' },
    { id: 'SCH002', name: 'Noor Islamic Academy' },
    { id: 'SCH003', name: 'Al-Furqan College' },
    { id: 'SCH004', name: 'Taqwa Islamic School' },
    { id: 'SCH005', name: 'Al-Hidayah Academy' },
  ];

  const classes = [
    'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3',
    'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students">
            <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-brand">Sponsor New Student</h1>
            <p className="text-muted-foreground mt-1">
              Register a new beneficiary for the SILP scholarship program
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="border-brand/30 bg-gradient-to-r from-brand/5 to-brand/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-brand">1Ummah Scholarship Initiative</h3>
                <p className="text-sm text-muted-foreground">
                  By sponsoring this student, you're providing them with access to quality Islamic education
                  and supporting their journey towards academic excellence. Complete the form below to register
                  a new beneficiary.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <CardTitle className="text-brand">Personal Information</CardTitle>
                  <CardDescription>Basic details about the student</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-brand">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                    className="border-brand/30 focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-brand">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                    className="border-brand/30 focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-brand">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    required
                    className="border-brand/30 focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-brand">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value || '')}>
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <CardTitle className="text-brand">Location Information</CardTitle>
                  <CardDescription>Where the student resides</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-brand">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleChange('state', value || '')}>
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lga" className="text-brand">LGA</Label>
                  <Input
                    id="lga"
                    placeholder="Enter local government area"
                    value={formData.lga}
                    onChange={(e) => handleChange('lga', e.target.value)}
                    className="border-brand/30 focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-brand">Home Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="border-brand/30 focus:border-brand"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <CardTitle className="text-brand">Guardian Information</CardTitle>
                  <CardDescription>Parent or guardian contact details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName" className="text-brand">Guardian Name *</Label>
                  <Input
                    id="guardianName"
                    placeholder="Enter guardian's full name"
                    value={formData.guardianName}
                    onChange={(e) => handleChange('guardianName', e.target.value)}
                    required
                    className="border-brand/30 focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone" className="text-brand">Phone Number *</Label>
                  <Input
                    id="guardianPhone"
                    type="tel"
                    placeholder="+234 XXX XXX XXXX"
                    value={formData.guardianPhone}
                    onChange={(e) => handleChange('guardianPhone', e.target.value)}
                    required
                    className="border-brand/30 focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianRelation" className="text-brand">Relationship *</Label>
                <Select value={formData.guardianRelation} onValueChange={(value) => handleChange('guardianRelation', value || '')}>
                  <SelectTrigger className="border-brand/30 focus:border-brand">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* School Information */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <SchoolIcon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <CardTitle className="text-brand">School Information</CardTitle>
                  <CardDescription>Academic details and enrollment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolId" className="text-brand">School *</Label>
                  <Select value={formData.schoolId} onValueChange={(value) => handleChange('schoolId', value || '')}>
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-brand">Class *</Label>
                  <Select value={formData.class} onValueChange={(value) => handleChange('class', value || '')}>
                    <SelectTrigger className="border-brand/30 focus:border-brand">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(classLevel => (
                        <SelectItem key={classLevel} value={classLevel}>{classLevel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate" className="text-brand">Admission Date *</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleChange('admissionDate', e.target.value)}
                  required
                  className="border-brand/30 focus:border-brand"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <CardTitle className="text-brand">Additional Information</CardTitle>
                  <CardDescription>Optional notes and comments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-brand">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the student or sponsorship..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="border-brand/30 focus:border-brand"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <Link href="/dashboard/students">
              <Button type="button" variant="outline" className="w-full sm:w-auto border-brand/30 text-brand hover:bg-brand/10">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white gap-2 shadow-md"
              size="lg"
            >
              <GraduationCap className="h-5 w-5" />
              Sponsor Student
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
