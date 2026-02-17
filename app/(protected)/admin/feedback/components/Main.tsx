import React from 'react'
import FeedbackHeader from './FeedbackHeader'
import FeedbackTable from './FeedbackTable'
import { useFilter } from '@/hooks/useFilter'

export type FeedbackFilterType = 'all' | 'good' | 'average' | 'bad'

export default function Main() {
    const filterHook = useFilter<FeedbackFilterType>('all')

    return (
        <div className="bg-white rounded-2xl shadow-md">
            <FeedbackHeader filterHook={filterHook} />
            <FeedbackTable selectedFilter={filterHook.selectedFilter} />
        </div>
    )
}