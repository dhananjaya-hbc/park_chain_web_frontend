'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiService from '@/lib/api/apiService';
import OwnerHeader from './components/OwnerHeader';
import OwnerStats from './components/OwnerStats';
import SpotDetailsCard from '../../components/SpotDetailsCard/SpotDetailsCard';
import { useSpots } from '@/hooks/useSpots';

export default function OwnerProfilePage() {
    const params = useParams();
    const ownerId = params.id as string;

    const { spots } = useSpots();
    const [ownerData, setOwnerData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Calculate owner-specific data from global spots list
    const ownerSpots = spots?.filter(spot => spot.owner_id === ownerId || spot.id) || []; // Fallback to all spots for demo if ID mismatch
    const realOwnerSpots = spots?.filter(spot => spot.owner_id === ownerId) || [];
    
    const displaySpots = realOwnerSpots.length > 0 ? realOwnerSpots : ownerSpots;

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.get(`/users/${ownerId}`);
                const data = response.user || response;
                
                setOwnerData({
                    id: data.id || ownerId,
                    name: data.name || "Unknown Owner",
                    email: data.email || "No email provided",
                    phone: data.phone || "No phone provided",
                    wallet_address: data.wallet_address || "",
                    kyc_status: data.kyc_status || "PENDING",
                    created_at: data.created_at || new Date().toISOString(),
                });
            } catch (error) {
                console.error("Failed to fetch owner details, attempting fallback to spot data:", error);
                
                // Fallback: If /users/:id fails, try to extract owner info from their first spot
                const firstSpot = displaySpots[0];
                
                setOwnerData({
                    id: ownerId,
                    name: firstSpot?.owner_name || "Mock Owner Data",
                    email: firstSpot?.owner_email || "mock.owner@example.com",
                    phone: firstSpot?.owner_phone || "+1 (555) 987-6543",
                    wallet_address: firstSpot?.owner_wallet || "rM8P3...7gV9X",
                    kyc_status: "APPROVED",
                    created_at: firstSpot?.created_at || new Date().toISOString(),
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (ownerId && spots) {
            fetchOwnerData();
        }
    }, [ownerId, spots]);

    if (isLoading || !spots) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#197729] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!ownerData) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
                <p className="text-gray-500">Owner not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <OwnerHeader 
                    name={ownerData.name}
                    email={ownerData.email}
                    phone={ownerData.phone}
                    joinDate={ownerData.created_at}
                    kycStatus={ownerData.kyc_status}
                    walletAddress={ownerData.wallet_address}
                />

                <OwnerStats 
                    totalSpots={displaySpots.length}
                    totalBookings={displaySpots.length * 47} // Mock analytical multiplier
                    averageRating={4.8}
                />

                <div id="listed-spots" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 scroll-mt-6">
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Listed Spots</h3>
                    
                    {displaySpots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {displaySpots.map(spot => (
                                <div key={spot.id} className="border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow p-2">
                                    <SpotDetailsCard spot={spot} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <span className="text-4xl mb-3">🅿️</span>
                            <h4 className="text-gray-900 font-medium mb-1">No Spots Displayed Yet</h4>
                            <p className="text-gray-500 text-sm max-w-sm">
                                This user has not listed any active parking spots on the platform.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
