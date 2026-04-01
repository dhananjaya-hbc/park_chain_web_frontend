"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export default function TotalEarningsCard() {
  const [totalEarnings, setTotalEarnings] = useState<string>("0.00");
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        // Get all bookings for this seller
        const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
        const bookings = response.bookings || [];

        // Calculate total earnings from completed/paid bookings
        let earnings = 0;
        let paidCount = 0;

        bookings.forEach((booking: Record<string, string>) => {
          if (booking.payment_status === "split_completed" || booking.payment_status === "paid") {
            earnings += parseFloat(booking.seller_amount_xrp || "0");
            paidCount++;
          }
        });

        setTotalEarnings(earnings.toFixed(2));
        setTotalBookings(paidCount);
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

    return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
          LIFETIME EARNINGS
        </span>
        <div className="flex items-center justify-center rounded-full flex-shrink-0 w-8 h-8 bg-[#F0FDF4]">
          <TrendingUp className="w-4 h-4 text-[#2e7d32]" />
        </div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col justify-center">
        {/* Earnings Amount */}
        <div className="mb-1">
          <p className="text-xs text-gray-500 font-medium tracking-wide mb-2">Total Earnings</p>
          {isLoading ? (
            <div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-4xl font-bold tracking-tight text-gray-900">{totalEarnings}</span>
              <span className="text-lg font-semibold text-gray-600">XRP</span>
            </div>
          )}
        </div>
      </div>

      {/* Bookings Count */}
      <div className="mt-5 pt-4 border-t border-gray-100 relative z-10 mt-auto">
        <p className="text-xs text-gray-500 mb-1.5">Source</p>
        <div className="flex items-center gap-2">
          {isLoading ? (
             <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-sm text-gray-700 font-medium">
              From {totalBookings} paid booking{totalBookings !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
