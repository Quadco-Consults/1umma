import studentsData from '@/mock-data/students.json';
import schoolsData from '@/mock-data/schools.json';
import feesData from '@/mock-data/fees.json';
import paymentsData from '@/mock-data/payments.json';
import usersData from '@/mock-data/users.json';
import type { Student, School, FeeRecord, PaymentRequest, AuthUser, StudentReport } from './types';

export const students = studentsData as Student[];
export const schools = schoolsData as School[];
export const fees = feesData as FeeRecord[];
export const payments = paymentsData as PaymentRequest[];
export const users = usersData as AuthUser[];

// Utility functions
export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function getSchoolById(id: string): School | undefined {
  return schools.find((s) => s.id === id);
}

export function getPaymentById(id: string): PaymentRequest | undefined {
  return payments.find((p) => p.id === id);
}

export function getStudentsBySchool(schoolId: string): Student[] {
  return students.filter((s) => s.school === schoolId);
}

export function getFeesByStudent(studentId: string): FeeRecord[] {
  return fees.filter((f) => f.studentId === studentId);
}

export function getFeesBySchool(schoolId: string): FeeRecord[] {
  return fees.filter((f) => f.school === schoolId);
}

export function getPaymentsBySchool(schoolId: string): PaymentRequest[] {
  return payments.filter((p) => p.school === schoolId);
}

// Calculate dashboard stats
export function getDashboardStats() {
  const totalStudents = students.filter((s) => s.status === 'Active').length;
  const activeSchools = schools.length;

  const currentTermFees = fees.filter(
    (f) => f.term === 'Term 2' && f.year === '2025/2026'
  );
  const totalFeesThisTerm = currentTermFees.reduce(
    (sum, f) => sum + f.amountDue,
    0
  );

  const pendingPayments = payments.filter((p) => p.status === 'Pending').length;

  return {
    totalStudents,
    activeSchools,
    totalFeesThisTerm: formatCurrency(totalFeesThisTerm),
    pendingPayments,
  };
}

// Get chart data for fees paid vs outstanding per school
export function getChartData() {
  return schools.slice(0, 10).map((school) => {
    const schoolFees = fees.filter(
      (f) => f.school === school.id && f.term === 'Term 2' && f.year === '2025/2026'
    );
    const paid = schoolFees
      .filter((f) => f.status === 'Paid')
      .reduce((sum, f) => sum + f.amountPaid, 0);
    const outstanding = schoolFees
      .filter((f) => f.status !== 'Paid')
      .reduce((sum, f) => sum + f.balance, 0);

    return {
      school: school.name.split(' ')[0], // Shortened name for chart
      paid: paid / 1000, // Convert to thousands for better chart display
      outstanding: outstanding / 1000,
    };
  });
}

