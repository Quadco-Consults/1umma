'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStudentById, getFeesByStudent, formatDate, formatCurrency } from '@/lib/mock-data';
import { ArrowLeft, Edit, GraduationCap, Mail, Phone, MapPin, Calendar, User, Upload, FileText, Download, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui-custom/ConfirmModal';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  url: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;
  const student = getStudentById(studentId);
  const feeHistory = getFeesByStudent(studentId);
  const [showGraduateModal, setShowGraduateModal] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'DOC001',
      name: 'Student ID Card.pdf',
      category: 'Identification',
      size: '2.4 MB',
      uploadedBy: 'Muhammad Ilu',
      uploadedDate: '2025-03-15',
      url: '#',
    },
    {
      id: 'DOC002',
      name: 'Birth Certificate.pdf',
      category: 'Identification',
      size: '1.8 MB',
      uploadedBy: 'Aisha Ibrahim',
      uploadedDate: '2025-03-15',
      url: '#',
    },
    {
      id: 'DOC003',
      name: 'Enrollment Form.pdf',
      category: 'Enrollment',
      size: '980 KB',
      uploadedBy: 'Muhammad Ilu',
      uploadedDate: '2025-02-20',
      url: '#',
    },
  ]);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The student with ID {studentId} could not be found.
          </p>
          <Link href="/dashboard/students">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
  const canGraduate = student.class === 'SS3' && student.status === 'Active';

  const handleGraduate = () => {
    toast.success(`${student.firstName} ${student.lastName} has been marked as graduated`);
    setShowGraduateModal(false);
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadCategory) {
      toast.error('Please select a file and category');
      return;
    }

    const newDocument: Document = {
      id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
      name: uploadFile.name,
      category: uploadCategory,
      size: `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: 'Muhammad Ilu',
      uploadedDate: new Date().toISOString().split('T')[0],
      url: '#',
    };

    setDocuments([newDocument, ...documents]);
    setUploadFile(null);
    setUploadCategory('');
    toast.success('Document uploaded successfully');
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast.success('Document deleted successfully');
  };

  // Mock school history
  const schoolHistory = [
    {
      school: student.schoolName,
      class: student.class,
      fromDate: student.enrolledDate,
      toDate: null,
      reason: 'Current Enrollment',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/dashboard/students">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
        </Link>

        {/* Profile header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-brand text-white text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        {student.firstName} {student.lastName}
                      </h1>
                      <StatusBadge status={student.status} />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Badge variant="outline">{student.id}</Badge>
                      <span>•</span>
                      <span>{student.class}</span>
                      <span>•</span>
                      <span>{student.schoolName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Enrolled: {formatDate(student.enrolledDate)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Student
                    </Button>
                    {canGraduate && (
                      <Button
                        variant="default"
                        className="gap-2"
                        onClick={() => setShowGraduateModal(true)}
                      >
                        <GraduationCap className="h-4 w-4" />
                        Mark as Graduated
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fees">Fee History</TabsTrigger>
            <TabsTrigger value="school">School History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Date of Birth</label>
                    <p className="font-medium">{formatDate(student.dob)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Gender</label>
                    <p className="font-medium">{student.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">State of Origin</label>
                    <p className="font-medium">{student.state}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Vulnerability Status</label>
                    <Badge variant="outline" className="mt-1">
                      {student.vulnerabilityStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Guardian Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Guardian Name</label>
                    <p className="font-medium">{student.guardianName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Relationship</label>
                    <p className="font-medium">{student.guardianRelationship}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{student.guardianPhone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Address</label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="font-medium">{student.guardianAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fee History Tab */}
          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Fee Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">Term</th>
                            <th className="text-left py-3 px-4 font-semibold">Year</th>
                            <th className="text-left py-3 px-4 font-semibold">Amount Due</th>
                            <th className="text-left py-3 px-4 font-semibold">Amount Paid</th>
                            <th className="text-left py-3 px-4 font-semibold">Balance</th>
                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 font-semibold">Paid Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeHistory.map((fee) => (
                            <tr key={fee.id} className="border-b">
                              <td className="py-3 px-4">{fee.term}</td>
                              <td className="py-3 px-4">{fee.year}</td>
                              <td className="py-3 px-4">{formatCurrency(fee.amountDue)}</td>
                              <td className="py-3 px-4">{formatCurrency(fee.amountPaid)}</td>
                              <td className="py-3 px-4 font-semibold">
                                {formatCurrency(fee.balance)}
                              </td>
                              <td className="py-3 px-4">
                                <StatusBadge status={fee.status} />
                              </td>
                              <td className="py-3 px-4">
                                {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No fee records found for this student.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* School History Tab */}
          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle>School & Class History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-10 w-10 rounded-full bg-brand-light flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-brand" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{record.school}</h4>
                        <p className="text-sm text-muted-foreground">
                          Class: {record.class}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(record.fromDate)} -{' '}
                          {record.toDate ? formatDate(record.toDate) : 'Present'}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {record.reason}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            {/* Upload Form */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Document Category *</Label>
                      <Select value={uploadCategory} onValueChange={(value) => setUploadCategory(value || '')} required>
                        <SelectTrigger className="border-brand/30 focus:border-brand">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Identification">Identification</SelectItem>
                          <SelectItem value="Enrollment">Enrollment Forms</SelectItem>
                          <SelectItem value="Medical">Medical Records</SelectItem>
                          <SelectItem value="Academic">Academic Records</SelectItem>
                          <SelectItem value="Financial">Financial Documents</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Select File *</Label>
                      <Input
                        id="file"
                        type="file"
                        required
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="border-brand/30 focus:border-brand"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-brand hover:bg-brand/90 text-white gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-brand" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-brand truncate">{doc.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {doc.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{doc.size}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                Uploaded by {doc.uploadedBy}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(doc.uploadedDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-brand/30 text-brand hover:bg-brand/10"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-brand/30 text-brand hover:bg-brand/10"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload student documents using the form above
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Graduate Confirmation Modal */}
      <ConfirmModal
        open={showGraduateModal}
        onOpenChange={setShowGraduateModal}
        title="Mark Student as Graduated"
        message={`Are you sure you want to mark ${student.firstName} ${student.lastName} as graduated? This action will update their status.`}
        confirmText="Mark as Graduated"
        onConfirm={handleGraduate}
      />
    </DashboardLayout>
  );
}
