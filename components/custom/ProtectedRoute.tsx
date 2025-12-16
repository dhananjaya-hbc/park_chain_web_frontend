"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !role) {
      router.push('/login');
    } else if (!isLoading && role && !allowedRoles.includes(role)) {
      router.push('/login');
    }
  }, [role, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#41ab5d] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#41ab5d] mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
