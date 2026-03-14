"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

// --- Type Definitions ---
type TransactionStatus = "Completed" | "Pending" | "Processed";
type TransactionType = "Booking Payment" | "Withdrawal";

interface Transaction {
  id: string;
  type: TransactionType;
  txId: string;
  date: string;
  status: TransactionStatus;
  amount: string;
  isCredit: boolean;
}

// --- Mock Data ---
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "Booking Payment",
    txId: "24B2...9A12",
    date: "Oct 24, 2023",
    status: "Completed",
    amount: "+ 24.00 XRP",
    isCredit: true,
  },
  {
    id: "2",
    type: "Withdrawal",
    txId: "8F31...C201",
    date: "Oct 22, 2023",
    status: "Processed",
    amount: "- 500.00 XRP",
    isCredit: false,
  },
  {
    id: "3",
    type: "Booking Payment",
    txId: "---",
    date: "Oct 24, 2023",
    status: "Pending",
    amount: "+ 35.00 XRP",
    isCredit: true,
  },
  {
    id: "4",
    type: "Booking Payment",
    txId: "1AB2...3F51",
    date: "Oct 20, 2023",
    status: "Completed",
    amount: "+ 12.50 XRP",
    isCredit: true,
  },
  {
    id: "5",
    type: "Booking Payment",
    txId: "4D22...91AA",
    date: "Oct 18, 2023",
    status: "Completed",
    amount: "+ 40.00 XRP",
    isCredit: true,
  },
];

const ITEMS_PER_PAGE = 5;

// --- Status Badge Component ---
function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    Completed: "bg-[#e8f5e9] text-[#2e7d32]",
    Pending: "bg-[#fff8e1] text-[#f57f17]",
    Processed: "bg-[#f3f4f6] text-[#4b5563]",
  };

  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

// --- Main Component ---
export default function TransactionHistoryCard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_TRANSACTIONS;
    const q = searchQuery.toLowerCase();
    return MOCK_TRANSACTIONS.filter(
      (tx) =>
        tx.type.toLowerCase().includes(q) ||
        tx.txId.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q) ||
        tx.amount.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Transaction
            <br />
            History
          </h2>
          <div className="flex items-center gap-2">
            {/* Search */}
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
            {/* Filter Button */}
            <button className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-[#F9FAFB] border-y border-[#F3F4F6]">
        <div className="grid grid-cols-12 gap-2 py-3 px-6 text-sm font-bold text-[#6B7280]">
          <div className="col-span-5">Type / ID</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Amount</div>
        </div>
      </div>

      {/* Transaction Rows */}
      <div className="w-full">
        {paginatedTransactions.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No transactions found.
          </div>
        ) : (
          paginatedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-12 gap-2 items-center py-4 px-6 border-b border-[#F3F4F6] hover:bg-gray-50/50 transition-colors"
            >
              {/* Type + TX ID */}
              <div className="col-span-5 flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.isCredit ? "bg-[#e8f5e9]" : "bg-gray-100"
                    }`}
                >
                  {tx.isCredit ? (
                    <ArrowDown className="w-4 h-4 text-[#2e7d32]" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.type}
                  </p>
                  <p className="text-xs text-[#6B7280] font-mono">
                    {tx.txId}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm font-medium text-[#6B7280] leading-tight">
                <div>{tx.date.split(", ")[0]},</div>
                <div>{tx.date.split(", ")[1]}</div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <StatusBadge status={tx.status} />
              </div>

              {/* Amount */}
              <div
                className={`col-span-3 text-right text-sm font-medium ${tx.status === "Pending" ? "text-black" : tx.isCredit ? "text-[#2e7d32]" : "text-gray-900"
                  }`}
              >
                {tx.amount}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-auto px-6 py-4 flex items-center justify-end gap-3 border-t border-[#F3F4F6]">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="text-[15px] text-[#4B5563] bg-white border border-[#D1D5DB] px-4 py-2 rounded-lg hover:bg-gray-50/50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="text-[15px] font-medium text-white bg-[#2e7d32] px-4 py-2 rounded-lg hover:bg-[#1b5e20] disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
