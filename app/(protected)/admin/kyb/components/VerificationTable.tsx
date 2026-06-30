"use client";

import React, { useEffect, useState } from 'react'
import VerificationTableRow from './VerificationTableRow'
import { VerificationFilterType, SortOrderType } from './Main'
import apiService from '@/lib/api/apiService'

interface VerificationTableProps {
    selectedFilter: VerificationFilterType
    searchQuery?: string
    sortOrder?: SortOrderType
}

interface VerificationData {
    id: number;
    entityName: string;
    spotType: string;
    address: string;
    date: string;
    status: 'pending' | 'verified' | 'rejected';
}

export default function VerificationTable({ selectedFilter, searchQuery = '', sortOrder = 'newest' }: VerificationTableProps) {
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
    const filteredData = verificationData
        .filter((item) => {
            const matchesStatus =
                selectedFilter === 'all' || item.status === selectedFilter

            const q = searchQuery.toLowerCase().trim()

            const matchesSearch =
                !q ||
                item.entityName?.toLowerCase().includes(q) ||
                item.spotType?.toLowerCase().includes(q) ||
                item.address?.toLowerCase().includes(q) ||
                item.date?.toLowerCase().includes(q) ||
                item.status?.toLowerCase().includes(q)

            return matchesStatus && matchesSearch
        })
        .sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') {
                return -1
            }
            if (a.status !== 'pending' && b.status === 'pending') {
                return 1
            }

            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()

            if (a.status === 'pending') {
                // Pending requests: oldest first (1st come 1st serve)
                return dateA - dateB
            } else {
                // Approved/Rejected requests: newest first (recently approved) if sorting is newest
                return sortOrder === 'newest'
                    ? dateB - dateA
                    : dateA - dateB
            }
        })

    if (isLoading) {
        return <div className="text-center py-10 font-medium text-gray-500">Loading verification details from database...</div>
    }

    if (error) {
        return <div className="text-center py-10 font-bold text-red-500">{error}</div>
    }

    if (filteredData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="py-16 text-center text-gray-400 text-sm">
                    No KYB verification requests found for this status.
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {isLoading ? (
                <div className="py-16 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-400 text-sm mt-3">Loading verification details from database...</p>
                </div>
            ) : error ? (
                <div className="py-16 text-center text-red-500 text-sm font-medium">
                    {error}
                </div>
            ) : (
                <div className="overflow-x-auto min-w-full">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Spot Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location &amp; Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">KYB Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredData.map((verification) => (
                                <VerificationTableRow
                                    key={verification.id}
                                    {...verification}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}