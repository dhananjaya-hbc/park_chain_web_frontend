import React from 'react';

export default function GeneralInfo() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">General Information</h3>
      
      <div className="space-y-4">
        <div>
          {/* Added htmlFor */}
          <label htmlFor="spotName" className="block text-sm text-gray-600 mb-1">
            Spot Name
          </label>
          {/* Added id, placeholder, and title */}
          <input 
            id="spotName"
            name="spotName"
            type="text" 
            placeholder="e.g. Secure Downtown Garage" 
            title="Enter the name of your parking spot"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        
        <div>
          {/* Added htmlFor */}
          <label htmlFor="spotDescription" className="block text-sm text-gray-600 mb-1">
            Description
          </label>
          {/* Added id, placeholder, and title */}
          <textarea 
            id="spotDescription"
            name="spotDescription"
            rows={4} 
            placeholder="Describe the accessibility, surroundings, and specific instructions for drivers..." 
            title="Describe your parking spot"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
}