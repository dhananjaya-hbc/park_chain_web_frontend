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
          Earnings & Payments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View your wallet balance, earnings, and transaction history.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left Column: Balance + Total Earnings */}
        <div className="lg:col-span-3 space-y-5">
          <BalanceCard />

        </div>
        <div className="lg:col-span-2 space-y-5">

          <TotalEarningsCard />
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-5">
          <TransactionHistoryCard />
        </div>
      </div>
    </>
  );
}