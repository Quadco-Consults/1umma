'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, GraduationCap, Heart, Award, CheckCircle2 } from 'lucide-react';
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

  const features = [
    { icon: GraduationCap, text: 'Quality Islamic Education' },
    { icon: Heart, text: 'Holistic Support System' },
    { icon: Award, text: 'Merit-Based Selection' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand via-brand/95 to-brand/90 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/1Ummah-NG22.png"
            alt="1Ummah Students"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/90 via-brand/85 to-brand/90"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-light rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 bg-white rounded-full p-2">
              <Image
                src="/1Ummah-Web-logo.png"
                alt="1Ummah Logo"
                fill
                className="object-contain p-1"
                sizes="64px"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">1-Ummah</h1>
              <p className="text-sm text-white/90">Islamic Organisation</p>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Empowering the Ummah Through Education
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                SILP Management Platform - Transforming lives through quality Islamic education
                and comprehensive scholarship support.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3 text-white/95">
                    <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="text-sm text-white/80">Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold">50+</div>
                <div className="text-sm text-white/80">Schools</div>
              </div>
              <div>
                <div className="text-4xl font-bold">₦50M+</div>
                <div className="text-sm text-white/80">Awarded</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/70">
            © 2026 1Ummah Islamic Organisation. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <div>
            <Link href="/">
              <Button variant="ghost" className="text-brand hover:text-brand/80 hover:bg-brand/10 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 bg-brand/10 rounded-full p-2">
                <Image
                  src="/1Ummah-Web-logo.png"
                  alt="1Ummah Logo"
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  priority
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand">1-Ummah</h2>
                <p className="text-sm text-brand/80">Islamic Organisation</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-brand">Welcome Back</h1>
            <p className="text-gray-600">
              Sign in to access the SILP Management Platform
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand font-medium text-sm">
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
                  className="pl-10 h-12 border-brand/30 focus:border-brand text-base"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand font-medium text-sm">
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
                  className="pl-10 pr-10 h-12 border-brand/30 focus:border-brand text-base"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/60 hover:text-brand transition-colors"
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
                className="text-sm text-brand hover:text-brand/80 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-13 bg-brand hover:bg-brand/90 text-white font-semibold text-base shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Demo Credentials */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Demo Credentials
              </p>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="flex justify-between items-center py-1 border-b border-blue-200">
                  <span className="font-medium">Admin:</span>
                  <span>admin@1ummah.org</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-200">
                  <span className="font-medium">Staff:</span>
                  <span>staff@1ummah.org</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-200">
                  <span className="font-medium">School:</span>
                  <span>school@eqraah.edu.ng</span>
                </div>
                <p className="mt-3 text-blue-700 text-center font-medium">
                  Password: Any non-empty password
                </p>
              </div>
            </div>
          </form>

          {/* Mobile Footer */}
          <div className="lg:hidden text-center text-sm text-gray-600 pt-4">
            © 2026 1Ummah Islamic Organisation
          </div>
        </div>
      </div>
    </div>
  );
}
