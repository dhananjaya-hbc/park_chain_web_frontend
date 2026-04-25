'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSliders } from '@fortawesome/free-solid-svg-icons';

interface MapSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterStatus: 'all' | 'active' | 'inactive';
    onFilterChange: (status: 'all' | 'active' | 'inactive') => void;
}

/**
 * MapSearchBar Component
 * 
 * Provides a text search input and an expandable filter tab for 
 * querying and filtering spots on the map. Includes click-outside detection.
 */
export default function MapSearchBar({
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterChange
}: MapSearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside of the search component to close the filters
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div 
            ref={containerRef}
            className="absolute top-4 left-4 z-50 w-[calc(100%-32px)] sm:w-[400px]"
        >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
                
                {/* Search Bar Input */}
                <div className="relative p-2">
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" 
                    />
                    <input
                        type="text"
                        placeholder="Search spots by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:bg-gray-50 text-sm text-gray-800 placeholder-gray-400 transition-colors"
                    />
                    {/* Toggle Icon to show it has filters */}
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                            isExpanded ? 'bg-[#197729]/10 text-[#197729]' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                        <FontAwesomeIcon icon={faSliders} className="text-sm" />
                    </button>
                </div>

                {/* Expandable Filter Tabs */}
                {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 mt-1 px-1">
                            Filter by Status
                        </p>
                        <div className="flex gap-2">
                            {(['all', 'active', 'inactive'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => onFilterChange(status)}
                                    className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                        filterStatus === status
                                            ? 'bg-[#197729] text-white shadow-sm'
                                            : 'bg-white text-gray-600 hover:bg-[#eef5f0] hover:text-[#197729] border border-gray-200'
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}