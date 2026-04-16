'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRole } from '@/contexts/RoleContext';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, X, Edit, Camera, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { currentUser } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+234 803 123 4567',
    address: '123 Main Street, Lagos, Nigeria',
    bio: 'Passionate about making a difference in education.',
  });

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'AU';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Profile picture removed');
  };

  const handleSave = () => {
    console.log('Saving profile:', formData, 'Profile image:', profileImage);
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: '+234 803 123 4567',
      address: '123 Main Street, Lagos, Nigeria',
      bio: 'Passionate about making a difference in education.',
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your personal information
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2 bg-brand hover:bg-brand/90 shadow-md"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-brand/20">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={currentUser?.name} />
                  ) : null}
                  <AvatarFallback className="bg-brand text-white text-2xl font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border-2 border-brand/20 hover:bg-brand/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 text-brand" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-brand text-2xl">{currentUser?.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {currentUser?.role} • Member since January 2025
                </CardDescription>
                {profileImage && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-gray-50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {formData.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-gray-50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {formData.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-brand/30 focus:border-brand"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-gray-50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {formData.phone}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-gray-50">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {currentUser?.role}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border-brand/30 focus:border-brand"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm p-2 border rounded-md bg-gray-50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {formData.address}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="border-brand/30 focus:border-brand"
                    rows={3}
                  />
                ) : (
                  <div className="text-sm p-2 border rounded-md bg-gray-50">
                    {formData.bio}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="gap-2 bg-brand hover:bg-brand/90"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="gap-2 border-brand/30 text-brand hover:bg-brand/10"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="text-sm font-medium">January 15, 2025</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium">April 16, 2026 at 9:30 AM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Account Status</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
