"use client";

/**
 * FinalizeCard Component
 * Handles spot creation form submission
 * Collects data from all form fields and submits to backend API
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { AddNewSpotFormState } from '@/hooks/useAddNewSpotForm';
import { useRouter } from 'next/navigation';

type PopupMode = 'success' | 'saveSuccess' | 'confirmDiscard' | null;

interface FinalizeCardProps {
    formState: AddNewSpotFormState;
    setSubmissionState: (isSubmitting: boolean, error?: string | null) => void;
    resetForm: () => void;
    prepareSubmissionPayload: () => any;
}

export default function FinalizeCard({
    formState,
    setSubmissionState,
    resetForm,
    prepareSubmissionPayload,
}: FinalizeCardProps) {
    const router = useRouter();
    const [localError, setLocalError] = useState<string | null>(null);
    const [popupMode, setPopupMode] = useState<PopupMode>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            setLocalError(null);
            setSuccessMessage(null);

            // Set submitting state
            setSubmissionState(true);

            // Validate all required fields
            const payload = prepareSubmissionPayload();

            // ✅ FIXED: Clean amenities
            payload.amenities = (payload.amenities || [])
                .map((item: string) => item.trim())
                .filter((item: string) => item.length > 0);

            // Build FormData with explicit fields for backend validators.
            const formData = new FormData();

            formData.append('title', payload.title);
            formData.append('description', payload.description || '');
            formData.append('address', payload.address);
            formData.append('latitude', String(payload.latitude));
            formData.append('longitude', String(payload.longitude));
            formData.append('totalSlots', String(payload.totalSlots));

            // Send array fields as JSON strings so the controller can normalize them safely.
            formData.append('vehicleTypes', JSON.stringify(payload.vehicleTypes || []));
            formData.append('slotsPerType', JSON.stringify(payload.slotsPerType || []));
            formData.append('pricesPerHour', JSON.stringify(payload.pricesPerHour || []));
            formData.append('amenities', JSON.stringify(payload.amenities || []));

            // Append raw image files
            formState.imageFiles.forEach((file: File) => {
                formData.append('images', file);
            });


            // Send to backend with native fetch to preserve FormData headers
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${baseUrl}${API_ENDPOINTS.SPOTS}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('park_chain_token') || ''}`,
                },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to create spot');
            }

            setPopupMode('success');
            setSubmissionState(false);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create spot';
            setLocalError(errorMessage);
            setSubmissionState(false, errorMessage);
        }
    };

    const handleSaveDraft = () => {
        const hasAnyInput = Boolean(
            formState.title.trim() ||
            formState.description.trim() ||
            formState.address.trim() ||
            formState.latitude.trim() ||
            formState.longitude.trim() ||
            formState.amenities.length > 0 ||
            formState.imageFiles.length > 0 ||
            formState.slots.some((slot) => slot.slotType.trim() || slot.slots > 0 || parseFloat(slot.rate) > 0)
        );

        if (!hasAnyInput) return;

        setLocalError(null);
        setSuccessMessage(null);
        setPopupMode('saveSuccess');
    };

    const handleGoToSpots = () => {
        setPopupMode(null);
        resetForm();
        router.push('/seller/spots');
    };

    const handleGoToApprovals = () => {
        setPopupMode(null);
        router.push('/seller/approvals');
    };

    const handleDiscardCancel = () => {
        setPopupMode(null);
    };

    const handleDiscardDelete = () => {
        setPopupMode(null);
        resetForm();
        router.push('/seller/approvals');
    };

    const handleCancel = () => {
        const hasAnyInput = Boolean(
            formState.title.trim() ||
            formState.description.trim() ||
            formState.address.trim() ||
            formState.latitude.trim() ||
            formState.longitude.trim() ||
            formState.amenities.length > 0 ||
            formState.imageFiles.length > 0 ||
            formState.slots.some((slot) => slot.slotType.trim() || slot.slots > 0 || parseFloat(slot.rate) > 0)
        );

        if (!hasAnyInput) return;

        setPopupMode('confirmDiscard');
    };

    const displayMessage = localError || successMessage || formState.submitError;
    const isError = localError || formState.submitError;

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[272px] relative z-0">
                <h2 className="text-sm font-bold text-gray-900 mb-6">Finalize</h2>

                {/* Error/Success Message */}
                {displayMessage && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${isError
                            ? 'bg-red-50 border border-red-200 text-red-700'
                            : 'bg-green-50 border border-green-200 text-green-700'
                        }`}>
                        {displayMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={formState.isSubmitting}
                        className="w-full h-12 rounded-[8px] bg-[#2e7d32] hover:bg-[#1b5e20] disabled:bg-[#7cbf80] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2 group"
                    >
                        <span>{formState.isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
                        {!formState.isSubmitting && (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        )}
                    </Button>

                    <Button
                        onClick={handleSaveDraft}
                        disabled={formState.isSubmitting}
                        variant="outline"
                        className="w-full h-[46px] rounded-[8px] border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
                    >
                        Save Draft
                    </Button>

                    <Button
                        onClick={handleCancel}
                        disabled={formState.isSubmitting}
                        variant="ghost"
                        className="w-full h-[46px] text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium rounded-xl disabled:opacity-50"
                    >
                        Cancel & Discard
                    </Button>
                </div>
            </div>

            {popupMode && (
                <div className="fixed inset-0 z-50 bg-gray-100 flex items-center justify-center p-4">
                    <div className="w-full max-w-[540px] rounded-xl bg-white border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden">
                        <div className={`h-2 ${popupMode === 'confirmDiscard' ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`} />
                        <div className="py-14 px-8 text-center">
                            <div className={`mx-auto mb-8 h-16 w-16 rounded-full flex items-center justify-center ${popupMode === 'confirmDiscard' ? 'border-4 border-[#ef4444]' : 'bg-[#22c55e]'}`}>
                                {popupMode === 'confirmDiscard' ? (
                                    <X className="w-8 h-8 text-[#ef4444]" strokeWidth={3} />
                                ) : (
                                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                                )}
                            </div>
                            {popupMode === 'success' || popupMode === 'saveSuccess' ? (
                                <>
                                    <h3 className="text-3xl font-semibold text-gray-900">Success!</h3>
                                    <p className="mt-6 text-lg text-gray-600 leading-8 max-w-lg mx-auto">
                                        {popupMode === 'saveSuccess'
                                            ? 'Your data has been saved successfully.'
                                            : 'Your spot has been created successfully. We&apos;ll check the spots .'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={popupMode === 'saveSuccess' ? handleGoToApprovals : handleGoToSpots}
                                        className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#111827] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0f172a]"
                                    >
                                        Go back home
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-3xl font-semibold text-[#4a5f72]">Are you sure?</h3>
                                    <p className="mt-6 text-lg text-[#7b8794] leading-8 max-w-lg mx-auto">
                                        Do you really want to delete these records? This process cannot be undone.
                                    </p>
                                    <div className="mt-8 flex items-center justify-center gap-5">
                                        <button
                                            type="button"
                                            onClick={handleDiscardCancel}
                                            className="h-12 min-w-[120px] rounded-md bg-[#d8dadd] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#cfd2d6]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDiscardDelete}
                                            className="h-12 min-w-[120px] rounded-md bg-[#ef3636] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626]"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}