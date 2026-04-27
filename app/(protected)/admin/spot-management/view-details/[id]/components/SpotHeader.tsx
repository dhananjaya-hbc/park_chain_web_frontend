'use client';

import React from 'react';

interface SpotHeaderProps {
    title: string;
    address: string;
    price: string;
    rating: number;
    reviewCount: number;
    onBack: () => void;
}

/**
 * SpotHeader Component
 * Displays the top navigation, title, address, pricing, and rating details.
 */
export default function SpotHeader({ title, address, price, rating, reviewCount, onBack }: SpotHeaderProps) {
    return (
        <div className="max-w-7xl mx-auto mb-6">
            <button 
                onClick={onBack} 
                className="flex items-center text-sm text-gray-500 hover:text-[#197729] transition-colors mb-4"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Map
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <span>📍 {address}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-900 font-medium">{price}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-bold text-gray-900">{rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({reviewCount} reviews)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
