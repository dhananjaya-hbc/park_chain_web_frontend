"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api/apiService';

interface SellerKYB {
    id: number | string;
    entityName: string;
    status: 'pending' | 'verified' | 'rejected';
    adminNotes?: string;
    spotCreated?: boolean;
}

export default function SellerApprovalsPage() {
    const [kybList, setKybList] = useState<SellerKYB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchMyKYBs = async () => {
            try {
                const [requestsRes, approvedRes] = await Promise.all([
                    apiService.get('/seller/kyb/my-requests'),
                    apiService.get('/seller/kyb/approved'),
                ]);

                const requests: SellerKYB[] = Array.isArray(requestsRes) ? requestsRes : (requestsRes.data || []);
                const approved: SellerKYB[] = Array.isArray(approvedRes) ? approvedRes : (approvedRes.data || []);
                const approvedById = new Map(approved.map((item) => [String(item.id), item]));

                setKybList(
                    requests.map((item) => {
                        const matchedApproved = approvedById.get(String(item.id));

                        return {
                            ...item,
                            spotCreated: matchedApproved?.spotCreated ?? false,
                        };
                    })
                );
            } catch (err) {
                console.error("Failed to load approvals:", err);
                setError('Failed to load your KYB verification history. Please check your backend connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyKYBs();
    }, []);

    const renderNextAction = (kyb: SellerKYB) => {
        const isVerified = kyb.status === 'verified';

        if (kyb.status === 'rejected') {
            return (
                <button
                    onClick={() => router.push('/seller/addnew')}
                    className="w-40 whitespace-nowrap px-4 py-2 border border-red-500 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                >
                    Do KYB Again
                </button>
            );
        }
        if (isVerified && kyb.spotCreated) {
            return (
                <button
                    disabled
                    className="w-40 whitespace-nowrap px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-sm font-bold cursor-not-allowed"
                >
                    Spot Created
                </button>
            );
        }

        if (isVerified) {
            return (
                <button
                    onClick={() => router.push(`/seller/addnew?kybId=${kyb.id}`)}
                    className="w-40 whitespace-nowrap px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                >
                    You can go ahead
                </button>
            );
        }
        return (
            <button
                disabled
                className="w-40 whitespace-nowrap px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-sm font-bold cursor-not-allowed"
            >
                Under Review
            </button>
        );
    };

    const renderStatusBadge = (status: string) => {
        if (status === 'verified') return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Verified</span>;
        if (status === 'rejected') return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</span>;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">KYB Approvals & Status</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Track the verification status of your KYB submissions and proceed to spot creation.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500 font-medium">Loading your approvals...</div>
                ) : error ? (
                    <div className="p-10 text-center text-red-500 font-medium">{error}</div>
                ) : kybList.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 font-medium flex flex-col items-center">
                        <p className="mb-4">You have not submitted any KYB verifications yet.</p>
                        <button onClick={() => router.push('/seller/addnew')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                            Submit KYB
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Entity Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Verify ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 max-w-[250px]">Admin Note</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Next Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {kybList.map((kyb, idx) => (
                                    <tr key={kyb.id || idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{kyb.entityName}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">#{kyb.id}</td>
                                        <td className="px-6 py-4">{renderStatusBadge(kyb.status)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[250px] truncate" title={kyb.adminNotes}>
                                            {kyb.adminNotes ? kyb.adminNotes : <span className="text-gray-400 italic">No notes</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {renderNextAction(kyb)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}