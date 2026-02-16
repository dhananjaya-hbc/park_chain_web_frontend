import React from 'react'

interface FeedbackTableRowProps {
    name: string
    rating: number
    comment: string
    roleId: string
    date: string
    userImage?: string
}

export default function FeedbackTableRow({
    name,
    rating,
    comment,
    roleId,
    date,
    userImage
}: FeedbackTableRowProps) {
    // Generate stars based on rating
    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <i key={i} className="ri-star-fill text-yellow-400 text-base"></i>
                )
            } else {
                stars.push(
                    <i key={i} className="ri-star-line text-gray-300 text-base"></i>
                )
            }
        }
        return stars
    }

    return (
        <tr className="bg-white">
            <td className="px-6 py-4 rounded-l-[10px]">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {userImage ? (
                        <img src={userImage} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <i className="ri-user-2-fill text-gray-400 text-xl"></i>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{name}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-1 mb-1">
                    {renderStars()}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment}</p>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 text-center whitespace-nowrap">{roleId}</div>
                <div className="text-xs text-gray-500 text-center whitespace-nowrap">{date}</div>
            </td>
            <td className="px-6 py-4 text-center rounded-r-[10px]">
                <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md whitespace-nowrap">
                    View Details
                </button>
            </td>
        </tr>
    )
}
