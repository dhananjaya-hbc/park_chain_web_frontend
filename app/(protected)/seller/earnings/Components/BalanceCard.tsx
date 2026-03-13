"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function BalanceCard() {
  const [addressCopied, setAddressCopied] = useState(false);

  // Mock wallet data
  const walletConnected = true;
  const availableBalance = "850.00";
  const usdEquivalent = "$527.00 USD";
  const walletAddress = "rHb9sdfwr3r3rR8Bfxvvbg...x4z";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#2e7d32] to-[#43a047] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

      {/* Wallet Connected Badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
          <span className="w-2 h-2 bg-[#76ff03] rounded-full animate-pulse" />
          WALLET CONNECTED
        </span>
      </div>

      {/* Balance */}
      <div className="mb-1">
        <p className="text-xs text-white/70 font-medium tracking-wide uppercase mb-2">
          Available Balance
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">
            {availableBalance}
          </span>
          <span className="text-lg font-semibold text-white/80">XRP</span>
        </div>
        <p className="text-sm text-white/60 mt-1">≈ {usdEquivalent}</p>
      </div>

      {/* Wallet Address */}
      <div className="mt-5 pt-4 border-t border-white/15">
        <p className="text-xs text-white/50 mb-1.5">Address</p>
        <div className="flex items-center gap-2">
          <code className="text-sm text-white/80 font-mono truncate">
            {walletAddress}
          </code>
          <button
            onClick={handleCopyAddress}
            className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            title="Copy address"
          >
            {addressCopied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
