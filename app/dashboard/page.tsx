'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui-custom/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDashboardStats, getChartData, getRecentActivity, formatDate } from '@/lib/mock-data';
import { Users, School, DollarSign, Clock, Plus, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = getDashboardStats();
  const chartData = getChartData();
  const recentActivity = getRecentActivity();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to the 1Ummah SILP Management Platform
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/students/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Active Schools"
            value={stats.activeSchools}
            icon={School}
            iconColor="text-green-600"
          />
          <StatCard
            title="Fees This Term"
            value={stats.totalFeesThisTerm}
            icon={DollarSign}
            iconColor="text-brand"
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={Clock}
            iconColor="text-warning"
          />
        </div>

        {/* Charts and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fees Overview by School</CardTitle>
              <CardDescription>
                Paid vs Outstanding fees for Term 2 (2025/2026)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="school" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `₦${(Number(value) * 1000).toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="paid" fill="hsl(var(--brand))" name="Paid (₦'000)" />
                  <Bar dataKey="outstanding" fill="hsl(var(--warning))" name="Outstanding (₦'000)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'student' ? (
                        <Users className="h-4 w-4 text-blue-600" />
                      ) : activity.type === 'payment' ? (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      ) : (
                        <School className="h-4 w-4 text-purple-600" />
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/students/new">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Add New Student</div>
                    <div className="text-xs text-muted-foreground">Register a beneficiary</div>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/fees/generate">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <DollarSign className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Generate Fees</div>
                    <div className="text-xs text-muted-foreground">Create fee records</div>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/payments">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">View Payments</div>
                    <div className="text-xs text-muted-foreground">Review payment requests</div>
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
