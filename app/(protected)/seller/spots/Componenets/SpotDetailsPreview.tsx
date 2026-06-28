"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X, Car, CarFront, Truck, BusFront, Bike, Check } from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface SpotDetailsPreviewProps {
  onClose: () => void;
  onSpotDeleted?: () => void;
  onEdit?: () => void;
  onBlock?: () => void;
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
  } | null;
}

const includesAny = (key: string, words: string[]) => words.some((word) => key.includes(word));

const toLooseNumber = (value: unknown) => Number((value as string | number | boolean | null | undefined) || 0);

export default function SpotDetailsPreview({ onClose, onSpotDeleted, onEdit, onBlock, status = "inactive", spot }: SpotDetailsPreviewProps) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
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

  const canEdit = Number(spot?.pendingBookings ?? 0) === 0;
  const canDelete = Number(spot?.activeBookings ?? 0) === 0;
  const [inlineError, setInlineError] = React.useState<string>("");
  const showNoAccessError = () => {
    setInlineError("Cannot delete this spot while there are active bookings.");
  };
  const showEditError = () => {
    setInlineError("Cannot edit this spot while there are pending bookings.");
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

  React.useEffect(() => {
    if (!inlineError) return;

    const timer = window.setTimeout(() => {
      setInlineError("");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [inlineError]);

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


  const occupiedSpaces  = Math.max(0, Number(spot?.activeBookings ?? 0));
  const computedTotalSlots = Number(spot?.totalSlots ?? 0);
  const fallbackSlots  = pricingRows.reduce((sum, row) => sum + toLooseNumber(row.slots), 0);
  // totalSlots: prefer backend totalSlots, fall back to sum of pricing rows
  const totalSlots = computedTotalSlots > 0 ? computedTotalSlots : fallbackSlots;
  // availableSpaces: straight subtraction — never below 0 (stale bookings reads can lag)
  const availableSpaces = Math.max(0, totalSlots - occupiedSpaces);
  // totalSpaces is used only for the capacity bar chart to avoid division-by-zero
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#dff4e3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e7d32]">
                        Approved
                      </span>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-sm font-medium leading-5 text-gray-500 max-w-xl">
                    {spot?.description || "A premium, secure underground parking facility located in the heart of the Green District. Features 24/7 monitoring, EV charging, and wide slots for easy maneuverability."}
                  </p>
                </div>
              </div>
            </div>

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
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e7d32]">
                  {capacityPercent}% Capacity
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2e7d32] to-[#43a047]" style={{ width: `${capacityPercent}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-medium text-gray-500">
                <span>{occupiedSpaces} Spaces Occupied</span>
                <span>{availableSpaces} Spaces Available</span>
              </div>
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

                <button
                  type="button"
                  onClick={() => {
                    setInlineError("");
                    if (onBlock) onBlock();
                  }}
                  className="rounded-md bg-[#f97316] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#ea6c0a] transition-colors"
                >
                  Block
                </button>

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

      {/* Delete Confirmation Popup */}
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
    </>
  );
}