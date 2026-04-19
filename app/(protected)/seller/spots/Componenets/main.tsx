"use client";

import React from "react";
import SpotCard from "./spotCard";

export default function Main() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Spots</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your spot locations and availability.
        </p>
      </div>

      <div className="relative z-0">
        <SpotCard />
      </div>
    </>
  );
}