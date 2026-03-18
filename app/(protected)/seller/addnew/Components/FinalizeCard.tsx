import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FinalizeCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Finalize</h2>
            
            <div className="space-y-4">
                <Button className="w-full bg-[#1eab55] hover:bg-[#199549] text-white font-medium py-6 h-auto transition-colors flex justify-between items-center group rounded-xl shadow-sm">
                    <span className="text-sm ml-2">Submit for Review</span>
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-6 h-auto rounded-xl">
                    Save Draft
                </Button>
                
                <Button variant="ghost" className="w-full text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium py-6 h-auto rounded-xl">
                    Cancel & Discard
                </Button>
            </div>
        </div>
    );
}
