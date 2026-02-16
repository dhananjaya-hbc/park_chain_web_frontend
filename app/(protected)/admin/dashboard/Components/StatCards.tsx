import React from 'react'
import { faUsers, faStore, faDollarSign, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface StatCardProps {
    title: string
    value: string | number
    icon: IconDefinition
    bgColor?: string
}

const StatCard = ({ title, value, icon, bgColor = 'bg-[#197729]' }: StatCardProps) => (
    <div className='p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
        <div>
            <p className='text-[#4f586d] text-md font-normal'>{title}</p>
            <h6 className='text-[#404a60] text-2xl font-medium pb-3'>{value}</h6>
        </div>
        <div className={`${bgColor} min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer`}>
            <FontAwesomeIcon icon={icon} className='text-white text-xl'/>
        </div>
    </div>
)

export default function StatCards() {
    const stats = [
        {
            title: 'Total Users',
            value: '2,063',
            icon: faUsers,
        },
        {
            title: 'Active Sellers',
            value: '2,500',
            icon: faStore,
        },
        {
            title: 'Platform Revenue',
            value: '5,613 XRP',
            icon: faDollarSign,
        },
        {
            title: 'Total Bookings',
            value: '9,547',
            icon: faCalendarCheck,
        },
    ]

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                />
            ))}
        </div>
    )
}