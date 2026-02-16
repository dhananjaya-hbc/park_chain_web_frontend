import React from 'react'
import FeedbackHeader from './FeedbackHeader'
import FeedbackTable from './FeedbackTable'

export default function Main() {
    return (
        <div className="bg-white rounded-2xl shadow-md">
            <FeedbackHeader />
            <FeedbackTable />
        </div>
    )
}