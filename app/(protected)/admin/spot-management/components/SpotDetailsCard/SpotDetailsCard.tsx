'use client'; // Required for useRouter

import React from 'react';
import { useRouter } from 'next/navigation';

// Interface matches your Spot data structure
export interface Spot {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  is_available: boolean;
  description?: string;
  address?: string;
}

interface SpotDetailsCardProps {
  spot: Spot;
}


export default function SpotDetailsCard({ spot }: SpotDetailsCardProps) {
  const router = useRouter();

  // Navigation Handler
  const handleViewDetails = () => {
    // Navigate to the dynamic details page
    router.push(`/admin/spot-management/view-details/${spot.id}`);
  };

  return (
    <div className="min-w-[200px] max-w-[250px] p-1 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 text-base leading-tight mr-2">
          {spot.title}
        </h3>
        
        {/* Status Badge */}
        <span 
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            spot.is_available 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          {spot.is_available ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Content Section */}
      <div className="text-sm text-gray-600 space-y-1">
        {spot.address && (
          <p className="flex items-center gap-1">
            <span className="opacity-70">📍</span> {spot.address}
          </p>
        )}
        
        {spot.description ? (
          <p className="mt-2 text-gray-700 line-clamp-3">
            {spot.description}
          </p>
        ) : (
          <p className="italic text-gray-400 text-xs mt-1">
            No description available.
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
        <button 
          onClick={handleViewDetails}
          className="text-xs font-semibold text-[#197729] hover:text-green-700 transition-colors flex items-center gap-1"
        >
          View Full Details <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
