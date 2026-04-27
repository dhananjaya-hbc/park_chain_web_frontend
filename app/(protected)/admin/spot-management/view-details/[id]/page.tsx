'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminActions from './components/AdminActions';
import OwnerCard from './components/OwnerCard';
import BookingHistory from './components/BookingHistory';
import SpotHeader from './components/SpotHeader';
import HeroImageCarousel from './components/HeroImageCarousel';
import ReviewsList from './components/ReviewsList';
import MiniMap from './components/MiniMap';

export default function SpotDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const spotId = params.id;

    const [spotData, setSpotData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSpotData = async () => {
            try {
                setIsLoading(true);
                // Dynamically import apiService and endpoints to avoid top-level issues if not needed
                const { default: apiService } = await import('@/lib/api/apiService');
                const { API_ENDPOINTS } = await import('@/lib/api/endpoints');
                
                const response = await apiService.get(`${API_ENDPOINTS.SPOTS}/${spotId}`);
                const rawSpot = response.spot || response;
                
                // Ensure images are properly parsed if they come as stringified JSON or Postgres strings
                const normalizeImages = (val: any): string[] => {
                    if (Array.isArray(val)) return val;
                    if (typeof val === 'string') {
                        try {
                            const parsed = JSON.parse(val);
                            if (Array.isArray(parsed)) return parsed;
                        } catch(e) {}
                        // Fallback for CSV or Postgres array "{url1,url2}"
                        return val.replace(/^\{|\}$/g, '').split(',').map(s => s.trim()).filter(Boolean);
                    }
                    return [];
                };
                const fetchedImages = normalizeImages(rawSpot.image_urls || rawSpot.imageUrls);

                setSpotData({
                    id: rawSpot.id || spotId,
                    title: rawSpot.name || rawSpot.title || "Unknown Spot",
                    address: rawSpot.address || "No address provided",
                    price: rawSpot.pricePerHour || rawSpot.prices_per_hour?.[0] ? `${rawSpot.pricePerHour || rawSpot.prices_per_hour[0]} XRP / hr` : "N/A",
                    description: rawSpot.description || "No description available.",
                    images: fetchedImages.length > 0 ? fetchedImages : ["/api/placeholder/800/400"],
                    rating: rawSpot.rating || 4.8,
                    reviewCount: rawSpot.reviewCount || 124,
                    amenities: rawSpot.amenities || ["CCTV", "Covered", "24/7 Access", "EV Charging"],
                    is_active: rawSpot.is_available !== false, // Maps admin status to is_available
                    latitude: Number(rawSpot.latitude) || 37.7749,
                    longitude: Number(rawSpot.longitude) || -122.4194,
                    owner_name: rawSpot.owner_name || rawSpot.ownerName || "Unknown Owner",
                    owner_email: rawSpot.owner_email || rawSpot.ownerEmail || "No email provided",
                    owner_phone: rawSpot.owner_phone || rawSpot.ownerPhone || "No phone provided",
                    owner_id: rawSpot.owner_id || rawSpot.ownerId,
                    created_at: rawSpot.owner_created_at || rawSpot.ownerCreatedAt || rawSpot.created_at || new Date().toISOString()
                });
            } catch (error) {
                console.error("Failed to fetch spot details:", error);
                // Fallback to mock data on error for development purposes
                setSpotData({
                    id: spotId,
                    title: "Downtown Metro Parking",
                    address: "123 Market St, San Francisco, CA",
                    price: "$6.00 / hr",
                    description: "Secure underground parking spot located near the financial district. 24/7 access with surveillance cameras. Suitable for SUVs and Sedans.",
                    images: ["/api/placeholder/800/400"],
                    rating: 4.8,
                    reviewCount: 124,
                    amenities: ["CCTV", "Covered", "24/7 Access", "EV Charging"],
                    is_active: true,
                    owner_name: "Mock Owner",
                    owner_email: "mock@example.com",
                    owner_phone: "+1 555-0000",
                    created_at: new Date().toISOString()
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (spotId) {
            fetchSpotData();
        }
    }, [spotId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#197729] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!spotData) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
                <p className="text-gray-500">Spot not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 pb-20">
            {/* --- Top Navigation & Header --- */}
            <SpotHeader 
                title={spotData.title}
                address={spotData.address}
                price={spotData.price}
                rating={spotData.rating}
                reviewCount={spotData.reviewCount}
                onBack={() => router.back()}
            />

            {/* --- Main Grid Layout --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (2/3 width) - Details & History */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Hero Image Carousel */}
                    <HeroImageCarousel 
                        images={spotData.images} 
                        title={spotData.title} 
                        amenities={spotData.amenities} 
                    />

                    {/* Description */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-900 font-bold text-lg mb-3">About this Spot</h3>
                        <p className="text-gray-600 leading-relaxed">{spotData.description}</p>
                    </div>

                    {/* Booking History Component */}
                    <BookingHistory spotId={spotData.id} />
                    
                    {/* Reviews List Component */}
                    <ReviewsList />
                </div>

                {/* RIGHT COLUMN (1/3 width) - Actions & Owner */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Admin Actions Component */}
                    <AdminActions 
                        spotId={spotData.id}
                        initialStatus={spotData.is_active} 
                        onStatusChange={(status) => console.log("New status:", status)}
                    />

                    {/* Owner Card Component */}
                    <OwnerCard 
                        ownerId={spotData.owner_id}
                        name={spotData.owner_name}
                        email={spotData.owner_email}
                        phone={spotData.owner_phone}
                        joinDate={spotData.created_at}
                    />

                    {/* Location Mini Map */}
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 h-48 overflow-hidden">
                        <MiniMap 
                            latitude={spotData.latitude} 
                            longitude={spotData.longitude} 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
