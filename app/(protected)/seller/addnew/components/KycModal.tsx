'use client';

import React, { useState } from 'react';
import Step1Identity from './Step1Identity';
import Step2LandDetails from './Step2LandDetails';
import Step3Documents from './Step3Documents';

export default function KycModal({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(1);
    const[loading, setLoading] = useState(false);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call to submit all KYC data
        setTimeout(() => {
            setLoading(false);
            onComplete();
        }, 2000);
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
                    {currentStep === 1 && <Step1Identity />}
                    {currentStep === 2 && <Step2LandDetails />}
                    {currentStep === 3 && <Step3Documents />}

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