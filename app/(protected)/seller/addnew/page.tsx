"use client"

import React from 'react';
import Main from './Components/Main';
import KYBModal from './Components/KYBModal';

export default function SellerNewPage() {
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