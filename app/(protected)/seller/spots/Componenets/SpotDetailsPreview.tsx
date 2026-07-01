"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X, Car, CarFront, Truck, BusFront, Bike, Check, Lock, Clock } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

function BlockTimer({ endTime, onExpire }: { endTime: string; onExpire?: () => void }) {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;
    const update = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) {
        setParts({ d: 0, h: 0, m: 0, s: 0 });
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (onExpire) onExpire();
        }
        return;
      }
      setParts({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    };
    update();
    const interval = setInterval(update, 1_000);
    return () => clearInterval(interval);
  }, [endTime]);

  const Segment = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="font-mono font-bold text-sm text-red-600 leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[8px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );

  const Sep = () => (
    <span className="font-mono font-bold text-sm text-gray-300 leading-none pb-3">:</span>
  );

  return (
    <div className="flex items-end gap-1 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1.5">
      <Segment value={parts.d} label="days" />
      <Sep />
      <Segment value={parts.h} label="hours" />
      <Sep />
      <Segment value={parts.m} label="min" />
      <Sep />
      <Segment value={parts.s} label="sec" />
    </div>
  );
}


interface SpotDetailsPreviewProps {
  onClose: () => void;
  onSpotDeleted?: () => void;
  onEdit?: () => void;
  onBlock?: () => void;
  onSpotUpdated?: () => void;
  status?: "active" | "inactive";
  spot?: {
    id: string;
    name: string;
    description?: string;
    address: string;
    pricePerHour: number;
    totalSlots?: number;
    activeBookings?: number;
    totalBookings?: number;
    pendingBookings?: number;
    vehicleTypes?: string[];
    slotsPerType?: number[];
    pricesPerHour?: number[];
    imageUrl?: string;
    isAvailable?: boolean;
    isBlocked?: boolean;
    isBlockedBySeller?: boolean;
    blockReason?: string;
    blockEndTime?: string;
  } | null;
}

const includesAny = (key: string, words: string[]) => words.some((word) => key.includes(word));

const toLooseNumber = (value: unknown) => Number((value as string | number | boolean | null | undefined) || 0);

