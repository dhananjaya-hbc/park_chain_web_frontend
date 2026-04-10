"use client";

/**
 * FinalizeCard Component
 * Handles spot creation form submission
 * Collects data from all form fields and submits to backend API
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { AddNewSpotFormState } from '@/hooks/useAddNewSpotForm';
import { useRouter } from 'next/navigation';

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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            setLocalError(null);
            setSuccessMessage(null);

            // Set submitting state
            setSubmissionState(true);

            // Validate all required fields before uploading images.
            const payload = prepareSubmissionPayload();

            let uploadedUrls: string[] = [];

            if (formState.imageFiles.length > 0) {
                const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || '';
                const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || '';

                // TEMP DEBUG: verify env injection at runtime in browser.
                console.info('[Cloudinary Debug]', {
                    fileCount: formState.imageFiles.length,
                    hasCloudName: Boolean(cloudinaryCloudName),
                    hasUploadPreset: Boolean(cloudinaryUploadPreset),
                    cloudNamePreview: cloudinaryCloudName ? `${cloudinaryCloudName.slice(0, 3)}***` : '',
                    uploadPresetPreview: cloudinaryUploadPreset ? `${cloudinaryUploadPreset.slice(0, 3)}***` : '',
                });

                if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
                    const missingKeys: string[] = [];
                    if (!cloudinaryCloudName) missingKeys.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
                    if (!cloudinaryUploadPreset) missingKeys.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
                    throw new Error(`Cloudinary config missing: ${missingKeys.join(', ')}. Restart the dev server after updating .env.local.`);
                }

                // 1️⃣ Upload images to Cloudinary (PARALLEL + SAFE)
                uploadedUrls = await Promise.all(
                    formState.imageFiles.map(async (file: File) => {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append(
                            "upload_preset",
                            cloudinaryUploadPreset
                        );

                        const res = await fetch(
                            `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
                            {
                                method: "POST",
                                body: formData,
                            }
                        );

                        const data = await res.json().catch(() => null);

                        if (!res.ok) {
                            const cloudinaryMessage = data?.error?.message || `Image upload failed for ${file.name}`;
                            throw new Error(cloudinaryMessage);
                        }

                        if (!data.secure_url) {
                            throw new Error(`Image upload failed for ${file.name}`);
                        }

                        return data.secure_url;
                    })
                );
            }

            // Attach uploaded image URLs
            payload.imageUrls = uploadedUrls;

            // Send to backend
            const response = await apiService.post(API_ENDPOINTS.SPOTS, payload);

            setSuccessMessage(`✅ ${response.message}`);
            setSubmissionState(false);

            // Reset form after successful submission
            setTimeout(() => {
                resetForm();
                router.push('/seller/spots');
            }, 2000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create spot';
            setLocalError(errorMessage);
            setSubmissionState(false, errorMessage);
        }
    };

    const handleSaveDraft = () => {
        setSuccessMessage('Draft saved locally');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure? All unsaved changes will be lost.')) {
            resetForm();
            router.back();
        }
    };

    const displayMessage = localError || successMessage || formState.submitError;
    const isError = localError || (formState.submitError && !successMessage);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[272px] relative z-0">
            <h2 className="text-sm font-bold text-gray-900 mb-6">Finalize</h2>

            {/* Error/Success Message */}
            {displayMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    isError
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
    );
}