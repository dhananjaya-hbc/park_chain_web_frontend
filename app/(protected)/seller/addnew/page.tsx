import React from 'react';

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Spot</h1>
            
            
        </div>
    );
}