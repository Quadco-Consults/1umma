'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, AuthUser } from '@/lib/types';
import usersData from '@/mock-data/users.json';

interface RoleContextType {
  currentRole: UserRole | null;
  currentUser: AuthUser | null;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isSchool: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole | null;
    if (savedRole) {
      const user = usersData.find((u) => u.role === savedRole) as AuthUser;
      setCurrentRole(savedRole);
      setCurrentUser(user || null);
    }
  }, []);

  const setRole = (role: UserRole) => {
    const user = usersData.find((u) => u.role === role) as AuthUser;
    setCurrentRole(role);
    setCurrentUser(user || null);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setCurrentRole(null);
    setCurrentUser(null);
    localStorage.removeItem('userRole');
  };

  const value: RoleContextType = {
    currentRole,
    currentUser,
    setRole,
    logout,
    isAdmin: currentRole === 'admin',
    isStaff: currentRole === 'staff',
    isSchool: currentRole === 'school',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
