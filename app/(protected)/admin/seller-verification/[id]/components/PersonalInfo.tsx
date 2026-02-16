'use client'

import React from 'react'

interface PersonalInfoProps {
    fullName?: string
    email?: string
    phoneNumber?: string
    verificationType?: string
    address?: string
}

export default function PersonalInfo({
    fullName = 'Kavindu Prabash',
    email = 'kavindu.rejected@email.com',
    phoneNumber = '+1 (555) 456-7890',
    verificationType = 'Multi-Area',
    address = '789 Pine Road, Austin, TX 73301, USA'
}: PersonalInfoProps) {
    const InfoField = ({ label, value }: { label: string, value: string }) => (
        <div className="space-y-2">
            <p className="text-gray-600 font-semibold">{label}</p>
            <p className="text-gray-900 text-lg">{value}</p>
        </div>
    )

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Personal Information
            </h2>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField label="Full Name" value={fullName} />
                    <InfoField label="Email Address" value={email} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField label="Phone Number" value={phoneNumber} />
                    <InfoField label="Verification Type" value={verificationType} />
                </div>
                
                <InfoField label="Address" value={address} />
            </div>
        </div>
    )
}
