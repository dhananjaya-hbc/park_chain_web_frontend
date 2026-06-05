'use client'

import React from 'react'

interface KYBInfoProps {
    ownerName?: string
    entityName?: string
    spotType?: string
    googleMapsLink?: string
    address?: string
}

export default function PersonalInfo({ // Kept name for file pairing, represents KYB details now
    ownerName = 'Kavindu Prabash',
    entityName = 'City Center Plaza Parking',
    spotType = 'Garage',
    googleMapsLink = 'https://maps.app.goo.gl/example',
    address = '789 Pine Road, Austin, TX 73301, USA'
}: KYBInfoProps) {
    const InfoField = ({ label, value, isLink = false }: { label: string, value: string, isLink?: boolean }) => (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            {isLink ? (
                <a href={value} target="_blank" rel="noreferrer" className="text-sm sm:text-base text-blue-600 hover:text-blue-800 hover:underline truncate block">
                    {value}
                </a>
            ) : (
                <p className="text-sm sm:text-base text-gray-900 break-words">{value}</p>
            )}
        </div>
    )

    return (
        <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Entity Details (KYB)
            </h2>
            
            <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InfoField label="Entity/Spot Name" value={entityName} />
                    <InfoField label="Owner Name" value={ownerName} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InfoField label="Spot Type" value={spotType} />
                    <InfoField label="Google Maps Link" value={googleMapsLink} isLink={true} />
                </div>
                
                <InfoField label="Address" value={address} />
            </div>
        </div>
    )
}
