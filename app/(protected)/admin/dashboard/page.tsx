"use client";

import { useRouter } from 'next/navigation';
import { useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
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
      localStorage.removeItem('park_chain_role');
      document.cookie = 'park_chain_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
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
            <h2 className="text-2xl font-bold text-[#41ab5d] mb-2">
              Welcome back, Admin! 👋
            </h2>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your platform today
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              +23
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-[#41ab5d]">1,542</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
              12 Pending
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Active Sellers</h3>
          <p className="text-2xl font-bold text-[#41ab5d]">234</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              +18%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Platform Revenue</h3>
          <p className="text-2xl font-bold text-[#41ab5d]">3,452 XRP</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Bookings</h3>
          <p className="text-2xl font-bold text-[#41ab5d]">8,942</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#41ab5d]">Pending Verifications</h3>
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              12 Pending
            </span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-[#F2F2F2] rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#41ab5d] rounded-full flex items-center justify-center text-white font-bold">
                      S{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#41ab5d]">Seller #{1000 + i}</p>
                      <p className="text-xs text-gray-500">Submitted 2 days ago</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Pending
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-[#41ab5d] text-white text-xs font-medium rounded-lg hover:bg-[#52b86d] transition-all">
                    Review KYC
                  </button>
                  <button className="px-4 py-2 border border-[#D8D8D8] text-[#41ab5d] text-xs font-medium rounded-lg hover:bg-[#F2F2F2] transition-all">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-[#41ab5d] font-medium hover:bg-[#F2F2F2] rounded-lg transition-all">
            View All Verifications
          </button>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
          <h3 className="text-lg font-bold text-[#41ab5d] mb-4">Recent Feedback</h3>
          <div className="space-y-3">
            {[
              { type: 'positive', rating: 5, message: 'Great platform! Easy to use.' },
              { type: 'neutral', rating: 3, message: 'Good but needs improvements in search.' },
              { type: 'negative', rating: 2, message: 'Payment process is confusing.' },
            ].map((feedback, i) => (
              <div
                key={i}
                className="p-4 bg-[#F2F2F2] rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#41ab5d] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      U{i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#41ab5d]">User #{3000 + i}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, idx) => (
                          <span
                            key={idx}
                            className={idx < feedback.rating ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{feedback.message}</p>
                <button className="mt-3 text-xs text-[#41ab5d] font-medium hover:underline">
                  Respond
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D8D8D8]">
        <h3 className="text-lg font-bold text-[#111827] mb-4">Revenue Analytics</h3>
        <div className="h-64 flex items-center justify-center bg-[#F2F2F2] rounded-lg">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📊</span>
            <p className="text-gray-500">Analytics chart will be displayed here</p>
            <p className="text-xs text-gray-400 mt-1">Integration with chart library needed</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-[#41ab5d] to-[#52b86d] rounded-xl p-6 shadow-lg text-white">
        <h3 className="text-lg font-bold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-300">API Status</p>
              <p className="font-semibold">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-300">XRPL Network</p>
              <p className="font-semibold">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-300">Web3Auth</p>
              <p className="font-semibold">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
