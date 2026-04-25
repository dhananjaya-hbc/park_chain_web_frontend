"use client"

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Main from './Components/Main';
import KYBModal from './Components/KYBModal';

export default function SellerNewPage() {
    const searchParams = useSearchParams();
    const kybDone = searchParams.get('kyb') === 'done';
    const kybId = searchParams.get('kybId');

    // If kybId is passed, show form directly with prefill
    if (kybId) {
        return (
            <div className="relative">
                <Main kybId={kybId} />
            </div>
        );
    }

    if (kybDone) {
        // KYB already verified — show the add new spot form directly, no modal, no blur
        return (
            <div className="relative">
                <Main />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Conditional check could eventually control rendering this modal */}
            <KYBModal />
            <div className="filter blur-sm pointer-events-none">
                <Main />
            </div>
        </div>
    );
}