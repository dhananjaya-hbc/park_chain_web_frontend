'use client';

import React, { useState, useEffect } from 'react';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface BookingHistoryProps {
    spotId: string;
}

export default function BookingHistory({ spotId }: BookingHistoryProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
                let bookings = response.bookings || response.data || [];
                
                // Filter locally by spotId
                if (bookings.length > 0) {
                    bookings = bookings.filter((b: any) => String(b.spot_id) === String(spotId) || String(b.spotId) === String(spotId));
                }
                
                setHistory(bookings);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
                setHistory([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (spotId) {
            fetchBookings();
        }
    }, [spotId]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold text-lg">Booking History</h3>
                <button className="text-sm text-[#197729] font-medium hover:underline">Download CSV</button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-6 text-gray-500 flex justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-[#197729] border-t-transparent rounded-full mr-2"></div>
                        Loading bookings...
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">No bookings found for this spot.</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">User</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Duration</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3 rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => {
                                const userName = item.driver_name || item.driverName || item.user_id || `User ${item.id?.substring(0,4)}`;
                                const status = item.booking_status || item.status || 'Pending';
                                
                                // Enhanced fallback chain using the exact column names from the backend Booking model
                                const amount = item.total_price_xrp || item.expected_price_xrp || item.total_price || item.totalPrice || item.amount_xrp || '0';
                                
                                // Calculate duration if start and end are provided
                                let duration = "N/A";
                                if (item.start_time && item.end_time) {
                                    const start = new Date(item.start_time).getTime();
                                    const end = new Date(item.end_time).getTime();
                                    const diffHours = Math.max(1, Math.round((end - start) / (1000 * 60 * 60)));
                                    duration = `${diffHours} hr${diffHours > 1 ? 's' : ''}`;
                                }

                                return (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{userName}</td>
                                        <td className="px-4 py-4 text-gray-500">{formatDate(item.created_at || item.createdAt)}</td>
                                        <td className="px-4 py-4 text-gray-500">{duration}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{amount} XRP</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                ['completed', 'confirmed', 'active'].includes(status.toLowerCase())
                                                    ? 'bg-green-50 text-green-700' 
                                                    : ['cancelled', 'failed'].includes(status.toLowerCase())
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
