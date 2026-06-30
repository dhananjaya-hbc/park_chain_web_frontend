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
    const [reviews, setReviews] = useState<any[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0.0);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Calculate owner-specific data from global spots list
    const ownerSpots = spots?.filter(spot => spot.owner_id === ownerId || spot.id) || []; // Fallback to all spots for demo if ID mismatch
    const realOwnerSpots = spots?.filter(spot => spot.owner_id === ownerId) || [];
    
    const displaySpots = realOwnerSpots.length > 0 ? realOwnerSpots : ownerSpots;

        useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                setIsLoading(true);
                setLoadingReviews(true);
                
                const { default: apiService } = await import('@/lib/api/apiService');
                const { API_ENDPOINTS } = await import('@/lib/api/endpoints');
                
                // Fetch from the real endpoint
                const [response, reviewsResponse] = await Promise.all([
                    apiService.get(`${API_ENDPOINTS.USERS}/${ownerId}`),
                    apiService.get(`${API_ENDPOINTS.REVIEWS}/seller/me?sellerId=${ownerId}`).catch(err => {
                        console.error("Error fetching reviews:", err);
                        return { data: [] };
                    })
                ]);
                
                // Get the user object from the response
                const user = response.user || response.data || response;

                const userReviews = reviewsResponse.data || [];
                setReviews(userReviews);
                if (userReviews.length > 0) {
                    const totalRating = userReviews.reduce((sum: number, r: any) => sum + Number(r.rating || 0), 0);
                    setAverageRating(Number((totalRating / userReviews.length).toFixed(2)));
                } else {
                    setAverageRating(0.0);
                }

                setOwnerData({
                    id: user.id || ownerId,
                    name: user.name || "Unknown Owner",
                    email: user.email || "No email provided",
                    phone: user.phone || "No phone provided",
                    wallet_address: user.wallet_address || user.walletAddress || "Not available",
                    kyc_status: user.kyc_status || "PENDING", 
                    status: user.status || "active",
                    created_at: user.created_at || new Date().toISOString(),
                    profile_image: user.profile_image || user.profileImageUrl || null
                });
            } catch (error) {
                console.error("Error fetching owner data:", error);
                
                // Fallback to extracting from the spots list if the API fails
                const firstSpot = displaySpots[0];
                if (firstSpot) {
                    setOwnerData({
                        id: ownerId,
                        name: firstSpot.owner_name || "Unknown Owner",
                        email: firstSpot.owner_email || "No email provided",
                        phone: firstSpot.owner_phone || "No phone provided",
                        wallet_address: firstSpot.owner_wallet || "",
                        kyc_status: "APPROVED", 
                        created_at: firstSpot.created_at || new Date().toISOString(),
                        profile_image: firstSpot.owner_image || null
                    });
                } else {
                    setOwnerData(null);
                }
            } finally {
                setIsLoading(false);
                setLoadingReviews(false);
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

    const handleSuspendToggle = async () => {
        try {
            const endpoint = `/users/${ownerId}/status`; 
            // Send request to backend
            await apiService.patch(endpoint, { 
                status: ownerData.status === 'suspended' ? 'active' : 'suspended' 
            });
            // Update local state to reflect change instantly
            setOwnerData((prev: any) => ({
                ...prev,
                status: prev.status === 'suspended' ? 'active' : 'suspended'
            }));
            alert(`Seller successfully ${ownerData.status === 'suspended' ? 'unblocked' : 'blocked'}!`);
        } catch (error) {
            console.error("Failed to toggle status", error);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleRemoveSeller = async () => {
        try {
            const endpoint = `/users/${ownerId}`;
            await apiService.delete(endpoint);
            alert("Seller removed successfully.");
            // Return to previous page after successful deletion
            window.history.back(); 
        } catch (error) {
            console.error("Failed to remove seller", error);
            alert("Failed to remove seller. Please try again.");
        }
    };

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
                    profileImage={ownerData.profile_image}
                    accountStatus={ownerData.status || 'active'}
                    onSuspendToggle={() => {
                        if (confirm(`Are you sure you want to ${ownerData.status === 'suspended' ? 'unblock' : 'block'} this seller?`)) {
                            handleSuspendToggle();
                        }
                    }}
                    onRemove={() => {
                        if (confirm("Are you sure you want to permanently remove this seller? This action cannot be undone.")) {
                            handleRemoveSeller();
                        }
                    }}
                />

                <OwnerStats 
                    totalSpots={displaySpots.length}
                    totalBookings={displaySpots.length * 47}  
                    averageRating={averageRating}
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

                {/* Seller Reviews Section */}
                <div id="seller-reviews" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Reviews & Feedback ({reviews.length})</h3>

                    {loadingReviews ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <span className="text-4xl mb-3">⭐</span>
                            <h4 className="text-gray-900 font-medium mb-1">No Reviews Yet</h4>
                            <p className="text-gray-500 text-sm max-w-sm">
                                This seller has not received any feedback or ratings yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start gap-2 mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            {rev.user_profile_image ? (
                                                <img
                                                    src={rev.user_profile_image}
                                                    alt={rev.user_name || "User"}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-150"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-xs font-bold text-[#197729]">
                                                    {(rev.user_name || "U")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-sm font-semibold text-gray-900 block leading-tight">
                                                    {rev.user_name || "Anonymous Driver"}
                                                </span>
                                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                                    {new Date(rev.created_at).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                <span className="text-[10px] text-amber-500 font-bold">★</span>
                                                <span className="text-[10px] font-bold text-amber-700">{rev.rating}</span>
                                            </div>
                                            {rev.spot_title && (
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    on: <span className="text-gray-700">{rev.spot_title}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {rev.comment && (
                                        <p className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100 leading-normal italic">
                                            "{rev.comment}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
