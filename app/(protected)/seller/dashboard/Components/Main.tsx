"use client";

import React from "react";
import StatsCards from "./StatsCards";
import EarningsChart from "./EarningsChart";
import SpotLocationsCard from "./SpotLocationsCard";
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

      {/* Main Layout — left wider, right slightly narrower (-48px ≈ 0.5in) */}
      <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: "520px" }}>
        {/* Left Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <StatsCards />
          <EarningsChart />
        </div>

        {/* Right Column: Spot Locations Map — shrunk by ~0.5in */}
        <div
          className="flex-shrink-0 flex flex-col relative z-0"
          style={{ width: "calc(40% - 67px)", minHeight: "480px", minWidth: "240px" }}
        >
          <SpotLocationsCard />
        </div>
      </div>

      <ParkingSpotsTable />
    </>
  );
}
