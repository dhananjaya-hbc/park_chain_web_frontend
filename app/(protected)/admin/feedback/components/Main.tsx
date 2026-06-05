'use client'

import React, { useEffect, useState, useCallback } from 'react'
import FeedbackHeader from './FeedbackHeader'
import FeedbackTable from './FeedbackTable'
import { useFilter } from '@/hooks/useFilter'
import apiService from '@/lib/api/apiService'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

export type FeedbackFilterType = 'all' | 'good' | 'average' | 'bad'

/**
 * Review shape from the backend (PostgreSQL)
 */
export interface Review {
    id: number
    user_id: string
    spot_id: number
    rating: number
    comment: string
    created_at: string
    updated_at: string
    // Joined fields the API may include
    user?: {
        id: string
        full_name?: string
        wallet_address?: string
        profile_image?: string
    }
    spot?: {
        id: number
        title?: string
    }
}

export default function Main() {
    const filterHook = useFilter<FeedbackFilterType>('all')
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await apiService.get(API_ENDPOINTS.REVIEWS)
            console.log('[Feedback] 📦 Raw API response:', response)

            const raw: Review[] = Array.isArray(response)
                ? response
                : Array.isArray(response?.reviews)
                    ? response.reviews
                    : Array.isArray(response?.data)
                        ? response.data
                        : []

            setReviews(raw)
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch reviews'
            console.error('❌ Failed to fetch reviews:', msg)
            setError(msg)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await apiService.delete(`${API_ENDPOINTS.REVIEWS}/${reviewId}`)
            setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        } catch (err) {
            console.error('❌ Failed to delete review:', err)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-md">
            <FeedbackHeader 
                filterHook={filterHook} 
                totalCount={reviews.length} 
            />
            <FeedbackTable 
                selectedFilter={filterHook.selectedFilter} 
                reviews={reviews}
                isLoading={isLoading}
                error={error}
                onDelete={handleDeleteReview}
                onRetry={fetchReviews}
            />
        </div>
    )
}