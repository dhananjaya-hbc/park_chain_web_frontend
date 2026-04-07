"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function KYBModal() {
  const [isOpen, setIsOpen] = useState(true); // Default open for demonstration
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);

    // Make sure we connect directly to the Backend rather than the Next.js frontend proxy
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    try {
      const response = await fetch(`${baseUrl}/kyb`, {
        method: 'POST',
        headers: {
          // If your backend needs to know which user this is, we pass the token from localStorage
          'Authorization': `Bearer ${localStorage.getItem('park_chain_token') || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit verification');
      }

      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="text-center py-12 px-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Under Review</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your parking spot details have been submitted successfully. This is currently under review and should not take more than 24 hours.
            </p>
            <Button onClick={() => router.push('/seller/dashboard')} className="w-full sm:w-auto px-8">
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Verify Your Parking Spot (KYB)</h2>
              <p className="text-sm text-gray-500 mt-2">
                Please provide details about the location/entity you are registering. This information will be reviewed by administrators.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Entity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity / Spot Name
            </label>
            <input
              type="text"
              name="entityName"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. City Center Plaza Parking"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full address"
              rows={3}
              required
            ></textarea>
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Link
            </label>
            <input
              type="url"
              name="googleMapsLink"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://maps.google.com/..."
            />
          </div>

          {/* Spot Type Selection */}
          <div>
            <label htmlFor="spotType" className="block text-sm font-medium text-gray-700 mb-1">
              Spot Type
            </label>
            <select
              id="spotType"
              name="spotType"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              defaultValue=""
            >
              <option value="" disabled>Select spot type</option>
              <option value="garage">Garage</option>
              <option value="open">Open Lot</option>
              <option value="covered">Covered Parking</option>
              <option value="driveway">Driveway</option>
              <option value="underground">Underground Structure</option>
            </select>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proof of Ownership / Residency (Utility Bill &lt; 3 months)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="document" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="document" name="document" type="file" className="sr-only" required accept=".png,.jpg,.jpeg,.pdf" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" className="mr-3" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}