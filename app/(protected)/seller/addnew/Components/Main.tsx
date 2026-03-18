import React from 'react';
import AdminReviewAlert from './AdminReviewAlert';
import GeneralInfoCard from './GeneralInfoCard';
import LocationDetailsCard from './LocationDetailsCard';
import AmenitiesCard from './AmenitiesCard';
import PricingCapacityCard from './PricingCapacityCard';
import SpotImagesCard from './SpotImagesCard';
import FinalizeCard from './FinalizeCard';

export default function Main() {
    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Parking Spot</h1>
                <p className="text-sm text-gray-500">Configure your new location details and availability below.</p>
            </div>

            {/* Alert */}
            <AdminReviewAlert />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    <GeneralInfoCard />
                    <LocationDetailsCard />
                    <AmenitiesCard />
                    <PricingCapacityCard />
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">
                    <SpotImagesCard />
                    <FinalizeCard />
                </div>
            </div>
        </>
    );
}
