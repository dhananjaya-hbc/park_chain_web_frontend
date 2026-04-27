'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSpots } from '@/hooks/useSpots';
import { 
    AdvancedMarker, 
    InfoWindow, 
    useMap 
} from '@vis.gl/react-google-maps';
import GoogleMapContainer from '@/components/custom/GoogleMapContainer';
import SpotDetailsCard from '../SpotDetailsCard/SpotDetailsCard';

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

/**
 * SpotMap Component
 * 
 * Renders the Google Map view, displaying spot locations as custom markers.
 * Handles marker selection, panning to selected markers, and filtering.
 */
export default function SpotMap({ selectedSpotId, onSpotSelect, searchQuery, filterStatus }: SpotMapProps) {
    const { spots, isLoading, error } = useSpots();
    const [centerLocation, setCenterLocation] = useState<MapLocation | null>(null);

    const defaultCenter: MapLocation = {
        lat: 37.7749,
        lng: -122.4194, 
    };

    // FIX: Added safety checks for undefined titles
    const filteredSpots = useMemo(() => {
        if (!spots) return [];
        
        return spots.filter(spot => {
            // Safe access to strings
            const spotTitle = spot.title || '';
            const query = searchQuery || '';

            // 1. Text match (case-insensitive)
            const matchesSearch = query === '' || spotTitle.toLowerCase().includes(query.toLowerCase());
            
            // 2. Status match (Admin level block uses is_available)
            const isActive = spot.is_available;
            const matchesStatus = 
                filterStatus === 'all' || 
                (filterStatus === 'active' && isActive) || 
                (filterStatus === 'inactive' && !isActive);

            return matchesSearch && matchesStatus;
        });
    }, [spots, searchQuery, filterStatus]);

    // Handle Map Centering
    useEffect(() => {
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
            // Optional: Center on first spot if nothing selected
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
    }, [selectedSpotId, spots]);

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

    const currentCenter = centerLocation && !isNaN(centerLocation.lat) && !isNaN(centerLocation.lng) 
        ? centerLocation 
        : defaultCenter;

    return (
        <div className="w-full h-full relative">
            <GoogleMapContainer
                defaultZoom={13}
                defaultCenter={currentCenter}
                mapId="DEMO_MAP_ID" 
                disableDefaultUI={false}
                gestureHandling={'greedy'}
                streetViewControl={false}
            >
                <MapCenterUpdater center={currentCenter} />

                {filteredSpots.map((spot) => {
                    const lat = Number(spot.latitude);
                    const lng = Number(spot.longitude);
                    
                    if (isNaN(lat) || isNaN(lng)) return null;

                    const isSelected = selectedSpotId === spot.id;
                    
                    const isActive = spot.is_available;
                    const colorClass = isSelected 
                        ? 'text-[#197729]' 
                        : isActive 
                            ? 'text-blue-600' 
                            : 'text-red-500'; 

                    return (
                        <React.Fragment key={spot.id}>
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

                            {isSelected && (
                                <InfoWindow
                                    position={{ lat, lng }}
                                    onCloseClick={() => onSpotSelect('')}
                                    pixelOffset={[0, -38]} 
                                >
                                    <SpotDetailsCard spot={spot} />
                                </InfoWindow>
                            )}
                        </React.Fragment>
                    );
                })}
            </GoogleMapContainer>
        </div>
    );
}
