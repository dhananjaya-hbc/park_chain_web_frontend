"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

function AddNewSpotPage() {
  const [formData, setFormData] = useState({
    spotName: '',
    description: '',
    carSlots: 0,
    carHourlyRate: 0,
    bikeSlots: 0,
    bikeHourlyRate: 0,
    features: {
      cctv: false,
      security247: false,
      covered: false,
      evCharging: false,
      disabledAccess: false,
      gatedEntry: false,
    }
  });

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={true} 
        setIsOpen={() => {}} 
        handleLogout={() => console.log('Logout')} 
        disconnectLoading={false}
        role="seller"
        currentPage="add-new"
      />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Parking Spot</h1>
          <p className="text-gray-500">Configure your new location details and availability below.</p>
        </div>

        <div className="flex gap-8">
          {/* Left Column - Form */}
          <div className="flex-1 space-y-6">
            {/* Admin Review Notice */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-shield-check-line text-red-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Admin Review Required</h3>
                  <p className="text-sm text-gray-600">
                    For quality assurance and safety, all new parking spots require admin approval before going live on the platform. 
                    The review process typically takes less than 24 hours. You will be notified via email immediately once approved.
                  </p>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">General Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spot Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Secure Downtown Garage"
                    value={formData.spotName}
                    onChange={(e) => setFormData({ ...formData, spotName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      <i className="ri-information-line"></i>
                    </span>
                  </label>
                  <textarea
                    placeholder="Describe the accessibility, surroundings, and specific instructions for drivers..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing & Capacity</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Car Slots</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.carSlots || ''}
                      onChange={(e) => setFormData({ ...formData, carSlots: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.carHourlyRate || ''}
                      onChange={(e) => setFormData({ ...formData, carHourlyRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bike Slots</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.bikeSlots || ''}
                      onChange={(e) => setFormData({ ...formData, bikeSlots: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.bikeHourlyRate || ''}
                      onChange={(e) => setFormData({ ...formData, bikeHourlyRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'cctv', label: 'CCTV' },
                  { key: 'security247', label: '24/7 Security' },
                  { key: 'covered', label: 'Covered' },
                  { key: 'evCharging', label: 'EV Charging' },
                  { key: 'disabledAccess', label: 'Disabled Access' },
                  { key: 'gatedEntry', label: 'Gated Entry' },
                ].map((feature) => (
                  <label key={feature.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features[feature.key as keyof typeof formData.features]}
                      onChange={() => handleFeatureToggle(feature.key)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload & Actions */}
          <div className="w-80 space-y-6">
            {/* Spot Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Spot Images</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100">
                  <i className="ri-upload-cloud-line text-2xl text-gray-400 group-hover:text-green-500"></i>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG (max 10MB)</p>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Preview
              </button>
            </div>

            {/* Finalize Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Finalize</h2>
              
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  Submit for Review
                  <i className="ri-arrow-right-line"></i>
                </button>
                
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Save Draft
                </button>
                
                <button className="w-full text-gray-500 py-3 rounded-xl font-medium hover:text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel & Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewSpotPage;
