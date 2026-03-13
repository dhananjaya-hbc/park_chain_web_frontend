import React from "react";
import { TrendingUp } from "lucide-react";

export default function TotalEarningsCard() {
  const totalEarnings = "4,280 XRP";

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">
          Total Earnings
        </p>
        <p className="text-2xl font-bold text-gray-900">{totalEarnings}</p>
      </div>

      {/* Icon Circle */}
      <div
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 40, height: 40, backgroundColor: "#F0FDF4" }}
      >
        <TrendingUp className="w-5 h-5 text-[#2e7d32]" />
      </div>
    </div>
  );
}
