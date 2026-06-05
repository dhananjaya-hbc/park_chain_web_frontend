"use client"

import React, { useState } from 'react'
import SellerHeader from './SellerHeader'
import SellerTable from './SellerTable'
import { useFilter } from '@/hooks/useFilter'

export type SellerFilterType = 'all' | 'active' | 'suspended'
export type SortOrderType = 'newest' | 'oldest'

export default function Main() {
    const filterHook = useFilter<SellerFilterType>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState<SortOrderType>('newest')

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <SellerHeader
                filterHook={filterHook}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            <SellerTable
                selectedFilter={filterHook.selectedFilter}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
            />
        </div>
    )
}