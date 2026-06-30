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
    fraud_score?: number;
    fraud_level?: string;
}

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status, type }: { status: string; type: 'booking' | 'payment' }) {
    const bookingStyles: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
        confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
        completed: 'bg-teal-50 text-teal-700 border-teal-200/50',
        cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50',
    };

    const paymentStyles: Record<string, string> = {
        unpaid: 'bg-slate-50 text-slate-600 border-slate-200/50',
        processing: 'bg-amber-50 text-amber-700 border-amber-200/50',
        paid: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
        split_completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
        failed: 'bg-rose-50 text-rose-700 border-rose-200/50',
        refunded: 'bg-violet-50 text-violet-700 border-violet-200/50',
    };

    const styles = type === 'booking' ? bookingStyles : paymentStyles;
    const displayText = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${styles[status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            {displayText}
        </span>
    );
}

function FraudBadge({ score }: { score?: number; level?: string }) {
    if (score === undefined) return <span className="text-slate-400 text-xs">—</span>;

    return (
        <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-slate-800">
                {score}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">
                Risk Score
            </span>
        </div>
    );
}

function formatDate(dateStr: string, endDateStr?: string): string {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startFormat = `${months[date.getMonth()]} ${date.getDate()}`;

    if (!endDateStr) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const check = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        if (check.getTime() === today.getTime()) {
            return `Today, ${startFormat}`;
        }
        if (check.getTime() === tomorrow.getTime()) {
            return `Tomorrow, ${startFormat}`;
        }
        return `${startFormat}, ${date.getFullYear()}`;
    }

    const end = new Date(endDateStr);
    const endFormat = `${months[end.getMonth()]} ${end.getDate()}`;

    if (date.getFullYear() === end.getFullYear() &&
        date.getMonth() === end.getMonth() &&
        date.getDate() === end.getDate()) {
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const check = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        if (check.getTime() === today.getTime()) {
            return `Today, ${startFormat}`;
        }
        if (check.getTime() === tomorrow.getTime()) {
            return `Tomorrow, ${startFormat}`;
        }
        return `${startFormat}, ${date.getFullYear()}`;
    } else {
        return `${startFormat} - ${endFormat}`;
    }
}

