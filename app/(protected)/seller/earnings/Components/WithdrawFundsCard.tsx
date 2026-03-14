"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBills } from "@fortawesome/free-solid-svg-icons";

export default function WithdrawFundsCard() {
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("0.00");

  const availableBalance = "850.00";

  const handleMaxClick = () => {
    setWithdrawAmount(availableBalance);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <FontAwesomeIcon icon={faMoneyBills} className="w-8 h-8 text-[#2e7d32]" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Withdraw
            <br />
            Funds
          </h2>
        </div>
      </div>

      {/* Destination Address */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#6B7280] mb-1.5">
          Destination Address
        </label>
        <input
          type="text"
          placeholder="abcd2×4xz5dc6zc....x6z8"
          value={withdrawAddress}
          onChange={(e) => setWithdrawAddress(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
        />
      </div>

      {/* Amount */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#6B7280] mb-1.5">
          Amount (XRP)
        </label>
        <div className="relative">
          <input
            type="text"
            value={withdrawAmount}
            placeholder="0.00"
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xl font-semibold text-[#6B7280] pr-20 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
          />
          <button
            onClick={handleMaxClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-md hover:bg-[#c8e6c9] transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <button className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
        Confirm Withdrawal
      </button>
    </div>
  );
}
