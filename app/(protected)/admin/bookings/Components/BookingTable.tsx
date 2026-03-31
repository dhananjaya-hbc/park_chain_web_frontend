"use client";

import React, { useState, useEffect, useMemo } from 'react';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface Booking {
    id: string;
    driver_name: string;
    driver_email?: string;
    spot_title: string;
    owner_name: string;
    vehicle_type?: string;
    booking_status: string;
    payment_status: string;
    price_per_hour: string;
    expected_duration_hours: string;
    total_price_xrp: string;
    admin_fee_xrp: string;
    seller_amount_xrp: string;
    start_time: string;
    end_time: string;
    created_at: string;
}

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status, type }: { status: string; type: 'booking' | 'payment' }) {
    const bookingStyles: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentStyles: Record<string, string> = {
        unpaid: 'bg-gray-100 text-gray-800',
        processing: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-blue-100 text-blue-800',
        split_completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800',
    };

    const styles = type === 'booking' ? bookingStyles : paymentStyles;
    const displayText = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {displayText}
        </span>
    );
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const statuses = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'];

export default function BookingTable() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
                setBookings(response.bookings || []);
                console.log(`✅ Loaded ${response.bookings?.length || 0} bookings`);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Filter bookings
    const filteredBookings = useMemo(() => {
        let filtered = bookings;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(b => b.booking_status === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.driver_name?.toLowerCase().includes(q) ||
                b.spot_title?.toLowerCase().includes(q) ||
                b.owner_name?.toLowerCase().includes(q) ||
                b.vehicle_type?.toLowerCase().includes(q) ||
                b.id?.toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [bookings, statusFilter, searchQuery]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Filters Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search driver, spot, owner..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-1 flex-wrap">
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                        statusFilter === status
                                            ? 'bg-[#197729] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-12 gap-2 py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Driver / Spot</div>
                    <div className="col-span-2">Date & Time</div>
                    <div className="col-span-1">Vehicle</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Amount (XRP)</div>
                    <div className="col-span-2 text-right">Split</div>
                </div>
            </div>

            {/* Table Body */}
            <div>
                {isLoading ? (
                    <div className="py-16 text-center">
                        <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-3">Loading bookings...</p>
                    </div>
                ) : paginatedBookings.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        {searchQuery || statusFilter !== 'all' ? 'No bookings match your filters' : 'No bookings yet'}
                    </div>
                ) : (
                    paginatedBookings.map((booking) => (
                        <div key={booking.id}>
                            {/* Main Row */}
                            <div
                                className="grid grid-cols-12 gap-2 items-center py-4 px-5 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                onClick={() => setExpandedRow(expandedRow === booking.id ? null : booking.id)}
                            >
                                {/* Driver & Spot */}
                                <div className="col-span-3">
                                    <p className="text-sm font-medium text-gray-900">{booking.driver_name}</p>
                                    <p className="text-xs text-gray-500">{booking.spot_title}</p>
                                    <p className="text-xs text-gray-400">Owner: {booking.owner_name}</p>
                                </div>

                                {/* Date & Time */}
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-700">{formatDate(booking.start_time)}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                    </p>
                                </div>

                                {/* Vehicle Type */}
                                <div className="col-span-1">
                                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        {booking.vehicle_type || 'Car'}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 flex flex-col gap-1">
                                    <StatusBadge status={booking.booking_status} type="booking" />
                                    <StatusBadge status={booking.payment_status} type="payment" />
                                </div>

                                {/* Amount */}
                                <div className="col-span-2 text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {parseFloat(booking.total_price_xrp).toFixed(4)} XRP
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {booking.expected_duration_hours}h × {parseFloat(booking.price_per_hour).toFixed(2)}
                                    </p>
                                </div>

                                {/* Split */}
                                <div className="col-span-2 text-right">
                                    <p className="text-xs text-green-700">
                                        Admin: {booking.admin_fee_xrp ? parseFloat(booking.admin_fee_xrp).toFixed(4) : '—'}
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Seller: {booking.seller_amount_xrp ? parseFloat(booking.seller_amount_xrp).toFixed(4) : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedRow === booking.id && (
                                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Booking ID</p>
                                            <p className="font-mono text-xs text-gray-700">{booking.id.substring(0, 8)}...</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Driver Email</p>
                                            <p className="text-gray-700 text-xs">{booking.driver_email || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Vehicle Type</p>
                                            <p className="text-gray-700 text-xs">{booking.vehicle_type || 'Car'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Created At</p>
                                            <p className="text-gray-700 text-xs">{formatDate(booking.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Price Per Hour</p>
                                            <p className="text-gray-700 text-xs">{parseFloat(booking.price_per_hour).toFixed(2)} XRP</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Duration</p>
                                            <p className="text-gray-700 text-xs">{booking.expected_duration_hours} hours</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Admin Fee (20%)</p>
                                            <p className="text-green-700 text-xs font-medium">
                                                {booking.admin_fee_xrp ? parseFloat(booking.admin_fee_xrp).toFixed(6) : '—'} XRP
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Seller Amount (80%)</p>
                                            <p className="text-blue-700 text-xs font-medium">
                                                {booking.seller_amount_xrp ? parseFloat(booking.seller_amount_xrp).toFixed(6) : '—'} XRP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {filteredBookings.length > ITEMS_PER_PAGE && (
                <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-sm font-medium text-white bg-[#197729] px-4 py-2 rounded-lg hover:bg-[#145e21] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}