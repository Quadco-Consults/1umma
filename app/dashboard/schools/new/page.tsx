'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, School as SchoolIcon, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewSchoolPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    region: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Creating school:', formData);
    router.push('/dashboard/schools');
  };

  const nigerianStates = [
    'Abuja FCT', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const regions = ['North Central', 'Northeast', 'Northwest', 'South East', 'South South', 'South West'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/schools">
            <Button variant="ghost" size="icon" className="text-brand hover:bg-brand/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">Add New Partner School</h1>
            <p className="text-muted-foreground mt-1">
              Register a new school to participate in the SILP program
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 max-w-4xl">
            {/* School Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <SchoolIcon className="h-5 w-5" />
                  School Information
                </CardTitle>
                <CardDescription>Basic details about the school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter school name"
                    className="border-brand/30 focus:border-brand"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                      required
                    >
                      <SelectTrigger className="border-brand/30 focus:border-brand">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData({ ...formData, region: value })}
                      required
                    >
                      <SelectTrigger className="border-brand/30 focus:border-brand">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">School Address *</Label>
                  <Textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter complete school address"
                    className="border-brand/30 focus:border-brand"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Primary Contact Information
                </CardTitle>
                <CardDescription>Main point of contact at the school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    id="contactName"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Enter contact person name"
                    className="border-brand/30 focus:border-brand"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+234 XXX XXX XXXX"
                      className="border-brand/30 focus:border-brand"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="contact@school.edu.ng"
                      className="border-brand/30 focus:border-brand"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Link href="/dashboard/schools">
                <Button type="button" variant="outline" className="border-brand/30 text-brand hover:bg-brand/10">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-brand hover:bg-brand/90 text-white gap-2">
                <SchoolIcon className="h-4 w-4" />
                Add Partner School
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
