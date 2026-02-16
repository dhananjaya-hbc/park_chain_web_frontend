import React from 'react'
import VerificationHeader from './VerificationHeader'
import PersonalInfo from './PersonalInfo'
import DocumentsSection from './DocumentsSection'
import AdminNotes from './AdminNotes'

export default function Main() {
    return (
        <div className="bg-white rounded-[30px] shadow-md p-6 sm:p-10">
            <VerificationHeader />
            <PersonalInfo />
            <DocumentsSection />
            <AdminNotes />
        </div>
    )
}
