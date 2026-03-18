import React from 'react';

export default function GeneralInfoCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">General Information</h2>
            
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Spot Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Secure Downtown Garage" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
                    <textarea 
                        rows={4} 
                        placeholder="Describe the accessibility, surroundings, and specific instructions for drivers..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
