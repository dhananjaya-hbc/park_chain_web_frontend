"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, Lock, CheckCircle, Check, CalendarX } from "lucide-react";
import ReactDOM from 'react-dom';
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface CurrentBlock {
  id?: string;
  reason?: string;
  end_time?: string;
  start_time?: string;
  date?: string;
}

interface BlockSpotProps {
  spot: {
    id: string;
    name: string;
    description?: string;
    address: string;
    imageUrl?: string;
    isBlocked?: boolean;
  } | null;
  onClose: () => void;
  onSpotUpdated?: () => void;
}

function BlockTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <span className="font-mono font-bold text-xl text-[#ef4444] tracking-wider">
      {timeLeft}
    </span>
  );
}

export default function BlockSpot({ spot, onClose, onSpotUpdated }: BlockSpotProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [reason, setReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<CurrentBlock | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [popupMode, setPopupMode] = useState<'success' | 'confirmCancel' | 'confirmDiscard' | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  // Calculate duration automatically
  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (diffHours > 0) {
          setDuration(Math.max(1, Math.round(diffHours)));
        }
      }
    }
  }, [startDate, endDate, startTime, endTime]);

  // Try to load any active block for this spot
  useEffect(() => {
    if (!spot?.id) return;
    const load = async () => {
      try {
        const response = await apiService.get(`${API_ENDPOINTS.SPOTS}/${spot.id}/block`);
        if (response?.block) setCurrentBlock(response.block);
      } catch {
        // no active block – that's fine
      }
    };
    load();
  }, [spot?.id]);

  // Check for conflicting bookings
  useEffect(() => {
    if (!spot?.id) return;
    if (startDate && endDate && startTime && endTime) {
      const checkConflict = async () => {
        try {
          setIsCheckingConflict(true);
          const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
          const backendBookings = Array.isArray(response?.bookings) ? response.bookings : [];

          const blockStart = new Date(`${startDate}T${startTime}`).getTime();
          const blockEnd = new Date(`${endDate}T${endTime}`).getTime();

          const hasOverlap = backendBookings.some((booking: any) => {
            const spotId = String(booking.spot_id || booking.spotId);
            if (spotId !== String(spot.id)) return false;

            const status = String(booking.booking_status || booking.status || "").toLowerCase();
            if (status !== "active" && status !== "confirmed") return false;

            const bookingStart = new Date(booking.start_time).getTime();
            const bookingEnd = new Date(booking.end_time).getTime();

            return blockStart < bookingEnd && blockEnd > bookingStart;
          });

          setHasConflict(hasOverlap);
        } catch (err) {
          console.error("Failed to fetch bookings to check conflict", err);
        } finally {
          setIsCheckingConflict(false);
        }
      };
      checkConflict();
    } else {
      setHasConflict(false);
    }
  }, [startDate, endDate, startTime, endTime, spot?.id]);

  // Auto-clear messages
  useEffect(() => {
    if (!error && !success) return;
    const t = window.setTimeout(() => { setError(""); setSuccess(""); }, 3000);
    return () => window.clearTimeout(t);
  }, [error, success]);

  const handleBlock = async () => {
    if (!spot?.id) return;
    if (!startDate || !endDate || !startTime || !endTime || !reason.trim()) {
      setError("Please fill in all the fields.");
      return;
    }
    try {
      setIsBlocking(true);
      setError("");
      await apiService.post(`${API_ENDPOINTS.SPOTS}/${spot.id}/block`, {
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        duration_hours: duration,
        reason: reason || undefined,
      });
      setPopupMode('success');
    } catch {
      setError("Failed to block spot. Please try again.");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleCancelBlockClick = () => {
    setPopupMode('confirmCancel');
  };

  const handleCancelForm = () => {
    setPopupMode('confirmDiscard');
  };

  const handleCancelBlockConfirm = async () => {
    if (!spot?.id) return;
    try {
      setIsCancelling(true);
      setError("");
      await apiService.delete(`${API_ENDPOINTS.SPOTS}/${spot.id}/block`);
      setCurrentBlock(null);
      setPopupMode(null);
      onSpotUpdated?.();
      onClose();
    } catch {
      setError("Failed to cancel block. Please try again.");
      setPopupMode(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleGoToSpots = () => {
    setPopupMode(null);
    onSpotUpdated?.();
    onClose();
  };

  return (
    <div className="flex-1 w-full">
      <div className="relative w-full p-0">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-colors"
          aria-label="Close block panel"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex w-full flex-col gap-5 bg-white px-4 py-4 sm:px-6 sm:py-6">
          {/* ── Spot header (mirrors SpotDetailsPreview top section) ── */}
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
                    {spot?.name || "Parking Spot"}
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
                    <span>{spot?.address}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-[#dff4e3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e7d32]">
                      Approved
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#dff4e3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2e7d32]">
                      Active
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium leading-5 text-gray-500 max-w-xl">
                  {spot?.description ||
                    "A premium, secure parking facility with 24/7 monitoring, EV charging, and wide slots for easy maneuverability."}
                </p>
              </div>
            </div>
          </div>

          {/* ── Current block banner ── */}
          {(currentBlock || spot?.isBlocked) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dff4e3] bg-[#f6faf6] border-l-4 border-l-[#2e7d32] px-4 py-4">
              <div className="flex items-center gap-4">
                {/* Icon box — dark green with lock+clock */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2e7d32] shadow-sm relative">
                  <Lock className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border border-[#2e7d32]">
                    <Clock className="h-2.5 w-2.5 text-[#2e7d32]" />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {spot?.name} Currently Blocked
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currentBlock?.reason || "Maintenance block scheduled for cleaning service"}
                  </p>
                </div>
              </div>

              {/* Timer + Cancel Block stacked on the right */}
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono font-bold text-xl tracking-widest text-[#ef4444]">
                  {currentBlock?.end_time ? (
                    <BlockTimer endTime={currentBlock.end_time} />
                  ) : (
                    "--:--:--"
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleCancelBlockClick}
                  disabled={isCancelling}
                  className="rounded-md border border-[#e0e0e0] bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {isCancelling ? "Cancelling…" : "Cancel Block"}
                </button>
              </div>
            </div>
          )}

          {/* ── Schedule a Block form ── */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Schedule a Block</h3>
            </div>

            {/* Start / End Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="block-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  id="block-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                />
              </div>
            </div>

            {/* Start / End Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  id="block-start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  id="block-end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                />
              </div>
            </div>

            {/* Duration bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <span className="rounded-md bg-[#e6f4ea] px-2.5 py-1 text-sm font-bold text-[#00695c]">
                  {duration} Hours
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2e7d32] to-[#43a047] transition-all duration-300"
                  style={{ width: `${Math.min(100, (duration / Math.max(24, duration || 1)) * 100)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>1h</span>
                <span>6h</span>
                <span>12h</span>
                <span>18h</span>
                <span>24h</span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>Duration is calculated automatically based on selected dates and times.Maximum blocking duration is 24 hours   </span>
              </ div>
            </div>

            {/* Optional reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason <span className="text-gray-400 font-normal"></span>
              </label>
              <input
                id="block-reason"
                type="text"
                placeholder="e.g. Maintenance block scheduled for cleaning service"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
              />
            </div>

            {/* No-conflict / Conflict status */}
            {hasConflict ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <X className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Conflicting bookings found
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Spot can not be blocked for the selected time period.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                <CheckCircle className="h-5 w-5 text-[#15803d]" />
                <div>
                  <p className="text-sm font-bold text-[#1f2937]">
                    No conflicting bookings found.
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Spot can be blocked for the selected period.
                  </p>
                </div>
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                {success}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                id="block-spot-cancel"
                type="button"
                onClick={handleCancelForm}
                className="rounded-md bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                id="block-spot-submit"
                type="button"
                onClick={handleBlock}
                disabled={isBlocking || hasConflict || isCheckingConflict}
                className="inline-flex items-center justify-center rounded-md bg-[#2e7d32] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1b5e20] disabled:opacity-50 transition-colors"
              >
                {isBlocking ? "Blocking…" : "Block Spot"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portaled Popup — covers navbar and sidebar */}
      {popupMode && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-[540px] rounded-xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className={`h-2 ${popupMode === 'confirmCancel' || popupMode === 'confirmDiscard' ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`} />
            <div className="py-14 px-8 text-center">
              <div className={`mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center ${popupMode === 'confirmCancel' || popupMode === 'confirmDiscard' ? 'border-4 border-[#ef4444]' : 'bg-[#22c55e]'}`}>
                {popupMode === 'confirmCancel' || popupMode === 'confirmDiscard'
                  ? (popupMode === 'confirmCancel' ? <CalendarX className="w-8 h-8 text-[#ef4444]" strokeWidth={2} /> : <X className="w-8 h-8 text-[#ef4444]" strokeWidth={3} />)
                  : <Check className="w-8 h-8 text-white" strokeWidth={3} />
                }
              </div>

              {popupMode === 'success' ? (
                <>
                  <h3 className="text-3xl font-bold text-gray-900">Spot Blocked Successfully!</h3>
                  <p className="mt-4 text-[15px] font-medium text-gray-500 leading-relaxed max-w-sm mx-auto">
                    This spot is now hidden from customers for the selected time.
                  </p>
                  <button
                    type="button"
                    onClick={handleGoToSpots}
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#111827] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f172a]"
                  >
                    Back to Spots
                  </button>
                </>
              ) : popupMode === 'confirmDiscard' ? (
                <>
                  <h3 className="text-3xl font-bold text-[#1f2937]">Cancel Editing?</h3>
                  <p className="mt-4 text-[15px] font-medium text-gray-500 leading-relaxed max-w-sm mx-auto">
                    Any unsaved changes will be lost. Do you want to go back?
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPopupMode(null)}
                      className="h-11 min-w-[130px] rounded-md bg-[#d8dadd] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#cfd2d6]"
                    >
                      Keep Editing
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 min-w-[130px] rounded-md bg-[#ef3636] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626]"
                    >
                      Yes, Cancel Editing
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-[#1f2937]">Cancel Spot Blocking?</h3>
                  <p className="mt-4 text-[15px] font-medium text-gray-500 leading-relaxed max-w-sm mx-auto">
                    The spot will become visible again to customers after cancellation.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPopupMode(null)}
                      disabled={isCancelling}
                      className="h-11 min-w-[130px] rounded-md bg-[#d8dadd] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#cfd2d6] disabled:opacity-50"
                    >
                      Keep Blocking
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelBlockConfirm}
                      disabled={isCancelling}
                      className="h-11 min-w-[130px] rounded-md bg-[#ef3636] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626] disabled:opacity-50"
                    >
                      {isCancelling ? 'Cancelling...' : 'Yes, Cancel Blocking'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
