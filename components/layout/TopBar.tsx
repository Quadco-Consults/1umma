'use client';

import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { currentUser, setRole } = useRole();
  const router = useRouter();

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'AU';

  const handleSignOut = () => {
    setRole(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand/20 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-brand hover:bg-brand/10"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo/Title */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-brand">
            1Ummah SILP
          </h2>
          <p className="text-xs text-muted-foreground">Scholarship Platform</p>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-brand hover:bg-brand/10">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer border-0 bg-transparent p-0 hover:opacity-80">
              <Avatar className="h-9 w-9 border-2 border-brand/20 hover:border-brand transition-colors">
                <AvatarFallback className="bg-brand text-white font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-2 py-2 font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-brand">
                    {currentUser?.name || '1Ummah Admin'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email || 'admin@1ummahng.org'}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-brand" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-brand" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
