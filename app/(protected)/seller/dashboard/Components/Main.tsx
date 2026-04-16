"use client";

import React from "react";
import StatsCards from "./StatsCards";
import EarningsChart from "./EarningsChart";
import ParkingSpotsTable from "./ParkingSpotsTable";

export default function SellerDashboardMain() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, here&apos;s what&apos;s happening with your spots today.
        </p>
      </div>

      <div className="flex flex-col gap-6" style={{ minHeight: "520px" }}>
        <StatsCards />
        <EarningsChart />
      </div>

      <ParkingSpotsTable />
    </>
  );
}
