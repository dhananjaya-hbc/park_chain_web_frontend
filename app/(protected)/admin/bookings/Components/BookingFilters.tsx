"use client";

import React from 'react';

interface BookingFiltersProps {
    statusFilter?: string;
    setStatusFilter?: (status: string) => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

const statuses = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'];

export default function BookingFilters({
    statusFilter = 'all',
    setStatusFilter,
    searchQuery = '',
    setSearchQuery,
}: BookingFiltersProps) {
    return null; // Filters are built into BookingTable
}