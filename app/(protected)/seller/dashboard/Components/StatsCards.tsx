"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Home, Users } from "lucide-react";
import { Calendar } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface StatCard {
  label: string;
  value: string;
  sub: React.ReactNode;
  subColor: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatsCards() {
  const [totalEarnings, setTotalEarnings] = useState("0.00");
  const [totalBookings, setTotalBookings] = useState(0);
  const [activeSpots, setActiveSpots] = useState(0);
  const [occupancy, setOccupancy] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, spotsRes] = await Promise.all([
          apiService.get(API_ENDPOINTS.BOOKINGS),
          apiService.get(API_ENDPOINTS.SPOTS),
        ]);

        const bookings = Array.isArray(bookingsRes?.bookings) ? bookingsRes.bookings : [];
        const spots = Array.isArray(spotsRes?.spots) ? spotsRes.spots : [];

        let earnings = 0;

        bookings.forEach((booking: Record<string, string>) => {
          if (booking.payment_status === "split_completed" || booking.payment_status === "paid") {
            earnings += parseFloat(booking.seller_amount_xrp || "0");
          }
        });

        const activeCount = spots.filter((spot: Record<string, unknown>) => {
          const status = typeof spot.status === "string" ? spot.status.toLowerCase() : "";
          const hasActiveFlag =
            spot.is_active === true ||
            spot.active === true ||
            spot.is_available === true ||
            spot.available === true;
          const activeByStatus = status === "active" || status === "approved" || status === "available";
          const approved = spot.is_approved !== false;

          return approved && (hasActiveFlag || activeByStatus || status === "");
        }).length;

        // Calculate occupancy using availability API (same logic as SpotDetailsPreview)
        const now = new Date();
        const startTime = now.toISOString();
        const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");
        const token = typeof window !== "undefined" ? localStorage.getItem("park_chain_token") : null;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Fetch availability for all approved spots in parallel
        const approvedSpots = spots.filter((s: Record<string, unknown>) => {
          const status = typeof s.status === "string" ? s.status.toLowerCase() : "";
          return s.is_approved !== false && (status === "active" || status === "approved" || status === "available" || status === "");
        });

        let totalSlotsAll = 0;
        let bookedSlotsAll = 0;

        if (approvedSpots.length > 0) {
          const availabilityResults = await Promise.allSettled(
            approvedSpots.map((s: Record<string, unknown>) =>
              fetch(
                `${apiBase}/bookings/availability/${s.id}?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`,
                { method: "GET", headers }
              ).then((r) => (r.ok ? r.json() : null))
            )
          );

          availabilityResults.forEach((result) => {
            if (result.status === "fulfilled" && result.value?.availability) {
              const list = Array.isArray(result.value.availability) ? result.value.availability : [];
              list.forEach((item: { totalSlots?: number; bookedSlots?: number }) => {
                totalSlotsAll += Number(item.totalSlots) || 0;
                bookedSlotsAll += Number(item.bookedSlots) || 0;
              });
            }
          });
        }

        const occupancyPercent = totalSlotsAll > 0 ? (bookedSlotsAll / totalSlotsAll) * 100 : 0;

        setTotalEarnings(earnings.toFixed(2));
        setTotalBookings(bookings.length);
        setActiveSpots(activeCount);
        setOccupancy(occupancyPercent.toFixed(0));
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards: StatCard[] = [
    {
      label: "Total Earnings",
      value: isLoading ? "..." : `${Number(totalEarnings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XRP`,
      sub: null,
      subColor: "text-green-500",
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      iconBg: "bg-green-50",
    },
    {
      label: "Total Bookings",
      value: isLoading ? "..." : String(totalBookings),
      sub: null,
      subColor: "text-blue-500",
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "Active Spots",
      value: isLoading ? "..." : String(activeSpots),
      sub: null,
      subColor: "text-gray-400",
      icon: <Home className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "Occupancy",
      value: isLoading ? "..." : `${occupancy}%`,
      sub: null,
      subColor: "text-green-500",
      icon: <Users className="w-5 h-5 text-purple-500" />,
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{card.label}</span>
            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
