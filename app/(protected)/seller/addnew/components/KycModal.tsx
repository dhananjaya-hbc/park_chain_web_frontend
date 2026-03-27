'use client';

import React, { useState } from 'react';
import Step1Identity from './Step1Identity';
import Step2LandDetails from './Step2LandDetails';
import Step3Documents from './Step3Documents';
import {
    initialKycDocumentFiles,
    initialKycFormValues,
    KycDocumentFiles,
    KycFormValues,
} from './kycTypes';

export default function KycModal({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formValues, setFormValues] = useState<KycFormValues>(initialKycFormValues);
    const [documentFiles, setDocumentFiles] = useState<KycDocumentFiles>(initialKycDocumentFiles);

    const handleFieldChange = (name: keyof KycFormValues, value: string | boolean | string[]) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (name: keyof KycDocumentFiles, file: File | null) => {
        setDocumentFiles((prev) => ({ ...prev, [name]: file }));
    };

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!formValues.fullName || !formValues.nicNumber || !formValues.dateOfBirth || !formValues.gender) {
                return 'Please complete all required identity fields.';
            }
            if (!documentFiles.nicFront || !documentFiles.nicBack) {
                return 'Please upload NIC front and NIC back images.';
            }
        }

        if (currentStep === 2) {
            if (
                !formValues.propertyName ||
                !formValues.fullAddress ||
                !formValues.mapsLink ||
                !formValues.parkingType ||
                !formValues.numberOfSlots
            ) {
                return 'Please complete all required land details fields.';
            }
            if (formValues.supportedVehicleTypes.length === 0) {
                return 'Please select at least one supported vehicle type.';
            }
        }

        if (currentStep === 3) {
            if (!formValues.ownershipDocumentType) {
                return 'Please select an ownership document type.';
            }
            if (!documentFiles.legalDocument || !documentFiles.utilityBill) {
                return 'Please upload legal document and utility bill files.';
            }
            if (!formValues.agreementAccepted) {
                return 'You must accept the agreement before submitting.';
            }
        }

        return '';
    };

    const nextStep = () => {
        const validationError = validateCurrentStep();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateCurrentStep();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const payload = new FormData();

            payload.append('fullName', formValues.fullName);
            payload.append('nicNumber', formValues.nicNumber);
            payload.append('dateOfBirth', formValues.dateOfBirth);
            payload.append('gender', formValues.gender);
            payload.append('propertyName', formValues.propertyName);
            payload.append('fullAddress', formValues.fullAddress);
            payload.append('mapsLink', formValues.mapsLink);
            payload.append('parkingType', formValues.parkingType);
            payload.append('numberOfSlots', formValues.numberOfSlots);
            payload.append('supportedVehicleTypes', JSON.stringify(formValues.supportedVehicleTypes));
            payload.append('ownershipDocumentType', formValues.ownershipDocumentType);
            payload.append('agreementAccepted', String(formValues.agreementAccepted));

            if (documentFiles.nicFront) payload.append('nicFront', documentFiles.nicFront);
            if (documentFiles.nicBack) payload.append('nicBack', documentFiles.nicBack);
            if (documentFiles.selfie) payload.append('selfie', documentFiles.selfie);
            if (documentFiles.legalDocument) payload.append('legalDocument', documentFiles.legalDocument);
            if (documentFiles.utilityBill) payload.append('utilityBill', documentFiles.utilityBill);

            const sellerEmail = localStorage.getItem('seller_email');
            const sellerWallet = localStorage.getItem('seller_wallet');
            const token = localStorage.getItem('token'); // Get auth token if required by external backend
            
            if (sellerEmail) payload.append('sellerEmail', sellerEmail);
            if (sellerWallet) payload.append('sellerWallet', sellerWallet);

            // POST to the external backend API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/seller/kyc`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: payload,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.error || 'Failed to submit KYC data.');
            }

            onComplete();
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : 'Failed to submit KYC data.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
                
                {/* Stepper Header */}
                <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-4 border-b border-gray-100 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">KYC Verification</h2>
                    
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                        <div 
                            className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 transition-all duration-300 -z-10 ${
                                currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-1/2' : 'w-full'
                            }`}
                        ></div>

                        {/* Steps */}
                        {['Identity', 'Land Details', 'Documents'].map((step, index) => {
                            const stepNum = index + 1;
                            const isActive = currentStep >= stepNum;
                            return (
                                <div key={step} className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>
                                        {isActive && currentStep > stepNum ? '✓' : stepNum}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 px-8 py-6 space-y-6">
                    {currentStep === 1 && (
                        <Step1Identity
                            values={formValues}
                            files={documentFiles}
                            onFieldChange={handleFieldChange}
                            onFileChange={handleFileChange}
                        />
                    )}
                    {currentStep === 2 && <Step2LandDetails values={formValues} onFieldChange={handleFieldChange} />}
                    {currentStep === 3 && (
                        <Step3Documents
                            values={formValues}
                            files={documentFiles}
                            onFieldChange={handleFieldChange}
                            onFileChange={handleFileChange}
                        />
                    )}

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Footer / Controls */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-8">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Back
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:bg-green-400"
                            >
                                {loading ? 'Submitting...' : 'Submit Verification'}
                            </button>
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
}