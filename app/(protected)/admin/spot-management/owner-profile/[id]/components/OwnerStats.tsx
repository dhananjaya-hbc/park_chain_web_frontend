'use client';

import React from 'react';

interface OwnerStatsProps {
    totalSpots: number;
    totalBookings: number;
    averageRating: number;
}

export default function OwnerStats({ totalSpots, totalBookings, averageRating }: OwnerStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    🏢
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Spots Listed</p>
                    <p className="text-2xl font-bold text-gray-900">{totalSpots}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">
                    🚗
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                    ⭐
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                </div>
            </div>
        </div>
    );
}
