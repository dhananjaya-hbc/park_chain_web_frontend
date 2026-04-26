'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import apiService from '@/lib/api/apiService'
import VerificationHeader from './VerificationHeader'
import PersonalInfo from './PersonalInfo'
import DocumentsSection from './DocumentsSection'
import AdminNotes from './AdminNotes'

interface KYBDetailData {
    id: number;
    ownerName?: string;
    owner?: { name: string };
    entityName: string;
    address: string;
    googleMapsLink: string;
    spotType: string;
    documentUrl?: string;
    date?: string;
    createdAt?: string;
    status: 'pending' | 'verified' | 'rejected';
    adminNotes?: string;
}

export default function Main() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [data, setData] = useState<KYBDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [adminNotes, setAdminNotes] = useState(''); // <-- Added local state to hold notes

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                // Connects to the specific detail API endpoint using the ID parameter
                const res = await apiService.get(`/admin/kyb/${id}`);
                const responseData = res.data || res;
                setData(responseData);
                if (responseData.adminNotes) {
                   setAdminNotes(responseData.adminNotes);
                }
            } catch (err) {
                console.error("Fetch detail error:", err);
                setError('Failed to load verification details. Check backend connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const updateStatus = async (newStatus: 'verified' | 'rejected') => {
        setIsUpdating(true);
        try {
            // Update: Send BOTH status and the updated adminNotes to backend
            await apiService.put(`/admin/kyb/${id}/status`, { 
                status: newStatus,
                adminNotes: adminNotes 
            });
            // Redirect back to the table after successfully updating!
            router.push('/admin/kyb');
        } catch (err) {
            console.error("Update status error:", err);
            alert("Failed to update status. Check backend connection.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading details from database...</div>;
    if (error) return <div className="text-center py-20 font-bold text-red-500">{error}</div>;
    if (!data) return <div className="text-center py-20 font-medium text-gray-500">No details found.</div>;

    return (
        <div className="bg-white rounded-[30px] shadow-md p-6 sm:p-10">
            <VerificationHeader 
                entityName={data.entityName} 
                status={data.status} 
                submittedDate={data.date || data.createdAt || 'Recently'} 
            />
            <PersonalInfo 
                ownerName={data.ownerName || data.owner?.name || 'Unknown Owner'} 
                entityName={data.entityName} 
                spotType={data.spotType} 
                googleMapsLink={data.googleMapsLink} 
                address={data.address} 
            />
            <DocumentsSection documentUrl={data.documentUrl || data.documentUrl} />
            <AdminNotes 
                initialNotes={adminNotes} 
                onSave={(newNotes) => setAdminNotes(newNotes)} 
            />

            <div className="mt-8 flex items-center gap-4 border-t-2 border-gray-100 pt-6">
                <button 
                    onClick={() => updateStatus('verified')}
                    disabled={isUpdating || data.status === 'verified'}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUpdating ? 'Saving...' : 'Approve KYB'}
                </button>
                <button 
                    onClick={() => updateStatus('rejected')}
                    disabled={isUpdating || data.status === 'rejected'}
                    className="bg-red-100 text-red-600 hover:bg-red-200 font-semibold px-8 py-3 rounded-xl transition-colors border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUpdating ? 'Saving...' : 'Reject'}
                </button>
            </div>
        </div>
    )
}
