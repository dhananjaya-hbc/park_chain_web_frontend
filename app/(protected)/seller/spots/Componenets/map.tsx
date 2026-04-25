"use client";

import { useEffect, useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import BaseLeafletMap from "@/components/custom/BaseLeafletMap";

const DEFAULT_CENTER: [number, number] = [6.9271, 79.8612]; // Colombo, Sri Lanka

const createLocationIcon = (color: string, shadow: string, popupY: number) =>
  new L.DivIcon({
    className: "",
    html: `<div style="
      width:50px;height:50px;
      display:flex;align-items:center;justify-content:center;
      filter:drop-shadow(${shadow});
    "><svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 22C12 22 20 14.5 20 9.5C20 5.35786 16.6421 2 12.5 2C8.35786 2 5 5.35786 5 9.5C5 14.5 12 22 12 22Z" fill="${color}" stroke="white" stroke-width="1.8"/>
      <circle cx="12.5" cy="9.5" r="3" fill="white"/>
    </svg></div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 44],
    popupAnchor: [0, popupY],
  });

const activeIcon = createLocationIcon(
  "#41ab5d",
  "0 2px 6px rgba(65,171,93,0.5)",
  -20
);

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

interface SpotMapProps {
  spots: Spot[];
  onView?: (spot: Spot) => void;
  isLoading?: boolean;
}

function FitBounds({ spots }: { spots: Spot[] }) {
  const map = useMap();

  useEffect(() => {
    if (spots.length === 0) return;
    if (spots.length === 1) {
      map.setView([spots[0].latitude, spots[0].longitude], 14);
      return;
    }

    const bounds = L.latLngBounds(spots.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, spots]);

  return null;
}

export default function SpotMap({ spots, onView, isLoading = false }: SpotMapProps) {
  const center = useMemo<[number, number]>(
    () =>
      spots.length > 0
        ? [spots[0].latitude, spots[0].longitude]
        : DEFAULT_CENTER,
    [spots]
  );

  return (
    <div className="relative h-full w-full">
      <BaseLeafletMap className="spot-map" center={center} zoom={12} minHeight="500px">
        <FitBounds spots={spots} />

        {spots.map((spot) => {
            const {
              id,
              latitude,
              longitude,
              hasBooking,
              isBlocked,
              name,
              address,
            } = spot;
            const isActiveStatus = (spot.activeBookings || 0) > 0;
            const statusClass = isActiveStatus
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500";
            const statusLabel = isActiveStatus ? "Active" : "Inactive";

            return (
              <Marker
                key={id}
                position={[latitude, longitude]}
                icon={activeIcon}
              >
                <Popup>
                  <div className="text-xs min-w-[140px]">
                    <p className="font-bold text-gray-900 mb-0.5">{name}</p>
                    <p className="text-gray-500 mb-1">{address}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onView?.(spot)}
                        className="inline-flex items-center justify-center rounded-full border border-[#2e7d32] px-2.5 py-0.5 text-[10px] font-semibold text-[#2e7d32] hover:bg-[#e8f5e9] transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </BaseLeafletMap>

      {isLoading ? (
        <div className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
            Loading spots...
          </div>
        </div>
      ) : null}
    </div>
  );
}