'use client';

import React, { useState } from 'react';

interface AdminActionsProps {
    initialStatus: boolean;
    onStatusChange: (newStatus: boolean) => void;
}

export default function AdminActions({ initialStatus, onStatusChange }: AdminActionsProps) {
    const [isActive, setIsActive] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newStatus = !isActive;
            setIsActive(newStatus);
            onStatusChange(newStatus);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Admin Actions</h3>
            
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        {isActive ? 'Active' : 'Blocked'}
                    </span>
                </div>

                <button
                    onClick={handleToggle}
                    disabled={isLoading}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all shadow-md flex justify-center items-center
                        ${isActive 
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                            : 'bg-[#197729] hover:bg-[#146121] shadow-green-200'
                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                        isActive ? 'Block This Spot' : 'Activate Spot'
                    )}
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-1">
                    {isActive 
                        ? 'Blocking will prevent new bookings immediately.' 
                        : 'Activating makes this spot visible on the map.'}
                </p>
            </div>
        </div>
    );
}
