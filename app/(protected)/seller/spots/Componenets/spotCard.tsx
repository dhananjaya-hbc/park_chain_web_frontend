"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import SpotDetailsPreview from "./SpotDetailsPreview";
import EditSpot from "./EditSpot";
import BlockSpot from "./BlockSpot";

const SpotMap = dynamic(() => import("./map"), {
  ssr: false,
});

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
  pendingBookings?: number;
  isBlocked?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  pricePerHour: number;
  totalSlots?: number;
  vehicleTypes?: string[];
  slotsPerType?: number[];
  pricesPerHour?: number[];
  imageUrl?: string;
}

type SpotDetailsStatus = "active" | "inactive";

interface BackendBooking {
  spot_id?: string;
  spotId?: string;
  booking_status?: string;
  status?: string;
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
  pending: number;
}

const EMPTY_BOOKING_STATS: SpotBookingStats = { total: 0, active: 0, pending: 0 };

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
    pendingBookings: bookingStats.pending,
    isBlocked,
    isApproved,
    isAvailable: spot.is_available !== false && spot.available !== false,
    totalSlots,
    vehicleTypes,
    slotsPerType,
    pricesPerHour,
    imageUrl: firstNonEmptyString(spot.image, images[0]),
    pricePerHour: Number(spot.pricePerHour ?? spot.price_per_hour ?? 0),
  };
};

export default function SpotCard() {
  const [spots, setSpots] = React.useState<Spot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showPreview, setShowPreview] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isBlocking, setIsBlocking] = React.useState(false);
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
    setIsEditing(false);
  }, []);

  const handleEditOpen = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditClose = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleBlockOpen = React.useCallback(() => {
    setIsBlocking(true);
  }, []);

  const handleBlockClose = React.useCallback(() => {
    setIsBlocking(false);
  }, []);

  const selectedPreviewSpot = previewSpot ?? currentSpot;

  const currentSpotStatus: SpotDetailsStatus = React.useMemo(() => {
    if (!selectedPreviewSpot) return "inactive";
    return (selectedPreviewSpot.activeBookings || 0) > 0 ? "active" : "inactive";
  }, [selectedPreviewSpot]);

  const filteredSpots = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return spots.filter((spot) => {
      if (spot.isApproved !== true) return false;
      if (!q) return true;

      return spot.name.toLowerCase().includes(q) || spot.address.toLowerCase().includes(q);
    });
  }, [spots, searchQuery]);

  const loadSpots = React.useCallback(async () => {
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

        const bookingStatus = typeof booking.booking_status === "string"
          ? booking.booking_status.toLowerCase()
          : typeof booking.status === "string"
            ? booking.status.toLowerCase()
            : "";

        const current = acc.get(spotId) || { ...EMPTY_BOOKING_STATS };
        current.total += 1;

        if (["pending", "confirmed", "active"].includes(bookingStatus)) {
          current.active += 1;
        }
        if (bookingStatus === "pending") {
          current.pending += 1;
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
  }, []);

  React.useEffect(() => {
    loadSpots();
  }, [loadSpots]);

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
    <div className={`flex flex-col ${showPreview ? "" : "h-full overflow-hidden"}`}>
      {/* Page Header integrated into SpotCard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Parking Spot" : isBlocking ? "Block Parking Spot" : "Manage Spots"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditing
              ? "Pricing, capacity, and descriptions can be updated here."
              : isBlocking
              ? "Schedule or manage a block for this spot."
              : "View your spot locations and availability."}
          </p>
        </div>

        {!showPreview && !isEditing && !isBlocking && (
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search spot name or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] shadow-sm transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Card Content */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col relative z-0 overflow-hidden ${showPreview ? "" : "flex-1 min-h-0"}`}>
        {isEditing ? (
          <EditSpot
            spot={selectedPreviewSpot}
            onClose={handleEditClose}
            onSpotUpdated={() => {
              loadSpots();
              handleEditClose();
            }}
          />
        ) : isBlocking ? (
          <BlockSpot
            spot={selectedPreviewSpot as any}
            onClose={handleBlockClose}
            onSpotUpdated={() => {
              loadSpots();
              handleBlockClose();
            }}
          />
        ) : showPreview ? (
          <SpotDetailsPreview
            onClose={handlePreviewClose}
            onSpotDeleted={loadSpots}
            onEdit={handleEditOpen}
            onBlock={handleBlockOpen}
            status={currentSpotStatus}
            spot={selectedPreviewSpot as any}
          />
        ) : (
          <div className="flex-1 min-h-0 relative z-0">
            <SpotMap
              isLoading={isLoadingSpots}
              spots={filteredSpots}
              onView={handlePreviewOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
}