export default function SpotDetailsPreview({ onClose, onSpotDeleted, onEdit, onBlock, onSpotUpdated, status = "inactive", spot }: SpotDetailsPreviewProps) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [popupMode, setPopupMode] = useState<'confirmUnblock' | 'unblockSuccess' | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsStats, setReviewsStats] = useState<{ averageRating: string; totalReviews: number } | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const statusBadge =
    status === "active"
      ? {
        label: "Active",
        className: "bg-[#dff4e3] text-[#2e7d32]",
      }
      : {
        label: "Inactive",
        className: "bg-gray-100 text-gray-600",
      };

  const isAdminBlocked = spot?.isBlocked === true || spot?.isAvailable === false;
  const canEdit = !isAdminBlocked;
  const canBlock = !isAdminBlocked;
  const canDelete = !isAdminBlocked && Number(spot?.activeBookings ?? 0) === 0;
  const [inlineError, setInlineError] = React.useState<string>("");
  const showNoAccessError = () => {
    if (isAdminBlocked) setInlineError("Cannot delete this spot because it is blocked by the admin.");
    else setInlineError("Cannot delete this spot while there are active bookings.");
  };
  const showEditError = () => {
    setInlineError("Cannot edit this spot because it is blocked by the admin.");
  };
  const showBlockError = () => {
    setInlineError("Cannot block this spot because it is blocked by the admin.");
  };

  const handleDeleteConfirm = async () => {
    if (!spot?.id) return;
    try {
      setIsDeleting(true);
      await apiService.delete(`${API_ENDPOINTS.SPOTS}/${spot.id}`);
      setDeleteSuccess(true);
    } catch (error: unknown) {
      console.error("Failed to delete spot:", error);
      setInlineError("Failed to delete spot. Please try again.");
      setShowDeletePopup(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUnblock = async () => {
    if (!spot?.id) return;
    try {
      setIsUnblocking(true);
      await apiService.post(`${API_ENDPOINTS.SPOTS}/${spot.id}/unblock`, {});
      setPopupMode("unblockSuccess");
      if (onSpotUpdated) {
        onSpotUpdated();
      }
    } catch (err) {
      console.error("Failed to unblock spot", err);
      setInlineError("Failed to unblock spot. Please try again.");
    } finally {
      setIsUnblocking(false);
    }
  };

  const handleAutoExpire = async () => {
    if (!spot?.id) return;
    try {
      await apiService.post(`${API_ENDPOINTS.SPOTS}/${spot.id}/unblock`, {});
      if (onSpotUpdated) {
        onSpotUpdated();
      }
    } catch (err) {
      console.error("Failed to automatically unblock spot", err);
    }
  };

  React.useEffect(() => {
    if (!inlineError) return;

    const timer = window.setTimeout(() => {
      setInlineError("");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [inlineError]);

  useEffect(() => {
    if (!spot?.id) {
      setReviews([]);
      setReviewsStats(null);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await apiService.get(`${API_ENDPOINTS.REVIEWS}/spot/${spot.id}`);
        setReviews(res.data || []);
        setReviewsStats(res.stats || { averageRating: "0.00", totalReviews: 0 });
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [spot?.id]);

  const pricingRows = React.useMemo(() => {
    const vehicleTypes = Array.isArray(spot?.vehicleTypes) ? spot?.vehicleTypes : [];
    const slotsPerType = Array.isArray(spot?.slotsPerType) ? spot?.slotsPerType : [];
    const pricesPerHour = Array.isArray(spot?.pricesPerHour) ? spot?.pricesPerHour : [];

    if (vehicleTypes.length > 0 && pricesPerHour.length > 0) {
      return vehicleTypes.map((vehicleType, index) => ({
        label: `${vehicleType} spots`,
        rawType: vehicleType,
        price: Number(pricesPerHour[index] ?? spot?.pricePerHour ?? 0),
        slots: Number(slotsPerType[index] ?? 0),
      }));
    }

    return [
      { label: "Car spots", rawType: "car", price: Number(spot?.pricePerHour ?? 0), slots: 0 },
      { label: "Van spots", rawType: "van", price: Number(spot?.pricePerHour ?? 0), slots: 0 },
      { label: "Bike/Cycle spots", rawType: "bike", price: Number(spot?.pricePerHour ?? 0), slots: 0 },
    ];
  }, [spot]);

  const getVehicleIcon = React.useCallback((type: string) => {
    const key = type.toLowerCase();

    if (includesAny(key, ["bike", "cycle", "three wheel"])) {
      return Bike;
    }

    if (key.includes("van")) {
      return CarFront;
    }

    if (key.includes("bus")) {
      return BusFront;
    }

    if (key.includes("truck")) {
      return Truck;
    }

    return Car;
  }, []);

  const vehicleIconPool = React.useMemo(() => [Car, CarFront, Truck, BusFront, Bike], []);

  const pricingRowsWithIcons = React.useMemo(() => {
    const usedIcons = new Set<(typeof vehicleIconPool)[number]>();

    return pricingRows.map((row, index) => {
      let icon = getVehicleIcon(row.rawType);

      if (usedIcons.has(icon)) {
        icon = vehicleIconPool[index % vehicleIconPool.length];
      }

      usedIcons.add(icon);
      return { ...row, icon };
    });
  }, [pricingRows, getVehicleIcon, vehicleIconPool]);


  // ── Live Occupancy via API ─────────────────────────────────────
  const [occupancyData, setOccupancyData] = useState<{
    bookedSlots: number;
    totalSlots: number;
    availableSlots: number;
  } | null>(null);
  const [occupancyLoading, setOccupancyLoading] = useState(false);
  const [occupancyError, setOccupancyError] = useState(false);
  const [occupancyRetry, setOccupancyRetry] = useState(0);

  useEffect(() => {
    const spotId = spot?.id;
    if (!spotId) return;

    setOccupancyLoading(true);
    setOccupancyError(false);
    setOccupancyData(null);

    const now = new Date();
    const startTime = now.toISOString();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");
    const token = typeof window !== "undefined" ? localStorage.getItem("park_chain_token") : null;
    const url = `${apiBase}/bookings/availability/${spotId}?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{
          availability: { vehicleType: string; totalSlots: number; bookedSlots: number; availableSlots: number }[];
        }>;
      })
      .then((data) => {
        const list = Array.isArray(data?.availability) ? data.availability : [];
        setOccupancyData({
          totalSlots:    list.reduce((s, r) => s + (Number(r.totalSlots)    || 0), 0),
          bookedSlots:   list.reduce((s, r) => s + (Number(r.bookedSlots)   || 0), 0),
          availableSlots:list.reduce((s, r) => s + (Number(r.availableSlots)|| 0), 0),
        });
        setOccupancyLoading(false);
      })
      .catch((err) => {
        console.error("[LiveOccupancy]", err);
        setOccupancyError(true);
        setOccupancyLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot?.id, occupancyRetry]);

  const handleRetryOccupancy = () => setOccupancyRetry((n) => n + 1);


  // Derived occupancy values
  const occupiedSpaces = occupancyData?.bookedSlots ?? 0;
  const computedTotalSlots = Number(spot?.totalSlots ?? 0);
  const fallbackSlots = pricingRows.reduce((sum, row) => sum + toLooseNumber(row.slots), 0);
  const totalSlots = occupancyData ? occupancyData.totalSlots : (computedTotalSlots > 0 ? computedTotalSlots : fallbackSlots);
  const availableSpaces = occupancyData?.availableSlots ?? Math.max(0, totalSlots - occupiedSpaces);
  const totalSpaces = Math.max(1, totalSlots);
  const capacityPercent = Math.min(100, Math.round((occupiedSpaces / totalSpaces) * 100));

  return (
    <>
      <div className="flex-1 w-full">
        <div className="relative w-full p-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex w-full flex-col gap-5 bg-white px-4 py-4 sm:px-6 sm:py-6">
            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={spot?.imageUrl || "/placeholder-spot-preview.jpg"}
                  alt="Spot preview"
                  className="h-full w-full object-cover min-h-[170px] lg:min-h-[180px]"
                />
              </div>

              <div className="rounded-xl bg-[#f6faf6]/70 p-4 sm:p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      {spot?.name || "Emerald Plaza Secure Deck"}
                    </h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                      <svg
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 22C12 22 20 14.5 20 9.5C20 5.35786 16.6421 2 12.5 2C8.35786 2 5 5.35786 5 9.5C5 14.5 12 22 12 22Z"
                          fill="#2e7d32"
                        />
                        <circle cx="12.5" cy="9.5" r="2.2" fill="white" />
                      </svg>
                      <span>{spot?.address || "452 Botanical Avenue, Green District, SF 94105"}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      {reviewsStats && Number(reviewsStats.totalReviews) > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-800">
                          <span className="text-amber-500 text-xs">★</span>
                          <span>{reviewsStats.averageRating} ({reviewsStats.totalReviews} REVIEWS)</span>
                        </span>
                      )}
                      {spot?.isBlockedBySeller ? (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                          Blocked( By User )
                        </span>
                      ) : isAdminBlocked ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700">
                          Blocked( By Admin )
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center rounded-full bg-[#dff4e3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e7d32]">
                            Approved
                          </span>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusBadge.className}`}>
                            {statusBadge.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="mt-5 text-sm font-medium leading-5 text-gray-500 max-w-xl">
                    {spot?.description || "A premium, secure underground parking facility located in the heart of the Green District. Features 24/7 monitoring, EV charging, and wide slots for easy maneuverability."}
                  </p>
                </div>
              </div>
            </div>

            {spot?.isBlockedBySeller && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f5c6c6] bg-[#fdf2f2] border-l-4 border-l-[#991b1b] px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#991b1b] shadow-sm relative">
                    <Lock className="h-5 w-5 text-white" />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border border-[#991b1b]">
                      <Clock className="h-2.5 w-2.5 text-[#991b1b]" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#991b1b]">
                      Scheduled Block in Progress
                    </p>
                    <p className="text-xs text-[#991b1b] mt-0.5">
                      Ends at: {spot?.blockEndTime ? (
                        new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(spot.blockEndTime))
                      ) : (
                        "Unknown"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono font-bold text-xl tracking-widest text-red-600">
                    {spot?.blockEndTime ? (
                      <BlockTimer endTime={spot?.blockEndTime || ""} onExpire={handleAutoExpire} />
                    ) : (
                      "--:--:--"
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPopupMode("confirmUnblock")}
                    disabled={isUnblocking}
                    className="rounded-md border border-[#e0e0e0] bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    {isUnblocking ? "Unblocking…" : "Unblock Spot"}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Pricing & Capacity</h3>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                {pricingRowsWithIcons.map((row, index) => {
                  const VehicleIcon = row.icon;

                  return (
                    <div key={`${row.label}-${index}`} className="rounded-2xl border-l-4 border-l-[#2e7d32] border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <VehicleIcon className="h-5 w-5 text-[#2e7d32]" />
                        <p className="text-sm font-semibold text-gray-800">{row.label}</p>
                      </div>
                      <p className="mt-2 text-xl font-bold text-gray-900">{Number(row.price || 0).toFixed(2)} XRP<span className="text-sm text-gray-500">/hr</span></p>
                      <p className="mt-1 text-xs text-gray-500">{Number(row.slots || 0)} spots </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#f6faf6]/70 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">
                  Live Occupancy
                </p>
                {occupancyLoading ? (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 animate-pulse">Loading…</span>
                ) : occupancyError ? (
                  <button
                    type="button"
                    onClick={handleRetryOccupancy}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:underline"
                  >
                    Retry
                  </button>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e7d32]">
                    {capacityPercent}% Capacity
                  </span>
                )}
              </div>


              {occupancyLoading ? (
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200 animate-pulse" />
              ) : occupancyError ? (
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-red-100">
                  <div className="h-full w-0 rounded-full bg-red-300" />
                </div>
              ) : (
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2e7d32] to-[#43a047] transition-all duration-500" style={{ width: `${capacityPercent}%` }} />
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-xs font-medium text-gray-500">
                {occupancyLoading ? (
                  <>
                    <span className="inline-block h-3 w-28 rounded bg-gray-200 animate-pulse" />
                    <span className="inline-block h-3 w-28 rounded bg-gray-200 animate-pulse" />
                  </>
                ) : occupancyError ? (
                  <span className="text-red-400">Could not load occupancy data</span>
                ) : (
                  <>
                    <span>{occupiedSpaces} Spaces Occupied</span>
                    <span>{availableSpaces} Spaces Available</span>
                  </>
                )}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>

              {loadingReviews ? (
                <div className="flex justify-center py-6">
                  <span className="text-sm font-semibold text-gray-500 animate-pulse">Loading reviews...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-6 bg-gray-50/55 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">No reviews available for this spot yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pb-3.5 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2.5">
                          {rev.user_profile_image ? (
                            <img
                              src={rev.user_profile_image}
                              alt={rev.user_name || "User"}
                              className="w-7 h-7 rounded-full object-cover border border-gray-150"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#e8f5e9] flex items-center justify-center text-xs font-extrabold text-[#2e7d32]">
                              {(rev.user_name || "U")[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-semibold text-gray-800 block">
                              {rev.user_name || "Anonymous Driver"}
                            </span>
                            <span className="text-[9px] text-gray-400 block mt-0.5">
                              {new Date(rev.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          <span className="text-[10px] text-amber-500 font-bold">★</span>
                          <span className="text-[10px] font-bold text-amber-700">{rev.rating}</span>
                        </div>
                      </div>
                      {rev.comment && (
                        <p className="mt-2 text-xs text-gray-600 italic bg-gray-50/70 p-2.5 rounded-lg border border-gray-100/80 leading-normal">
                          "{rev.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="min-h-[28px] min-w-[240px] flex-1">
                {inlineError ? (
                  <span className="inline-flex w-full items-center rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                    {inlineError}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!canEdit) {
                      showEditError();
                    } else {
                      setInlineError("");
                      if (onEdit) onEdit();
                    }
                  }}
                  className={`rounded-md bg-[#43a047] px-5 py-2 text-sm font-semibold text-white shadow-sm ${canEdit ? "" : "opacity-45"}`}
                >
                  Edit
                </button>

                {!spot?.isBlockedBySeller && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!canBlock) {
                        showBlockError();
                      } else {
                        setInlineError("");
                        if (onBlock) onBlock();
                      }
                    }}
                    className={`rounded-md bg-[#f97316] hover:bg-[#ea6c0a] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${canBlock ? "" : "opacity-45"}`}
                  >
                    Block
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!canDelete) {
                      showNoAccessError();
                    } else {
                      setInlineError("");
                      setDeleteSuccess(false);
                      setShowDeletePopup(true);
                    }
                  }}
                  disabled={isDeleting}
                  className={`rounded-md bg-[#ef4444] px-5 py-2 text-sm font-semibold text-white shadow-sm ${canDelete && !isDeleting ? "" : "opacity-45"}`}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeletePopup && typeof document !== "undefined" && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-[540px] rounded-xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden">
            {deleteSuccess ? (
              <>
                <div className="h-2 bg-[#43a047]" />
                <div className="py-14 px-8 text-center">
                  <div className="mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center border-4 border-[#43a047]">
                    <Check className="w-8 h-8 text-[#43a047]" strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-semibold text-[#4a5f72]">Successfully Deleted</h3>
                  <p className="mt-6 text-lg text-[#7b8794] leading-8 max-w-lg mx-auto">
                    The spot {spot?.name} has been successfully deleted.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeletePopup(false);
                        setDeleteSuccess(false);
                        onSpotDeleted?.();
                        onClose();
                      }}
                      className="h-12 min-w-[120px] rounded-md bg-[#43a047] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2e7d32]"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-2 bg-[#ef4444]" />
                <div className="py-14 px-8 text-center">
                  <div className="mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center border-4 border-[#ef4444]">
                    <X className="w-8 h-8 text-[#ef4444]" strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-semibold text-[#4a5f72]">Are you sure?</h3>
                  <p className="mt-6 text-lg text-[#7b8794] leading-8 max-w-lg mx-auto">
                    Do you really want to delete {spot?.name}? This process cannot be undone.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      onClick={() => setShowDeletePopup(false)}
                      className="h-12 min-w-[120px] rounded-md bg-[#d8dadd] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#cfd2d6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      disabled={isDeleting}
                      className="h-12 min-w-[120px] rounded-md bg-[#ef3636] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626] disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Portaled Popup — Unblock Confirmation */}
      {popupMode && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-[540px] rounded-xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className={`h-2 ${popupMode === 'confirmUnblock' ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`} />
            <div className="py-14 px-8 text-center">
              <div className={`mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center ${popupMode === 'confirmUnblock' ? 'border-4 border-[#ef4444]' : 'bg-[#22c55e]'}`}>
                {popupMode === 'confirmUnblock'
                  ? <X className="w-8 h-8 text-[#ef4444]" strokeWidth={3} />
                  : <Check className="w-8 h-8 text-white" strokeWidth={3} />
                }
              </div>

              {popupMode === 'confirmUnblock' ? (
                <>
                  <h3 className="text-3xl font-bold text-[#1f2937]">Unblock Spot?</h3>
                  <p className="mt-4 text-[15px] font-medium text-gray-500 leading-relaxed max-w-sm mx-auto">
                    This spot will become visible to customers again and they will be able to book it. Are you sure?
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPopupMode(null)}
                      className="h-11 min-w-[130px] rounded-md bg-[#d8dadd] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#cfd2d6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUnblock}
                      disabled={isUnblocking}
                      className="h-11 min-w-[130px] rounded-md bg-[#ef3636] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626] disabled:opacity-50"
                    >
                      {isUnblocking ? "Unblocking..." : "Yes, Unblock"}
                    </button>
                  </div>
                </>
              ) : popupMode === 'unblockSuccess' ? (
                <>
                  <h3 className="text-3xl font-bold text-gray-900">Spot Unblocked!</h3>
                  <p className="mt-4 text-[15px] font-medium text-gray-500 leading-relaxed max-w-sm mx-auto">
                    The spot is now successfully unblocked and available for customers again.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPopupMode(null);
                      if (onClose) onClose();
                    }}
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#111827] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f172a]"
                  >
                    Back to Spots
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}