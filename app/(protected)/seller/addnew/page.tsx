'use client';

import React, { useState, useEffect } from 'react';

import Main from './components/Main';
import KycModal from './components/KycModal';
import PendingReview from './components/PendingReview';

// Assuming you have this defined or it's needed
type KycStatus = 'unverified' | 'pending' | 'pending_review' | 'approved';

export default function SellerNewPage() {
    const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the REAL KYC status for the specific logged-in user directly from the backend
        const fetchKycStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const sellerEmail = localStorage.getItem('seller_email');
                
                if (!token || !sellerEmail) {
                    setKycStatus('unverified');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/seller/kyc/status?email=${encodeURIComponent(sellerEmail)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Assumes backend returns { status: 'unverified' | 'pending_review' | 'approved' }
                    setKycStatus(data.status || 'unverified');
                } else {
                    // Fallback if the endpoint fails/doesn't exist
                    setKycStatus('unverified');
                }
            } catch (error) {
                console.error("Failed to check KYC status", error);
                setKycStatus('unverified'); 
            } finally {
                setLoading(false);
            }
        };

        fetchKycStatus();
    }, []);

    // When the user successfully submits the KYC form explicitly in the UI
    const handleKycComplete = () => {
        setKycStatus('pending_review');
    };

    if (loading) {
        return <div className="p-6 text-center">Checking verification status...</div>;
    }

    return (
        <div className="p-6">
            <Main />

            {kycStatus === 'unverified' && (
                <KycModal onComplete={handleKycComplete} />
            )}

            {(kycStatus === 'pending_review' || kycStatus === 'pending') && (
                <PendingReview />
            )}
        </div>
    );
}