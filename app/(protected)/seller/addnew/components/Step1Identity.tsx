import React from 'react';

export default function Step1Identity() {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Personal Identity</h3>
                <p className="text-sm text-gray-500">Please provide your details exactly as they appear on your National Identity Card (NIC).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (As per NIC)</label>
                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. John Doe" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                    <input type="text" required pattern="^([0-9]{9}[x|X|v|V]|[0-9]{12})$" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="123456789V or 200012345678" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input title="Date of Birth" placeholder="Date of Birth" type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select title="Gender" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Identity Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                        <span className="block text-sm font-medium text-gray-700 mb-2">NIC Front Image</span>
                        <input title="NIC Front Image" placeholder="Upload Front Image" type="file" required accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                        <span className="block text-sm font-medium text-gray-700 mb-2">NIC Back Image</span>
                        <input title="NIC Back Image" placeholder="Upload Back Image" type="file" required accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                    </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer mt-2">
                    <span className="block text-sm font-medium text-gray-700 mb-2">Live Selfie with NIC (Optional)</span>
                    <input title="Live Selfie with NIC" placeholder="Live Selfie with NIC" type="file" accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <p className="text-xs text-gray-400 mt-2">Hold your NIC near your face to prevent identity theft.</p>
                </div>
            </div>
        </div>
    );
}