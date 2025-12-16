"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3AuthUser, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useWeb3Auth as useWeb3AuthSDK } from "@web3auth/modal/react";
import { useRole } from '@/hooks/useRole';

export default function SellerDashboard() {
  const { userInfo } = useWeb3AuthUser();
  const { provider } = useWeb3AuthSDK();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { clearRole } = useRole();
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const getWalletAddress = async () => {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "eth_accounts" }) as string[];
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to get wallet address:', error);
        }
      }
    };

    getWalletAddress();
  }, [provider]);

  const handleLogout = async () => {
    try {
      await disconnect();
      clearRole();
      router.push('/login');
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
              Welcome Back, Seller
            </h2>
            <p className="text-gray-600">
              Your wallet details and authentication information
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

      {/* Wallet Details Card */}
      <div className="bg-gradient-to-r from-[#41ab5d] to-[#52b86d] rounded-xl p-8 shadow-lg text-white">
        <h3 className="text-2xl font-bold mb-6">Wallet Information</h3>
        
        <div className="space-y-6">
          {/* Wallet Address */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Wallet Address</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-mono break-all">
                {walletAddress || 'Loading...'}
              </p>
            </div>
          </div>

          {/* Email */}
          {userInfo?.email && (
            <div>
              <p className="text-sm text-gray-200 mb-2">Email</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-lg">
                  {userInfo.email}
                </p>
              </div>
            </div>
          )}

          {/* Name */}
          {userInfo?.name && (
            <div>
              <p className="text-sm text-gray-200 mb-2">Name</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-lg">
                  {userInfo.name}
                </p>
              </div>
            </div>
          )}

          {/* Network */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Network</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-semibold">XRPL Testnet</p>
            </div>
          </div>

          {/* Auth Provider */}
          <div>
            <p className="text-sm text-gray-200 mb-2">Authentication Provider</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg capitalize">
                Web3Auth (Social Login)
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
