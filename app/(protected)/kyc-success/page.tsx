"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/stores/sessionStore";
import { getRoleDashboard } from "@/lib/utils/roleUtils";
import apiService from "@/lib/api/apiService";

function KycSuccessContent() {
  const [status, setStatus] = useState<string>("Checking verification status...");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useSessionStore();

useEffect(() => {
    const verifyStatus = async () => {
      try {
        setStatus("Checking verification status...");
        const urlStatus = searchParams.get('status');
        const sessionId = searchParams.get('verificationSessionId');

        const response = await apiService.get(`/kyc-status?status=${urlStatus || ''}&session=${sessionId || ''}`);

        if (response.kyc_status === 'APPROVED') {
          setStatus("Success! Your identity has been verified.");
          setIsSuccess(true);
          setIsFailed(false);

          // Fetch the user's profile status
          try {
            const profileResponse = await apiService.get('/users/profile');
            // Give the user a moment to see the success message before redirecting 
            setTimeout(() => {
              if (profileResponse.data && profileResponse.data.profileCompleted) {
                router.push(getRoleDashboard(role || 'seller'));
              } else {
                router.push('/seller/complete-profile');
              }
            }, 2000);
          } catch (profileErr) {
            console.error("Error checking profile status after KYC approval:", profileErr);
            setTimeout(() => {
              router.push('/seller/complete-profile');
            }, 2000);
          }
        } else if (response.kyc_status === 'DECLINED' || response.kyc_status === 'FAILED' || response.kyc_status === 'ABANDONED') {
          setStatus("Verification was not completed or declined by Didit.");      
          setIsFailed(true);
          setIsSuccess(false);
        } else {
          // Pending, Not Started, etc.
          setStatus(`Verification is currently: ${response.kyc_status || 'Pending'}. Wait for approval or verify again if incomplete.`);
          setIsFailed(true); // Treat as failed/incomplete so they get the try again button
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Error checking KYC status:", err);
        setStatus("An error occurred while checking your status. Please refresh or try again.");
        setIsFailed(true);
      }
    };

    verifyStatus();
  }, [router, role, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">KYC Status</h1>
        
        <div className={`p-4 rounded-lg text-lg ${isSuccess ? 'bg-green-50 text-green-700' : isFailed ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {status}
        </div>
        
        {isSuccess && (
          <p className="text-sm text-gray-500 animate-pulse">Redirecting to your dashboard...</p>
        )}

        {isFailed && (
          <Button 
            onClick={() => router.push('/kyc')} 
            className="w-full py-6 text-lg mt-4"
          >
            Verify Identity Again
          </Button>
        )}
      </div>
    </div>
  );
}
export default function KycSuccessPage() { return <Suspense fallback={<div>Loading...</div>}><KycSuccessContent /></Suspense>; }
