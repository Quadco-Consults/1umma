import studentsData from '@/mock-data/students.json';
import schoolsData from '@/mock-data/schools.json';
import feesData from '@/mock-data/fees.json';
import paymentsData from '@/mock-data/payments.json';
import usersData from '@/mock-data/users.json';
import type { Student, School, FeeRecord, PaymentRequest, AuthUser } from './types';

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
