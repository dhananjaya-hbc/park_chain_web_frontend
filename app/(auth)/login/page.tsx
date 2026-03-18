"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/lib/web3/Web3AuthProvider';
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useWeb3Auth as useWeb3AuthSDK } from "@web3auth/modal/react";
import { UserRole } from '@/types';
import { getRoleDashboard } from '@/lib/utils/roleUtils';
import { useSessionStore } from '@/lib/stores/sessionStore';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);
  const hasRegistered = useRef(false);
  const { setSelectedRole } = useWeb3Auth();
  const { setRole } = useSessionStore();
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { provider } = useWeb3AuthSDK();
  const router = useRouter();

  // After Web3Auth connects, register with backend
  useEffect(() => {
    console.log('🔍 Debug:', {
      isConnected,
      hasProvider: !!provider,
      isRegistering,
      hasRegistered: hasRegistered.current
    });

    if (isConnected && provider && !isRegistering && !hasRegistered.current) {
      hasRegistered.current = true;
      registerWithBackend();
    }
  }, [isConnected, provider]);

  useEffect(() => {
    if (connectError) {
      const timer = setTimeout(() => {
        setError('Failed to connect. Please try again.');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [connectError]);

  // ★ Register/login with backend ★
  const registerWithBackend = async () => {
    setIsRegistering(true);
    setError('');

    try {
      let email = '';
      const name = 'Seller';
      let verifierId = '';

      if (provider) {
        // Try to get private key as unique identifier
        try {
          const privateKey = await provider.request({ method: "eth_private_key" }) as string;
          if (privateKey) {
            verifierId = `web3auth|${privateKey.substring(0, 16)}`;
            email = `${privateKey.substring(0, 8)}@web3auth.seller`;
          }
        } catch (err) {
          console.log('ℹ️ eth_private_key not available, trying eth_accounts...');
        }

        // Fallback: try eth_accounts
        if (!verifierId) {
          try {
            const accounts = await provider.request({ method: "eth_accounts" }) as string[];
            if (accounts && accounts.length > 0) {
              verifierId = `web3auth|${accounts[0].substring(0, 16)}`;
              email = `${accounts[0].substring(0, 10)}@web3auth.seller`;
            }
          } catch (err) {
            console.log('ℹ️ eth_accounts not available');
          }
        }
      }

      // Final fallback
      if (!verifierId) {
        const timestamp = Date.now().toString();
        verifierId = `web3auth|${timestamp}`;
        email = `seller_${timestamp}@web3auth.seller`;
      }

      console.log('📝 Registering seller:', { email, verifierId });

      // Step 1: Register with backend
      const response = await apiService.post(API_ENDPOINTS.WEB3AUTH_LOGIN, {
        email,
        name,
        wallet_address: '',
        web3auth_sub: verifierId,
        profile_image: '',
        role: 'seller',
      });

      console.log('✅ Backend registration successful');

      // Step 2: Store token
      const token = response.token;
      if (token) {
        apiService.setToken(token);
        console.log('🔐 Token stored for API calls');
      }

      // Step 3: Set role and redirect
      const role: UserRole = 'seller';
      setRole(role);
      setSelectedRole(role);

      const dashboardUrl = getRoleDashboard(role);
      console.log('🚀 Redirecting to:', dashboardUrl);
      router.push(dashboardUrl);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('❌ Backend registration failed:', errorMessage);
      setError(errorMessage);
      hasRegistered.current = false;
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogin = async () => {
    try {
      setError('');
      hasRegistered.current = false;
      const role: UserRole = 'seller';
      setSelectedRole(role);
      await connect();
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to connect. Please try again.');
    }
  };

  const isLoading = connectLoading || isRegistering;

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

            {/* Status Message */}
            {isRegistering && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-green-600 text-sm">Setting up your account...</p>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-[#41ab5d] text-white rounded-xl font-semibold hover:bg-[#368a4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {isRegistering ? 'Setting up account...' : 'Opening secure login...'}
                </span>
              ) : (
                'Connect with Web3Auth'
              )}
            </button>

            {/* Admin Login Link */}
            <div className="text-center pt-2">
              <Link
                href="/admin-login"
                className="text-[#2d5f42] text-sm hover:text-[#1a4d2e] transition-colors font-medium"
              >
                Login as Admin →
              </Link>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-[#2d5f42]/20">
              <p className="text-[#2d5f42] text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-[#1a4d2e] font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-[#2d5f42] text-xs">
            Secured with Web3Auth • XRPL Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}