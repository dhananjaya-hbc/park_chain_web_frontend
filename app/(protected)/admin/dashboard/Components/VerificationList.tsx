"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import apiService from '@/lib/api/apiService'

export type SortOrderType = 'newest' | 'oldest'

const ITEMS_PER_PAGE = 5;

interface VerificationData {
    id: number;
    entityName: string;
    spotType: string;
    address: string;
    date: string;
    status: 'pending' | 'verified' | 'rejected';
}

export default function VerificationList() {
    const [verificationData, setVerificationData] = useState<VerificationData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState<SortOrderType>('newest')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const data = await apiService.get('/admin/kyb')
                const arr = Array.isArray(data) ? data : (data.data || [])
                // We only care about pending verifications here
                setVerificationData(arr.filter((item: VerificationData) => item.status === 'pending'))
            } catch (err) {
                console.error("Failed to load verification data:", err)
                setError("Unable to load table data. Check backend connection.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredData = verificationData
        .filter((item) => {
            const q = searchQuery.toLowerCase().trim()
            const matchesSearch =
                !q ||
                item.entityName?.toLowerCase().includes(q) ||
                item.address?.toLowerCase().includes(q) ||
                item.date?.toLowerCase().includes(q)

            return matchesSearch
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()

            return sortOrder === 'newest'
                ? dateB - dateA
                : dateA - dateB
        })

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col h-full">
            {/* Header / Toolbar */}
            <div className="p-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-gray-900">Pending Verifications</h2>
                        <span className="inline-flex items-center text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            {filteredData.length} {searchQuery ? "found" : "Total"}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search entity, address..."
                                className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                            />
                        </div>
                        <select
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value as SortOrderType);
                                setCurrentPage(1);
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="py-16 text-center">
                        <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-3">Loading pending verifications...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 text-center text-red-500 text-sm font-medium">
                        {error}
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        No pending verifications found.
                    </div>
                ) : (
                    <div className="overflow-x-auto min-w-full">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location &amp; Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">KYB Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {paginatedData.map((verification) => (
                                    <tr key={verification.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                        <i className="ri-building-4-fill text-gray-600 text-sm"></i>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">{verification.entityName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                                            <div className="max-w-[240px] flex items-start gap-1.5 mt-1.5">
                                                <MapPin className="w-4 h-4 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm text-gray-900 truncate" title={verification.address}>
                                                        {verification.address}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {verification.date}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-amber-50 text-amber-600 border border-amber-200">
                                                {verification.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-left">
                                            <Link href={`/admin/kyb/${verification.id}`}>
                                                <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-colors">
                                                    View Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            {!isLoading && filteredData.length > ITEMS_PER_PAGE && (
                <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-[#F3F4F6] bg-[#F9FAFB80]">
                    <p className="text-xs text-gray-500">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-sm font-medium text-white bg-[#197729] px-4 py-2 rounded-lg hover:bg-[#12581f] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}