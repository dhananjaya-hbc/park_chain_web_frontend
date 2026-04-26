"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/lib/stores/sessionStore';
import { UserRole } from '@/types';
import { getRoleDashboard } from '@/lib/utils/roleUtils';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Link from 'next/link';
import { xumm } from '@/lib/web3/xaman';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const hasRegistered = useRef(false);
  const { setRole } = useSessionStore();
  const router = useRouter();

  // Xaman listener — fires when user approves sign-in
  useEffect(() => {
    if (!xumm) return;

    const handleSuccess = async () => {
      try {
        const account = await xumm?.user?.account;
        if (account && !hasRegistered.current) {
          hasRegistered.current = true;
          await registerWithBackend(account);
        }
      } catch (e) {
        console.error("Xaman success error:", e);
        setError('Failed to get wallet address from Xaman.');
        setIsLoading(false);
      }
    };

    xumm.on("success", handleSuccess);
    xumm.on("retrieved", handleSuccess);

    return () => {
      // Cleanup listeners on unmount
      if (xumm) {
        xumm.off("success", handleSuccess);
        xumm.off("retrieved", handleSuccess);
      }
    };
  }, []);

  // Register/login with our backend using the Xaman wallet address
  const registerWithBackend = async (walletAddress: string) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('📝 Registering seller with Xaman wallet:', walletAddress);

      // Call backend — creates user if new, returns existing if found
      const response = await apiService.post(API_ENDPOINTS.XAMAN_LOGIN, {
        wallet_address: walletAddress,
        role: 'seller',
      });

      console.log('✅ Backend authentication successful');

      // Store JWT token
      const token = response.token;
      if (token) {
        apiService.setToken(token);
        console.log('🔐 Token stored');
      }

      // Set role and redirect
      const role: UserRole = 'seller';
      setRole(role);

      // Also set cookie for middleware
      document.cookie = `park_chain_role=${role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      // Redirect logic based on KYC status
      if (response.user && response.user.kyc_status === 'APPROVED') {
        console.log('✅ User already verified. Redirecting to dashboard...');
        router.push(getRoleDashboard(role));
      } else {
        console.log('🚀 User not verified. Redirecting to KYC...');
        router.push('/kyc');
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('❌ Backend registration failed:', errorMessage);
      setError(errorMessage);
      hasRegistered.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleXamanLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!xumm) {
      setError('Xaman SDK is not initialized yet. Please refresh.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      hasRegistered.current = false;

      // Clear old session
      await xumm.logout();

      console.log('🔗 Initiating Xaman login...');
      await xumm.authorize();
    } catch (err) {
      console.error('Xaman login failed:', err);
      setError('Failed to connect with Xaman. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#41ab5d] via-[#52b86d] to-[#41ab5d]">
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#1a4d2e] rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Park Chain</h1>
          <p className="text-[#2d5f42] text-sm">Sign in to your seller account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-[#2d5f42]/20 shadow-xl">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Loading Status */}
            {isLoading && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-green-600 text-sm">Connecting your wallet...</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Xaman Login Button */}
              <button
                type="button"
                onClick={handleXamanLogin}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[#41ab5d] text-white rounded-xl font-semibold hover:bg-[#368a4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Setting up account...
                  </span>
                ) : (
                  'Connect with Xaman Wallet'
                )}
              </button>
            </div>

            {/* Admin Login Link */}
            <div className="text-center pt-2">
              <Link
                href="/admin-login"
                className="text-[#2d5f42] text-sm hover:text-[#1a4d2e] transition-colors font-medium"
              >
                Login as Admin →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[#2d5f42] text-xs">
            Secured with Xaman Wallet • XRPL Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}