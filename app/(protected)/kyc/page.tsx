"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import apiService from "@/lib/api/apiService";

export default function KycPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const startKYC = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Call your own backend to start a session using apiService
      const data = await apiService.post('/create-didit-session');

      // REDIRECT THE USER DIRECTLY TO DIDIT (No pop-up window)
      if (data.didit_url) {
        window.location.href = data.didit_url;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = 'An error occurred starting KYC';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'error' in err) {
        errorMessage = String((err as Record<string, unknown>).error);
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Verify Your Identity</h1>
        <p className="text-gray-600">
          To keep our platform secure, we require all users to complete a quick identity verification step using Didit.
        </p>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          onClick={startKYC} 
          disabled={isLoading}
          className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? "Starting Verification..." : "Verify Identity"}
        </Button>
      </div>
    </div>
  );
}
