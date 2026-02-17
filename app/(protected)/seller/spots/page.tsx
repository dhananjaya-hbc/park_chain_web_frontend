"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

function SpotsPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={true} 
        setIsOpen={() => {}} 
        handleLogout={() => console.log('Logout')} 
        disconnectLoading={false}
        role="seller"
        currentPage="spots"
      />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Manage Parking Spots</h1>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <i className="ri-download-line"></i>
            Export Report
          </button>
        </div>
        <p className="text-gray-500 mb-8">View details, edit availability, and track performance of your locations.</p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <i className="ri-home-4-line text-purple-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Active Now</p>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <i className="ri-bar-chart-box-line text-blue-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">75%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Earnings (30d)</p>
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-yellow-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">482.5 <span className="text-lg text-gray-500">XRP</span></p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name, address or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'inactive' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Inactive
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-50">
                <i className="ri-filter-3-line text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Parking Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Spot Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white text-green-600 rounded-full text-xs font-medium flex items-center gap-1">
                <i className="ri-checkbox-circle-fill"></i>
                Active
              </span>
            </div>
            <div className="mt-16 mb-4">
              <h3 className="text-xl font-bold mb-1">Downtown Garage A1</h3>
              <p className="text-green-50 text-sm flex items-center gap-1">
                <i className="ri-map-pin-line"></i>
                123 Main St, Central District
              </p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-100 text-xs">Rate</p>
                <p className="text-lg font-bold">15 XRP/hr</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Rating</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  4.8 <i className="ri-star-fill text-yellow-300 text-sm"></i>
                </p>
              </div>
            </div>
            <button className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
              Edit Details
            </button>
          </div>

          {/* Inactive Spot Card */}
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1">
                <i className="ri-close-circle-line"></i>
                Inactive
              </span>
            </div>
            <div className="mt-16 mb-4">
              <h3 className="text-xl font-bold mb-1">Residential Driveway #4</h3>
              <p className="text-gray-200 text-sm flex items-center gap-1">
                <i className="ri-map-pin-line"></i>
                45 Elm St, Suburbia
              </p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-300 text-xs">Rate</p>
                <p className="text-lg font-bold">8 XRP/hr</p>
              </div>
              <div>
                <p className="text-gray-300 text-xs">Rating</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  4.5 <i className="ri-star-fill text-yellow-300 text-sm"></i>
                </p>
              </div>
            </div>
            <button className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Edit Details
            </button>
          </div>

          {/* Active Spot Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white text-green-600 rounded-full text-xs font-medium flex items-center gap-1">
                <i className="ri-checkbox-circle-fill"></i>
                Active
              </span>
            </div>
            <div className="mt-16 mb-4">
              <h3 className="text-xl font-bold mb-1">Metro Center Spot</h3>
              <p className="text-green-50 text-sm flex items-center gap-1">
                <i className="ri-map-pin-line"></i>
                67 Broadway, Metro Area
              </p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-100 text-xs">Rate</p>
                <p className="text-lg font-bold">20 XRP/hr</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Rating</p>
                <p className="text-lg font-bold flex items-center gap-1">
                  5.0 <i className="ri-star-fill text-yellow-300 text-sm"></i>
                </p>
              </div>
            </div>
            <button className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
              Edit Details
            </button>
          </div>

          {/* Add Another Spot Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[320px] hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <i className="ri-add-line text-3xl text-gray-400 group-hover:text-green-500"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add Another Spot</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Maximize your earnings by listing more parking locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotsPage;