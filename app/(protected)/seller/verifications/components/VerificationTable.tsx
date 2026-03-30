'use client';

import React, { useEffect, useState } from 'react';

// Define the shape of our data based on what the backend should return
interface SellerVerification {
    id: string | number;
    _id?: string;
    parkingType: string;
    fullAddress: string;
    status: 'pending' | 'verified' | 'rejected';
    createdAt: string;
}

export default function VerificationTable() {
    const [verifications, setVerifications] = useState<SellerVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyVerifications = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                // The backend endpoint to get only this seller's verifications
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/seller/verifications`, {
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch verification data');
                }

                const data = await response.json();
                console.log("Seller Verifications Data:", data);

                // Handle whatever structure the backend returns
                if (Array.isArray(data)) {
                    setVerifications(data);
                } else if (data && Array.isArray(data.data)) {
                    setVerifications(data.data);
                } else if (data && Array.isArray(data.verifications)) {
                    setVerifications(data.verifications);
                } else if (data && data.status) {
                    // Sometimes the backend might just return a single active object
                    setVerifications([data]);
                } else {
                    console.error("API did not return an array:", data);
                    setVerifications([]);
                }
            } catch (err) {
                console.error("Error fetching verifications:", err);
                setError('Could not load your verifications from the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyVerifications();
    }, []);

    // Format Date securely
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown Date';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch(e) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto px-2 sm:px-4 py-4 rounded-2xl" style={{backgroundColor: '#E5F5E0'}}>
                <table className="w-full border-separate min-w-[800px]" style={{borderSpacing: '0 10px'}}>
                    <thead style={{backgroundColor: '#f7fcf5'}}>
                        <tr>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 rounded-l-xl">Spot / Type</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Date Submitted</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 rounded-r-xl">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 bg-white rounded-xl shadow-sm">
                                    Loading your verifications...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-red-500 bg-white rounded-xl shadow-sm">
                                    {error}
                                </td>
                            </tr>
                        ) : verifications.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 bg-white rounded-xl shadow-sm">
                                    No verifications found. Submit a new property to get verified!
                                </td>
                            </tr>
                        ) : (
                            verifications.map((item) => (
                                <tr key={item.id || item._id || Math.random()} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900 rounded-l-xl flex flex-col items-center">
                                        <span>{item.parkingType || 'Parking Spot'}</span>
                                        {item.fullAddress && (
                                            <span className="text-xs text-gray-500 font-normal mt-1 block max-w-[200px] truncate" title={item.fullAddress}>
                                                {item.fullAddress}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                                        {formatDate(item.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block border ${
                                            (item.status || 'pending').toLowerCase() === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                                            (item.status || 'pending').toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-orange-100 text-orange-700 border-orange-200'
                                        }`}>
                                            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center rounded-r-xl">
                                        <button className="text-[#197729] hover:text-green-800 font-bold text-sm transition-colors flex items-center justify-center gap-2 mx-auto px-4 py-2 border border-[#197729] rounded-lg hover:bg-green-50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}