function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const statuses = ['all', 'pending', 'confirmed', 'active', 'completed'];

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

            {/* Bookings Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-6 font-semibold">Driver & Spot</th>
                            <th className="py-4 px-6 font-semibold">Date & Time</th>
                            <th className="py-4 px-6 font-semibold">Vehicle</th>
                            <th className="py-4 px-6 font-semibold">Status</th>
                            <th className="py-4 px-6 font-semibold text-center">Fraud Score</th>
                            <th className="py-4 px-6 font-semibold text-right">Amount (XRP)</th>
                            <th className="py-4 px-6 font-semibold text-right">Split Breakdown</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full mx-auto"></div>
                                    <p className="text-slate-400 text-sm mt-3 font-medium">Loading bookings...</p>
                                </td>
                            </tr>
                        ) : paginatedBookings.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-slate-400 text-sm font-medium">
                                    {searchQuery || statusFilter !== 'all' ? 'No bookings match your filters' : 'No bookings yet'}
                                </td>
                            </tr>
                        ) : (
                            paginatedBookings.map((booking) => (
                                <React.Fragment key={booking.id}>
                                    {/* Main Row */}
                                    <tr
                                        className="hover:bg-slate-50/60 transition-all duration-200 cursor-pointer align-middle border-b border-slate-100/40"
                                        onClick={() => setExpandedRow(expandedRow === booking.id ? null : booking.id)}
                                    >
                                        {/* Driver & Spot */}
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-950 hover:text-green-700 transition-colors">
                                                    {booking.driver_name}
                                                </span>
                                                <span className="text-xs text-slate-500 mt-1 font-medium">
                                                    {booking.spot_title}
                                                </span>
                                                <span className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">
                                                    Owner: {booking.owner_name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Date & Time */}
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-800">
                                                    {formatDate(booking.start_time, booking.end_time)}
                                                </span>
                                                <span className="text-xs text-slate-400 mt-1 font-normal">
                                                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Vehicle Type */}
                                        <td className="py-5 px-6">
                                            <span className="inline-flex items-center text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/50 px-2.5 py-1 rounded-full">
                                                {booking.vehicle_type || 'Car'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <StatusBadge status={booking.booking_status} type="booking" />
                                                <StatusBadge status={booking.payment_status} type="payment" />
                                            </div>
                                        </td>

                                        {/* Fraud Score */}
                                        <td className="py-5 px-6 text-center">
                                            <FraudBadge score={booking.fraud_score} level={booking.fraud_level} />
                                        </td>

                                        {/* Amount */}
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {parseFloat(booking.total_price_xrp).toFixed(4)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-0.5">
                                                        XRP
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400 mt-1 font-normal">
                                                    {booking.expected_duration_hours}h duration
                                                </span>
                                            </div>
                                        </td>

                                        {/* Split */}
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex flex-col items-end gap-1.5">
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/40">
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Admin:</span>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {booking.admin_fee_xrp ? parseFloat(booking.admin_fee_xrp).toFixed(4) : '—'} <span className="text-[9px] font-normal text-slate-400">XRP</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/40">
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Seller:</span>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {booking.seller_amount_xrp ? parseFloat(booking.seller_amount_xrp).toFixed(4) : '—'} <span className="text-[9px] font-normal text-slate-400">XRP</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Details */}
                                    {expandedRow === booking.id && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-5 bg-slate-50/50 border-t border-b border-slate-100">
                                                <div className="bg-white p-6 rounded-xl border border-slate-100/80 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Booking ID</p>
                                                        <p className="font-mono text-xs text-slate-800 mt-1 font-semibold">{booking.id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Driver Email</p>
                                                        <p className="text-slate-700 text-xs mt-1 font-medium">{booking.driver_email || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Vehicle Type</p>
                                                        <p className="text-slate-700 text-xs mt-1 font-medium">{booking.vehicle_type || 'Car'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Created At</p>
                                                        <p className="text-slate-700 text-xs mt-1 font-medium">{formatDate(booking.created_at)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Price Per Hour</p>
                                                        <p className="text-slate-700 text-xs mt-1 font-medium">{parseFloat(booking.price_per_hour).toFixed(2)} XRP</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Duration</p>
                                                        <p className="text-slate-700 text-xs mt-1 font-medium">{booking.expected_duration_hours} hours</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Admin Fee (20%)</p>
                                                        <p className="text-emerald-700 text-xs mt-1 font-semibold">
                                                            {booking.admin_fee_xrp ? parseFloat(booking.admin_fee_xrp).toFixed(6) : '—'} XRP
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Seller Amount (80%)</p>
                                                        <p className="text-blue-700 text-xs mt-1 font-semibold">
                                                            {booking.seller_amount_xrp ? parseFloat(booking.seller_amount_xrp).toFixed(6) : '—'} XRP
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Fraud Score</p>
                                                        <p className="text-slate-800 text-xs mt-1 font-semibold">
                                                            {booking.fraud_score !== undefined ? `${booking.fraud_score}%` : '—'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Fraud Risk Level</p>
                                                        <p className={`text-xs mt-1 font-bold uppercase ${
                                                            booking.fraud_level === 'high'
                                                                ? 'text-rose-600'
                                                                : booking.fraud_level === 'medium'
                                                                    ? 'text-amber-600'
                                                                    : 'text-emerald-600'
                                                        }`}>
                                                            {booking.fraud_level || 'LOW'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredBookings.length > ITEMS_PER_PAGE && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-xs font-semibold text-white bg-[#197729] px-4 py-2 rounded-lg hover:bg-[#145e21] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}