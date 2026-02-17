"use client";

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function SellerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={true} 
        setIsOpen={() => {}} 
        handleLogout={() => console.log('Logout')} 
        disconnectLoading={false}
        role="seller"
        currentPage="dashboard"
      />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-500 mb-8">Welcome back, here's what's happening with your spots today.</p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="ri-arrow-up-line text-green-600"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">$4,250<span className="text-lg text-gray-400">.00</span></p>
            <p className="text-sm text-green-600 mt-2">+12.5% <span className="text-gray-500">from last month</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Active Spots</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <i className="ri-home-smile-line text-blue-600"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500 mt-2">Currently listed</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Occupancy</p>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-purple-600"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-green-600 mt-2">+5% <span className="text-gray-500">this week</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-3">Spot Locations</p>
            <div className="h-24 mb-3 rounded-lg overflow-hidden bg-gray-100">
              <div className="w-full h-full relative">
                <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-6 w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="absolute bottom-6 left-8 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
        </div>

        {/* Earnings Overview Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">Week</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">Month</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">Year</button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-b from-gray-50 to-white rounded-lg flex items-end p-4">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#4CAF50', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#4CAF50', stopOpacity: 0}} />
                </linearGradient>
              </defs>
              <path d="M 0 150 Q 150 120, 300 100 T 600 60" fill="url(#lineGradient)" />
              <path d="M 0 150 Q 150 120, 300 100 T 600 60" fill="none" stroke="#4CAF50" strokeWidth="2" />
              <circle cx="300" cy="100" r="4" fill="#4CAF50" />
              <circle cx="600" cy="60" r="4" fill="#4CAF50" />
            </svg>
          </div>
        </div>

        {/* Parking Spots Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Parking Spots <span className="text-gray-400 font-normal text-base">15 Total</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Spot ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Earnings (Mo)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">A-101</td>
                  <td className="py-4 px-4 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">123 Main St, Downtown</td>
                  <td className="py-4 px-4 text-sm text-gray-600">Covered</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Active</span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">$450.00</td>
                  <td className="py-4 px-4">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Manage</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">B-205</td>
                  <td className="py-4 px-4 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">456 Oak Ave, Westside</td>
                  <td className="py-4 px-4 text-sm text-gray-600">Open Air</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Active</span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">$320.00</td>
                  <td className="py-4 px-4">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Manage</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">C-302</td>
                  <td className="py-4 px-4 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">789 Pine Ln, North</td>
                  <td className="py-4 px-4 text-sm text-gray-600">Garage</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">Inactive</span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-400">$0.00</td>
                  <td className="py-4 px-4">
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-700">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All Spots</button>
          </div>
        </div>
      </div>
    </div>
  );
}
