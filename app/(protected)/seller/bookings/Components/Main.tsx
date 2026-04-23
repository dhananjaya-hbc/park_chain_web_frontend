"use client";

import { useState, useEffect, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import BookingStatCards from "./BookingStatCards";
import BookingList, { Booking } from "./BookingList";

export default function Main() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
      setBookings(response.bookings || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (activeFilter !== "all") {
      filtered = filtered.filter((b) => b.booking_status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.spot_title?.toLowerCase().includes(q) ||
          b.driver_name?.toLowerCase().includes(q) ||
          b.driver_email?.toLowerCase().includes(q) ||
          b.vehicle_number?.toLowerCase().includes(q) ||
          b.vehicle_type?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [bookings, activeFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter((b) => b.booking_status === "active").length,
    confirmed: bookings.filter((b) => b.booking_status === "confirmed").length,
    completed: bookings.filter((b) => b.booking_status === "completed").length,
  }), [bookings]);

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and track all your parking spot bookings
          </p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <BookingStatCards stats={stats} />

      <BookingList
        isLoading={isLoading}
        error={error}
        filteredBookings={filteredBookings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        fetchBookings={fetchBookings}
      />
    </div>
  );
}