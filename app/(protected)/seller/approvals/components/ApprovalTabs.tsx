"use client";

import { useState } from "react";

const tabs = ["All Requests", "Pending", "Verified", "Rejected"];

export default function ApprovalTabs() {
  const [activeTab, setActiveTab] = useState("All Requests");

  return (
    <div className="bg-[#f1f3f5] p-1 rounded-lg inline-flex mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}