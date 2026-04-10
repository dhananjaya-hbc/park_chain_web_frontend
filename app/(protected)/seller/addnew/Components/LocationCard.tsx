"use client";

/**
 * LocationCard Component
 * 
 * A location picker card for sellers to select parking spot locations.
 * Features:
 * - Search for locations by place name or address using OpenStreetMap Nominatim API
 * - Click on the interactive map to select a location
 * - Auto-fills latitude and longitude fields based on selected location
 * - Used in the seller "Add New Parking Spot" form
 */

import React, { FormEvent, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import type { MapPosition } from './LocationPickerMap';

// Dynamically import map component to avoid SSR issues with Leaflet
const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[260px] w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 animate-pulse" />
    ),
});

// Type definition for OpenStreetMap Nominatim API response
interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

interface LocationCardProps {
    latitude: string;
    longitude: string;
    setLocation: (latitude: string, longitude: string) => void;
}

export default function LocationCard({ latitude, longitude, setLocation }: LocationCardProps) {
    // State: user's search input text
    const [searchQuery, setSearchQuery] = useState('');
    // State: whether location search is in progress
    const [isSearching, setIsSearching] = useState(false);
    // State: error message from failed search attempt
    const [searchError, setSearchError] = useState('');

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

    // Handler: called when user clicks on map to select a location
    const handleLocationSelect = (position: MapPosition) => {
        setLocation(String(position[0]), String(position[1]));
        setSearchError('');  // Clear any previous search errors
    };

    // Memoized: convert selected position to [lat, lng] for map
    const selectedPosition = useMemo<MapPosition | null>(
        () => (latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null),
        [latitude, longitude]
    );

    // Handler: performs location search via OpenStreetMap Nominatim API
    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;

        setIsSearching(true);
        setSearchError('');

        try {
            // Query OpenStreetMap Nominatim API for location
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                throw new Error('Unable to find location');
            }

            // Parse response and check if results exist
            const data = (await response.json()) as NominatimResult[];
            if (!data.length) {
                setSearchError('No location found. Try a more specific place name.');
                return;
            }

            // Extract latitude and longitude from first result
            const lat = Number(data[0].lat);
            const lon = Number(data[0].lon);
            if (isNaN(lat) || isNaN(lon)) {
                setSearchError('Invalid location data received.');
                return;
            }

            // Update selected position and coordinates
            setLocation(String(lat), String(lon));
        } catch {
            setSearchError('Location search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative z-0">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
                <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">Location</h2>
            </div>

            <div className="space-y-4">

                <form onSubmit={handleSearch} className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Search Location</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search by place name or address"
                                className="w-full h-11 rounded-lg border border-gray-300 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="h-11 px-4 rounded-lg bg-[#2e7d32] hover:bg-[#1b5e20] disabled:bg-[#7cbf80] text-white text-sm font-medium transition-colors"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    {searchError ? <p className="text-xs text-red-600">{searchError}</p> : null}
                </form>

                <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 relative z-0">
                    <LocationPickerMap selectedPosition={selectedPosition} onSelect={handleLocationSelect} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                        <input
                            type="text"
                            value={displayLatitude}
                            readOnly
                            placeholder="Auto-filled from map"
                            className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                        <input
                            type="text"
                            value={displayLongitude}
                            readOnly
                            placeholder="Auto-filled from map"
                            className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
