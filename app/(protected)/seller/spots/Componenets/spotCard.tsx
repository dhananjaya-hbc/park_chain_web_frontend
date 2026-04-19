"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import SpotDetailsPreview from "./SpotDetailsPreview";

const SpotMap = dynamic(() => import("./map"), {
  ssr: false,
});

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
] as const;

interface Spot {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  hasBooking?: boolean;
  activeBookings?: number;
  totalBookings?: number;
  isBlocked?: boolean;
  isApproved?: boolean;
  pricePerHour: number;
  totalSlots?: number;
  vehicleTypes?: string[];
  slotsPerType?: number[];
  pricesPerHour?: number[];
  amenities?: string[];
  imageUrl?: string;
}

type SpotDetailsStatus = "active" | "inactive" | "blocked";

interface BackendBooking {
  spot_id?: string;
  spotId?: string;
  booking_status?: string;
}

interface BackendSpot {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  status?: string;
  is_active?: boolean;
  active?: boolean;
  is_available?: boolean;
  available?: boolean;
  is_approved?: boolean;
  approved?: boolean;
  is_blocked?: boolean;
  blocked?: boolean;
  isBlocked?: boolean;
  totalSlots?: number | string;
  total_slots?: number | string;
  vehicleTypes?: string[] | string;
  vehicle_types?: string[] | string;
  slotsPerType?: Array<number | string> | string;
  slots_per_type?: Array<number | string> | string;
  pricesPerHour?: Array<number | string> | string;
  prices_per_hour?: Array<number | string> | string;
  amenities?: string[] | string;
  features?: string[] | string;
  images?: string[] | string;
  image_urls?: string[] | string;
  image?: string;
  pricePerHour?: number | string;
  price_per_hour?: number | string;
}

interface SpotBookingStats {
  total: number;
  active: number;
}

const EMPTY_BOOKING_STATS: SpotBookingStats = { total: 0, active: 0 };

const getSpotId = (value: unknown) => String(value ?? "");

const toLooseNumber = (value: unknown) => Number((value as string | number | boolean | null | undefined) || 0);

const isTrue = (...values: unknown[]) => values.some((value) => value === true);

const firstNonEmptyString = (...values: Array<string | undefined | null>) => {
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return "";
};

const parseJson = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    const parsed = parseJson(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter((item) => item.length > 0);
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

const normalizeNumberArray = (value: unknown): number[] => {
  if (Array.isArray(value)) {
    return value.map((item) => toLooseNumber(item));
  }

  if (typeof value === "string") {
    const parsed = parseJson(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => toLooseNumber(item));
    }

    return value
      .split(",")
      .map((item) => toLooseNumber(item.trim()));
  }

  return [];
};

const mapBackendSpotToSpot = (spot: BackendSpot, bookingStatsBySpot: Map<string, SpotBookingStats>): Spot => {
  const status = typeof spot.status === "string" ? spot.status.toLowerCase() : "";
  const spotId = getSpotId(spot.id);
  const bookingStats = bookingStatsBySpot.get(spotId) || EMPTY_BOOKING_STATS;
  const isBlocked = isTrue(spot.is_blocked, spot.blocked, spot.isBlocked) || status === "blocked";
  const hasActiveFlag = isTrue(spot.is_active, spot.active, spot.is_available, spot.available);
  const activeByStatus = ["active", "approved", "available"].includes(status);
  const isApproved = isTrue(spot.is_approved, spot.approved) || status === "approved";

  const totalSlots = Number(spot.totalSlots ?? spot.total_slots ?? 0);
  const vehicleTypes = normalizeStringArray(spot.vehicleTypes ?? spot.vehicle_types);
  const slotsPerType = normalizeNumberArray(spot.slotsPerType ?? spot.slots_per_type);
  const pricesPerHour = normalizeNumberArray(spot.pricesPerHour ?? spot.prices_per_hour);
  const amenities = normalizeStringArray(spot.amenities ?? spot.features);
  const images = normalizeStringArray(spot.images ?? spot.image_urls);

  return {
    id: spot.id,
    name: firstNonEmptyString(spot.title, spot.name) || "Untitled Spot",
    description: firstNonEmptyString(spot.description),
    address: firstNonEmptyString(spot.address) || "-",
    latitude: Number(spot.latitude ?? 0),
    longitude: Number(spot.longitude ?? 0),
    isActive: !isBlocked && isApproved && (hasActiveFlag || activeByStatus || status === ""),
    hasBooking: bookingStats.total > 0,
    activeBookings: bookingStats.active,
    totalBookings: bookingStats.total,
    isBlocked,
    isApproved,
    totalSlots,
    vehicleTypes,
    slotsPerType,
    pricesPerHour,
    amenities,
    imageUrl: firstNonEmptyString(spot.image, images[0]),
    pricePerHour: Number(spot.pricePerHour ?? spot.price_per_hour ?? 0),
  };
};

