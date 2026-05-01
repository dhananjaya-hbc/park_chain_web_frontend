'use client';

import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import GoogleMapContainer from '@/components/custom/GoogleMapContainer';

interface MiniMapProps {
    latitude: number;
    longitude: number;
}

export default function MiniMap({ latitude, longitude }: MiniMapProps) {
    if (isNaN(latitude) || isNaN(longitude)) {
        return (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-medium rounded-lg border-2 border-dashed border-gray-200">
                Invalid Coordinates
            </div>
        );
    }

    const center = { lat: latitude, lng: longitude };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 z-10"></div>
            <GoogleMapContainer
                defaultZoom={15}
                defaultCenter={center}
                mapId="MINI_MAP_ID"
                disableDefaultUI={true}
                gestureHandling="none"
                keyboardShortcuts={false}
            >
                <AdvancedMarker position={center} zIndex={1}>
                    <div className="relative flex justify-center items-center -mt-6">
                        <svg 
                            className="text-[#197729] drop-shadow-md" 
                            width="32" height="32" viewBox="0 0 24 24" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>
                </AdvancedMarker>
            </GoogleMapContainer>
        </div>
    );
}
