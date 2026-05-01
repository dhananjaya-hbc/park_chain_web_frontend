"use client";

import React, { useState, useEffect, useMemo } from 'react';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface Transaction {
    id: string;
    booking_id: string;
    tx_hash: string;
    from_address: string;
    to_address: string;
    amount_xrp: string;
    tx_type: string;
    status: string;
    created_at: string;
    spot_title?: string;
    driver_name?: string;
    owner_name?: string;
}

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        validated: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        submitted: 'bg-blue-100 text-blue-800',
        failed: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function TxTypeBadge({ txType }: { txType: string }) {
    const isDriverToAdmin = txType === 'driver_to_admin';
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isDriverToAdmin ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
        }`}>
            {isDriverToAdmin ? 'Driver → Admin' : 'Admin → Seller'}
        </span>
    );
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function shortenAddress(addr: string): string {
    if (!addr || addr.length < 12) return addr || '—';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

function shortenHash(hash: string): string {
    if (!hash || hash.length < 12) return hash || '—';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 4)}`;
}

const txTypes = ['all', 'driver_to_admin', 'admin_to_seller'];

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await apiService.get(API_ENDPOINTS.TRANSACTIONS);
                setTransactions(response.transactions || []);
                console.log(`Loaded ${response.transactions?.length || 0} transactions`);
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // Filter
    const filteredTransactions = useMemo(() => {
        let filtered = transactions;

        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.tx_type === typeFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.tx_hash?.toLowerCase().includes(q) ||
                t.spot_title?.toLowerCase().includes(q) ||
                t.driver_name?.toLowerCase().includes(q) ||
                t.owner_name?.toLowerCase().includes(q) ||
                t.from_address?.toLowerCase().includes(q) ||
                t.to_address?.toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [transactions, typeFilter, searchQuery]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Summary
    const totalReceived = filteredTransactions
        .filter(t => t.tx_type === 'driver_to_admin')
        .reduce((sum, t) => sum + parseFloat(t.amount_xrp || '0'), 0);
    const totalPaid = filteredTransactions
        .filter(t => t.tx_type === 'admin_to_seller')
        .reduce((sum, t) => sum + parseFloat(t.amount_xrp || '0'), 0);

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Filters Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                            {typeFilter === 'all' && (
                                <span>
                                    {' · '}
                                    <span className="text-blue-600">↓ {totalReceived.toFixed(2)} XRP in</span>
                                    {' · '}
                                    <span className="text-orange-600">↑ {totalPaid.toFixed(2)} XRP out</span>
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search hash, spot, driver..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-1">
                            {txTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                                        typeFilter === type
                                            ? 'bg-[#197729] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {type === 'all' ? 'All' : type === 'driver_to_admin' ? 'Driver → Admin' : 'Admin → Seller'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-12 gap-2 py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Transaction</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">From → To</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1 text-right">Verify</div>
                </div>
            </div>

            {/* Table Body */}
            <div>
                {isLoading ? (
                    <div className="py-16 text-center">
                        <div className="animate-spin h-6 w-6 border-2 border-[#197729] border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-400 text-sm mt-3">Loading transactions...</p>
                    </div>
                ) : paginatedTransactions.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        {searchQuery || typeFilter !== 'all' ? 'No transactions match your filters' : 'No transactions yet'}
                    </div>
                ) : (
                    paginatedTransactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="grid grid-cols-12 gap-2 items-center py-4 px-5 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                            {/* Transaction Info */}
                            <div className="col-span-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {tx.spot_title || 'Booking Payment'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {tx.tx_type === 'driver_to_admin' ? tx.driver_name : tx.owner_name}
                                </p>
                                <p className="text-xs font-mono text-gray-400">{shortenHash(tx.tx_hash)}</p>
                            </div>

                            {/* Type */}
                            <div className="col-span-2">
                                <TxTypeBadge txType={tx.tx_type} />
                            </div>

                            {/* From → To */}
                            <div className="col-span-2">
                                <p className="text-xs font-mono text-gray-600">{shortenAddress(tx.from_address)}</p>
                                <p className="text-xs text-gray-400">↓</p>
                                <p className="text-xs font-mono text-gray-600">{shortenAddress(tx.to_address)}</p>
                            </div>

                            {/* Status */}
                            <div className="col-span-1">
                                <StatusBadge status={tx.status} />
                            </div>

                            {/* Date */}
                            <div className="col-span-1">
                                <p className="text-xs text-gray-700">{formatDate(tx.created_at)}</p>
                            </div>

                            {/* Amount */}
                            <div className="col-span-2 text-right">
                                <p className={`text-sm font-semibold ${
                                    tx.tx_type === 'driver_to_admin' ? 'text-green-700' : 'text-orange-700'
                                }`}>
                                    {tx.tx_type === 'driver_to_admin' ? '+' : '-'} {parseFloat(tx.amount_xrp).toFixed(4)} XRP
                                </p>
                            </div>

                            {/* Verify Link */}
                            <div className="col-span-1 text-right">
                                {tx.tx_hash && (
                                    <a
                                        href={`https://testnet.xrpl.org/transactions/${tx.tx_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <i className="ri-external-link-line"></i>
                                        XRPL
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {filteredTransactions.length > ITEMS_PER_PAGE && (
                <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
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