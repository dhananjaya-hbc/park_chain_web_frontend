"use client";

import React, { useEffect, useState } from "react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface SpotRow {
  id: string;
  title: string;
  location: string;
  status: "Active" | "Inactive";
  earningsPerMonth: number;
}

interface BackendSpot {
  id: string;
  title: string;
  address?: string;
  is_available?: boolean;
  is_approved?: boolean;
}

interface BackendTransaction {
  spot_id: string;
  amount_xrp: string | number;
  created_at: string;
  tx_type?: string;
  status?: string;
}

export default function ParkingSpotsTable() {
  const [spots, setSpots] = useState<SpotRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);

        const [spotsResponse, transactionsResponse] = await Promise.all([
          apiService.get(API_ENDPOINTS.SPOTS),
          apiService.get(API_ENDPOINTS.SELLER_TRANSACTIONS),
        ]);

        const backendSpots: BackendSpot[] = spotsResponse?.spots || [];
        const transactions: BackendTransaction[] = transactionsResponse?.transactions || [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyEarningsBySpot: Record<string, number> = {};

        transactions.forEach((tx) => {
          const createdAt = new Date(tx.created_at);
          const isCurrentMonth =
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear;

          if (!isCurrentMonth) return;

          const amount = Number(tx.amount_xrp) || 0;
          monthlyEarningsBySpot[tx.spot_id] =
            (monthlyEarningsBySpot[tx.spot_id] || 0) + amount;
        });

        const mappedRows: SpotRow[] = backendSpots.map((spot) => ({
          id: spot.id,
          title: spot.title,
          location: spot.address || "-",
          status: spot.is_available && spot.is_approved ? "Active" : "Inactive",
          earningsPerMonth: monthlyEarningsBySpot[spot.id] || 0,
        }));

        setSpots(mappedRows);
      } catch (error) {
        console.error("Failed to load parking spots:", error);
        setSpots([]);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, []);

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#F9FAFB80]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-900">Your Parking Spots</h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
            {spots.length} Total
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Spot ID</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Title</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Location</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Status</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">
                Earnings (Mo)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-gray-500" colSpan={5}>
                  Loading spots...
                </td>
              </tr>
            ) : spots.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-gray-500" colSpan={5}>
                  No spots found.
                </td>
              </tr>
            ) : (
              spots.map((spot) => (
                <tr key={spot.id} className="transition-colors hover:bg-gray-50">
                  <td
                    className={`px-6 py-4 font-bold ${
                      spot.status === "Active" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {spot.id}
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      spot.status === "Active" ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {spot.title}
                  </td>

                  <td
                    className={`px-6 py-4 ${
                      spot.status === "Active" ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {spot.location}
                  </td>

                  <td className="px-6 py-4">
                    {spot.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      spot.status === "Active" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    ${spot.earningsPerMonth.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-100 px-6 py-4 text-center bg-[#F9FAFB80]">
        <button className="text-sm font-semibold text-[#41ab5d] hover:text-[#2e7d32] transition-colors">
          View All Spots
        </button>
      </div>
    </div>
  );
}