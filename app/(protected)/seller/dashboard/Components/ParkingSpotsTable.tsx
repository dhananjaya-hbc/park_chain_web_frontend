"use client";

import React from "react";

interface ParkingSpot {
  id: string;
  location: string;
  type: "Covered" | "Open Air" | "Garage";
  status: "Active" | "Inactive";
  earningsPerMonth: number;
}

const PARKING_SPOTS: ParkingSpot[] = [
  {
    id: "A-101",
    location: "123 Main St, Downtown",
    type: "Covered",
    status: "Active",
    earningsPerMonth: 450.0,
  },
  {
    id: "B-205",
    location: "456 Oak Ave, Westside",
    type: "Open Air",
    status: "Active",
    earningsPerMonth: 320.0,
  },
  {
    id: "C-302",
    location: "789 Pine Ln, North",
    type: "Garage",
    status: "Inactive",
    earningsPerMonth: 0.0,
  },
];

export default function ParkingSpotsTable() {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#F9FAFB80]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-900">Your Parking Spots</h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full">
            15 Total
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Spot ID</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Location</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Type</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Status</th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">
                Earnings (Mo)
              </th>
              <th className="text-left text-sm font-bold text-[#6B7280] px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PARKING_SPOTS.map((spot) => (
              <tr key={spot.id} className="transition-colors hover:bg-gray-50">
                <td
                  className={`px-6 py-4 font-bold ${
                    spot.status === "Active" ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  {spot.id}
                </td>
                <td
                  className={`px-6 py-4 ${
                    spot.status === "Active" ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {spot.location}
                </td>
                <td
                  className={`px-6 py-4 ${
                    spot.status === "Active" ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {spot.type}
                </td>

                <td className="px-6 py-4">
                  {spot.status === "Active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                      Inactive
                    </span>
                  )}
                </td>

                <td
                  className={`px-6 py-4 font-medium ${
                    spot.status === "Active" ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  ${spot.earningsPerMonth.toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  {spot.status === "Active" ? (
                    <button className="text-xs font-semibold text-gray-700 hover:text-[#41ab5d] transition-colors">
                      Manage
                    </button>
                  ) : (
                    <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-100 px-6 py-4 text-center bg-[#F9FAFB80]">
        <button className="text-sm font-semibold text-[#41ab5d] hover:text-[#2e7d32] transition-colors">
          View All Spots
        </button>
      </div>
    </div>
  );
}