"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MapPin, Search } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface SpotRow {
  id: string;
  title: string;
  location: string;
  approved: boolean;
  isAvailable: boolean;
  isBlockedBySeller: boolean;
  earningsPerMonth: number;
}

interface BackendSpot {
  id: string;
  title: string;
  address?: string;
  is_available?: boolean;
  is_approved?: boolean;
  is_blocked_by_seller?: boolean;
}

interface BackendTransaction {
  spot_id: string;
  amount_xrp: string | number;
  created_at: string;
  tx_type?: string;
  status?: string;
}

interface BackendBooking {
  spot_id?: string;
  spotId?: string;
}

const ITEMS_PER_PAGE = 5;

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Blocked (By Admin)", value: "blocked_admin" },
  { label: "Blocked (By seller)", value: "blocked_seller" },
];

export default function ParkingSpotsTable() {
  const [spots, setSpots] = useState<SpotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);

        const [spotsResponse, transactionsResponse, bookingsResponse] = await Promise.all([
          apiService.get(API_ENDPOINTS.SPOTS),
          apiService.get(API_ENDPOINTS.SELLER_TRANSACTIONS),
          apiService.get(API_ENDPOINTS.BOOKINGS),
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

        const mappedRows: SpotRow[] = backendSpots
          .filter((spot) => spot.is_approved === true)
          .map((spot) => ({
            id: spot.id,
            title: spot.title,
            location: spot.address || "-",
            approved: spot.is_approved === true,
            isAvailable: spot.is_available !== false,
            isBlockedBySeller: spot.is_blocked_by_seller === true,
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

  const renderSpotId = (id: string) => {
    const parts = id.split("-");
    if (parts.length <= 4) return id;

    const firstPart = parts.slice(0, 4).join("-");
    const secondPart = parts.slice(4).join("-");

    return (
      <>
        {firstPart}-<br />
        {secondPart}
      </>
    );
  };

  // Filter
  const filteredSpots = useMemo(() => {
    let result = spots;
    if (activeFilter === "approved") {
      result = result.filter((spot) => spot.isAvailable);
    } else if (activeFilter === "blocked_admin") {
      result = result.filter((spot) => !spot.isAvailable && !spot.isBlockedBySeller);
    } else if (activeFilter === "blocked_seller") {
      result = result.filter((spot) => spot.isBlockedBySeller);
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(
      (spot) =>
        spot.title?.toLowerCase().includes(q) ||
        spot.location?.toLowerCase().includes(q) ||
        spot.id?.toLowerCase().includes(q)
    );
  }, [searchQuery, spots, activeFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSpots.length / ITEMS_PER_PAGE));
  const paginatedSpots = filteredSpots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-gray-100 bg-white gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-900">Your Parking Spots</h2>
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
            {filteredSpots.length} {searchQuery || activeFilter !== "all" ? "found" : "Total"}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveFilter(tab.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeFilter === tab.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, location, ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 w-56 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Title</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Location</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3 whitespace-nowrap">Spot ID</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Status</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3 whitespace-nowrap">Earnings (Mo)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td className="px-6 py-8 text-gray-500 text-center align-middle" colSpan={5}>
                  Loading spots...
                </td>
              </tr>
            ) : paginatedSpots.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-gray-400 text-sm text-center align-middle" colSpan={5}>
                  No spots found.
                </td>
              </tr>
            ) : (
              paginatedSpots.map((spot) => (
                <tr key={spot.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{spot.title}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2e7d32] flex-shrink-0" />
                      <span>{spot.location}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-700 whitespace-normal">
                    {renderSpotId(spot.id)}
                  </td>

                  <td className="px-6 py-4">
                    {spot.isBlockedBySeller ? (
                      <div className="flex flex-col items-center gap-1 w-fit">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          Blocked
                        </span>
                        <span className="text-[10px] text-orange-600 font-medium">
                          (By seller)
                        </span>
                      </div>
                    ) : !spot.isAvailable ? (
                      <div className="flex flex-col items-center gap-1 w-fit">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Blocked
                        </span>
                        <span className="text-[10px] text-red-600 font-medium">
                          (By admin)
                        </span>
                      </div>
                    ) : spot.approved ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium text-[#2e7d32] whitespace-nowrap">
                    {spot.earningsPerMonth.toFixed(2)} XRP
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && filteredSpots.length > ITEMS_PER_PAGE && (
        <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-[#F3F4F6] bg-[#F9FAFB80]">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredSpots.length)} of {filteredSpots.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-sm font-medium text-white bg-[#2e7d32] px-4 py-2 rounded-lg hover:bg-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
