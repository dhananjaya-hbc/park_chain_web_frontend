import React from 'react';

export default function AmenitiesCard() {
    const amenities = [
        "CCTV",
        "24/7 Security",
        "Covered",
        "EV Charging",
        "Disabled Access",
        "Lighting at night",
        "Gated Entry"
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[272px]">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
                <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">Features & Amenities</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((feature, i) => (
                    <label key={i} className="flex items-center justify-between w-[178.890625px] h-[46px] bg-white border border-[#E5E7EBF5] rounded-[8px] px-4 cursor-pointer">
                        <span className="text-sm font-medium text-[#374151] select-none">{feature}</span>
                        <input
                            type="checkbox"
                            className="h-[16px] w-[16px] rounded border border-[#F3F4F6] accent-[#166534]"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
