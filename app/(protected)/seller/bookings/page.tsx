"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  MapPin,
  User,
  Car,
  Search,
  RefreshCw,
  Calendar,
} 
from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// --- Types ---
type BookingStatus = "pending" | "confirmed" | "active" | "completed";
type PaymentStatus = "unpaid" | "processing" | "paid" | "split_completed" | "failed";

interface Booking {
  id: string;
  spot_title: string;
  spot_address: string;
  driver_name: string;
  driver_email: string;
  driver_phone: string | null;
  vehicle_number: string | null;
  start_time: string;
  end_time: string;
  expected_duration_hours: string;
  actual_duration_hours: string | null;
  price_per_hour: string;
  total_price_xrp: string;
  admin_fee_xrp: string;
  seller_amount_xrp: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

// --- Status Badge ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    active: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
    unpaid: "bg-yellow-50 text-yellow-700 border-yellow-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    paid: "bg-green-50 text-green-700 border-green-200",
    split_completed: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  const displayText = status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {displayText}
    </span>
  );
}

// --- Format Date ---
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${month} ${day}, ${year} • ${hours}:${minutes} ${period}`;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${period}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// --- Filter Tabs ---
const FILTER_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
];

// --- Main Component ---
export default function SellerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
      setBookings(response.bookings || []);
      console.log(`✅ Loaded ${response.bookings?.length || 0} bookings`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load bookings";
      console.error("❌ Error loading bookings:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter and search
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter((b) => b.booking_status === activeFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.spot_title?.toLowerCase().includes(q) ||
          b.driver_name?.toLowerCase().includes(q) ||
          b.driver_email?.toLowerCase().includes(q) ||
          b.vehicle_number?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [bookings, activeFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter((b) => b.booking_status === "active").length,
      confirmed: bookings.filter((b) => b.booking_status === "confirmed").length,
      completed: bookings.filter((b) => b.booking_status === "completed").length,
    };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Timeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all bookings for your parking spots
          </p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
          <p className="text-sm text-green-600">Active Now</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
          <p className="text-sm text-blue-600">Upcoming</p>
          <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-700">{stats.completed}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by spot, driver, vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === tab.value
                      ? "bg-[#2e7d32] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking List */}
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#2e7d32] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 text-sm mt-3">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchBookings}
                className="mt-3 px-4 py-2 bg-[#2e7d32] text-white rounded-lg text-sm hover:bg-[#1b5e20]"
              >
                Retry
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {searchQuery || activeFilter !== "all"
                  ? "No bookings match your filter"
                  : "No bookings yet"}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                className="p-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
              >
                {/* Booking Row */}
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Spot + Driver Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-[#2e7d32] flex-shrink-0" />
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {booking.spot_title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {booking.driver_name}
                      </span>
                      {booking.vehicle_number && (
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {booking.vehicle_number}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(booking.start_time)}
                    </p>
                  </div>

                  {/* Right: Amount + Status */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#2e7d32]">
                      {parseFloat(booking.seller_amount_xrp || "0").toFixed(2)} XRP
                    </p>
                    <p className="text-xs text-gray-400 mb-1">
                      of {parseFloat(booking.total_price_xrp || "0").toFixed(2)} total
                    </p>
                    <StatusBadge status={booking.booking_status} />
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedBooking?.id === booking.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {parseFloat(booking.actual_duration_hours || booking.expected_duration_hours).toFixed(1)} hours
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Rate</p>
                      <p className="text-sm font-medium text-gray-900">
                        {parseFloat(booking.price_per_hour).toFixed(2)} XRP/hr
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Payment Status</p>
                      <StatusBadge status={booking.payment_status} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Your Earnings (80%)</p>
                      <p className="text-sm font-bold text-[#2e7d32]">
                        {parseFloat(booking.seller_amount_xrp || "0").toFixed(4)} XRP
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Driver Email</p>
                      <p className="text-sm text-gray-700">{booking.driver_email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Booked On</p>
                      <p className="text-sm text-gray-700">{formatDateTime(booking.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}