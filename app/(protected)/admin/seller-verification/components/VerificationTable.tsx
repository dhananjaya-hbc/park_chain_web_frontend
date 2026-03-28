'use client';

import React, { useEffect, useState } from 'react';
import VerificationTableRow from './VerificationTableRow';
import { VerificationFilterType } from './Main';

interface VerificationTableProps {
    selectedFilter: VerificationFilterType;
}

interface VerificationData {
    id: string | number;
    name: string;
    role: string;
    walletId: string;
    blockchain: string;
    roleId: string;
    date: string;
    status: 'pending' | 'verified' | 'rejected';
}

export default function VerificationTable({ selectedFilter }: VerificationTableProps) {
    const [verificationData, setVerificationData] = useState<VerificationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVerifications = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                // Call your backend API endpoint here
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/verifications`, {
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch verification data');
                }

                const data = await response.json();
                
                // Assuming the backend returns an array of verification objects mapped to our interface
                setVerificationData(data);
            } catch (err) {
                console.error("Error fetching verifications:", err);
                setError('Could not load verifications from the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchVerifications();
    }, []);

    // Filter data based on selected filter
    const filteredData = selectedFilter === 'all' 
        ? verificationData 
        : verificationData.filter(item => item.status === selectedFilter);

    return (
        <div className="overflow-x-auto px-2 sm:px-4 lg:px-[2.5rem] py-2 rounded-b-2xl" style={{backgroundColor: '#E5F5E0'}}>
            <table className="w-full border-separate min-w-[800px]" style={{borderSpacing: '0 14px'}}>
                <thead style={{backgroundColor: '#f7fcf5'}}>
                    <tr>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Wallet ID</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Role ID & Date</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-green-50">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 bg-white">
                                Loading verifications...
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-red-500 bg-white">
                                {error}
                            </td>
                        </tr>
                    ) : filteredData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 bg-white">
                                No verifications found.
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((verification) => (
                            <VerificationTableRow 
                                key={verification.id}
                                id={Number(verification.id) || 0} 
                                name={verification.name || 'Unknown'}
                                role={verification.role || 'Seller'}
                                walletId={verification.walletId || '---'}
                                blockchain={verification.blockchain || 'XRPL'}
                                roleId={verification.roleId || '---'}
                                date={verification.date || '---'}
                                status={verification.status || 'pending'}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}