'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';
import {
  LayoutDashboard,
  Users,
  School,
  DollarSign,
  CreditCard,
  FileText,
  Settings,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: ('admin' | 'staff' | 'school')[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'staff'],
  },
  {
    href: '/dashboard/students',
    label: 'Students',
    icon: Users,
    roles: ['admin', 'staff'],
  },
  {
    href: '/dashboard/schools',
    label: 'Schools',
    icon: School,
    roles: ['admin', 'staff'],
  },
  {
    href: '/dashboard/fees',
    label: 'Fees',
    icon: DollarSign,
    roles: ['admin', 'staff'],
  },
  {
    href: '/dashboard/payments',
    label: 'Payments',
    icon: CreditCard,
    roles: ['admin', 'staff'],
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: FileText,
    roles: ['admin'],
  },
  // School portal items
  {
    href: '/portal/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['school'],
  },
  {
    href: '/portal/students',
    label: 'My Students',
    icon: Users,
    roles: ['school'],
  },
  {
    href: '/portal/payments',
    label: 'Payments',
    icon: CreditCard,
    roles: ['school'],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole } = useRole();

  const filteredNavItems = navItems.filter((item) =>
    currentRole ? item.roles.includes(currentRole) : false
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 h-16 px-6 border-b">
            <div className="relative h-8 w-8">
              <Image
                src="https://1ummahng.org/wp-content/uploads/2024/08/1Ummah-Web-logo.png"
                alt="1Ummah Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-brand">1Ummah SILP</h1>
              <p className="text-xs text-muted-foreground">
                Management Platform
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3',
                          isActive && 'bg-brand-light text-brand'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Quick actions */}
            {currentRole !== 'school' && (
              <div className="mt-6 px-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2 px-3">
                  QUICK ACTIONS
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link href="/dashboard/students/new">
                      <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
                        <Plus className="h-4 w-4" />
                        Add Student
                      </Button>
                    </Link>
                  </li>
                  {currentRole === 'admin' && (
                    <li>
                      <Link href="/dashboard/fees/generate">
                        <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
                          <Plus className="h-4 w-4" />
                          Generate Fees
                        </Button>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {currentRole === 'school' && (
              <div className="mt-6 px-3">
                <Link href="/portal/payments/new">
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Submit Payment Request
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