// Get recent activity
export function getRecentActivity() {
  const recentStudents = students
    .sort(
      (a, b) =>
        new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime()
    )
    .slice(0, 3)
    .map((s) => ({
      type: 'student' as const,
      name: `${s.firstName} ${s.lastName}`,
      date: s.enrolledDate,
      school: s.schoolName,
    }));

  const recentPayments = payments
    .filter((p) => p.status === 'Pending' || p.status === 'Approved')
    .sort(
      (a, b) =>
        new Date(b.submittedDate).getTime() -
        new Date(a.submittedDate).getTime()
    )
    .slice(0, 2)
    .map((p) => ({
      type: 'payment' as const,
      name: `Payment Request - ${p.schoolName}`,
      date: p.submittedDate,
      school: p.schoolName,
    }));

  return [...recentStudents, ...recentPayments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Get graduated students for reports
export function getGraduatedStudents() {
  return students
    .filter((s) => s.status === 'Graduated' || s.class === 'SS3')
    .map((s) => ({
      name: `${s.firstName} ${s.lastName}`,
      school: s.schoolName,
      graduationYear: '2025',
      higherInstitution: 'Pending',
      sponsorshipStatus: 'Pending' as 'Yes' | 'No' | 'Pending',
    }));
}

// Mock student reports data
const studentReports: StudentReport[] = [
  {
    id: 'REP-001',
    studentId: 'STU-024',
    term: 'Term 1',
    year: '2024/2025',
    class: 'JSS1',
    subjects: [
      { subject: 'Mathematics', score: 78, grade: 'B', remark: 'Good' },
      { subject: 'English Language', score: 82, grade: 'A', remark: 'Excellent' },
      { subject: 'Science', score: 75, grade: 'B', remark: 'Good' },
      { subject: 'Social Studies', score: 80, grade: 'A', remark: 'Very Good' },
      { subject: 'Hausa Language', score: 70, grade: 'B', remark: 'Good' },
      { subject: 'Physical Education', score: 85, grade: 'A', remark: 'Excellent' },
      { subject: 'Islamic Studies', score: 88, grade: 'A', remark: 'Excellent' },
      { subject: 'Computer Studies', score: 76, grade: 'B', remark: 'Good' },
    ],
    totalScore: 634,
    averageScore: 79.25,
    position: 5,
    totalStudents: 45,
    attendance: { present: 88, absent: 2, total: 90 },
    teacherComment: 'Jamilu is a dedicated student who shows consistent effort in all subjects. Keep up the good work!',
    principalComment: 'Excellent performance. Continue to strive for excellence.',
    nextTermBegins: '2025-04-08',
  },
  {
    id: 'REP-002',
    studentId: 'STU-024',
    term: 'Term 2',
    year: '2024/2025',
    class: 'JSS1',
    subjects: [
      { subject: 'Mathematics', score: 85, grade: 'A', remark: 'Excellent' },
      { subject: 'English Language', score: 87, grade: 'A', remark: 'Excellent' },
      { subject: 'Science', score: 82, grade: 'A', remark: 'Very Good' },
      { subject: 'Social Studies', score: 84, grade: 'A', remark: 'Very Good' },
      { subject: 'Hausa Language', score: 75, grade: 'B', remark: 'Good' },
      { subject: 'Physical Education', score: 90, grade: 'A', remark: 'Outstanding' },
      { subject: 'Islamic Studies', score: 92, grade: 'A', remark: 'Outstanding' },
      { subject: 'Computer Studies', score: 80, grade: 'A', remark: 'Very Good' },
    ],
    totalScore: 675,
    averageScore: 84.38,
    position: 3,
    totalStudents: 45,
    attendance: { present: 92, absent: 1, total: 93 },
    teacherComment: 'Outstanding improvement this term! Jamilu has shown remarkable dedication and progress.',
    principalComment: 'Keep up this excellent performance. Well done!',
    nextTermBegins: '2025-09-10',
  },
  {
    id: 'REP-003',
    studentId: 'STU-024',
    term: 'Term 1',
    year: '2023/2024',
    class: 'Primary 6',
    subjects: [
      { subject: 'Mathematics', score: 72, grade: 'B', remark: 'Good' },
      { subject: 'English Language', score: 76, grade: 'B', remark: 'Good' },
      { subject: 'Science', score: 70, grade: 'B', remark: 'Good' },
      { subject: 'Social Studies', score: 74, grade: 'B', remark: 'Good' },
      { subject: 'Hausa Language', score: 68, grade: 'C', remark: 'Fair' },
      { subject: 'Physical Education', score: 80, grade: 'A', remark: 'Very Good' },
      { subject: 'Islamic Studies', score: 82, grade: 'A', remark: 'Very Good' },
    ],
    totalScore: 522,
    averageScore: 74.57,
    position: 8,
    totalStudents: 40,
    attendance: { present: 85, absent: 5, total: 90 },
    teacherComment: 'Good effort. Needs to improve in Hausa Language.',
    principalComment: 'Satisfactory performance. Keep working hard.',
    nextTermBegins: '2024-01-10',
  },
];

// Get reports for a student
export function getReportsByStudent(studentId: string): StudentReport[] {
  return studentReports
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => {
      // Sort by year first (descending)
      const yearCompare = b.year.localeCompare(a.year);
      if (yearCompare !== 0) return yearCompare;

      // Then by term (descending - Term 3, Term 2, Term 1)
      const termOrder = { 'Term 3': 3, 'Term 2': 2, 'Term 1': 1 };
      return (termOrder[b.term as keyof typeof termOrder] || 0) - (termOrder[a.term as keyof typeof termOrder] || 0);
    });
}
