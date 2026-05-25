import React, { useState } from 'react'
import VerificationHeader from './VerificationHeader'
import VerificationTable from './VerificationTable'
import { useFilter } from '@/hooks/useFilter'

export type VerificationFilterType = 'all' | 'pending' | 'verified' | 'rejected'
export type SortOrderType = 'newest' | 'oldest'

export default function Main() {
    const filterHook = useFilter<VerificationFilterType>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState<SortOrderType>('newest')

    return (
        <div className="bg-white rounded-2xl shadow-md">
            <VerificationHeader
                filterHook={filterHook}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            <VerificationTable
                selectedFilter={filterHook.selectedFilter}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
            />
        </div>
    )
}