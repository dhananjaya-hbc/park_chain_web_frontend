import React from 'react';
import { useRouter } from 'next/navigation';

interface OwnerCardProps {
    ownerId: string;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
}

export default function OwnerCard({ ownerId, name, email, phone, joinDate }: OwnerCardProps) {
    const router = useRouter();
    // Format join date nicely
    const formattedJoinDate = new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Owner Details</h3>
            
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 uppercase">
                    {name ? name.charAt(0) : '?'}
                </div>
                <div>
                    <p className="font-bold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">Host since {formattedJoinDate}</p>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900 max-w-[150px] truncate" title={email}>{email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Portfolio</span>
                    <button 
                        onClick={() => ownerId && router.push(`/admin/spot-management/owner-profile/${ownerId}#listed-spots`)}
                        disabled={!ownerId}
                        className="font-medium text-[#197729] hover:text-green-700 hover:underline transition-colors disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                        View Listed Spots
                    </button>
                </div>
            </div>

            <button 
                onClick={() => ownerId && router.push(`/admin/spot-management/owner-profile/${ownerId}`)}
                disabled={!ownerId}
                className="w-full mt-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                View Owner Profile
            </button>
        </div>
    );
}
