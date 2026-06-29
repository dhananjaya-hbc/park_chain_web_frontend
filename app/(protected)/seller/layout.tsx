"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import SellerSidebar from '@/components/layout/Sidebar/SellerSidebar';
import SellerNavbar from '@/components/layout/Navbar/SellerNavbar';
import apiService from '@/lib/api/apiService';
import { xumm } from '@/lib/web3/xaman';

function SellerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clearRole, isLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);

  const handleLogout = async () => {
    setDisconnectLoading(true);
    try {
      // Logout from Xaman SDK
      if (xumm) {
        await xumm.logout();
      }
      // Clear JWT token
      apiService.clearToken();
      // Clear role cookie
      document.cookie = 'park_chain_role=; path=/; max-age=0';
      // Clear session store
      clearRole();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Always redirect even if Xaman logout fails
      clearRole();
      router.push('/login');
    } finally {
      setDisconnectLoading(false);
    }
  };

  let currentPageStr = "dashboard";
  let pageTitle = "Dashboard";

  if (pathname.includes('/spots')) { currentPageStr = "spots"; pageTitle = "Parking Spots"; }
  else if (pathname.includes('/bookings')) { currentPageStr = "bookings"; pageTitle = "Booking Timeline"; }
  else if (pathname.includes('/approvals')) { currentPageStr = "approvals"; pageTitle = "Submissions"; }
  else if (pathname.includes('/earnings')) { currentPageStr = "earnings"; pageTitle = "Earnings"; }
  else if (pathname.includes('/reviews')) { currentPageStr = "reviews"; pageTitle = "Reviews"; }
  else if (pathname.includes('/addnew')) { currentPageStr = "add-new"; pageTitle = "Add New Spot"; }
  else if (pathname.includes('/settings')) { currentPageStr = "settings"; pageTitle = "Settings"; }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4CAF50] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <SellerSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleLogout={handleLogout}
        disconnectLoading={disconnectLoading}
        currentPage={currentPageStr}
      />

      <div className="flex-1 bg-[#f8f9fa] h-screen min-h-screen overflow-y-scroll">
        <SellerNavbar
          setIsOpen={setIsOpen}
          handleLogout={handleLogout}
          disconnectLoading={disconnectLoading}
          title={pageTitle}
        />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <SellerLayoutContent>{children}</SellerLayoutContent>
    </ProtectedRoute>
  );
}