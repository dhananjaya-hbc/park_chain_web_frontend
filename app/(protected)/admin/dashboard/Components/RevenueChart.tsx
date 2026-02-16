import React from 'react'
import dynamic from 'next/dynamic'

const MyChart = dynamic(() => import('./MyChart'), { ssr: false })

export default function RevenueChart() {
    return (
        <div className='mb-5'>
            <MyChart />
        </div>
    )
}