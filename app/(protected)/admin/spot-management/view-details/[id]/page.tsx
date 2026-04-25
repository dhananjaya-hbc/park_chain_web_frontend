'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdminActions from './components/AdminActions';
import OwnerCard from './components/OwnerCard';
import BookingHistory from './components/BookingHistory';

// You would usually create a ReviewsList component similar to BookingHistory
// For brevity, I'll inline a simple reviews section or you can add ReviewsList.tsx later.

export default function SpotDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const spotId = params.id;

    // MOCK DATA - In a real app, use your `useSpot(spotId)` hook here
    const spotData = {
        id: spotId,
        title: "Downtown Metro Parking",
        address: "123 Market St, San Francisco, CA",
        price: "$6.00 / hr",
        description: "Secure underground parking spot located near the financial district. 24/7 access with surveillance cameras. Suitable for SUVs and Sedans.",
        images: ["/api/placeholder/800/400"], // Placeholder for spot image
        rating: 4.8,
        reviewCount: 124,
        amenities: ["CCTV", "Covered", "24/7 Access", "EV Charging"],
        is_active: true
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 pb-20">
            {/* --- Top Navigation --- */}
            <div className="max-w-7xl mx-auto mb-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center text-sm text-gray-500 hover:text-[#197729] transition-colors mb-4"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    Back to Map
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{spotData.title}</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span>📍 {spotData.address}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-900 font-medium">{spotData.price}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-bold text-gray-900">{spotData.rating}</span>
                            <span className="text-gray-400 text-sm ml-1">({spotData.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Grid Layout --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (2/3 width) - Details & History */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Hero Image */}
                    <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden shadow-sm relative">
                         {/* Replace with <Image /> in real usage */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
                            Spot Image Preview
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            {spotData.amenities.map(amenity => (
                                <span key={amenity} className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 rounded-full shadow-sm">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-900 font-bold text-lg mb-3">About this Spot</h3>
                        <p className="text-gray-600 leading-relaxed">{spotData.description}</p>
                    </div>

                    {/* Booking History Component */}
                    <BookingHistory />
                    
                    {/* Reviews Section (Inline for now) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-900 font-bold text-lg mb-4">Recent Feedback</h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="pb-4 border-b border-gray-50 last:border-0">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-900">User #{100 + i}</span>
                                        <span className="text-xs text-gray-400">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600">"Great spot, easy to find and very secure. Will book again!"</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-2 text-center text-sm text-[#197729] font-medium hover:underline">
                            View All Reviews
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN (1/3 width) - Actions & Owner */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Admin Actions Component */}
                    <AdminActions 
                        initialStatus={spotData.is_active} 
                        onStatusChange={(status) => console.log("New status:", status)}
                    />

                    {/* Owner Card Component */}
                    <OwnerCard />

                    {/* Location Mini Map Placeholder */}
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 h-48 overflow-hidden">
                        <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200 text-sm font-medium rounded-lg border-2 border-dashed border-blue-100">
                            Mini Map View
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
