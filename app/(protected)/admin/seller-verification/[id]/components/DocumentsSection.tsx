'use client'

import React from 'react'
import Image from 'next/image'

interface DocumentCardProps {
    title: string
    imageUrl: string
}

const DocumentCard = ({ title, imageUrl }: DocumentCardProps) => (
    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
        <h3 className="text-gray-900 font-semibold">{title}</h3>
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden h-48 bg-white relative">
            <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
            />
        </div>
    </div>
)

interface DocumentsSectionProps {
    documents?: {
        idFront?: string
        idBack?: string
        selfie?: string
        proofOfAddress?: string
    }
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
    // Default placeholder images
    const defaultDocs = {
        idFront: documents?.idFront || 'https://res.cloudinary.com/dgcqzodby/image/upload/v1771231999/Image1_wjmpdk.png',
        idBack: documents?.idBack || 'https://res.cloudinary.com/dgcqzodby/image/upload/v1771232002/Image_ID_Back_s3xnsz.png',
        selfie: documents?.selfie || 'https://res.cloudinary.com/dgcqzodby/image/upload/v1771232004/image2_blfy9x.png',
        proofOfAddress: documents?.proofOfAddress || 'https://res.cloudinary.com/dgcqzodby/image/upload/v1771232008/image3_zbobvi.png'
    }

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Uploaded Documents
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DocumentCard title="ID Card - Front" imageUrl={defaultDocs.idFront} />
                <DocumentCard title="ID Card - Back" imageUrl={defaultDocs.idBack} />
                <DocumentCard title="Selfie with ID" imageUrl={defaultDocs.selfie} />
                <DocumentCard title="Proof of Address" imageUrl={defaultDocs.proofOfAddress} />
            </div>
        </div>
    )
}
