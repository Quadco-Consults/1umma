'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { schools, formatCurrency } from '@/lib/mock-data';
import type { School } from '@/lib/types';
import { Plus, Search, MapPin, Phone, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SchoolsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');

  // Get unique states
  const uniqueStates = Array.from(new Set(schools.map(s => s.state))).sort();

  // Filter schools
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || school.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
            <p className="text-muted-foreground mt-1">
              Manage all participating schools in the SILP program
            </p>
          </div>
          <Link href="/dashboard/schools/new">
            <Button className="gap-2 bg-brand hover:bg-brand/90 shadow-md">
              <Plus className="h-4 w-4" />
              Add School
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by school name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedState} onValueChange={(value) => setSelectedState(value || 'all')}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* School cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card
              key={school.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/schools/${school.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{school.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {school.state}, {school.region}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{school.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{school.contactPhone}</span>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Active Students
                    </div>
                    <span className="font-semibold">{school.activeStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Outstanding
                    </div>
                    <span className="font-semibold text-warning">
                      {formatCurrency(school.outstandingBalance)}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No schools found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
