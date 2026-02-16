import React from 'react'
import FeedbackHeader from './FeedbackHeader'
import FeedbackTable from './FeedbackTable'

export default function Main() {
    return (
        <div className="bg-white rounded-t-2xl">
            <FeedbackHeader />
            <FeedbackTable />
        </div>
    )
}