import React from 'react';

export default function OwnerCard() {
    // Mock data - replace with props later
    const owner = {
        name: "Sarah Jenkins",
        joinDate: "March 2023",
        phone: "+1 (555) 012-3456",
        email: "sarah.j@example.com",
        totalSpots: 3,
        rating: 4.8
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Owner Details</h3>
            
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                    {owner.name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-gray-900">{owner.name}</p>
                    <p className="text-sm text-gray-500">Host since {owner.joinDate}</p>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{owner.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">{owner.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Portfolio</span>
                    <span className="font-medium text-[#197729]">{owner.totalSpots} Spots Listed</span>
                </div>
            </div>

            <button className="w-full mt-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                View Owner Profile
            </button>
        </div>
    );
}
