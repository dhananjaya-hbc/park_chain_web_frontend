import React from 'react';

export default function PendingReview() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300">
                
                {/* Clock / Waiting Icon */}
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Under Review</h2>
                
                <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                    Your KYC documents have been submitted successfully. Our administrative team is currently reviewing your details. 
                    <br/><br/>
                    This usually takes 24-48 hours. You will gain access to add new parking spots once your identity is verified.
                </p>

                {/* In a real app, this would route back to /dashboard or /home using next/navigation */}
                <button 
                    onClick={() => window.location.href = '/'} 
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}