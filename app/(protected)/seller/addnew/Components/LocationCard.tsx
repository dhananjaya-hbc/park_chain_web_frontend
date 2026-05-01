"use client";

/**
 * LocationCard Component
 *
 * A location display card for sellers showing the parking spot location.
 * When `readOnly` is true (pre-filled from KYB data):
 *   - No search bar or search button
 *   - Map is view-only (no click to pin)
 *   - Lat/Lng fields are disabled
 *   - An info badge confirms auto-fill from KYB
 */

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import type { MapPosition } from './LocationPickerMap';

// Dynamically import map component to avoid SSR issues with Google Maps
const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[260px] w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 animate-pulse" />
    ),
}); 

interface LocationCardProps {
    latitude: string;
    longitude: string;
    setLocation: (latitude: string, longitude: string) => void;
    isPricingPartial?: boolean;
    readOnly?: boolean; // When true: no search, no map clicking, fields disabled
}

export default function LocationCard({ latitude, longitude, setLocation, isPricingPartial, readOnly = false }: LocationCardProps) {
    // Memoized: latitude formatted to 6 decimal places for display
    const displayLatitude = useMemo(
        () => (latitude ? parseFloat(latitude).toFixed(6) : ''),
        [latitude]
    );
    // Memoized: longitude formatted to 6 decimal places for display
    const displayLongitude = useMemo(
        () => (longitude ? parseFloat(longitude).toFixed(6) : ''),
        [longitude]
    );

    // Handler: called when user clicks on map (only active when not readOnly)
    const handleLocationSelect = (position: MapPosition) => {
        if (readOnly) return;
        setLocation(String(position[0]), String(position[1]));
    };

    // Memoized: convert selected position to [lat, lng] for map
    const selectedPosition = useMemo<MapPosition | null>(
        () => (latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null),
        [latitude, longitude]
    );

    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-6 pb-12 shadow-sm relative z-0${isPricingPartial ? ' flex-1' : ''}`}>
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
                <h2 className="text-sm font-bold text-gray-900 leading-tight tracking-[0.7px]">Location</h2>
            </div>

            <div className="space-y-4">
                {/* Read-only info text */}
                {readOnly && (
                    <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        Location is automatically set from your KYB submission and cannot be edited.
                    </p>
                )}

                <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 relative z-0">
                    <LocationPickerMap
                        selectedPosition={selectedPosition}
                        onSelect={handleLocationSelect}
                        readOnly={readOnly}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                        <input
                            type="text"
                            value={displayLatitude}
                            readOnly
                            disabled={readOnly}
                            placeholder="Auto-filled from KYB"
                            className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder:text-gray-400 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                        <input
                            type="text"
                            value={displayLongitude}
                            readOnly
                            disabled={readOnly}
                            placeholder="Auto-filled from KYB"
                            className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder:text-gray-400 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
