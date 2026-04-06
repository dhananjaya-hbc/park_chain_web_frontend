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
            <p className="text-gray-600 font-semibold">{label}</p>
            {isLink ? (
                <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-lg truncate block">
                    {value}
                </a>
            ) : (
                <p className="text-gray-900 text-lg">{value}</p>
            )}
        </div>
    )

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Entity Details (KYB)
            </h2>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField label="Entity/Spot Name" value={entityName} />
                    <InfoField label="Owner Name" value={ownerName} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField label="Spot Type" value={spotType} />
                    <InfoField label="Google Maps Link" value={googleMapsLink} isLink={true} />
                </div>
                
                <InfoField label="Address" value={address} />
            </div>
        </div>
    )
}
