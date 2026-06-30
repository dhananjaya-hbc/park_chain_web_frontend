'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface OwnerHeaderProps {
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    kycStatus: string;
    walletAddress?: string;
    profileImage?: string;
    accountStatus?: 'active' | 'suspended';
    onSuspendToggle?: () => void;
    onRemove?: () => void;
}

export default function OwnerHeader({ name, email, phone, joinDate, kycStatus, walletAddress, profileImage, accountStatus = 'active', onSuspendToggle, onRemove }: OwnerHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const formattedDate = new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Deduce if we are currently inside the sellers tab
    const isSellersTab = pathname?.includes('/admin/sellers');
    const backRoute = isSellersTab ? '/admin/sellers' : '/admin/spot-management';
    const backText = isSellersTab ? 'Back to Sellers' : 'Back to Spot';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-[#197729]/10 h-32 w-full"></div>
            <div className="px-8 pb-8 relative">
                {/* Avatar */}
                <div className="absolute -top-12 h-24 w-24 rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profileImage} alt={name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                        <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 uppercase">
                            {name ? name.charAt(0) : '?'}
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="flex justify-end pt-4 mb-4">
                    <button 
                        onClick={() => router.back()}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        &larr; {backText}
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
                        {accountStatus === 'suspended' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                Suspended
                            </span>
                        )}
                        
                        <div className="ml-auto flex gap-2">
                            {isSellersTab && (
                                <>
                                    <button 
                                        onClick={onSuspendToggle}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors border ${
                                            accountStatus === 'suspended' 
                                                ? 'text-green-700 bg-green-50 hover:bg-green-100 border-green-200' 
                                                : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                        }`}
                                    >
                                        {accountStatus === 'suspended' ? 'Unblock Seller' : 'Block Seller'}
                                    </button>
                                    <button 
                                        onClick={onRemove}
                                        className="px-4 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                    >
                                        Remove Seller
                                    </button>
                                </>
                            )}
                        </div>
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
                            <p className="text-gray-900 font-medium truncate" title={walletAddress || 'Not available'}>
                                {walletAddress || <span className="text-gray-400 italic">Not available</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
