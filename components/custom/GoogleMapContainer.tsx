'use client';

import React from 'react';
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';

export interface GoogleMapContainerProps extends MapProps {
    children?: React.ReactNode;
    fallbackClass?: string;
}

/**
 * GoogleMapContainer
 * 
 * Reusable wrapper for Google Maps. Validates the API key and renders the
 * standard Map context. Pass any @vis.gl/react-google-maps MapProps.
 */
export default function GoogleMapContainer({ 
    children, 
    fallbackClass = "w-full h-full bg-red-50 flex items-center justify-center text-red-400 text-sm font-medium rounded-lg border-2 border-dashed border-red-100",
    ...mapProps 
}: GoogleMapContainerProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className={fallbackClass}>
                Map API Key Missing in .env.local
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map {...mapProps}>
                {children}
            </Map>
        </APIProvider>
    );
}
