import React from 'react'

interface ActivityItemProps {
    title: string
    description: string
    time: string
    icon: string
    bgColor?: string
}

const ActivityItem = ({ 
    title, 
    description, 
    time, 
    icon, 
    bgColor = 'bg-[#71b98c]' 
}: ActivityItemProps) => (
    <div className='flex gap-3 mb-3 p-3 rounded-lg bg-gray-50'>
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
            <i className={`${icon} text-lg`}></i>
        </div>
        <div className='flex-1'>
            <h4 className='font-medium text-[#212529]'>{title}</h4>
            <p className='text-[#4f586d] text-sm mb-1'>{description}</p>
            <p className='text-[#6c757d] text-xs flex items-center gap-1'>
                <i className="ri-time-line text-xs"></i>
                {time}
            </p>
        </div>
    </div>
)

export default function RecentActivity() {
    const activities = [
        {
            title: 'New Verification Request',
            description: 'Kawinda Prasada submitted verification',
            time: '3 mins ago',
            icon: 'ri-shield-check-line',
            bgColor: 'bg-[#71b98c]'
        },
        {
            title: 'Verification Completed',
            description: 'Multi-Area verified successfully',
            time: '15 mins ago',
            icon: 'ri-checkbox-circle-line',
            bgColor: 'bg-[#71b98c]'
        },
        {
            title: 'New User Registration',
            description: '3 new users joined the platform',
            time: '1 hour ago',
            icon: 'ri-user-add-line',
            bgColor: 'bg-[#71b98c]'
        },
        {
            title: 'Payment Received',
            description: '5,250 XRP received from parking fees',
            time: '2 hours ago',
            icon: 'ri-money-dollar-circle-line',
            bgColor: 'bg-[#71b98c]'
        },
        {
            title: 'Verification Rejected',
            description: 'Multi-Area verification was rejected',
            time: '3 hours ago',
            icon: 'ri-close-circle-line',
            bgColor: 'bg-[#f12121]'
        },
    ]

    return (
        <div className='p-5 rounded-xl bg-white shadow-xl'>
            <h3 className='font-semibold text-xl pb-4'>Recent Activity</h3>
            
            {activities.map((activity, index) => (
                <ActivityItem
                    key={index}
                    {...activity}
                />
            ))}
        </div>
    )
}