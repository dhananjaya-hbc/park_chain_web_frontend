import React from "react";
import BalanceCard from "./BalanceCard";
import TotalEarningsCard from "./TotalEarningsCard";
import TransactionHistoryCard from "./TransactionHistoryCard";

export default function Main() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Earnings & Withdrawals
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your funds and view transaction history.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Balance + Withdraw + Total */}
        <div className="lg:col-span-2 space-y-5">
          <BalanceCard />
          <TotalEarningsCard />
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-3">
          <TransactionHistoryCard />
        </div>
      </div>
    </>
  );
}
