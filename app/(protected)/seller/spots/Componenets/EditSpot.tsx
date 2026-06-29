"use client";

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import GeneralInfoCard from '@/app/(protected)/seller/addnew/Components/GeneralInfoCard';
import PricingCapacityCard from '@/app/(protected)/seller/addnew/Components/PricingCapacityCard';
import SpotImagesCard from '@/app/(protected)/seller/addnew/Components/SpotImagesCard';
import LocationCard from '@/app/(protected)/seller/addnew/Components/LocationCard';
import { useAddNewSpotForm } from '@/hooks/useAddNewSpotForm';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Check, X } from 'lucide-react';


export default function EditSpot({ spot, onClose, onSpotUpdated }: any) {
    const form = useAddNewSpotForm();
    const [localError, setLocalError] = useState<string | null>(null);
    const [popupMode, setPopupMode] = useState<'success' | 'confirmDiscard' | null>(null);
    const [minSlotsPerType, setMinSlotsPerType] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!localError) return;
        const timer = setTimeout(() => {
            setLocalError(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [localError]);

    // Pre-fill form with current spot data from props
    useEffect(() => {
        if (!spot) return;

        form.setGeneralInfo({
            title: spot.name || '',
            address: spot.address || '',
            description: spot.description || '',
        });

        if (spot.latitude && spot.longitude) {
            form.setLocation(String(spot.latitude), String(spot.longitude));
        }

        form.setTotalSlots(spot.totalSlots || 0);

        // Map backend pricing rows into form slot rows
        const vTypes: string[] = Array.isArray(spot.vehicleTypes) ? spot.vehicleTypes : [];
        const slotsPer: number[] = Array.isArray(spot.slotsPerType) ? spot.slotsPerType : [];
        const prices: number[] = Array.isArray(spot.pricesPerHour) ? spot.pricesPerHour : [];

        if (vTypes.length > 0) {
            const updatedSlots = form.formState.slots.map(s => {
                const idx = vTypes.findIndex(t => t.toLowerCase() === s.slotType.toLowerCase());
                if (idx >= 0) {
                    return { ...s, slots: Number(slotsPer[idx] ?? 0), rate: String(prices[idx] ?? '0') };
                }
                return s;
            });
            form.setSlots(updatedSlots);
        }

        // Load existing image as file for the image card
        if (spot.imageUrl) {
            fetch(spot.imageUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'spot_image.jpg', { type: blob.type });
                    form.setImageFiles([file]);
                })
                .catch(() => { /* silent — image preview optional */ });
        }

        // Fetch sweep-line min-slots per vehicle type from the backend
        apiService.get(`${API_ENDPOINTS.SPOTS}/${spot.id}/min-slots`)
            .then(data => {
                // Expected: { minSlotsPerType: { car: 3, bike: 1, ... } }
                if (data?.minSlotsPerType && typeof data.minSlotsPerType === 'object') {
                    setMinSlotsPerType(data.minSlotsPerType);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch min-slots:", err);
                setMinSlotsPerType({});
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spot?.id]);

    // ---------- Submit ----------
    const handleSubmit = async () => {
        try {
            setLocalError(null);
            form.setSubmissionState(true);

            // Validation: All fields should be filled
            if (!form.formState.description?.trim()) {
                throw new Error('Description is required.');
            }
            if (form.formState.imageFiles.length === 0) {
                throw new Error('At least one image is required.');
            }

            // In pricing and capacity section, at least one row should be fully filled
            const activeSlots = form.formState.slots.filter(slot => slot.slots > 0 && parseFloat(slot.rate) > 0);
            if (activeSlots.length === 0) {
                throw new Error('At least one pricing row must be filled with a slot count and hourly rate.');
            }

            // Check for partial rows where only one field is filled
            const partialRow = form.formState.slots.find(slot => (slot.slots > 0) !== (parseFloat(slot.rate) > 0));
            if (partialRow) {
                throw new Error(`Incomplete row: Both slot count and hourly rate are required for ${partialRow.slotType}.`);
            }

            // Client-side sweep-line check: block submit if any row is below minimum
            for (const slot of form.formState.slots) {
                const key = slot.slotType.trim().toLowerCase();
                const min = minSlotsPerType[key] ?? 0;
                if (min > 0 && slot.slots < min) {
                    throw new Error(
                        `Cannot reduce ${slot.slotType} slots to ${slot.slots}. Maximum concurrent bookings is ${min}.`
                    );
                }
            }

            const formData = new FormData();
            formData.append('description', form.formState.description || '');
            formData.append('vehicleTypes', JSON.stringify(activeSlots.map(s => s.slotType)));
            formData.append('pricesPerHour', JSON.stringify(activeSlots.map(s => parseFloat(s.rate))));
            formData.append('slotsPerType', JSON.stringify(activeSlots.map(s => s.slots)));

            // Calculate new total slots
            const computedTotalSlots = activeSlots.reduce((sum, s) => sum + s.slots, 0);
            formData.append('totalSlots', String(computedTotalSlots));

            // Attach images
            form.formState.imageFiles.forEach((file: File) => {
                formData.append('images', file);
            });

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${baseUrl}${API_ENDPOINTS.SPOTS}/${spot.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('park_chain_token') || ''}`,
                },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || data.message || 'Failed to update spot');

            form.setSubmissionState(false);
            setPopupMode('success');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Failed to update spot';
            setLocalError(msg);
            form.setSubmissionState(false, msg);
        }
    };

    // ---------- Cancel ----------
    const handleCancel = () => setPopupMode('confirmDiscard');

    const handleGoToSpots = () => {
        setPopupMode(null);
        form.resetForm();
        if (onSpotUpdated) onSpotUpdated();
        onClose();
    };

    return (
        <div className="flex-1 w-full px-4 py-4 sm:px-6 sm:py-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 space-y-5">
                    {/* Title and address locked; description editable */}
                    <GeneralInfoCard
                        formState={form.formState}
                        setGeneralInfo={form.setGeneralInfo}
                        isSpotIdentityLocked={true}
                    />
                    <PricingCapacityCard
                        slots={form.formState.slots}
                        setSlots={form.setSlots}
                        totalSlots={form.formState.totalSlots}
                        setTotalSlots={form.setTotalSlots}
                        lockSlotCount={false}
                        minSlotsPerType={minSlotsPerType}
                    />
                </div>

                <div className="lg:col-span-2 space-y-5">
                    {/* Images fully editable */}
                    <SpotImagesCard
                        imageFiles={form.formState.imageFiles}
                        setImageFiles={form.setImageFiles}
                        readOnly={false}
                    />
                    {/* Location locked */}
                    <LocationCard
                        latitude={form.formState.latitude}
                        longitude={form.formState.longitude}
                        setLocation={form.setLocation}
                        readOnly={true}
                    />
                </div>
            </div>

            {/* Error Banner */}
            {localError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {localError}
                </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={form.formState.isSubmitting}
                    className="rounded-md bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={form.formState.isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-[#2e7d32] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1b5e20] disabled:opacity-50 transition-colors"
                >
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Portaled Popup — covers navbar and sidebar */}
            {popupMode && typeof document !== 'undefined' && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[9999] bg-gray-100 flex items-center justify-center p-4">
                    <div className="w-full max-w-[540px] rounded-xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden">
                        <div className={`h-2 ${popupMode === 'confirmDiscard' ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`} />
                        <div className="py-14 px-8 text-center">
                            <div className={`mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center ${popupMode === 'confirmDiscard' ? 'border-4 border-[#ef4444]' : 'bg-[#22c55e]'}`}>
                                {popupMode === 'confirmDiscard'
                                    ? <X className="w-8 h-8 text-[#ef4444]" strokeWidth={3} />
                                    : <Check className="w-8 h-8 text-white" strokeWidth={3} />
                                }
                            </div>

                            {popupMode === 'success' ? (
                                <>
                                    <h3 className="text-3xl font-semibold text-gray-900">Successfully Saved!</h3>
                                    <p className="mt-6 text-lg text-gray-600 leading-8 max-w-lg mx-auto">
                                        Your spot details have been updated successfully.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleGoToSpots}
                                        className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#111827] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0f172a]"
                                    >
                                        Back to Spots
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-3xl font-semibold text-[#4a5f72]">Cancel Editing?</h3>
                                    <p className="mt-6 text-lg text-[#7b8794] leading-8 max-w-lg mx-auto">
                                        Any unsaved changes will be lost. Do you want to go back?
                                    </p>
                                    <div className="mt-8 flex items-center justify-center gap-5">
                                        <button
                                            type="button"
                                            onClick={() => setPopupMode(null)}
                                            className="h-12 min-w-[120px] rounded-md bg-[#d8dadd] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#cfd2d6]"
                                        >
                                            Keep Editing
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGoToSpots}
                                            className="h-12 min-w-[120px] rounded-md bg-[#ef3636] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}