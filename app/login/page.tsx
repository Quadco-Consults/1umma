'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { users } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      toast.error('Invalid email or password');
      setIsLoading(false);
      return;
    }

    // In a real app, you would verify the password here
    // For now, we'll accept any non-empty password
    if (!password) {
      toast.error('Please enter your password');
      setIsLoading(false);
      return;
    }

    // Set the role and redirect
    setRole(user.role);
    toast.success('Login successful!');

    const redirectPath = user.role === 'school' ? '/portal/dashboard' : '/dashboard';
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 via-white to-brand-light/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-light rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-brand hover:text-brand/80 hover:bg-brand/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-brand/20 shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative h-20 w-20 bg-brand/10 rounded-full p-3">
                <Image
                  src="/1Ummah-Web-logo.png"
                  alt="1Ummah Logo"
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                  priority
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold text-brand">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to access the SILP Management Platform
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 border-brand/30 focus:border-brand"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-brand font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand/60" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-12 border-brand/30 focus:border-brand"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/60 hover:text-brand"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-brand hover:text-brand/80 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-semibold text-base shadow-md"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p><strong>Admin:</strong> admin@1ummah.org</p>
                  <p><strong>Staff:</strong> staff@1ummah.org</p>
                  <p><strong>School:</strong> school@eqraah.edu.ng</p>
                  <p className="mt-2 text-blue-700">Password: Any non-empty password</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 1Ummah Islamic Organisation. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
