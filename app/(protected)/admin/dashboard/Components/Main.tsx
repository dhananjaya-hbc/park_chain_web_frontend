import React from 'react' 
import StatCards from './StatCards'
import RevenueChart from './RevenueChart'
import VerificationList from './VerificationList'
import RecentActivity from './RecentActivity'

export default function Main() {
    return (
        <>
            {/* Statistics Cards */}
            <StatCards />

            {/* Revenue Analytics Chart */}
            <RevenueChart />

            {/* Pending Verifications and Recent Activity Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>
                <VerificationList />
                <RecentActivity />
            </div>
        </>
    )
}