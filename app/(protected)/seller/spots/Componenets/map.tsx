"use client";

import { useEffect, useMemo, useState } from "react";
import { AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import GoogleMapContainer from "@/components/custom/GoogleMapContainer";

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 }; // Colombo, Sri Lanka

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
  isBlocked?: boolean;
  isBlockedBySeller?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
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
  const coreLibrary = useMapsLibrary("core");

  useEffect(() => {
    if (!map || !coreLibrary) return;
    if (spots.length === 0) return;
    if (spots.length === 1) {
      map.setCenter({ lat: spots[0].latitude, lng: spots[0].longitude });
      map.setZoom(14);
      return;
    }

    const bounds = new coreLibrary.LatLngBounds();
    spots.forEach((s) => bounds.extend({ lat: s.latitude, lng: s.longitude }));
    map.fitBounds(bounds, 40);
  }, [map, coreLibrary, spots]);

  return null;
}

export default function SpotMap({ spots, onView, isLoading = false }: SpotMapProps) {
  const center = useMemo(
    () =>
      spots.length > 0
        ? { lat: spots[0].latitude, lng: spots[0].longitude }
        : DEFAULT_CENTER,
    [spots]
  );

  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 flex-shrink-0">
      <div className="absolute inset-0">
        <GoogleMapContainer
          defaultCenter={center}
          defaultZoom={12}
          mapId="seller_spots_map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          <FitBounds spots={spots} />

          {spots.map((spot) => {
            const {
              id,
              latitude,
              longitude,
              name,
              address,
            } = spot;
            const isActiveStatus = (spot.activeBookings || 0) > 0;
            const isSellerBlocked = spot.isBlockedBySeller;
            const isAdminBlocked = spot.isBlocked || spot.isAvailable === false;
            const statusClass = isSellerBlocked
              ? "bg-orange-100 text-orange-700 border-orange-200"
              : isAdminBlocked
                ? "bg-red-100 text-red-700 border-red-200"
                : isActiveStatus
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-gray-100 text-gray-600 border-gray-200";
            const statusLabel = isSellerBlocked
              ? "Blocked"
              : isAdminBlocked
                ? "Blocked"
                : isActiveStatus ? "Active" : "Inactive";

            const isSelected = activeSpotId === id;

            return (
              <AdvancedMarker
                key={id}
                position={{ lat: latitude, lng: longitude }}
                onClick={() => setActiveSpotId(id)}
                zIndex={isSelected ? 1000 : 1}
              >
                <div className="relative flex items-center justify-center w-12 h-12 cursor-pointer group">
                  {/* Outer pulse effect */}
                  <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${isSellerBlocked ? 'bg-orange-400' : isAdminBlocked ? 'bg-red-600' : 'bg-[#2e7d32]'}`} />

                  {/* Inner pin */}
                  <div className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all duration-300 ease-out ${
                    isSellerBlocked
                      ? (isSelected ? 'bg-orange-400 scale-125' : 'bg-orange-300 group-hover:scale-110')
                      : isAdminBlocked 
                        ? (isSelected ? 'bg-red-800 scale-125' : 'bg-red-600 group-hover:scale-110')
                        : (isSelected ? 'bg-[#1b5e20] scale-125' : 'bg-[#2e7d32] group-hover:scale-110')
                  }`}>
                    <span className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                </div>

                {isSelected && (
                  <InfoWindow
                    position={{ lat: latitude, lng: longitude }}
                    onCloseClick={() => setActiveSpotId(null)}
                    pixelOffset={[0, -24]}
                  >
                    <div className="text-sm min-w-[180px] p-2 font-sans flex flex-col gap-2">
                      <div>
                        <p className="font-bold text-gray-900 leading-tight mb-1">{name}</p>
                        <p className="text-xs text-gray-500 leading-snug line-clamp-2">{address}</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => onView?.(spot)}
                          className="inline-flex items-center justify-center rounded-full bg-[#2e7d32] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1b5e20] transition-colors shadow-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </AdvancedMarker>
            );
          })}
        </GoogleMapContainer>
      </div>

      {isLoading ? (
        <div className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="rounded-full border border-gray-200 bg-white/90 px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            Loading spots...
          </div>
        </div>
      ) : null}
    </div>
  );
}