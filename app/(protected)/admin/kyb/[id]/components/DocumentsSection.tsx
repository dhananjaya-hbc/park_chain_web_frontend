'use client'

import React from 'react'

interface DocumentCardProps {
    title: string
    imageUrl: string
}

const DocumentCard = ({ title, imageUrl }: DocumentCardProps) => (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="rounded-lg border border-gray-200 overflow-hidden h-64 bg-white relative">
            <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-contain"
            />
        </div>
        <div className="pt-2 text-center">
            <a href={imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View Full Size Document ↗</a>
        </div>
    </div>
)

interface DocumentsSectionProps {
    documentUrl?: string
}

export default function DocumentsSection({ documentUrl }: DocumentsSectionProps) {
    // Default placeholder
    const docUrl = documentUrl || 'https://res.cloudinary.com/dgcqzodby/image/upload/v1771232008/image3_zbobvi.png'

    return (
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Verification Document
            </h2>
            
            <div className="grid grid-cols-1 gap-5">
                <DocumentCard title="Proof of Ownership/Residency (Utility Bill/Deed)" imageUrl={docUrl} />
            </div>
        </div>
    )
}
