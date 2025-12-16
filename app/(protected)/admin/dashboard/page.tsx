"use client";

import { useRouter } from 'next/navigation';
import { useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useEffect, useState } from 'react';
import { useRole } from '@/hooks/useRole';

export default function AdminDashboard() {
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { clearRole } = useRole();
  const router = useRouter();
  const [adminWallet, setAdminWallet] = useState<string>('');

  useEffect(() => {
    // Get admin wallet from localStorage
    const wallet = localStorage.getItem('admin_wallet');
    if (wallet) {
      setAdminWallet(wallet);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await disconnect();
      clearRole();
      router.push('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1a4d2e] mb-2">
              Welcome Back, Administrator
            </h2>
            <p className="text-gray-600">
              Admin account details and system information
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={disconnectLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {disconnectLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Admin Account Details Card */}
      <div className="bg-gradient-to-r from-[#1a4d2e] to-[#2d5f42] rounded-xl p-8 shadow-lg text-white">
        <h3 className="text-2xl font-bold mb-6">Admin Account Information</h3>
        
        <div className="space-y-6">
          {/* Admin Wallet Address */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Admin Wallet Address</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-mono break-all">
                {adminWallet || 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'}
              </p>
            </div>
          </div>

          {/* Admin Email */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Admin Email</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg">
                admin@parkchain.com
              </p>
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Role</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-semibold">Administrator</p>
            </div>
          </div>

          {/* Network */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Network</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-semibold">XRPL Testnet</p>
            </div>
          </div>

          {/* Authentication Type */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Authentication Type</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg">Credentials-based (Email & Password)</p>
            </div>
          </div>

          {/* Access Level */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Access Level</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-semibold">Full System Access</p>
              <p className="text-sm text-gray-300">All administrative privileges</p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
}
