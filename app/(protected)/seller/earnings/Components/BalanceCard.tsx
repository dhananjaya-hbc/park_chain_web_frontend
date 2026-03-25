"use client";

import React, { useEffect, useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export default function BalanceCard() {
  const [addressCopied, setAddressCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.get(API_ENDPOINTS.BALANCE);
      setWalletAddress(response.walletAddress || "");
      setBalance(parseFloat(response.balanceXrp || "0").toFixed(2));
      setHasWallet(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed";
      if (errorMessage.includes("NO_WALLET") || errorMessage.includes("No wallet") || errorMessage.includes("No funded wallet")) {
        setHasWallet(false);
      } else {
        setError("Could not load wallet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateWallet = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await apiService.post(API_ENDPOINTS.GENERATE_WALLET);
      const wallet = response.wallet;
      setWalletAddress(wallet.address);
      setBalance(parseFloat(wallet.balance || "100").toFixed(2));
      setHasWallet(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  
  // Loading State
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-[#2e7d32] to-[#43a047] rounded-2xl p-6 text-white shadow-lg h-48 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  // No Wallet State
  if (!hasWallet) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No XRPL Wallet</h3>
        <p className="text-sm text-gray-500 mb-4">Generate a testnet wallet to receive payments</p>
        <button
          onClick={generateWallet}
          disabled={isGenerating}
          className="w-full py-3 bg-[#2e7d32] text-white rounded-xl font-semibold hover:bg-[#1b5e20] transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate Wallet"}
        </button>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    );
  }

  // Wallet Card
  return (
    <div className="bg-gradient-to-br from-[#2e7d32] to-[#43a047] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
          <span className="w-2 h-2 bg-[#76ff03] rounded-full animate-pulse" />
          WALLET CONNECTED
        </span>
        <button onClick={fetchBalance} className="text-white/60 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 flex-grow flex flex-col justify-center">
        {/* Balance */}
        <div className="mb-1">
          <p className="text-xs text-white/70 font-medium tracking-wide mb-2">Available Balance</p>
          <div className="flex items-start gap-2">
            <span className="text-4xl font-bold tracking-tight">{balance}</span>
            <span className="text-lg font-semibold text-white/80">XRP</span>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="mt-5 pt-4 border-t border-white/15 relative z-10 mt-auto">
        <p className="text-xs text-white/50 mb-1.5">Address</p>
        <div className="flex items-center gap-2">
          <code className="text-sm text-white/80 font-mono truncate">
            {(walletAddress)}
          </code>
          <button
            onClick={handleCopyAddress}
            className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            title="Copy address"
          >
            {addressCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-xs mt-2 relative z-10">{error}</p>}
    </div>
  );
 
}