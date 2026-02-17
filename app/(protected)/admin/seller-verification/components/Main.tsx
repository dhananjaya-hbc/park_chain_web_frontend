import React from 'react'
import VerificationHeader from './VerificationHeader'
import VerificationTable from './VerificationTable'
import { useFilter } from '@/hooks/useFilter'

export type VerificationFilterType = 'all' | 'pending' | 'verified' | 'rejected'

export default function Main() {
    const filterHook = useFilter<VerificationFilterType>('all')

    return (
        <div className="bg-white rounded-2xl shadow-md">
            <VerificationHeader filterHook={filterHook} />
            <VerificationTable selectedFilter={filterHook.selectedFilter} />
        </div>
    )
}