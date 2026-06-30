import React from 'react';

interface ReviewsListProps {
    reviews?: any[];
    isLoading?: boolean;
}

/**
 * ReviewsList Component
 * Renders a list of recent feedback and reviews for the spot.
 */
export default function ReviewsList({ reviews = [], isLoading = false }: ReviewsListProps) {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-center py-10">
                <span className="text-sm font-semibold text-gray-500 animate-pulse">Loading reviews...</span>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Recent Feedback</h3>
            
            {reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">No reviews available for this spot yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((rev) => (
                        <div key={rev.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                <div className="flex items-center gap-2.5">
                                    {rev.user_profile_image ? (
                                        <img
                                            src={rev.user_profile_image}
                                            alt={rev.user_name || "User"}
                                            className="w-7 h-7 rounded-full object-cover border border-gray-150"
                                        />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#e8f5e9] flex items-center justify-center text-xs font-bold text-[#197729]">
                                            {(rev.user_name || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm font-semibold text-gray-900 block leading-tight">
                                            {rev.user_name || "Anonymous Driver"}
                                        </span>
                                        <span className="text-[10px] text-gray-400 block mt-0.5">
                                            {new Date(rev.created_at).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                    <span className="text-[10px] text-amber-500 font-bold">★</span>
                                    <span className="text-[10px] font-bold text-amber-700">{rev.rating}</span>
                                </div>
                            </div>
                            {rev.comment && (
                                <p className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100 leading-normal italic">
                                    "{rev.comment}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
