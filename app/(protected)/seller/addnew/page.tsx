'use client';

import React, { useState, useEffect } from 'react';

import Main from './components/Main';
import KycModal from './components/KycModal';
import PendingReview from './components/PendingReview';

// Assuming you have this defined or it's needed
type KycStatus = 'unverified' | 'pending_review' | 'approved';

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
        <div className="p-6">
            <Main />

            {kycStatus === 'unverified' && (
                <KycModal onComplete={() => setKycStatus('pending_review')} />
            )}

            {kycStatus === 'pending_review' && (
                <PendingReview />
            )}
        </div>
    );
}