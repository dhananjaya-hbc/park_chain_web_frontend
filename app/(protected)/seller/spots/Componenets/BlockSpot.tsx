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
    isBlockedBySeller?: boolean;
    blockReason?: string;
    blockEndTime?: string;
  } | null;
  onClose: () => void;
  onSpotUpdated?: () => void;
}

export default function BlockSpot({ spot, onClose, onSpotUpdated }: BlockSpotProps) {
  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 21);
  const maxDateString = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [reason, setReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<CurrentBlock | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [popupMode, setPopupMode] = useState<'success' | 'confirmDiscard' | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  const isValidDateRange = React.useMemo(() => {
    if (!startDate || !endDate || !startTime || !endTime) return false;
    // Replace hyphens to ensure cross-browser parsing if necessary, though YYYY-MM-DDTHH:mm is standard.
    const s = new Date(`${startDate}T${startTime}`);
    const e = new Date(`${endDate}T${endTime}`);
    return !isNaN(s.getTime()) && !isNaN(e.getTime()) && s < e;
  }, [startDate, endDate, startTime, endTime]);

  // Calculate duration automatically
  useEffect(() => {
    if (isValidDateRange) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      setDuration(Math.max(1, Math.round(diffMinutes)));
    } else {
      setDuration(0);
    }
  }, [isValidDateRange, startDate, endDate, startTime, endTime]);

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
    if (isValidDateRange) {
      const checkConflict = async () => {
        try {
          setIsCheckingConflict(true);
          const blockStart = new Date(`${startDate}T${startTime}`).toISOString();
          const blockEnd = new Date(`${endDate}T${endTime}`).toISOString();

          // Call the new backend endpoint for conflict checking
          const response = await apiService.post(`${API_ENDPOINTS.SPOTS}/${spot.id}/check-conflicts`, {
            startDateTime: blockStart,
            endDateTime: blockEnd
          });

          // Assuming backend returns { hasConflict: true/false }
          setHasConflict(response?.hasConflict === true);
        } catch (err) {
          console.error("Failed to check conflict", err);
        } finally {
          setIsCheckingConflict(false);
        }
      };
      checkConflict();
    } else {
      setHasConflict(false);
    }
  }, [isValidDateRange, spot?.id, startDate, endDate, startTime, endTime]);

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
      const blockStartObj = new Date(`${startDate}T${startTime}`);
      const blockEndObj = new Date(`${endDate}T${endTime}`);

      if (isNaN(blockStartObj.getTime()) || isNaN(blockEndObj.getTime()) || blockStartObj >= blockEndObj) {
        setError("End date and time must be after the start date and time.");
        return;
      }

      setIsBlocking(true);
      setError("");
      await apiService.post(`${API_ENDPOINTS.SPOTS}/${spot.id}/block`, {
        startDateTime: blockStartObj.toISOString(),
        endDateTime: blockEndObj.toISOString(),
        reason: reason || undefined,
      });
      setPopupMode('success');
    } catch {
      setError("Failed to block spot. Please try again.");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleCancelForm = () => {
    setPopupMode('confirmDiscard');
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
                  min={todayDateString}
                  max={maxDateString}
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
                  min={startDate || todayDateString}
                  max={maxDateString}
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
                  {duration === 0
                    ? '0m'
                    : duration < 60
                      ? `${duration}m`
                      : duration % 60 === 0
                        ? `${Math.floor(duration / 60)}h`
                        : `${Math.floor(duration / 60)}h ${duration % 60}m`}
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2e7d32] to-[#43a047] transition-all duration-300"
                  style={{ width: `${Math.min(100, ((duration / 60) / Math.max(24, (duration / 60) || 1)) * 100)}%` }}
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
              <select
                id="block-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
              >
                <option value="" disabled>Select a reason</option>
                <option value="Maintenance Work">Maintenance Work</option>
                <option value="Private Use">Private Use</option>
                <option value="Cleaning in Progress">Cleaning in Progress</option>
                <option value="Temporary Safety Issue">Temporary Safety Issue</option>
                <option value="Event Reservation">Event Reservation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* No-conflict / Conflict status */}
            {isValidDateRange && (
              hasConflict ? (
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
              )
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
            <div className={`h-2 ${popupMode === 'confirmDiscard' ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`} />
            <div className="py-14 px-8 text-center">
              <div className={`mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center ${popupMode === 'confirmDiscard' ? 'border-4 border-[#ef4444]' : 'bg-[#22c55e]'}`}>
                {popupMode === 'confirmDiscard'
                  ? <X className="w-8 h-8 text-[#ef4444]" strokeWidth={3} />
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
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
