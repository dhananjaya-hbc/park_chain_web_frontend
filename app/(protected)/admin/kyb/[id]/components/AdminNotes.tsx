'use client'

import React, { useState } from 'react'

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

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (onSave) {
                await onSave(notes)
            }
            // Show success message or handle success
            console.log('Notes saved successfully')
        } catch (error) {
            console.error('Failed to save notes:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-600 pb-3 mb-6">
                Admin Notes
            </h2>
            
            <div className="space-y-4">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or observations about this verification..."
                    className="w-full border-2 border-gray-200 rounded-xl p-4 min-h-[120px] resize-y focus:outline-none focus:border-green-600 text-gray-900 placeholder-gray-400"
                    rows={5}
                />
                
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-black"
                >
                    {isSaving ? 'Saving...' : 'Save Notes'}
                </button>
            </div>
        </div>
    )
}