export default function SpotCard() {
  const [spots, setSpots] = React.useState<Spot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<(typeof FILTER_TABS)[number]["value"]>("all");
  const [showPreview, setShowPreview] = React.useState(false);
  const [currentSpot, setCurrentSpot] = React.useState<Spot | null>(null);
  const [previewSpot, setPreviewSpot] = React.useState<Spot | null>(null);
  const [bookingStatsBySpot, setBookingStatsBySpot] = React.useState<Map<string, SpotBookingStats>>(new Map());

  const handlePreviewClose = React.useCallback(() => {
    setShowPreview(false);
    setPreviewSpot(null);
  }, []);

  const handlePreviewOpen = React.useCallback((spot: Spot) => {
    setCurrentSpot(spot);
    setPreviewSpot(spot);
    setShowPreview(true);
  }, []);

  const selectedPreviewSpot = previewSpot ?? currentSpot;

  const currentSpotStatus: SpotDetailsStatus = React.useMemo(() => {
    if (!selectedPreviewSpot) return "inactive";
    if (selectedPreviewSpot.isBlocked) return "blocked";
    return selectedPreviewSpot.hasBooking ? "active" : "inactive";
  }, [selectedPreviewSpot]);

  const filteredSpots = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return spots.filter((spot) => {
      if (spot.isApproved !== true) return false;
      if (activeFilter === "blocked" && spot.isBlocked !== true) return false;
      if (activeFilter === "active" && spot.isBlocked === true) return false;
      if (!q) return true;

      return spot.name.toLowerCase().includes(q) || spot.address.toLowerCase().includes(q);
    });
  }, [spots, activeFilter, searchQuery]);

  React.useEffect(() => {
    const loadSpots = async () => {
      try {
        setIsLoadingSpots(true);
        const [spotsResponse, bookingsResponse] = await Promise.all([
          apiService.get(API_ENDPOINTS.SPOTS),
          apiService.get(API_ENDPOINTS.BOOKINGS),
        ]);

        const backendSpots: BackendSpot[] = Array.isArray(spotsResponse?.spots) ? spotsResponse.spots : [];
        const backendBookings: BackendBooking[] = Array.isArray(bookingsResponse?.bookings) ? bookingsResponse.bookings : [];
        const bookingStatsBySpot = backendBookings.reduce((acc, booking) => {
          const spotId = getSpotId(booking.spot_id ?? booking.spotId);
          if (!spotId) return acc;

          const bookingStatus = typeof booking.booking_status === "string" ? booking.booking_status.toLowerCase() : "";
          const current = acc.get(spotId) || { ...EMPTY_BOOKING_STATS };
          current.total += 1;
          if (bookingStatus === "active") {
            current.active += 1;
          }
          acc.set(spotId, current);
          return acc;
        }, new Map<string, SpotBookingStats>());

        setBookingStatsBySpot(bookingStatsBySpot);
        setSpots(backendSpots.map((spot) => mapBackendSpotToSpot(spot, bookingStatsBySpot)));
      } catch (error) {
        console.error("Failed to load spots:", error);
        setSpots([]);
      } finally {
        setIsLoadingSpots(false);
      }
    };

    loadSpots();
  }, []);

  React.useEffect(() => {
    if (!showPreview || !currentSpot?.id) return;

    const loadSpotDetails = async () => {
      try {
        const response = await apiService.get(`${API_ENDPOINTS.SPOTS}/${currentSpot.id}`);
        const backendSpot: BackendSpot | null = response?.spot ?? null;

        if (!backendSpot?.id) return;

        setPreviewSpot(mapBackendSpotToSpot(backendSpot, bookingStatsBySpot));
      } catch (error) {
        console.error("Failed to load spot details:", error);
      }
    };

    loadSpotDetails();
  }, [showPreview, currentSpot?.id, bookingStatsBySpot]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden relative z-0">

      {showPreview ? (
        <SpotDetailsPreview
          onClose={handlePreviewClose}
          status={currentSpotStatus}
          spot={selectedPreviewSpot}
        />
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-[#F9FAFB80]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by spot name or adress"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047]"
                />
              </div>

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

          {/* Map */}
          <div className="flex-1 min-h-0 relative z-0">
            <SpotMap 
              isLoading={isLoadingSpots}
              spots={filteredSpots} 
              onView={handlePreviewOpen}
            />
          </div>
        </>
      )}
    </div>
  );
}