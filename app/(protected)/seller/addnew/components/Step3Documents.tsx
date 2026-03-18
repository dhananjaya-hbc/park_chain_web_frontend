import React from 'react';

export default function Step3Documents() {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Ownership Proof</h3>
                <p className="text-sm text-gray-500">Upload documents to verify you have the right to rent out this land.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select title="Document Type" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white">
                        <option value="">Select Document Type</option>
                        <option value="deed">Deed of Partition</option>
                        <option value="utility">Utility Bill (Primary Proof)</option>
                        <option value="tax">Tax Receipt</option>
                        <option value="lease">Lease Agreement</option>
                    </select>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:bg-gray-50 transition cursor-pointer">
                    <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">Upload Legal Document</span>
                    <input title="Upload Legal Document" type="file" required accept=".pdf,image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mx-auto block max-w-xs" />
                    <p className="text-xs text-gray-400 mt-2">PDF, JPG or PNG (Max. 5MB)</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:bg-gray-50 transition cursor-pointer">
                    <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">Upload Recent Utility Bill</span>
                    <input title="Upload Recent Utility Bill" type="file" required accept=".pdf,image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mx-auto block max-w-xs" />
                    <p className="text-xs text-gray-400 mt-2">Must show the same address entered in Step 2</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" required className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                            <strong>Agreement:</strong> I confirm that I am the legal owner or authorized representative of this property, and all the information provided above is true and accurate to the best of my knowledge.
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}