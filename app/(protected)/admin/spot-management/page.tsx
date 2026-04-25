'use client';

import React from 'react';
import Main from '@/app/(protected)/admin/spot-management/components/Main';

/**
 * Admin Spot Management Page
 * 
 * Serves as the root page for spot management functionality.
 * Delegates rendering to the Main component which handles all
 * spot-related operations including map display and spot listings.
 */
export default function AdminSpotManagementPage() {
    return (
        <div className="p-6">
            
            <Main />
        </div>
    );
}