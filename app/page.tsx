"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function Redirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve query parameters (like ?code=... from OAuth providers such as Xaman)
    const paramsString = searchParams.toString();
    router.replace(paramsString ? `/login?${paramsString}` : '/login');
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
      <p className="text-white mt-4">Redirecting to login...</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#41ab5d] via-[#52b86d] to-[#41ab5d]">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      }>
        <Redirector />
      </Suspense>
    </div>
  );
}
