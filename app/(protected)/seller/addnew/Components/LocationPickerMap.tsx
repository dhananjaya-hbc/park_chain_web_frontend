"use client";

/**
 * LocationPickerMap Component
 * 
 * An interactive Google Map component for selecting parking spot locations.
 * Features:
 * - Click anywhere on the map to capture location coordinates
 * - Auto-centers and animates to selected location
 * - Displays marker at selected position
 * - Uses shared GoogleMapContainer component for consistent Google Maps setup
 */

import { useEffect, useMemo } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import GoogleMapContainer from '@/components/custom/GoogleMapContainer';

// Type alias for [latitude, longitude] coordinates
export type MapPosition = [number, number];

// Props interface for map picker
interface LocationPickerMapProps {
    selectedPosition: MapPosition | null;  // Currently selected location
    onSelect: (position: MapPosition) => void;  // Callback when user selects a location
    readOnly?: boolean;  // When true, disables map click to select
}

// Default map center: Colombo, Sri Lanka
const DEFAULT_CENTER: MapPosition = [6.9271, 79.8612];

/**
 * MapController Hook
 * Listens for map click events and extracts clicked coordinates.
 * Automatically centers and animates the map to selected position.
 */
function MapController({ selectedPosition, onSelect, readOnly = false }: LocationPickerMapProps) {
    const map = useMap();

    // Handle clicks
    useEffect(() => {
        if (!map || readOnly) return;
        
        const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            onSelect([e.latLng.lat(), e.latLng.lng()]);
        });

        return () => {
            google.maps.event.removeListener(clickListener);
        };
    }, [map, onSelect, readOnly]);

    // Handle recentering when position changes
    useEffect(() => {
        if (!map || !selectedPosition) return;
        
        const currentZoom = map.getZoom() || 12;
        const nextZoom = currentZoom < 14 ? 14 : currentZoom;
        
        map.panTo({ lat: selectedPosition[0], lng: selectedPosition[1] });
        map.setZoom(nextZoom);
    }, [map, selectedPosition]);

    return null;
}

export default function LocationPickerMap({ selectedPosition, onSelect, readOnly = false }: LocationPickerMapProps) {
    const center = useMemo(
        () => (selectedPosition ? { lat: selectedPosition[0], lng: selectedPosition[1] } : { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] }),
        [selectedPosition]
    );

    return (
        <GoogleMapContainer 
            defaultCenter={center} 
            defaultZoom={12} 
            mapId="seller_location_picker_map" 
            gestureHandling={readOnly ? "none" : "greedy"}
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
        >
            <MapController selectedPosition={selectedPosition} onSelect={onSelect} readOnly={readOnly} />

            {/* Display custom styled marker at selected location */}
            {selectedPosition && (
                <AdvancedMarker position={{ lat: selectedPosition[0], lng: selectedPosition[1] }}>
                    <div className="relative flex items-center justify-center w-12 h-12 pointer-events-none">
                        {/* Outer pulse effect */}
                        <div className="absolute inset-0 bg-[#2e7d32] rounded-full opacity-20 animate-ping" />
                        
                        {/* Inner pin */}
                        <div className="absolute w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center bg-[#2e7d32]">
                            <span className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                    </div>
                </AdvancedMarker>
            )}
        </GoogleMapContainer>
    );
}

