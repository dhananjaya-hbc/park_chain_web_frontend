import React from 'react';

/**
 * ReviewsList Component
 * Renders a list of recent feedback and reviews for the spot.
 */
export default function ReviewsList() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Recent Feedback</h3>
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="pb-4 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-900">User #{100 + i}</span>
                            <span className="text-xs text-gray-400">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-600">"Great spot, easy to find and very secure. Will book again!"</p>
                    </div>
                ))}
            </div>
            <button className="w-full mt-2 text-center text-sm text-[#197729] font-medium hover:underline">
                View All Reviews
            </button>
        </div>
    );
}
