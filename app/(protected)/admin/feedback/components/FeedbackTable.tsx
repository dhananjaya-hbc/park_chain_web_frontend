import React from 'react'
import FeedbackTableRow from './FeedbackTableRow'
import { FeedbackFilterType } from './Main'

interface FeedbackTableProps {
    selectedFilter: FeedbackFilterType
}

// Mock data - Replace with API call later
const feedbackData = [
    {
        id: 1,
        name: 'Jenny Hope',
        rating: 4,
        comment: 'Nice place to park in my world. Good safe place to park.👌',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: 2,
        name: 'Sion L..',
        rating: 4,
        comment: 'Nice place to park in my world. Good safe place to park.👌',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=2'
    },
    {
        id: 3,
        name: 'Henny Hope',
        rating: 4,
        comment: 'Nice place to park in my world. Good safe place to park.👌',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=3'
    },
    {
        id: 4,
        name: 'B Rodrigo',
        rating: 2,
        comment: 'Nice place to park in my world. Good safe place to park. but had an issue with the owner of this place very bad experience.plz get an action for this.Thank u',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=4'
    },
    {
        id: 5,
        name: 'Kevin Dias',
        rating: 4,
        comment: 'Nice place to park in my world. Good safe place to park.👌',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=5'
    },
    {
        id: 6,
        name: 'Helena go.',
        rating: 4,
        comment: 'Nice place to park in my world. Good safe place to park.👌',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=6'
    },
    {
        id: 7,
        name: 'Amal K.',
        rating: 4,
        comment: 'Nice place to park in my world. Good safe place to park.👌',
        roleId: '#AD-123456789',
        date: '01 Dec 2025-23:21:56',
        userImage: 'https://i.pravatar.cc/150?img=7'
    },
]

export default function FeedbackTable({ selectedFilter }: FeedbackTableProps) {
    // Filter data based on rating category
    const getFilteredData = () => {
        if (selectedFilter === 'all') return feedbackData
        if (selectedFilter === 'good') return feedbackData.filter(item => item.rating >= 4)
        if (selectedFilter === 'average') return feedbackData.filter(item => item.rating === 3)
        if (selectedFilter === 'bad') return feedbackData.filter(item => item.rating <= 2)
        return feedbackData
    }

    const filteredData = getFilteredData()

    return (
        <div className="overflow-x-auto px-1 sm:px-2 lg:px-4 py-2 rounded-b-2xl" style={{backgroundColor: '#E5F5E0'}}>
            <table className="w-full border-separate min-w-[950px]" style={{borderSpacing: '0 14px'}}>
                <tbody className="bg-green-50">
                    {filteredData.map((feedback) => (
                        <FeedbackTableRow 
                            key={feedback.id}
                            {...feedback}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
