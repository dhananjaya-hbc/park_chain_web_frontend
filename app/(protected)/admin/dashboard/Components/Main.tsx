import React from 'react' 
import StatCards from './StatCards'
import RevenueChart from './RevenueChart'
import VerificationList from './VerificationList'

export default function Main() {
    return (
        <>
            {/* Statistics Cards */}
            <StatCards />

            {/* Revenue Analytics Chart */}
            <RevenueChart />

            {/* Pending Verifications Section */}
            <div className='grid grid-cols-1 gap-5 mb-5'>
                <VerificationList />
            </div>
        </>
    )
}