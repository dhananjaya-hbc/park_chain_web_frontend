"use client";

import React, { useEffect, useState } from 'react'
import VerificationTableRow from './VerificationTableRow'
import { VerificationFilterType } from './Main'
import apiService from '@/lib/api/apiService'

interface VerificationTableProps {
    selectedFilter: VerificationFilterType
}

interface VerificationData {
    id: number;
    entityName: string;
    spotType: string;
    address: string;
    date: string;
    status: 'pending' | 'verified' | 'rejected';
}

export default function VerificationTable({ selectedFilter }: VerificationTableProps) {
    const [verificationData, setVerificationData] = useState<VerificationData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        // Fetch real data from the backend when the component mounts
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Adjust this route base string to match what your backend copilot constructed!
                // For instance, if they made GET /api/admin/kyb, this maps as '/admin/kyb' through your apiService
                const data = await apiService.get('/admin/kyb') 
                
                // if they wrapped it in an object (e.g., { data: [...] }), do: setVerificationData(data.data)
                // Assuming it returns an array directly:
                setVerificationData(Array.isArray(data) ? data : (data.data || []))
            } catch (err) {
                console.error("Failed to load verification data:", err)
                setError("Unable to load table data. Check backend connection.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Filter data based on selected filter
    const filteredData = selectedFilter === 'all' 
        ? verificationData 
        : verificationData.filter(item => item.status === selectedFilter)

    if (isLoading) {
        return <div className="text-center py-10 font-medium text-gray-500">Loading verification details from database...</div>
    }

    if (error) {
        return <div className="text-center py-10 font-bold text-red-500">{error}</div>
    }

    if (filteredData.length === 0) {
        return <div className="text-center py-10 font-medium text-gray-500">No KYB verification requests found for this status.</div>
    }

    return (
        <div className="overflow-x-auto px-2 sm:px-4 lg:px-[2.5rem] py-2 rounded-b-2xl" style={{backgroundColor: '#E5F5E0'}}>
            <table className="w-full border-separate min-w-[800px]" style={{borderSpacing: '0 14px'}}>
                <thead style={{backgroundColor: '#f7fcf5'}}>
                    <tr>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Entity Name</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Spot Type</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Location & Date</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">KYB Status</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-green-50">
                    {filteredData.map((verification) => (
                        <VerificationTableRow 
                            key={verification.id}
                            {...verification}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}