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
import { useFcmToken } from '@/hooks/useFcmToken';

export default function SignupPage() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const hasRegistered = useRef(false);
  const { setRole } = useSessionStore();
  const router = useRouter();
  const { initializeFcm } = useFcmToken();

  // Xaman listener
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
      if (xumm) {
        xumm.off("success", handleSuccess);
        xumm.off("retrieved", handleSuccess);
      }
    };
  }, []);

  const registerWithBackend = async (walletAddress: string) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('📝 Registering new seller with Xaman:', walletAddress);

      const response = await apiService.post(API_ENDPOINTS.XAMAN_LOGIN, {
        wallet_address: walletAddress,
        role: 'seller',
      });

      console.log('✅ Registration successful');

      const token = response.token;
      if (token) {
        apiService.setToken(token);
      }

      const role: UserRole = 'seller';
      setRole(role);
      document.cookie = `park_chain_role=${role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      // Initialize FCM notifications
      console.log('🔔 Initializing push notifications...');
      await initializeFcm();

      const dashboardUrl = getRoleDashboard(role);
      router.push(dashboardUrl);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('❌ Registration failed:', errorMessage);
      setError(errorMessage);
      hasRegistered.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (!xumm) {
      setError('Xaman SDK is not initialized yet. Please refresh.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      hasRegistered.current = false;

      await xumm.logout();

      console.log('🔗 Initiating Xaman signup...');
      await xumm.authorize();
    } catch (err) {
      console.error('Xaman signup failed:', err);
      setError('Failed to connect with Xaman. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#41ab5d] via-[#52b86d] to-[#41ab5d] py-12">
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
          <h1 className="text-4xl font-bold text-white mb-2">Join Park Chain</h1>
          <p className="text-[#2d5f42] text-sm">Create your seller account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-[#2d5f42]/20 shadow-xl">
          <div className="space-y-6">
            {/* Info */}
            <div className="p-4 rounded-lg bg-[#2c5f9e]/10 border border-[#2c5f9e]/30">
              <p className="text-[#1a4d7e] text-sm">
                <span className="font-semibold">Note:</span> You&apos;ll need the Xaman wallet app installed.
                Your XRPL wallet address will be your identity on Park Chain.
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#2d5f42]/30 bg-white text-[#41ab5d] focus:ring-2 focus:ring-[#41ab5d]"
              />
              <label htmlFor="terms" className="text-[#2d5f42] text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-[#1a4d2e] font-medium hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#1a4d2e] font-medium hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              disabled={isLoading || !acceptTerms}
              className="w-full py-4 px-6 bg-[#41ab5d] text-white rounded-xl font-semibold hover:bg-[#368a4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Sign Up with Xaman Wallet'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-[#2d5f42]/20">
              <p className="text-[#2d5f42] text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-[#1a4d2e] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#2d5f42] text-xs">
            Secured with Xaman Wallet • XRPL Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}