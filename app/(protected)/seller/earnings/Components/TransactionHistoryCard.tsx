"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowDown,
  Search,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// --- Types ---
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
}

type TransactionStatus = "validated" | "pending" | "submitted" | "failed";

const ITEMS_PER_PAGE = 5;

// --- Status Badge ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    validated: "bg-[#e8f5e9] text-[#2e7d32]",
    pending: "bg-[#fff8e1] text-[#f57f17]",
    submitted: "bg-[#e3f2fd] text-[#1565c0]",
    failed: "bg-[#ffebee] text-[#c62828]",
  };

  const displayText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {displayText}
    </span>
  );
}

// --- Format Date ---
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// --- Shorten Hash ---
function shortenHash(hash: string): string {
  if (!hash || hash.length < 12) return hash || "---";
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

// --- Main Component ---
export default function TransactionHistoryCard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiService.get(API_ENDPOINTS.TRANSACTIONS);
        // Only show admin_to_seller transactions (payments received by seller)
        const sellerTxs = (response.transactions || []).filter(
          (tx: Transaction) => tx.tx_type === "admin_to_seller"
        );
        setTransactions(sellerTxs);
        console.log(`✅ Loaded ${sellerTxs.length} seller transactions`);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.tx_hash?.toLowerCase().includes(q) ||
        tx.spot_title?.toLowerCase().includes(q) ||
        tx.driver_name?.toLowerCase().includes(q) ||
        tx.amount_xrp?.includes(q)
    );
  }, [searchQuery, transactions]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <p className="text-xs text-gray-500 mt-1">Payments received from bookings (80% share)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hash..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 w-44 focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-[#F9FAFB] border-y border-[#F3F4F6]">
        <div className="grid grid-cols-12 gap-2 py-3 px-6 text-sm font-bold text-[#6B7280]">
          <div className="col-span-4">Transaction</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Verify</div>
        </div>
      </div>

      {/* Transaction Rows */}
      <div className="w-full flex-1">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-[#2e7d32] border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-400 text-sm mt-2">Loading transactions...</p>
          </div>
        ) : paginatedTransactions.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            {searchQuery ? "No transactions match your search" : "No transactions yet"}
          </div>
        ) : (
          paginatedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-12 gap-2 items-center py-4 px-6 border-b border-[#F3F4F6] hover:bg-gray-50/50 transition-colors"
            >
              {/* TX Info */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#e8f5e9]">
                  <ArrowDown className="w-4 h-4 text-[#2e7d32]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.spot_title || "Booking Payment"}
                  </p>
                  <p className="text-xs text-[#6B7280] font-mono">
                    {shortenHash(tx.tx_hash)}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm font-medium text-[#6B7280]">
                {formatDate(tx.created_at)}
              </div>

              {/* Status */}
              <div className="col-span-2">
                <StatusBadge status={tx.status} />
              </div>

              {/* Amount */}
              <div className="col-span-2 text-right text-sm font-semibold text-[#2e7d32]">
                + {parseFloat(tx.amount_xrp).toFixed(2)} XRP
              </div>

              {/* Verify Link */}
              <div className="col-span-2 text-right">
                {tx.tx_hash && (
                  <a
                    href={`https://testnet.xrpl.org/transactions/${tx.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
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
        <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-[#F3F4F6]">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-sm font-medium text-white bg-[#2e7d32] px-4 py-2 rounded-lg hover:bg-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}