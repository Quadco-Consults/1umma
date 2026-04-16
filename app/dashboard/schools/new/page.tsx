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
import { ArrowLeft, School as SchoolIcon, MapPin, Phone, User, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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

  const [feeStructure, setFeeStructure] = useState([
    { classLevel: 'Nursery 1', termlyFee: 0 },
    { classLevel: 'Nursery 2', termlyFee: 0 },
    { classLevel: 'Primary 1', termlyFee: 0 },
    { classLevel: 'Primary 2', termlyFee: 0 },
    { classLevel: 'Primary 3', termlyFee: 0 },
    { classLevel: 'Primary 4', termlyFee: 0 },
    { classLevel: 'Primary 5', termlyFee: 0 },
    { classLevel: 'Primary 6', termlyFee: 0 },
    { classLevel: 'JSS1', termlyFee: 0 },
    { classLevel: 'JSS2', termlyFee: 0 },
    { classLevel: 'JSS3', termlyFee: 0 },
    { classLevel: 'SS1', termlyFee: 0 },
    { classLevel: 'SS2', termlyFee: 0 },
    { classLevel: 'SS3', termlyFee: 0 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one fee is set
    const hasAtLeastOneFee = feeStructure.some(f => f.termlyFee > 0);
    if (!hasAtLeastOneFee) {
      toast.error('Please set at least one class fee');
      return;
    }

    // In a real app, this would call an API
    const schoolData = {
      ...formData,
      feeStructure: feeStructure.filter(f => f.termlyFee > 0), // Only save classes with fees
    };
    console.log('Creating school:', schoolData);
    toast.success('School added successfully!');
    router.push('/dashboard/schools');
  };

  const updateFee = (classLevel: string, amount: number) => {
    setFeeStructure(
      feeStructure.map((fee) =>
        fee.classLevel === classLevel ? { ...fee, termlyFee: amount } : fee
      )
    );
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
                      onValueChange={(value) => setFormData({ ...formData, state: value || '' })}
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
                      onValueChange={(value) => setFormData({ ...formData, region: value || '' })}
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

            {/* Fee Structure */}
            <Card className="border-brand/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-brand flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Termly Fee Structure
                </CardTitle>
                <CardDescription>
                  Set fees for each class level (Only set fees for classes you offer)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Nursery */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Nursery</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {feeStructure.slice(0, 2).map((fee) => (
                        <div key={fee.classLevel} className="space-y-2">
                          <Label htmlFor={fee.classLevel}>{fee.classLevel}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                            <Input
                              id={fee.classLevel}
                              type="number"
                              min="0"
                              value={fee.termlyFee || ''}
                              onChange={(e) => updateFee(fee.classLevel, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="pl-8 border-brand/30 focus:border-brand"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Primary</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {feeStructure.slice(2, 8).map((fee) => (
                        <div key={fee.classLevel} className="space-y-2">
                          <Label htmlFor={fee.classLevel}>{fee.classLevel}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                            <Input
                              id={fee.classLevel}
                              type="number"
                              min="0"
                              value={fee.termlyFee || ''}
                              onChange={(e) => updateFee(fee.classLevel, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="pl-8 border-brand/30 focus:border-brand"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Junior Secondary */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Junior Secondary (JSS)</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {feeStructure.slice(8, 11).map((fee) => (
                        <div key={fee.classLevel} className="space-y-2">
                          <Label htmlFor={fee.classLevel}>{fee.classLevel}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                            <Input
                              id={fee.classLevel}
                              type="number"
                              min="0"
                              value={fee.termlyFee || ''}
                              onChange={(e) => updateFee(fee.classLevel, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="pl-8 border-brand/30 focus:border-brand"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Senior Secondary */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Senior Secondary (SS)</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {feeStructure.slice(11, 14).map((fee) => (
                        <div key={fee.classLevel} className="space-y-2">
                          <Label htmlFor={fee.classLevel}>{fee.classLevel}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                            <Input
                              id={fee.classLevel}
                              type="number"
                              min="0"
                              value={fee.termlyFee || ''}
                              onChange={(e) => updateFee(fee.classLevel, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="pl-8 border-brand/30 focus:border-brand"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Tip:</strong> Only enter fees for the class levels your school offers.
                      Leave others at ₦0. You can always update this later.
                    </p>
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
