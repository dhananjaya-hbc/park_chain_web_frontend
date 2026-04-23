'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSpots } from '@/hooks/useSpots';
import { 
    APIProvider, 
    Map, 
    AdvancedMarker, 
    InfoWindow, 
    useMap 
} from '@vis.gl/react-google-maps';

interface MapLocation {
    lat: number;
    lng: number;
}

interface SpotMapProps {
    selectedSpotId: string | null;
    onSpotSelect: (spotId: string) => void;
    searchQuery: string;
    filterStatus: 'all' | 'active' | 'inactive';
}

/**
 * Sub-component to handle panning the Google Map when a spot is selected
 */
function MapCenterUpdater({ center }: { center: MapLocation | null }) {
    const map = useMap();

    useEffect(() => {
        if (map && center && !isNaN(center.lat) && !isNaN(center.lng)) {
            map.panTo(center);
        }
    }, [center, map]);

    return null;
}

export default function SpotMap({ selectedSpotId, onSpotSelect, searchQuery, filterStatus }: SpotMapProps) {
    const { spots, isLoading, error } = useSpots();
    const [centerLocation, setCenterLocation] = useState<MapLocation | null>(null);

    const defaultCenter: MapLocation = {
        lat: 37.7749,
        lng: -122.4194, // San Francisco default
    };

    // Filter spots based on Search Query and Status
    const filteredSpots = useMemo(() => {
        if (!spots) return [];
        
        return spots.filter(spot => {
            // 1. Text match (case-insensitive)
            const matchesSearch = searchQuery === '' || spot.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            // 2. Status match
            const matchesStatus = 
                filterStatus === 'all' || 
                (filterStatus === 'active' && spot.is_available) || 
                (filterStatus === 'inactive' && !spot.is_available);

            return matchesSearch && matchesStatus;
        });
    }, [spots, searchQuery, filterStatus]);

    // Handle Map Centering
    useEffect(() => {
        // Use the raw 'spots' array instead of 'filteredSpots' to prevent the map 
        // from jumping around wildly when typing in the search bar.
        if (selectedSpotId && spots) {
            const selectedSpot = spots.find(spot => spot.id === selectedSpotId);
            if (selectedSpot) {
                const lat = Number(selectedSpot.latitude);
                const lng = Number(selectedSpot.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    setCenterLocation(prev => {
                        if (prev?.lat === lat && prev?.lng === lng) return prev;
                        return { lat, lng };
                    });
                }
            }
        } else if (spots && spots.length > 0) {
            const firstSpot = spots[0];
            const lat = Number(firstSpot.latitude);
            const lng = Number(firstSpot.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setCenterLocation(prev => {
                    if (prev) return prev; 
                    return { lat, lng };
                });
            }
        }
    }, [selectedSpotId, spots]); // Safely depending strictly on the selected ID and raw data

    // Data Loading state
    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#197729] mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading map...</p>
                </div>
            </div>
        );
    }

    // Data Error state
    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-red-50/50">
                <div className="text-center p-6">
                    <div className="text-red-500 text-4xl mb-3">⚠️</div>
                    <p className="text-red-600 font-semibold mb-2">Error loading spots</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // API Key Check
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-gray-50">
                <p className="text-red-500 font-medium">Google Maps API key is missing in .env.local</p>
            </div>
        );
    }

    // Fallback logic for map center just in case
    const currentCenter = centerLocation && !isNaN(centerLocation.lat) && !isNaN(centerLocation.lng) 
        ? centerLocation 
        : defaultCenter;

    return (
        <APIProvider apiKey={apiKey}>
            <div className="w-full h-full relative">
                <Map
                    defaultZoom={13}
                    defaultCenter={currentCenter}
                    mapId="DEMO_MAP_ID" // Required for AdvancedMarkers
                    disableDefaultUI={false}
                    gestureHandling={'greedy'}
                    streetViewControl={false}
                >
                    <MapCenterUpdater center={currentCenter} />

                    {filteredSpots.map((spot) => {
                        // Ensure coords are valid numbers before rendering the marker
                        const lat = Number(spot.latitude);
                        const lng = Number(spot.longitude);
                        
                        if (isNaN(lat) || isNaN(lng)) return null;

                        const isSelected = selectedSpotId === spot.id;
                        
                        // Determine marker color
                        const colorClass = isSelected 
                            ? 'text-[#197729]' // Selected (Green)
                            : spot.is_available 
                                ? 'text-blue-600' // Available
                                : 'text-gray-400'; // Inactive

                        return (
                            <React.Fragment key={spot.id}>
                                {/* Custom SVG Marker */}
                                <AdvancedMarker
                                    position={{ lat, lng }}
                                    onClick={() => onSpotSelect(spot.id)}
                                    zIndex={isSelected ? 50 : 1}
                                >
                                    <div className="relative flex justify-center items-center -mt-8 cursor-pointer">
                                        <svg 
                                            className={`${colorClass} transition-colors duration-200 drop-shadow-lg`} 
                                            width="36" height="36" viewBox="0 0 24 24" fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                </AdvancedMarker>

                                {/* Popup Window - Shows only for the selected spot */}
                                {isSelected && (
                                    <InfoWindow
                                        position={{ lat, lng }}
                                        onCloseClick={() => onSpotSelect('')}
                                        pixelOffset={[0, -38]} // Shifts popup slightly above the marker
                                    >
                                        <div className="min-w-[200px] max-w-[250px] p-1 font-sans">
                                            <p className="font-bold text-gray-900 text-base mb-1">
                                                {spot.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                                                📍 {spot.address}
                                            </p>
                                            
                                            {/* Capacity and Availability */}
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Capacity</p>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {spot.total_slots}
                                                    </p>
                                                </div>
                                                <div className="bg-[#197729]/10 p-2 rounded-md border border-[#197729]/20">
                                                    <p className="text-[10px] text-[#197729]/80 uppercase tracking-wide mb-1">Available</p>
                                                    <p className="font-bold text-[#197729] text-sm">
                                                        {spot.available_slots}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price and Status */}
                                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                                                <span className="text-sm font-bold text-gray-900">
                                                    ${spot.prices_per_hour[0]}<span className="text-xs text-gray-500 font-normal">/hr</span>
                                                </span>
                                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${
                                                    spot.is_available
                                                        ? 'bg-green-100 text-[#197729]'
                                                        : 'bg-red-50 text-red-600'
                                                }`}>
                                                    {spot.is_available ? '✓ Active' : '✗ Inactive'}
                                                </span>
                                            </div>

                                            {/* Owner Info */}
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Owner</p>
                                                <p className="text-xs font-medium text-gray-700">{spot.owner_name}</p>
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Map>
            </div>
        </APIProvider>
    );
}