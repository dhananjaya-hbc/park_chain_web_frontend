'use client';

import React from 'react';
// import KycModal from './components/KycModal'; // Temporarily commented out
import GeneralInfo from './components/GeneralInfo';
import PricingCapacity from './components/PricingCapacity';
import FeaturesAmenities from './components/FeaturesAmenities';
import SpotImages from './components/SpotImages';
import FinalizeAction from './components/FinalizeAction';

export default function SellerNewPage() {
    // const [isKycVerified, setIsKycVerified] = useState(false); // Temporarily commented out

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 relative">
            
            {/* --- KYC MODAL DISABLED FOR TESTING --- */}
            {/* 
            {!isKycVerified && (
                <KycModal onComplete={() => setIsKycVerified(true)} />
            )} 
            */}

            {/* --- MAIN PAGE CONTENT --- */}
            {/* Removed the dynamic blur classes (blur-md pointer-events-none...) so you can interact with the form */}
            <div className="max-w-6xl mx-auto">
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