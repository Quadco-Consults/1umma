'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, School } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { setRole, currentRole } = useRole();

  // Redirect if already logged in
  useEffect(() => {
    if (currentRole) {
      const redirectPath = currentRole === 'school' ? '/portal/dashboard' : '/dashboard';
      router.push(redirectPath);
    }
  }, [currentRole, router]);

  const handleRoleSelect = (role: 'admin' | 'staff' | 'school') => {
    setRole(role);
    const redirectPath = role === 'school' ? '/portal/dashboard' : '/dashboard';
    router.push(redirectPath);
  };

  const roles = [
    {
      value: 'admin' as const,
      label: '1Ummah Admin',
      description: 'Full access to all modules and settings',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'staff' as const,
      label: '1Ummah Staff',
      description: 'View and manage students, schools, and fees',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'school' as const,
      label: 'School Portal',
      description: 'Access school portal and submit payment requests',
      icon: School,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-light via-background to-brand-light p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative h-24 w-24">
              <Image
                src="https://1ummahng.org/wp-content/uploads/2024/08/1Ummah-Web-logo.png"
                alt="1Ummah Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand">
            SILP Management Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Scholarship Initiative for the Less Privileged
          </p>
          <p className="text-sm text-muted-foreground">
            Select your role to enter the platform
          </p>
        </div>

        {/* Role selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.value}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleRoleSelect(role.value)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-4 rounded-full p-4 w-fit ${role.bgColor}`}>
                    <Icon className={`h-8 w-8 ${role.color}`} />
                  </div>
                  <CardTitle className="text-xl">{role.label}</CardTitle>
                  <CardDescription className="min-h-[40px]">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full group-hover:bg-brand group-hover:text-white"
                    variant="outline"
                  >
                    Enter as {role.label}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>1Ummah Islamic Organisation, Abuja</p>
          <p className="mt-1">Prototype v1.0 - April 2026</p>
        </div>
      </div>
    </div>
  );
}
