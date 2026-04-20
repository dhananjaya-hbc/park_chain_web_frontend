import React, { useEffect, useState } from 'react';
import AdminReviewAlert from './AdminReviewAlert';
import GeneralInfoCard from './GeneralInfoCard';
import AmenitiesCard from './AmenitiesCard';
import PricingCapacityCard from './PricingCapacityCard';
import SpotImagesCard from './SpotImagesCard';
import LocationCard from '@/app/(protected)/seller/addnew/Components/LocationCard';
import FinalizeCard from './FinalizeCard';
import { useAddNewSpotForm } from '@/hooks/useAddNewSpotForm';
import apiService from '@/lib/api/apiService';

interface KybData {
    kybId?: string | number;
    name?: string;
    address?: string;
    entityName?: string;
}

export default function Main({ kybId }: { kybId?: string }) {
    // Initialize form state hook for managing all form data
    const form = useAddNewSpotForm();
    const [isSpotIdentityLocked, setIsSpotIdentityLocked] = useState(false);

    useEffect(() => {
        if (!kybId) return;

        const loadKybData = async () => {
            try {
                const kybData: KybData = await apiService.get(`/seller/kyb/${kybId}`);
                const spotName = kybData.name || kybData.entityName || '';
                const spotAddress = kybData.address || '';

                form.setGeneralInfo({
                    title: spotName,
                    address: spotAddress,
                });
                form.setKybSubmissionId(String(kybData.kybId || kybId));
                setIsSpotIdentityLocked(true);
            } catch (error) {
                console.error('Failed to load KYB data:', error);
                setIsSpotIdentityLocked(false);
            }
        };

        loadKybData();
    }, [kybId, form]);

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
                {/* Left Column: General Info + Pricing + Amenities */}
                <div className="lg:col-span-3 space-y-5">
                    <GeneralInfoCard formState={form.formState} setGeneralInfo={form.setGeneralInfo} isSpotIdentityLocked={isSpotIdentityLocked} />
                    <PricingCapacityCard slots={form.formState.slots} setSlots={form.setSlots} totalSlots={form.formState.totalSlots} setTotalSlots={form.setTotalSlots} />
                    <AmenitiesCard amenities={form.formState.amenities} setAmenities={form.setAmenities} />
                </div>

                {/* Right Column: Spot Images + Location + Finalize */}
                <div className="lg:col-span-2 space-y-5">
                    <SpotImagesCard
                        imageFiles={form.formState.imageFiles}
                        setImageFiles={form.setImageFiles}
                    />
                    <LocationCard latitude={form.formState.latitude} longitude={form.formState.longitude} setLocation={form.setLocation} />
                    <FinalizeCard formState={form.formState} setSubmissionState={form.setSubmissionState} resetForm={form.resetForm} prepareSubmissionPayload={form.prepareSubmissionPayload} kybSubmissionId={form.formState.kybSubmissionId} />
                </div>
            </div>
        </>
    );
}