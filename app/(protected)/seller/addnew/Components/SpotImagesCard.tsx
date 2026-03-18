import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function SpotImagesCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Spot Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 hover:border-green-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-center group">
                <div className="w-12 h-12 bg-gray-50 group-hover:bg-green-50 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 mb-1">Click to upload or drag</span>
                <span className="text-xs text-gray-500">SVG, PNG, JPG (max 5MB)</span>
            </div>
        </div>
    );
}
