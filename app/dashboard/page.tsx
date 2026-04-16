'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui-custom/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDashboardStats, getChartData, getRecentActivity, formatDate } from '@/lib/mock-data';
import { School, Clock, Plus, FileText, GraduationCap, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = getDashboardStats();
  const chartData = getChartData();
  const recentActivity = getRecentActivity();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand to-brand/80 text-white rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to 1Ummah SILP</h1>
              <p className="text-white/90 text-lg">
                Empowering students through education sponsorship
              </p>
              <p className="text-white/80 text-sm">
                Track and manage scholarship programs for underprivileged students
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/students/new">
                <Button className="gap-2 bg-white text-brand hover:bg-white/90 shadow-md">
                  <Plus className="h-4 w-4" />
                  Sponsor New Student
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Students Sponsored"
            value={stats.totalStudents}
            icon={GraduationCap}
            iconColor="text-brand"
            bgColor="bg-brand/5"
            description="Students receiving scholarships"
          />
          <StatCard
            title="Partner Schools"
            value={stats.activeSchools}
            icon={School}
            iconColor="text-brand"
            bgColor="bg-brand/5"
            description="Active educational institutions"
          />
          <StatCard
            title="Total Investment"
            value={stats.totalFeesThisTerm}
            icon={Heart}
            iconColor="text-brand"
            bgColor="bg-brand/5"
            description="Scholarship funds this term"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingPayments}
            icon={Clock}
            iconColor="text-warning"
            bgColor="bg-warning/5"
            description="Awaiting payment approval"
          />
        </div>

        {/* Charts and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 border-brand/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-brand">Scholarship Distribution by School</CardTitle>
              <CardDescription>
                Funds disbursed vs pending for Term 2 (2025/2026)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="school" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => `₦${(Number(value) * 1000).toLocaleString()}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="paid" fill="hsl(var(--brand))" name="Disbursed (₦'000)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outstanding" fill="hsl(var(--warning))" name="Pending (₦'000)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="border-brand/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-brand">Recent Sponsorship Activity</CardTitle>
              <CardDescription>Latest updates across the program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3 p-2 rounded-lg hover:bg-brand/5 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'student' ? (
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-brand" />
                        </div>
                      ) : activity.type === 'payment' ? (
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-brand" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center">
                          <School className="h-4 w-4 text-brand" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.name}
                      </p>
                      {activity.school && (
                        <p className="text-xs text-muted-foreground">
                          {activity.school}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand">Sponsorship Actions</CardTitle>
            <CardDescription>Manage student scholarships and disbursements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/students/new">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-4 border-brand/30 hover:bg-brand hover:text-white transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    <GraduationCap className="h-5 w-5 text-brand group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Sponsor Student</div>
                    <div className="text-xs text-muted-foreground group-hover:text-white/80">Register new beneficiary</div>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/fees/generate">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-4 border-brand/30 hover:bg-brand hover:text-white transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Heart className="h-5 w-5 text-brand group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Generate Scholarships</div>
                    <div className="text-xs text-muted-foreground group-hover:text-white/80">Create scholarship records</div>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/payments">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-4 border-brand/30 hover:bg-brand hover:text-white transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    <FileText className="h-5 w-5 text-brand group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Disbursements</div>
                    <div className="text-xs text-muted-foreground group-hover:text-white/80">Review fund disbursements</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
