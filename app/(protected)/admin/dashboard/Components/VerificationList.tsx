import React from 'react'
import { faCalendar, faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface VerificationItemProps {
    sellerId: string
    sellerName: string
    avatar: string
    submittedDate: string
    documentCount: number
    bgColor?: string
}

const VerificationItem = ({ 
    sellerId, 
    sellerName, 
    avatar, 
    submittedDate, 
    documentCount,
    bgColor = 'bg-[#82c092]'
}: VerificationItemProps) => (
    <div className='p-4 rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300'>
        <div className='flex justify-between items-start mb-3'>
            <div className='flex gap-3 items-start'>
                <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white font-bold`}>
                    {avatar}
                </div>
                <div>
                    <h4 className='font-medium text-[#212529]'>{sellerId}</h4>
                    <p className='text-[#4f586d] text-sm'>{sellerName}</p>
                </div>
            </div>
            <span className='px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600'>Pending</span>
        </div>
        <div className='flex justify-between items-center text-sm'>
            <div className='flex gap-4 text-[#4f586d]'>
                <span className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faCalendar} className='text-xs'/>
                    Submitted: {submittedDate}
                </span>
                <span className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faFile} className='text-xs'/>
                    {documentCount} Documents
                </span>
            </div>
            <button className='px-3 py-1 border border-[#197729] rounded text-sm hover:bg-[#197729] hover:text-white transition-colors duration-300'>
                Review KYC
            </button>
        </div>
    </div>
)

export default function VerificationList() {
    const verifications = [
        {
            sellerId: 'Seller #001',
            sellerName: 'John Michel',
            avatar: 'S3',
            submittedDate: '2024-09-20',
            documentCount: 3,
            bgColor: 'bg-[#82c092]'
        },
        {
            sellerId: 'Seller #002',
            sellerName: 'Sara Noyel',
            avatar: 'S3',
            submittedDate: '2024-09-20',
            documentCount: 4,
            bgColor: 'bg-[#71b98c]'
        },
        {
            sellerId: 'Seller #003',
            sellerName: 'Nikil Malhothra',
            avatar: 'S3',
            submittedDate: '2024-09-15',
            documentCount: 3,
            bgColor: 'bg-[#71b98c]'
        },
    ]

    return (
        <div className='p-5 rounded-xl bg-white shadow-xl'>
            <h3 className='font-semibold text-xl pb-4'>Pending Verifications</h3>
            
            {verifications.map((verification, index) => (
                <VerificationItem
                    key={index}
                    {...verification}
                />
            ))}

            <button className='w-full py-2 border border-[#197729] rounded text-sm hover:bg-[#197729] hover:text-white transition-colors duration-300 mt-4'>
                View All
            </button>
        </div>
    )
}