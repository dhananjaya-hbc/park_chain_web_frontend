import React from 'react';
import { Shield, User } from 'lucide-react';

const ShieldUserIcon = () => (
    <div className="relative w-7 h-7">
        {/* Filled Shield */}
        <Shield className="w-7 h-7 text-[#374151] fill-[#374151]" />
        
        {/* Circular user badge (bottom-right) */}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#374151] rounded-full border-2 border-white flex items-center justify-center">
            <User className="w-2 h-2 text-white fill-white" />
        </div>
    </div>
);

export default function AdminReviewAlert() {
    return (
        <div className="bg-white border shadow-sm border-l-4 border-l-red-500 p-4 mb-8 rounded-r-lg flex gap-4">
            <div className="w-12 h-12 bg-[#F3F4F6] rounded-full flex items-center justify-center shrink-0">
                <ShieldUserIcon />
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">Admin Review Required</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    For quality assurance and safety, all new parking spots require admin approval before going live on the platform. The review process typically takes less than 24 hours. You will be notified via email immediately once approved.
                </p>
            </div>
        </div>
    );
}
