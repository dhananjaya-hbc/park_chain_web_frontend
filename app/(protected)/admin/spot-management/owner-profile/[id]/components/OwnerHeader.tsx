'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface OwnerHeaderProps {
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    kycStatus: string;
    walletAddress?: string;
}

export default function OwnerHeader({ name, email, phone, joinDate, kycStatus, walletAddress }: OwnerHeaderProps) {
    const router = useRouter();
    const formattedDate = new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-[#197729]/10 h-32 w-full"></div>
            <div className="px-8 pb-8 relative">
                {/* Avatar */}
                <div className="absolute -top-12 h-24 w-24 rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center">
                    <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 uppercase">
                        {name ? name.charAt(0) : '?'}
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-end pt-4 mb-4">
                    <button 
                        onClick={() => router.back()}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        &larr; Back to Spot
                    </button>
                </div>

                <div className="mt-2">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            kycStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                            {kycStatus === 'APPROVED' ? 'Verified Host' : 'Pending Verification'}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">Host since {formattedDate}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Email Address</p>
                            <p className="text-gray-900 font-medium truncate max-w-[200px]" title={email}>
                                {email}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="text-gray-900 font-medium">{phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Wallet Address</p>
                            <p className="text-gray-900 font-medium truncate" title={walletAddress}>
                                {walletAddress || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
