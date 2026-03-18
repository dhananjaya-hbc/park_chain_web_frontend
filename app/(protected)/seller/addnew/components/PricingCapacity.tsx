import React from 'react';

export default function PricingCapacity() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Pricing & Capacity</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Car Slots */}
        <div>
          <label htmlFor="carSlots" className="block text-sm text-gray-600 mb-1">Car Slots</label>
          <input 
            id="carSlots"
            name="carSlots"
            type="number" 
            placeholder="0" 
            title="Number of car parking slots"
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
          />
        </div>
        
        {/* Car Hourly Rate */}
        <div>
          <label htmlFor="carHourlyRate" className="block text-sm text-gray-600 mb-1">Hourly Rate</label>
          <div className="relative">
             <input 
               id="carHourlyRate"
               name="carHourlyRate"
               type="number" 
               placeholder="0.00" 
               title="Hourly rate for cars"
               className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-right pr-4 focus:border-green-500 focus:ring-1 focus:ring-green-500" 
             />
          </div>
        </div>

        {/* Bike Slots */}
        <div>
          <label htmlFor="bikeSlots" className="block text-sm text-gray-600 mb-1">Bike Slots</label>
          <input 
            id="bikeSlots"
            name="bikeSlots"
            type="number" 
            placeholder="0" 
            title="Number of bike parking slots"
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
          />
        </div>

        {/* Bike Hourly Rate */}
        <div>
          <label htmlFor="bikeHourlyRate" className="block text-sm text-gray-600 mb-1">Hourly Rate</label>
          <input 
            id="bikeHourlyRate"
            name="bikeHourlyRate"
            type="number" 
            placeholder="0.00" 
            title="Hourly rate for bikes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-right pr-4 focus:border-green-500 focus:ring-1 focus:ring-green-500" 
          />
        </div>
      </div>
    </div>
  );
}