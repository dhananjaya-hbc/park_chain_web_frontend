import React from 'react'

export default function FeedbackHeader() {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 mb-2 p-4 sm:p-3 pb-0">
            <h1 className="text-l font-bold text-gray-800">All Feedbacks (45,668)</h1>
            
            <div className="flex flex-wrap items-center gap-2">
                {/* Filter Button */}
                <button className="px-4 py-2 bg-green-20 border border-gray-500 rounded-lg flex items-center gap-2 text-sm font-l text-gray-700 hover:bg-gray-50">
                    Filter
                    <i className="ri-menu-line text-gray-700"></i>
                </button>
                
                {/* Status Filter Badges */}
                <button className="px-3 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium hover:bg-green-600 flex items-center gap-0.1">
                    <i className="ri-checkbox-circle-fill text-sm"></i>
                    Good
                </button>
                <button className="px-3 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 flex items-center gap-0.1">
                    <i className="ri-close-circle-fill text-sm"></i>
                    Bad
                </button>
                <button className="px-3 py-0.5 bg-amber-500 text-white rounded-full text-xs font-medium hover:bg-amber-600 flex items-center gap-0.1">
                    <i className="ri-star-half-line text-sm"></i>
                    Average 
                </button>
                
                {/* Search Input */}
                <div className="relative w-full sm:w-64 lg:w-96 h-10 bg-white border border-gray-300 rounded-lg flex items-center px-2">
                    <div className="flex items-center justify-center pl-1 pr-2">
                        <i className="ri-search-2-line text-green-600 text-xl"></i>
                    </div>
                    <input 
                        type="text" 
                        placeholder="" 
                        className="flex-1 h-7 px-3 rounded-lg text-sm focus:outline-none mr-0"
                        style={{backgroundColor: '#f7fcf5'}}
                    />
                </div>
            </div>
        </div>
    )
}
