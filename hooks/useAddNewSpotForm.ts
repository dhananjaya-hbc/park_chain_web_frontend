/**
 * useAddNewSpotForm Hook
 * Manages the complete state for the seller "Add New Spot" form
 * Supports Cloudinary image upload flow
 */

import { useState, useCallback } from 'react';

export interface SlotRow {
    id: number;
    slotType: string;
    slots: number;
    rate: string;
    isCustom: boolean;
}

export interface AddNewSpotFormState {
    // General Info
    title: string;
    description: string;
    address: string;

    // Location
    latitude: string;
    longitude: string;

    // Pricing & Capacity
    slots: SlotRow[];
    totalSlots: number;

    // Amenities
    amenities: string[];

    // Images
    imageUrls: string[];   // ✅ Final Cloudinary URLs
    imageFiles: File[];    // ⭐ NEW: Raw selected files

    // Submission state
    isSubmitting: boolean;
    submitError: string | null;
}

const createInitialState = (): AddNewSpotFormState => ({
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    slots: [
        { id: 1, slotType: 'Car', slots: 0, rate: '0.00', isCustom: false },
        { id: 2, slotType: 'Bike', slots: 0, rate: '0.00', isCustom: false },
        { id: 3, slotType: 'Van', slots: 0, rate: '0.00', isCustom: false },
        { id: 4, slotType: 'Three Wheel', slots: 0, rate: '0.00', isCustom: false },
        { id: 5, slotType: 'Bus', slots: 0, rate: '0.00', isCustom: false },
        { id: 6, slotType: 'Truck', slots: 0, rate: '0.00', isCustom: false },
    ],
    totalSlots: 1,
    amenities: [],

    imageUrls: [],
    imageFiles: [], // ⭐ NEW

    isSubmitting: false,
    submitError: null,
});

export function useAddNewSpotForm() {
    const [formState, setFormState] = useState<AddNewSpotFormState>(createInitialState());

    // Update general info
    const setGeneralInfo = useCallback((data: { title?: string; description?: string; address?: string }) => {
        setFormState(prev => ({
            ...prev,
            title: data.title ?? prev.title,
            description: data.description ?? prev.description,
            address: data.address ?? prev.address,
        }));
    }, []);

    // Update location
    const setLocation = useCallback((latitude: string, longitude: string) => {
        setFormState(prev => ({
            ...prev,
            latitude,
            longitude,
        }));
    }, []);

    // Update slots
    const setSlots = useCallback((slots: SlotRow[]) => {
        setFormState(prev => ({
            ...prev,
            slots,
        }));
    }, []);

    // Update total slots
    const setTotalSlots = useCallback((total: number) => {
        setFormState(prev => ({
            ...prev,
            totalSlots: total,
        }));
    }, []);

    // Update amenities
    const setAmenities = useCallback((amenities: string[]) => {
        setFormState(prev => ({
            ...prev,
            amenities,
        }));
    }, []);

    // ✅ Set Cloudinary URLs
    const setImageUrls = useCallback((urls: string[]) => {
        setFormState(prev => ({
            ...prev,
            imageUrls: urls,
        }));
    }, []);

    // ⭐ NEW: Set raw image files
    const setImageFiles = useCallback((files: File[]) => {
        setFormState(prev => ({
            ...prev,
            imageFiles: files,
        }));
    }, []);

    // Prepare submission payload (NO CHANGE except clarity)
    const prepareSubmissionPayload = useCallback(() => {
        const validSlots = formState.slots.filter(slot => slot.slots > 0);

        if (validSlots.length === 0) {
            throw new Error('Please add at least one slot type with quantity > 0');
        }

        const vehicleTypes = validSlots.map(slot => slot.slotType);
        const pricesPerHour = validSlots.map(slot => parseFloat(slot.rate));

        if (!formState.title.trim()) throw new Error('Spot name is required');
        if (!formState.address.trim()) throw new Error('Address is required');
        if (!formState.latitude) throw new Error('Latitude is required');
        if (!formState.longitude) throw new Error('Longitude is required');

        const lat = parseFloat(formState.latitude);
        const lng = parseFloat(formState.longitude);

        if (isNaN(lat) || isNaN(lng)) throw new Error('Invalid coordinates');

        if (pricesPerHour.some(p => isNaN(p) || p <= 0)) {
            throw new Error('All prices must be valid numbers greater than 0');
        }

        return {
            title: formState.title.trim(),
            description: formState.description.trim() || '',
            address: formState.address.trim(),
            latitude: lat,
            longitude: lng,
            vehicleTypes,
            pricesPerHour,
            imageUrls: formState.imageUrls, // ✅ URLs only sent
            totalSlots: formState.totalSlots,
        };
    }, [formState]);

    // Submission state
    const setSubmissionState = useCallback((isSubmitting: boolean, error: string | null = null) => {
        setFormState(prev => ({
            ...prev,
            isSubmitting,
            submitError: error,
        }));
    }, []);

    // Reset form
    const resetForm = useCallback(() => {
        setFormState(createInitialState());
    }, []);

    return {
        formState,
        setGeneralInfo,
        setLocation,
        setSlots,
        setTotalSlots,
        setAmenities,
        setImageUrls,
        setImageFiles, // ⭐ NEW (IMPORTANT)
        prepareSubmissionPayload,
        setSubmissionState,
        resetForm,
    };
}