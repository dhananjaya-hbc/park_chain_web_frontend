"use client";

import React, { useEffect, useState } from 'react';
import SellerTableRow from './SellerTableRow';
import { SellerFilterType, SortOrderType } from './Main';

import apiService from '@/lib/api/apiService';

interface SellerTableProps {
    selectedFilter: SellerFilterType
    searchQuery: string
    sortOrder: SortOrderType
}

export interface SellerData {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalSpots: number;
    joinedDate: string;
    status: 'active' | 'suspended';
    image?: string;
}

export default function SellerTable({ selectedFilter, searchQuery, sortOrder }: SellerTableProps) {
    const [sellerData, setSellerData] = useState<SellerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchSellers = async () => {
            setIsLoading(true);
            try {

                const data = await apiService.get('/users?role=seller'); // Updated to use a likely real endpoint pattern

                // Assuming the API returns the array of sellers directly
                setSellerData(data);
            } catch (err) {
                console.error("Failed to load seller data:", err);
            } finally {
                setIsLoading(false);
            }

        };

        fetchSellers();
    }, []);

    const filteredData = sellerData
        .filter((item) => {
            const matchesStatus =
                selectedFilter === 'all' || item.status === selectedFilter;

            const q = searchQuery.toLowerCase().trim();

            // Safely handle null/undefined values
            const nameStr = item.name ?? '';
            const emailStr = item.email ?? '';
            const phoneStr = item.phone ?? '';

            const matchesSearch =
                !q ||
                nameStr.toLowerCase().includes(q) ||
                emailStr.toLowerCase().includes(q) ||
                phoneStr.toLowerCase().includes(q);

            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.joinedDate).getTime();
            const dateB = new Date(b.joinedDate).getTime();

            return sortOrder === 'newest'
                ? dateB - dateA
                : dateA - dateB;
        });

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-xl overflow-hidden py-16 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-400 text-sm mt-3">Loading sellers...</p>
            </div>
        );
    }

    if (filteredData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-xl overflow-hidden py-16 text-center text-gray-400 text-sm">
                No sellers found matching your criteria.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-y border-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spots</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {filteredData.map((seller) => (
                        <SellerTableRow
                            key={seller.id}
                            seller={seller}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}