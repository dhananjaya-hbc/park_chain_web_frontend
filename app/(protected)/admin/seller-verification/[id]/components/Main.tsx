'use client'

import React, { useEffect, useState } from 'react'
import VerificationHeader from './VerificationHeader'
import PersonalInfo from './PersonalInfo'
import DocumentsSection from './DocumentsSection'
import AdminNotes from './AdminNotes'

interface VerificationDetails {
    id: string
    fullName: string
    sellerEmail: string
    nicNumber: string
    parkingType: string
    fullAddress: string
    status: 'pending' | 'verified' | 'rejected'
    createdAt: string
    nicFrontUrl: string
    nicBackUrl: string
    selfieUrl: string
    legalDocumentUrl: string
    utilityBillUrl: string
}

export default function Main({ id }: { id: string }) {
    const [details, setDetails] = useState<VerificationDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/verifications/${id}`, {
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                })

                if (!res.ok) {
                    throw new Error('Failed to fetch details')
                }

                const data = await res.json()
                setDetails(data)
            } catch (err) {
                console.error("Error fetching verification details:", err)
                setError("Could not load details from the server.")
            } finally {
                setLoading(false)
            }
        }
        
        fetchDetails()
    }, [id])

    if (loading) {
        return <div className="p-8 text-center text-gray-500 bg-white rounded-[30px] shadow-md">Loading details...</div>
    }

    if (error || !details) {
        return <div className="p-8 text-center text-red-500 bg-white rounded-[30px] shadow-md">{error || "Verification details not found."}</div>
    }

    // Format Date securely
    let submittedDate = "Unknown"
    try {
        if (details.createdAt) {
            submittedDate = new Date(details.createdAt).toLocaleDateString('en-GB')
        }
    } catch(e) {}

    return (
        <div className="bg-white rounded-[30px] shadow-md p-6 sm:p-10">
            <VerificationHeader 
                name={details.fullName} 
                status={details.status}
                submittedDate={submittedDate} 
            />
            <PersonalInfo 
                fullName={details.fullName}
                email={details.sellerEmail}
                phoneNumber={details.nicNumber} // Using NIC here for now, or add phone later!
                verificationType={details.parkingType}
                address={details.fullAddress}
            />
            <DocumentsSection 
                documents={{
                    idFront: details.nicFrontUrl,
                    idBack: details.nicBackUrl,
                    selfie: details.selfieUrl,
                    proofOfAddress: details.utilityBillUrl
                }}
            />
            <AdminNotes 
                id={id} 
                status={details.status} 
            />
        </div>
    )
}
