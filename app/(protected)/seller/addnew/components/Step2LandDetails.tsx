import React from 'react';
import { KycFormValues } from './kycTypes';

interface Step2LandDetailsProps {
    values: KycFormValues;
    onFieldChange: (name: keyof KycFormValues, value: string | boolean | string[]) => void;
}

export default function Step2LandDetails({ values, onFieldChange }: Step2LandDetailsProps) {
    const vehicleTypes = ['bike', 'car', 'van', 'lorry'];

    const handleVehicleTypeChange = (vehicleType: string, checked: boolean) => {
        const nextVehicleTypes = checked
            ? [...values.supportedVehicleTypes, vehicleType]
            : values.supportedVehicleTypes.filter((item) => item !== vehicleType);

        onFieldChange('supportedVehicleTypes', nextVehicleTypes);
    };

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Land & Parking Details</h3>
                <p className="text-sm text-gray-500">Tell us about the location where the parking will be hosted.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input type="text" required value={values.propertyName} onChange={(e) => onFieldChange('propertyName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. Colombo 07 Secure Parking" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <textarea rows={3} required value={values.fullAddress} onChange={(e) => onFieldChange('fullAddress', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Street, City, Postal Code"></textarea>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link / Coordinates</label>
                    <input type="url" required value={values.mapsLink} onChange={(e) => onFieldChange('mapsLink', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="https://maps.google.com/..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parking Type</label>
                    <select title="Parking Type" required value={values.parkingType} onChange={(e) => onFieldChange('parkingType', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white">
                        <option value="">Select Type</option>
                        <option value="covered">Covered</option>
                        <option value="uncovered">Uncovered</option>
                        <option value="garage">Garage</option>
                        <option value="street">Street-side</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Slots</label>
                    <input type="number" min="1" required value={values.numberOfSlots} onChange={(e) => onFieldChange('numberOfSlots', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. 5" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supported Vehicle Types</label>
                    <div className="flex flex-wrap gap-4">
                        {vehicleTypes.map((type) => (
                            <label key={type} className="flex items-center space-x-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                                <input type="checkbox" value={type} checked={values.supportedVehicleTypes.includes(type)} onChange={(e) => handleVehicleTypeChange(type, e.target.checked)} className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                                <span className="text-sm font-medium text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}