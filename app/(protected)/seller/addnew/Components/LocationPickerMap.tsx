"use client";

/**
 * LocationPickerMap Component
 * 
 * An interactive Leaflet map component for selecting parking spot locations.
 * Features:
 * - Click anywhere on the map to capture location coordinates
 * - Auto-centers and animates to selected location
 * - Displays marker at selected position
 * - Uses shared BaseLeafletMap component for consistent Leaflet setup
 */

import { useEffect } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import BaseLeafletMap from '@/components/custom/BaseLeafletMap';

// Type alias for [latitude, longitude] coordinates
export type MapPosition = [number, number];

// Props interface for map picker
interface LocationPickerMapProps {
    selectedPosition: MapPosition | null;  // Currently selected location
    onSelect: (position: MapPosition) => void;  // Callback when user selects a location
}

// Default map center: Colombo, Sri Lanka
const DEFAULT_CENTER: MapPosition = [6.9271, 79.8612];

/**
 * MapClickHandler Hook
 * Listens for map click events and extracts clicked coordinates.
 * Calls onSelect callback with latitude and longitude of clicked point.
 */
function MapClickHandler({ onSelect }: { onSelect: (position: MapPosition) => void }) {
    useMapEvents({
        click(event) {
            // Capture clicked coordinates and pass to parent
            onSelect([event.latlng.lat, event.latlng.lng]);
        },
    });

    return null;
}

/**
 * RecenterMap Hook
 * Automatically centers and animates the map to selected position.
 * Ensures minimum zoom level of 14 for better visibility.
 */
function RecenterMap({ selectedPosition }: { selectedPosition: MapPosition | null }) {
    const map = useMap();

    useEffect(() => {
        if (!selectedPosition) return;  // Do nothing if no position selected
        // Set zoom to 14 if currently lower, otherwise maintain current zoom
        const nextZoom = map.getZoom() < 14 ? 14 : map.getZoom();
        // Smoothly animate map to selected position
        map.flyTo(selectedPosition, nextZoom, { animate: true });
    }, [map, selectedPosition]);

    return null;
}

export default function LocationPickerMap({ selectedPosition, onSelect }: LocationPickerMapProps) {
    return (
        <BaseLeafletMap
            center={selectedPosition ?? DEFAULT_CENTER}  // Center on selected position or default to Colombo
            zoom={12}
            minHeight="230px"
        >
            {/* Listen for map clicks and capture coordinates */}
            <MapClickHandler onSelect={onSelect} />
            {/* Auto-center map when location is selected */}
            <RecenterMap selectedPosition={selectedPosition} />

            {/* Display marker at selected location */}
            {selectedPosition && <Marker position={selectedPosition} />}
        </BaseLeafletMap>
    );
}
