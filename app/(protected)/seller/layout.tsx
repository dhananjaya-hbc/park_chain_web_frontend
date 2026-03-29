"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import SellerSidebar from '@/components/layout/Sidebar/SellerSidebar'; 
import SellerNavbar from '@/components/layout/Navbar/SellerNavbar'; 

// 1. IMPORT WEB3AUTH DISCONNECT
import { useWeb3AuthDisconnect } from "@web3auth/modal/react"; 

function SellerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clearRole, isLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  
  // 2. INITIALIZE DISCONNECT HOOK
  const { disconnect } = useWeb3AuthDisconnect();
  
  // Sidebar States
  const[isOpen, setIsOpen] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);

  // 3. UPDATE LOGOUT TO CLEAR WEB3 SESSION
  const handleLogout = async () => {
    setDisconnectLoading(true);
    
    try {
      // Disconnect the active Web3Auth session first
      if (disconnect) {
        await disconnect();
      }
    } catch (error) {
      console.error("Failed to disconnect Web3Auth:", error);
    } finally {
      // Always clear local roles and redirect, even if Web3Auth throws a minor error
      clearRole();
      router.push('/login');
    }
  };

  // Determine which menu item is active based on the URL
  let currentPageStr = "dashboard";
  let pageTitle = "Dashboard";

  if (pathname.includes('/spots')) { currentPageStr = "spots"; pageTitle = "Parking Spots"; }
  else if (pathname.includes('/bookings')) { currentPageStr = "bookings"; pageTitle = "Booking Timeline"; }
  else if (pathname.includes('/verifications')) { currentPageStr = "verifications"; pageTitle = "Verifications"; }
  else if (pathname.includes('/earnings')) { currentPageStr = "earnings"; pageTitle = "Earnings"; }
  else if (pathname.includes('/reviews')) { currentPageStr = "reviews"; pageTitle = "Reviews"; }
  else if (pathname.includes('/addnew')) { currentPageStr = "add-new"; pageTitle = "Add New Spot"; }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4CAF50] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      
      {/* INJECT THE NEW SELLER SIDEBAR */}
      <SellerSidebar 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleLogout={handleLogout}
        disconnectLoading={disconnectLoading}
        currentPage={currentPageStr}
      />

      {/* Main Content Area */}
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