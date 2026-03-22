import React from 'react';
import {  UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SpotImagesCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[433px]">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
                <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">Spot Images</h2>
            </div>
            
            <div
                tabIndex={0}
                className="border border-[#C7CDD8] bg-[#F9FAFB4D] rounded-2xl h-[280px] px-6 relative cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-[#43a047]/30 focus-within:border-[#43a047] transition-all"
            >
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4">
                        <UploadCloud className="w-6 h-6 text-[#9CA3AF]" />
                    </div>
                    <span className="text-base font-medium text-[#111827] mb-1">Click to upload or drag</span>
                    <span className="text-sm text-[#6B7280]">SVG, PNG, JPG (max 5MB)</span>
                    <Button
                        type="button"
                        className="mt-3 !h-auto text-sm font-semibold text-[#2e7d32] bg-[#e8f5e9] hover:bg-[#c8e6c9] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                        Browse File 
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
                <Button
                    type="button"
                    className="h-9 !py-0 px-5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="h-9 !py-0 px-5 rounded-md bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-sm font-medium transition-colors"
                >
                    Upload 
                </Button>
            </div>
        </div>
    );
}
