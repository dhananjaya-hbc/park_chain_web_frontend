'use client';

import React, { useState } from 'react';
import KycModal from './components/KycModal';
import GeneralInfo from './components/GeneralInfo';
import PricingCapacity from './components/PricingCapacity';
import FeaturesAmenities from './components/FeaturesAmenities';
import SpotImages from './components/SpotImages';
import FinalizeAction from './components/FinalizeAction';

export default function SellerNewPage() {
    const [isKycVerified, setIsKycVerified] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 relative">
            
            {/* KYC Modal Popup */}
            {!isKycVerified && (
                <KycModal onComplete={() => setIsKycVerified(true)} />
            )}

            {/* Main Page Content - Blurred until KYC is verified */}
            <div className={`max-w-6xl mx-auto transition-all duration-500 ${!isKycVerified ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Add New Parking Spot</h1>
                    <p className="text-gray-500">Fill in the details below to list your land on the platform.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <GeneralInfo />
                        <PricingCapacity />
                        <FeaturesAmenities />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <SpotImages />
                        <FinalizeAction />
                    </div>
                </div>
            </div>
        </div>
    );
}