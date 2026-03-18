import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationDetailsCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Location Details</h2>
            
            {/* Map Mockup */}
            <div className="h-48 bg-gradient-to-r from-[#e0eaf5] to-[#f4f7f6] rounded-xl border border-gray-200 flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer hover:opacity-95 transition-opacity">
                <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                    <div className="flex gap-1.5 mb-2.5">
                        <MapPin className="text-red-500 w-7 h-7" fill="currentColor" />
                        <MapPin className="text-green-500 w-7 h-7" fill="currentColor" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">Click on the map to drop a pin and set location</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Latitude</label>
                    <input 
                        type="text" 
                        placeholder="6.9271" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                        defaultValue="6.9271"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Longitude</label>
                    <input 
                        type="text" 
                        placeholder="79.8612" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                        defaultValue="79.8612"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Address</label>
                <input 
                    type="text" 
                    placeholder="Full street address..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
                />
            </div>
        </div>
    );
}
