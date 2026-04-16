'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Lock,
  Mail,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    paymentUpdates: true,
    studentUpdates: true,
    systemUpdates: false,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    toast.success('Notification preference updated');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    console.log('Changing password');
    toast.success('Password changed successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Notifications Settings */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Channels */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-brand">Notification Channels</h4>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                />
              </div>
            </div>

            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-brand">Notification Types</h4>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <Label htmlFor="payment-updates">Payment Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about payment requests and approvals
                  </p>
                </div>
                <Switch
                  id="payment-updates"
                  checked={notifications.paymentUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('paymentUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <Label htmlFor="student-updates">Student Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about student enrollments and changes
                  </p>
                </div>
                <Switch
                  id="student-updates"
                  checked={notifications.studentUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('studentUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label htmlFor="system-updates">System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about system maintenance and updates
                  </p>
                </div>
                <Switch
                  id="system-updates"
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="border-brand/30 focus:border-brand pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="border-brand/30 focus:border-brand pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="border-brand/30 focus:border-brand pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-xs text-blue-800 mt-2 space-y-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </div>

              <Button type="submit" className="gap-2 bg-brand hover:bg-brand/90">
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Preferences
            </CardTitle>
            <CardDescription>
              Manage your email communication preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter">Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Receive monthly newsletters with program updates
                </p>
              </div>
              <Switch id="newsletter" defaultChecked />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="space-y-0.5">
                <Label htmlFor="announcements">Announcements</Label>
                <p className="text-sm text-muted-foreground">
                  Important announcements and policy changes
                </p>
              </div>
              <Switch id="announcements" defaultChecked />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label htmlFor="marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Promotional emails and special offers
                </p>
              </div>
              <Switch id="marketing" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
