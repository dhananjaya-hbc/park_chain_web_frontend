"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/lib/web3/Web3AuthProvider';
import { UserRole } from '@/types';
import { saveRoleToStorage, getRoleDashboard } from '@/lib/utils/roleUtils';
import Link from 'next/link';

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@parkchain.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_WALLET = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"; // Admin's XRPL wallet

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedRole } = useWeb3Auth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      // Validate admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const role: UserRole = 'admin';
        
        // Save role to storage
        saveRoleToStorage(role);
        localStorage.setItem('admin_wallet', ADMIN_WALLET);
        
        // Update context
        setSelectedRole(role);
        
        // Redirect to admin dashboard
        const dashboardUrl = getRoleDashboard(role);
        router.push(dashboardUrl);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-[#2d5f42] text-sm">Park Chain Administration</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-[#2d5f42]/20 shadow-xl">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a4d2e] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parkchain.com"
                className="w-full px-4 py-3 bg-white border border-[#2d5f42]/30 rounded-lg text-[#1a4d2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d] focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a4d2e] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-[#2d5f42]/30 rounded-lg text-[#1a4d2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d] focus:border-transparent"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-[#41ab5d] text-white rounded-xl font-semibold hover:bg-[#368a4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login as Admin'
              )}
            </button>

            {/* Back to Seller Login */}
            <div className="text-center pt-4 border-t border-[#2d5f42]/20">
              <p className="text-[#2d5f42] text-sm">
                Are you a seller?{' '}
                <Link 
                  href="/login" 
                  className="text-[#1a4d2e] font-medium hover:underline">
                
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-[#2d5f42] text-xs">
            Admin access only • Authorized personnel
          </p>
        </div>
      </div>
    </div>
  );
}
