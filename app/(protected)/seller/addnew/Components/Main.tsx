import React, { useEffect, useState } from 'react';
import AdminReviewAlert from './AdminReviewAlert';
import GeneralInfoCard from './GeneralInfoCard';
import PricingCapacityCard from './PricingCapacityCard';
import SpotImagesCard from './SpotImagesCard';
import LocationCard from '@/app/(protected)/seller/addnew/Components/LocationCard';
import { useAddNewSpotForm } from '@/hooks/useAddNewSpotForm';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KybData {
    kybId?: string | number;
    name?: string;
    address?: string;
    entityName?: string;
    googleMapsLink?: string;
}

type PopupMode = 'success' | 'confirmDiscard' | null;

/**
 * Extracts latitude and longitude from a Google Maps URL.
 *
 * Supports formats:
 *  - https://www.google.com/maps/@12.9716,77.5946,15z
 *  - https://maps.app.goo.gl/... (short link — cannot parse client-side, returns null)
 *  - https://www.google.com/maps/place/.../@12.9716,77.5946,...
 *  - https://maps.google.com/?q=12.9716,77.5946
 */
function parseLatLngFromMapsUrl(url: string): { lat: string; lng: string } | null {
    if (!url) return null;

    // Pattern 1: /@lat,lng  or  /place/.../@lat,lng
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };

    // Pattern 2: ?q=lat,lng  or  &q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };

    // Pattern 3: /maps/place/lat,lng (rare)
    const placeMatch = url.match(/maps\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (placeMatch) return { lat: placeMatch[1], lng: placeMatch[2] };

    return null;
}

export default function Main({ kybId }: { kybId?: string }) {
    const router = useRouter();
    const form = useAddNewSpotForm();

    // KYB prefill locks
    const [isSpotIdentityLocked, setIsSpotIdentityLocked] = useState(false);
    const [isLocationLocked, setIsLocationLocked] = useState(false);

    // Submission UI state (lifted from FinalizeCard)
    const [localError, setLocalError] = useState<string | null>(null);
    const [popupMode, setPopupMode] = useState<PopupMode>(null);

    useEffect(() => {
        if (!kybId) return;

        const loadKybData = async () => {
            try {
                const kybData: KybData = await apiService.get(`/seller/kyb/${kybId}`);
                const spotName = kybData.name || kybData.entityName || '';
                const spotAddress = kybData.address || '';

                form.setGeneralInfo({ title: spotName, address: spotAddress });
                form.setKybSubmissionId(String(kybData.kybId || kybId));
                setIsSpotIdentityLocked(true);

                // Parse lat/lng from Google Maps link and auto-fill location
                if (kybData.googleMapsLink) {
                    const coords = parseLatLngFromMapsUrl(kybData.googleMapsLink);
                    if (coords) {
                        form.setLocation(coords.lat, coords.lng);
                        setIsLocationLocked(true);
                    }
                }
            } catch (error) {
                console.error('Failed to load KYB data:', error);
                setIsSpotIdentityLocked(false);
                setIsLocationLocked(false);
            }
        };

        loadKybData();
    }, [kybId, form]);

    // ---------- Submit handler ----------
    const handleSubmit = async () => {
        try {
            setLocalError(null);
            form.setSubmissionState(true);

            const payload = form.prepareSubmissionPayload();

            // Validate all required fields
            if (!payload.title) throw new Error('Spot name is required.');
            if (!payload.description) throw new Error('Description is required.');
            if (!payload.address) throw new Error('Address is required.');
            if (!payload.latitude) throw new Error('Location (latitude) is required.');
            if (!payload.longitude) throw new Error('Location (longitude) is required.');
            if (!form.formState.imageFiles.length) throw new Error('At least one spot image is required.');

            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('description', payload.description || '');
            formData.append('address', payload.address);
            formData.append('latitude', String(payload.latitude));
            formData.append('longitude', String(payload.longitude));
            formData.append('totalSlots', String(payload.totalSlots));
            formData.append('vehicleTypes', JSON.stringify(payload.vehicleTypes || []));
            formData.append('slotsPerType', JSON.stringify(payload.slotsPerType || []));
            formData.append('pricesPerHour', JSON.stringify(payload.pricesPerHour || []));

            if (form.formState.kybSubmissionId) {
                formData.append('kybSubmissionId', String(form.formState.kybSubmissionId));
            }

            form.formState.imageFiles.forEach((file: File) => {
                formData.append('images', file);
            });

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${baseUrl}${API_ENDPOINTS.SPOTS}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('park_chain_token') || ''}`,
                },
                body: formData,
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || data.message || 'Failed to create spot');

            setPopupMode('success');
            form.setSubmissionState(false);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Failed to create spot';
            setLocalError(msg);
            form.setSubmissionState(false, msg);
        }
    };

    // ---------- Cancel / discard handler ----------
    const handleCancel = () => {
        const hasAnyInput = Boolean(
            form.formState.title.trim() ||
            form.formState.description.trim() ||
            form.formState.address.trim() ||
            form.formState.latitude.trim() ||
            form.formState.longitude.trim() ||
            form.formState.imageFiles.length > 0 ||
            form.formState.slots.some((slot) => slot.slotType.trim() || slot.slots > 0 || parseFloat(slot.rate) > 0)
        );
        if (!hasAnyInput) return;
        setPopupMode('confirmDiscard');
    };

    const handleGoToSpots = () => {
        setPopupMode(null);
        form.resetForm();
        router.push('/seller/spots');
    };

    const handleDiscardCancel = () => setPopupMode(null);

    const handleDiscardDelete = () => {
        setPopupMode(null);
        form.resetForm();
        router.push('/seller/approvals');
    };

    const displayError = localError || form.formState.submitError;

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Parking Spot</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Fill in the details of your parking spot to get started
                </p>
            </div>

            <AdminReviewAlert />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Left Column: General Info + Pricing */}
                <div className="lg:col-span-3 space-y-5">
                    <GeneralInfoCard formState={form.formState} setGeneralInfo={form.setGeneralInfo} isSpotIdentityLocked={isSpotIdentityLocked} />
                    <PricingCapacityCard slots={form.formState.slots} setSlots={form.setSlots} totalSlots={form.formState.totalSlots} setTotalSlots={form.setTotalSlots} />
                </div>

                {/* Right Column: Spot Images + Location */}
                <div className="lg:col-span-2 space-y-5">
                    <SpotImagesCard
                        imageFiles={form.formState.imageFiles}
                        setImageFiles={form.setImageFiles}
                    />
                    <LocationCard
                        latitude={form.formState.latitude}
                        longitude={form.formState.longitude}
                        setLocation={form.setLocation}
                        readOnly={isLocationLocked}
                    />
                </div>
            </div>

            {/* Error Banner — shown below the cards, above action buttons */}
            {displayError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {displayError}
                </div>
            )}

            {/* Bottom Action Buttons — styled to match SpotDetailsPreview bottom bar */}
            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={form.formState.isSubmitting}
                    className="rounded-md bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                    Cancel &amp; Discard
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={form.formState.isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-[#2e7d32] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1b5e20] disabled:bg-[#7cbf80] transition-colors"
                >
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>

            {/* Success / Discard Popup */}
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
                            {popupMode === 'success' ? (
                                <>
                                    <h3 className="text-3xl font-semibold text-gray-900">Success!</h3>
                                    <p className="mt-6 text-lg text-gray-600 leading-8 max-w-lg mx-auto">
                                        Your spot has been created successfully. We&apos;ll check the spot details.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleGoToSpots}
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