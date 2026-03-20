import React from 'react';

export default function GeneralInfoCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
                <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">General Information</h2>
            </div>
            
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Spot Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Secure Downtown Garage" 
                        className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-[#111827] placeholder:opacity-60 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Address</label>
                    <input 
                        type="text" 
                        placeholder="e.g. No 457, 5th Avenue, Colombo 07" 
                        className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-[#111827] placeholder:opacity-60 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Description</label>
                    <textarea 
                        rows={4} 
                        placeholder="Describe the accessibility, surroundings, and specific instructions for drivers..." 
                        className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-[#111827] placeholder:opacity-60 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
