"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/stores/sessionStore";
import { getRoleDashboard } from "@/lib/utils/roleUtils";

export default function KycSuccessPage() {
  const router = useRouter();
  const { role } = useSessionStore();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Optionally wait a second or automatically redirect to the user's dashboard
    const timer = setTimeout(() => {
      const dashboardUrl = getRoleDashboard(role || 'seller');
      router.push(dashboardUrl);
    }, 3000);

    return () => clearTimeout(timer);
  }, [role, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-green-600">Verification Submitted</h1>
        <p className="text-gray-600">
          Your identity verification has been received. Our backend will process the approval shortly via Didit webhooks.
        </p>
        
        <p className="text-sm text-gray-500">
          Redirecting you to your dashboard...
        </p>

        <Button 
          onClick={() => router.push(getRoleDashboard(role || 'seller'))} 
          className="w-full"
        >
          Go to Dashboard Now
        </Button>
      </div>
    </div>
  );
}
