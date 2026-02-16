import React from 'react'
import VerificationHeader from './VerificationHeader'
import VerificationTable from './VerificationTable'

export default function Main() {
    return (
        <div className="bg-white rounded-2xl shadow-md">
            <VerificationHeader />
            <VerificationTable />
        </div>
    )
}