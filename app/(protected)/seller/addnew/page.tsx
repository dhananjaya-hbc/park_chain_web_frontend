'use client';

import React, { useEffect, useState } from 'react';
import KycModal from './components/KycModal';
import PendingReview from './components/PendingReview'; // We need to create this component next
import GeneralInfo from './components/GeneralInfo';
import PricingCapacity from './components/PricingCapacity';
import FeaturesAmenities from './components/FeaturesAmenities';
import SpotImages from './components/SpotImages';
import FinalizeAction from './components/FinalizeAction';
import { KycStatus } from './components/kycTypes';

export default function SellerNewPage() {
    // Replaced boolean state with a 3-step status
    const [kycStatus, setKycStatus] = useState<KycStatus>(() => {
        if (typeof window === 'undefined') {
            return 'unverified';
        }

        const savedStatus = localStorage.getItem('seller_kyc_status') as KycStatus | null;
        if (savedStatus && ['unverified', 'pending_review', 'approved'].includes(savedStatus)) {
            return savedStatus;
        }

        return 'unverified';
    });

    useEffect(() => {
        localStorage.setItem('seller_kyc_status', kycStatus);
    }, [kycStatus]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 relative">
            
            {/* Phase 1: Show KYC Modal Popup if not submitted yet */}
            {kycStatus === 'unverified' && (
                <KycModal onComplete={() => setKycStatus('pending_review')} />
            )}

            {/* Phase 2: Show the Pending Review message overlay after submission */}
            {kycStatus === 'pending_review' && (
                <PendingReview />
            )}

            {/* --- DEVELOPER TEST BUTTON (Remove later) --- */}
            {/* This button lets you test what happens when an admin finally approves it */}
            {kycStatus === 'pending_review' && (
                <div className="fixed top-4 right-4 z-[60]">
                    <button 
                        onClick={() => setKycStatus('approved')} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-bold hover:bg-green-700 animate-pulse"
                    >
                        Click to Simulate Admin Approval
                    </button>
                </div>
            )}

            {/* Main Page Content - Blurred until KYC status is strictly 'approved' */}
            <div className={`max-w-6xl mx-auto transition-all duration-500 ${kycStatus !== 'approved' ? 'blur-md pointer-events-none select-none opacity-50' : 'blur-0 opacity-100'}`}>
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