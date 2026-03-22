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
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">Total Earnings</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900">{totalEarnings} XRP</p>
              <p className="text-xs text-gray-400 mt-1">From {totalBookings} paid booking{totalBookings !== 1 ? "s" : ""}</p>
            </>
          )}
        </div>
        <div className="flex items-center justify-center rounded-full flex-shrink-0 w-10 h-10 bg-[#F0FDF4]">
          <TrendingUp className="w-5 h-5 text-[#2e7d32]" />
        </div>
      </div>
    </div>
  );
}