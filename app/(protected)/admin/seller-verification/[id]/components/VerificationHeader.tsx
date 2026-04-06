'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface VerificationHeaderProps {
    entityName?: string
    status?: 'pending' | 'verified' | 'rejected'
    submittedDate?: string
}

const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
}

const statusLabels = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected'
}

export default function VerificationHeader({ 
    entityName = 'City Center Plaza Parking',
    status = 'pending',
    submittedDate = '01 Dec 2025'
}: VerificationHeaderProps) {
    const router = useRouter()

    return (
        <div className="mb-10">
            {/* Back Button */}
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            >
                <i className="ri-arrow-left-line text-xl group-hover:-translate-x-1 transition-transform"></i>
                <span className="font-medium">Back to Verifications</span>
            </button>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {entityName}
            </h1>
            
            {/* Status and Date */}
            <div className="flex items-center gap-4">
                <span className={`${statusStyles[status]} px-4 py-2 rounded-full text-sm font-medium`}>
                    {statusLabels[status]}
                </span>
                <span className="text-gray-500">
                    Submitted on {submittedDate}
                </span>
            </div>
        </div>
    )
}