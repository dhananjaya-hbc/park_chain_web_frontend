'use client';

import { useState, useEffect } from 'react';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

/**
 * Spot data interface - matches backend API structure
 */
export interface Spot {
    id: string;
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    total_slots: number;
    available_slots: number;
    is_available: boolean;
    is_approved: boolean;
    is_active?: boolean;
    is_blocked?: boolean;
    vehicle_types: string[];
    slots_per_type: number[];
    prices_per_hour: number[];
    image_urls: string[];
    amenities: string[];
    owner_id: string;
    owner_name: string;
    owner_email: string;
    owner_phone?: string;
    owner_wallet?: string;
    created_at: string;
    updated_at: string;
}

/**
 * API Response interface
 */
interface SpotResponse {
    spots: Spot[];
    total: number;
}

/**
 * Hook return type
 */
interface UseSpotReturn {
    spots: Spot[] | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * useSpots Hook
 * 
 * Custom hook for managing spot data fetching and state management.
 * Features:
 * - Fetches all parking spots from admin endpoint
 * - Handles loading and error states
 * - Provides manual refetch capability
 * - Matches backend API v1 structure
 */
export function useSpots(): UseSpotReturn {
    const [spots, setSpots] = useState<Spot[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch spots from API
     * 
     * @throws Error if API request fails
     */
    const fetchSpots = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response: SpotResponse = await apiService.get(API_ENDPOINTS.SPOTS);
            setSpots(response.spots || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch spots';
            setError(errorMessage);
            setSpots(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Initial data fetch on component mount
     */
    useEffect(() => {
        fetchSpots();
    }, []);

    return {
        spots,
        isLoading,
        error,
        refetch: fetchSpots,
    };
}