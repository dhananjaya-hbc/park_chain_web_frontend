'use client';

import React, { useState } from 'react';
import SpotMap from './MapView/SpotMap';
import MapSearchBar from './SearchBar/MapSearchBar';

export default function Main() {
    const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        // Wrapper for the full page map
        <div className="relative w-full h-[80vh] min-h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 mt-4">

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
            
                {/* Modular Search and Filter Bar Component */}
                <MapSearchBar 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                />
            </div>
            
            {/* Google Map Full Container */}
            <SpotMap 
                selectedSpotId={selectedSpotId}
                onSpotSelect={setSelectedSpotId}
                searchQuery={searchQuery}
                filterStatus={filterStatus}
            />
        </div>
    );
}