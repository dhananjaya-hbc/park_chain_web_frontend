"use client";

import React from "react";
import dynamic from "next/dynamic";

interface Spot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  pricePerHour: number;
}

// Hardcoded sample spots — replace with real API data later
const HARDCODED_SPOTS: Spot[] = [
  {
    id: "1",
    name: "Colombo City Parking",
    address: "42 Galle Road, Colombo 03",
    latitude: 6.9101,
    longitude: 79.8534,
    isActive: true,
    pricePerHour: 3.5,
  },
  {
    id: "2",
    name: "Fort Station Lot",
    address: "Station Rd, Colombo 01",
    latitude: 6.9344,
    longitude: 79.8428,
    isActive: true,
    pricePerHour: 2.0,
  },
  {
    id: "3",
    name: "Pettah Market Spot",
    address: "Main St, Pettah, Colombo 11",
    latitude: 6.9389,
    longitude: 79.8536,
    isActive: false,
    pricePerHour: 1.5,
  },
  {
    id: "4",
    name: "Bambalapitiya Bay Park",
    address: "Duplication Rd, Colombo 04",
    latitude: 6.8878,
    longitude: 79.8573,
    isActive: true,
    pricePerHour: 4.0,
  },
];

// Dynamically import the map to avoid SSR issues with Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MapWithNoSSR = dynamic<{ spots: Spot[] }>(
  () => import("./SpotMap") as any,
  { ssr: false }
);

export default function SpotLocationsCard() {
  const spots = HARDCODED_SPOTS;
  const activeCount = spots.filter((s) => s.isActive).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden relative z-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#F9FAFB80]">
        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight tracking-[0.7px]">Spot Locations</h3>
        </div>
        <button className="text-sm font-semibold text-[#2e7d32] bg-[#e8f5e9] hover:bg-[#c8e6c9] px-3 py-1.5 rounded-lg transition-colors">
          View All
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 min-h-0 relative z-0">
        <MapWithNoSSR spots={spots} />
      </div>

      {/* Footer: spot count badge */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
        <span className="w-4 h-4 flex items-center justify-center animate-pulse" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 14.5 20 9.5C20 5.35786 16.6421 2 12.5 2C8.35786 2 5 5.35786 5 9.5C5 14.5 12 22 12 22Z" fill="#41ab5d" stroke="white" strokeWidth="1.8"/>
            <circle cx="12.5" cy="9.5" r="3" fill="white"/>
          </svg>
        </span>
        <span className="text-xs text-gray-500 font-medium">
          {activeCount} active of {spots.length} spots
        </span>
      </div>
    </div>
  );
}
