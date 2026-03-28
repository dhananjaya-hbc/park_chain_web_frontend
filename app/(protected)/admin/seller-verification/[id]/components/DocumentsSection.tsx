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
    // We only want to show dummy data if explicitly no document was provided AND we want placeholders.
    // However, if we do have a documents object, but some fields are missing (like they didn't upload a selfie),
    // we should realistically show a "missing document" state instead of a default person!
    
    // For now, let's keep track of what's provided versus what isn't:
    return (
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Uploaded Documents
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {documents?.idFront ? (
                    <DocumentCard title="ID Card - Front" imageUrl={documents.idFront} />
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 flex flex-col justify-center items-center h-full border-2 border-dashed border-gray-300">
                        <span className="text-gray-400">No Front ID provided</span>
                    </div>
                )}
                
                {documents?.idBack ? (
                    <DocumentCard title="ID Card - Back" imageUrl={documents.idBack} />
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 flex flex-col justify-center items-center h-full border-2 border-dashed border-gray-300">
                        <span className="text-gray-400">No Back ID provided</span>
                    </div>
                )}

                {documents?.selfie ? (
                    <DocumentCard title="Selfie with ID" imageUrl={documents.selfie} />
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 flex flex-col justify-center items-center h-full border-2 border-dashed border-gray-300">
                        <span className="text-gray-400">No Selfie provided</span>
                    </div>
                )}

                {documents?.proofOfAddress ? (
                    <DocumentCard title="Proof of Address" imageUrl={documents.proofOfAddress} />
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 flex flex-col justify-center items-center h-full border-2 border-dashed border-gray-300">
                        <span className="text-gray-400">No Proof of Address provided</span>
                    </div>
                )}
            </div>
        </div>
    )
}
