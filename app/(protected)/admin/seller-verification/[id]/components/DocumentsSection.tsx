'use client'

import React from 'react'

interface DocumentCardProps {
    title: string
    imageUrl: string
}

const DocumentCard = ({ title, imageUrl }: DocumentCardProps) => (
    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
        <h3 className="text-gray-900 font-semibold">{title}</h3>
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden h-64 bg-white relative">
            <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-contain"
            />
        </div>
        <div className="pt-2 text-center">
            <a href={imageUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Full Size Document ↗</a>
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
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Verification Document
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DocumentCard title="Proof of Ownership/Residency (Utility Bill/Deed)" imageUrl={docUrl} />
            </div>
        </div>
    )
}
