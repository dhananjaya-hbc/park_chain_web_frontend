import React from 'react';
import SpotLocationsCard from '../dashboard/Components/SpotLocationsCard';

export default function SellerSpotsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Spots</h1>
            <div className="relative z-0 max-w-4xl">
                <SpotLocationsCard />
            </div>
        </div>
    );
}