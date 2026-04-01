"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar/AdminSidebar';
import Navbar from '@/components/layout/Navbar/AdminNavbar';
import { xumm } from '@/lib/web3/xaman';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const { clearRole, isLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const [adminWallet, setAdminWallet] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('admin_wallet') || '' : '';
  });

  const handleLogout = async () => {
    setDisconnectLoading(true);
    try {
      if (xumm) {
        await xumm.logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearRole();
      router.push('/login');
    }
  };

  let currentPageStr = "dashboard";
  let pageTitle = "Dashboard";

  const pageMap: Record<string, { id: string; title: string }> = {
    '/admin/seller-verification': { id: 'verification', title: 'Seller Verification Requests' },
    '/admin/bookings': { id: 'bookings', title: 'All Bookings' },
    '/admin/transactions': { id: 'transactions', title: 'Transactions' },
    '/admin/users': { id: 'users', title: 'Users' },
    '/admin/feedback': { id: 'feedback', title: 'Feedback' },
    '/admin/settings': { id: 'settings', title: 'Settings' },
    '/admin/dashboard': { id: 'dashboard', title: 'Dashboard' },
  };

  for (const [path, config] of Object.entries(pageMap)) {
    if (pathname.includes(path)) {
      currentPageStr = config.id;
      pageTitle = config.title;
      break;
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4CAF50] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen h-screen overflow-y-hidden bg-gray-100">
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          handleLogout={handleLogout} 
          disconnectLoading={disconnectLoading} 
          currentPage={currentPageStr} 
        />
        
        <div className="flex-1 bg-gray-100 h-screen min-h-screen overflow-y-scroll">
          <Navbar 
            setIsOpen={setIsOpen} 
            handleLogout={handleLogout} 
            disconnectLoading={disconnectLoading} 
            adminWallet={adminWallet} 
            title={pageTitle} 
            showSearch={true} 
          />

          <div className="main-content px-6 pt-5 pb-6 bg-gray-100">
            {children}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ProtectedRoute>
  )
}