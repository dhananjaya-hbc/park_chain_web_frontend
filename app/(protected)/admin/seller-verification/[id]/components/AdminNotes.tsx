'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminNotes({ id, status = 'pending' }: { id: string, status?: string }) {
    const router = useRouter()
    const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
    const [reason, setReason] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState('')

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setApiError('')
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/verifications/${id}/decision`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    decision,
                    reason: decision === 'reject' ? reason : undefined
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.error || 'Failed to submit decision to the server.');
            }

            // Successfully processed! Take them back to the verification list
            router.push('/admin/seller-verification')
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Network error occurred');
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Verification Decision
            </h2>

            {status !== 'pending' ? (
                <div className={`p-6 rounded-xl border ${status === 'verified' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        {status === 'verified' ? (
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ) : (
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                        <h3 className="text-xl font-bold">
                            {status === 'verified' ? 'Seller Approved' : 'Seller Rejected'}
                        </h3>
                    </div>
                    <p className="font-medium opacity-90">
                        This application has already been reviewed and {status === 'verified' ? 'approved' : 'rejected'}.
                    </p>
                </div>
            ) : (
                <>
                    {apiError && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {apiError}
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        <p className="text-gray-700 font-medium">Please review the documents above and make a decision.</p>

                        {/* Decision Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => setDecision('approve')}
                                className={`px-8 py-3 rounded-xl font-bold border-2 transition-all ${
                                    decision === 'approve' 
                                    ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                                    : 'bg-white border-green-600 text-green-600 hover:bg-green-50'
                                }`}
                            >
                                Approve Seller
                            </button>
                            <button 
                                onClick={() => setDecision('reject')}
                                className={`px-8 py-3 rounded-xl font-bold border-2 transition-all ${
                                    decision === 'reject' 
                                    ? 'bg-red-600 border-red-600 text-white shadow-lg' 
                                    : 'bg-white border-red-600 text-red-600 hover:bg-red-50'
                                }`}
                            >
                                Reject Seller
                            </button>
                        </div>

                        {/* Rejection Reason Textarea */}
                        {decision === 'reject' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="block text-gray-900 font-semibold">
                                    Reason for Rejection <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain why the verification is rejected (e.g. Blurry ID, Invalid Address, etc.)"
                                    className="w-full border-2 border-red-200 rounded-xl p-4 min-h-[120px] resize-y focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-400"
                                    rows={4}
                                />
                            </div>
                        )}

                        {/* Approval Notice */}
                        {decision === 'approve' && (
                            <div className="bg-green-100 text-green-800 p-4 rounded-xl border border-green-200 animate-in fade-in slide-in-from-top-4 duration-300">
                                <p className="font-medium">⚠️ By approving this seller, they will immediately gain access to add new parking spots.</p>
                            </div>
                        )}

                        {/* Final Submit Button */}
                        {decision && (
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || (decision === 'reject' && !reason.trim())}
                                    className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-semibold flex items-center justify-center gap-2 px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        'Processing...'
                                    ) : (
                                        `Confirm ${decision === 'approve' ? 'Approval' : 'Rejection'}`
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
