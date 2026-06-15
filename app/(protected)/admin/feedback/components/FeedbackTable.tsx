import React from 'react'
import FeedbackTableRow from './FeedbackTableRow'
import { FeedbackFilterType, Review } from './Main'

interface FeedbackTableProps {
    selectedFilter: FeedbackFilterType
    reviews: Review[]
    isLoading: boolean
    error: string | null
    onDelete: (reviewId: number) => void
    onRetry: () => void
}

export default function FeedbackTable({ 
    selectedFilter, 
    reviews, 
    isLoading, 
    error, 
    onDelete,
    onRetry 
}: FeedbackTableProps) {
    // Filter data based on rating category
    const getFilteredData = () => {
        if (selectedFilter === 'all') return reviews
        if (selectedFilter === 'good') return reviews.filter(item => item.rating >= 4)
        if (selectedFilter === 'average') return reviews.filter(item => item.rating === 3)
        if (selectedFilter === 'bad') return reviews.filter(item => item.rating <= 2)
        return reviews
    }

    const filteredData = getFilteredData()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16" style={{backgroundColor: '#E5F5E0'}}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">Loading reviews...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-16" style={{backgroundColor: '#E5F5E0'}}>
                <div className="flex flex-col items-center gap-3 text-center">
                    <i className="ri-error-warning-line text-3xl text-red-400"></i>
                    <p className="text-sm text-gray-600">{error}</p>
                    <button 
                        onClick={onRetry}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (filteredData.length === 0) {
        return (
            <div className="flex items-center justify-center py-16" style={{backgroundColor: '#E5F5E0'}}>
                <div className="flex flex-col items-center gap-2">
                    <i className="ri-chat-3-line text-3xl text-gray-400"></i>
                    <p className="text-sm text-gray-500">No reviews found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto px-1 sm:px-2 lg:px-4 py-2 rounded-b-2xl" style={{backgroundColor: '#E5F5E0'}}>
            <table className="w-full border-separate min-w-[950px]" style={{borderSpacing: '0 14px'}}>
                <tbody className="bg-green-50">
                    {filteredData.map((review) => (
                        <FeedbackTableRow 
                            key={review.id}
                            id={review.id}
                            name={review.user?.full_name || review.user?.wallet_address?.slice(0, 10) + '...' || 'Anonymous'}
                            rating={review.rating}
                            comment={review.comment}
                            spotTitle={review.spot?.title || `Spot #${review.spot_id}`}
                            date={new Date(review.created_at).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            userImage={review.user?.profile_image}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
