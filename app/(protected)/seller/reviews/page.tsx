"use client";

import React, { useEffect, useState } from 'react';
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export default function SellerReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0.0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await apiService.get(`${API_ENDPOINTS.REVIEWS}/seller/me`);
                const userReviews = response.data || [];
                setReviews(userReviews);
                if (userReviews.length > 0) {
                    const totalRating = userReviews.reduce((sum: number, r: any) => sum + Number(r.rating || 0), 0);
                    setAverageRating(Number((totalRating / userReviews.length).toFixed(2)));
                } else {
                    setAverageRating(0.0);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6 font-sans">
            {/* Header and Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
                        <p className="text-gray-500 text-sm mt-1">Monitor ratings and reviews across all your parking locations.</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <span className="text-4xl">💬</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#197729] to-[#2e7d32] p-6 rounded-2xl shadow-md text-white flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-90">Seller Reputation</p>
                        <p className="text-3xl font-extrabold mt-1">{averageRating.toFixed(1)} / 5.0</p>
                        <p className="text-xs mt-1.5 opacity-75">Based on {reviews.length} total reviews</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                        ⭐
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Reviews</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3">
                        <div className="animate-spin h-8 w-8 border-4 border-[#197729] border-t-transparent rounded-full"></div>
                        <span className="text-sm font-medium text-gray-500">Loading your feedback...</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <span className="text-5xl mb-4">🌟</span>
                        <h3 className="text-gray-900 font-bold text-lg mb-1">No Reviews Yet</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Once drivers start booking and reviewing your parking spots, their feedback will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                                    <div className="flex items-center gap-3">
                                        {rev.user_profile_image ? (
                                            <img
                                                src={rev.user_profile_image}
                                                alt={rev.user_name || "User"}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-sm font-extrabold text-[#197729]">
                                                {(rev.user_name || "U")[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-bold text-gray-900 block leading-tight">
                                                {rev.user_name || "Anonymous Driver"}
                                            </span>
                                            <span className="text-xs text-gray-400 block mt-1">
                                                Reviewed on {new Date(rev.created_at).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-1.5 min-w-[120px]">
                                        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 self-start sm:self-auto">
                                            <span className="text-sm text-amber-500 font-bold">★</span>
                                            <span className="text-sm font-bold text-amber-700">{rev.rating}</span>
                                        </div>
                                        {rev.spot_title && (
                                            <span className="text-xs text-gray-500 text-left sm:text-right">
                                                Location: <span className="font-semibold text-gray-700">{rev.spot_title}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {rev.comment && (
                                    <p className="mt-4 text-sm text-gray-700 bg-gray-50/50 p-4 rounded-xl border border-gray-100 leading-relaxed italic">
                                        "{rev.comment}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}