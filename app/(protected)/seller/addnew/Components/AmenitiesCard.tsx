import React from 'react';

interface AmenitiesCardProps {
    amenities: string[];
    setAmenities: (amenities: string[]) => void;
}

export default function AmenitiesCard({ amenities, setAmenities }: AmenitiesCardProps) {

    const availableAmenities = [
        "CCTV",
        "24/7 Security",
        "Covered",
        "EV Charging",
        "Disabled Access",
        "Lighting at night",
        "Gated Entry"
    ];

    const handleAmenityChange = (amenity: string) => {
        const cleanAmenity = amenity.trim();

        if (amenities.includes(cleanAmenity)) {
            // remove
            setAmenities(amenities.filter(a => a !== cleanAmenity));
        } else {
            // add (avoid duplicates)
            setAmenities([...new Set([...amenities, cleanAmenity])]);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[272px]">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
                <h2 className="text-sm font-bold text-gray-900 mb-1 tracking-[0.7px]">
                    Features & Amenities
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableAmenities.map((feature, i) => {
                    const cleanFeature = feature.trim();

                    return (
                        <label
                            key={i}
                            className="flex items-center justify-between w-full min-h-[46px] bg-white border border-[#E5E7EBF5] rounded-[8px] px-4 py-2 cursor-pointer"
                        >
                            <span className="text-sm font-medium text-[#374151]">
                                {cleanFeature}
                            </span>

                            <input
                                type="checkbox"
                                checked={amenities.includes(cleanFeature)}
                                onChange={() => handleAmenityChange(cleanFeature)}
                                className="h-[16px] w-[16px] rounded border border-[#F3F4F6] accent-[#166534]"
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}