import React from 'react'
import { SellerFilterType, SortOrderType } from './Main'

interface SellerHeaderProps {
    filterHook: {
        selectedFilter: SellerFilterType
        handleFilterSelect: (filter: SellerFilterType) => void
    }
    searchQuery: string
    setSearchQuery: (value: string) => void
    sortOrder: SortOrderType
    setSortOrder: (value: SortOrderType) => void
}

export default function SellerHeader({ filterHook, searchQuery, setSearchQuery, sortOrder, setSortOrder }: SellerHeaderProps) {
    const { selectedFilter, handleFilterSelect } = filterHook

    const filterOptions = [
        { value: 'all' as SellerFilterType, label: 'All' },
        { value: 'active' as SellerFilterType, label: 'Active' },
        { value: 'suspended' as SellerFilterType, label: 'Suspended' },
    ]

    return (
        <div className="p-5 border-b border-gray-100 bg-white rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Sellers list</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search seller name, email..."
                            className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 w-72 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                        />
                    </div>
                    
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>

                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFilterSelect(option.value)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                                selectedFilter === option.value
                                    ? option.value === 'suspended'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-[#197729] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}