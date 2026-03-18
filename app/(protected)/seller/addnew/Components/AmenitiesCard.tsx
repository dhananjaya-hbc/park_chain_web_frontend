import React from 'react';

export default function AmenitiesCard() {
    const amenities = [
        "CCTV", "24/7 Security", "Covered", 
        "EV Charging", "Disabled Access", "Gated Entry", 
        "Lighting at night"
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Features & Amenities</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {amenities.map((feature, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="w-[18px] h-[18px] border-[1.5px] border-gray-300 rounded-sm bg-white peer-checked:bg-green-500 peer-checked:border-green-500 transition-colors"></div>
                            <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">{feature}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
