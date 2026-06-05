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
        <div className="space-y-4 mb-8">
            <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#197729] transition-colors group w-fit"
            >
                <i className="ri-arrow-left-line text-base group-hover:-translate-x-1 transition-transform"></i>
                <span className="font-medium">Back to Verifications</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {entityName}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Submitted on {submittedDate}
                    </p>
                </div>

                <span className={`${statusStyles[status]} inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold w-fit`}>
                    {statusLabels[status]}
                </span>
            </div>
        </div>
    )
}