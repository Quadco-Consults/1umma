'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { students } from '@/lib/mock-data';
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Calendar,
  GraduationCap,
  Users,
  Heart,
  School as SchoolIcon,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function PortalStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-brand mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-4">The student you're looking for doesn't exist.</p>
          <Link href="/portal/students">
            <Button className="bg-brand hover:bg-brand/90">Back to Students</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/portal/students">
            <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-brand text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-brand">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">{student.id}</p>
            </div>
          </div>
          <StatusBadge status={student.status} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Student's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{student.firstName}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{student.lastName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand" />
                      <p className="text-sm font-medium">
                        {new Date(student.dob).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{student.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Vulnerability Status</Label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
                    <Heart className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-medium text-amber-900">{student.vulnerabilityStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* School Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  School Information
                </CardTitle>
                <CardDescription>Academic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>School</Label>
                  <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                    <SchoolIcon className="h-4 w-4 text-brand" />
                    <p className="text-sm font-medium">{student.schoolName}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{student.class}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Enrollment Date</Label>
                    <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand" />
                      <p className="text-sm font-medium">
                        {new Date(student.enrolledDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Guardian Information
                </CardTitle>
                <CardDescription>Parent or guardian contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Guardian Name</Label>
                  <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                    <User className="h-4 w-4 text-brand" />
                    <p className="text-sm font-medium">{student.guardianName}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{student.guardianRelationship}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand" />
                      <p className="text-sm font-medium">{student.guardianPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="p-2 bg-muted/50 rounded-md flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-brand mt-0.5" />
                    <p className="text-sm font-medium">{student.guardianAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-muted-foreground text-xs">State</p>
                    <p className="font-medium">{student.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-muted-foreground text-xs">Enrolled</p>
                    <p className="font-medium">
                      {new Date(student.enrolledDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-muted-foreground text-xs mb-1">Student ID</p>
                  <p className="font-mono text-xs bg-brand/5 p-2 rounded">{student.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Academic Status</p>
                    <StatusBadge status={student.status} />
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground mb-2">Vulnerability</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-sm font-medium">
                      <Heart className="h-3.5 w-3.5" />
                      {student.vulnerabilityStatus}
                    </div>
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
