import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FinalizeCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[272px]">
            <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px] mb-6">Finalize</h2>
            
            <div className="space-y-4">
                <Button className="w-[243.328125px] h-[48px] rounded-[8px] bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2 group" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>Submit for Review</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button variant="outline" className="w-[243.328125px] h-[46px] rounded-[8px] border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                    Save Draft
                </Button>
                
                <Button variant="ghost" className="w-[243.328125px] h-[46px] opacity-100 text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium rounded-xl">
                    Cancel & Discard
                </Button>
            </div>
        </div>
    );
}
