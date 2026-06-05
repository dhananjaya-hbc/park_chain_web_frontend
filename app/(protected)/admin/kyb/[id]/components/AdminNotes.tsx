'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AdminNotesProps {
    initialNotes?: string
    onSave?: (notes: string) => void
}

export default function AdminNotes({
    initialNotes = '',
    onSave
}: AdminNotesProps) {
    const [notes, setNotes] = useState(initialNotes)
    const [isSaving, setIsSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current)
            }

            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current)
            }
        }
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (onSave) {
                await onSave(notes)
            }
            setIsSaved(true)
            setShowToast(true)

            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current)
            }

            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current)
            }

            successTimerRef.current = setTimeout(() => {
                setIsSaved(false)
            }, 2000)

            toastTimerRef.current = setTimeout(() => {
                setShowToast(false)
            }, 2400)
        } catch (error) {
            console.error('Failed to save notes:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50/50 p-5 sm:p-6">
            {showToast && (
                <div className="fixed bottom-10 right-10 z-50 transition-all duration-300 ease-out">
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-lg px-4 py-3 text-sm font-medium flex items-center gap-2">
                        <i className="ri-checkbox-circle-fill text-green-600"></i>
                        <span>Notes saved successfully</span>
                    </div>
                </div>
            )}

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Admin Notes
            </h2>

            <div className="space-y-4">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or observations about this verification..."
                    className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] resize-y bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                    rows={5}
                />

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`inline-flex items-center gap-2 bg-white text-[#197729] border shadow-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                        isSaved
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md'
                    }`}
                >
                    {isSaving ? (
                        <>
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true"></span>
                            <span>Saving...</span>
                        </>
                    ) : isSaved ? (
                        '✓ Saved'
                    ) : (
                        'Save Notes'
                    )}
                </button>
            </div>
        </div>
    )
}
