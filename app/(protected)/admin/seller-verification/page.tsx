"use client"

import { useState } from 'react'  
import { useRouter } from 'next/navigation'
import { useWeb3AuthDisconnect } from "@web3auth/modal/react"
import { useRole } from '@/hooks/useRole'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'


export default function SellerVerificationPage() {
    const [isOpen, setIsOpen] = useState(false);
    const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
    const { clearRole } = useRole();
    const router = useRouter();
    const [adminWallet, setAdminWallet] = useState<string>(() => {
        return typeof window !== 'undefined' ? localStorage.getItem('admin_wallet') || '' : '';
    });

    const handleLogout = async () => {
        try {
            await disconnect();
            clearRole();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
       <>
       <div className='flex min-h-screen h-screen overflow-y-hidden bg-gray-100'>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} disconnectLoading={disconnectLoading} currentPage="verification"/>
        
        <div className='flex-1 bg-gray-100 h-screen min-h-screen overflow-y-scroll'>
            <Navbar setIsOpen={setIsOpen} handleLogout={handleLogout} disconnectLoading={disconnectLoading} adminWallet={adminWallet} title="Verifications" showSearch={false}/>

            <div className='main-content px-4 sm:px-6 pt-5 pb-6 bg-gray-100'>
                <div className="bg-white rounded-2xl shadow-md">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 mb-2 p-4 sm:p-3 pb-0">
                        <h1 className="text-l font-bold text-gray-800">Verification list (1522)</h1>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Filter Button */}
                            <button className="px-4 py-2 bg-green-20 border border-gray-500 rounded-lg flex items-center gap-2 text-sm font-l text-gray-700 hover:bg-gray-50">
                                Filter
                                <i className="ri-menu-line text-gray-700"></i>
                            </button>
                            
                            {/* Status Filter Badges */}
                            <button className="px-3 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium hover:bg-green-600 flex items-center gap-0.1">
                                <i className="ri-checkbox-circle-fill text-sm"></i>
                                Approved
                            </button>
                            <button className="px-3 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 flex items-center gap-0.1">
                                <i className="ri-close-circle-fill text-sm"></i>
                                Rejected
                            </button>
                            <button className="px-3 py-0.5 bg-amber-500 text-white rounded-full text-xs font-medium hover:bg-amber-600 flex items-center gap-0.1">
                                <i className="ri-time-fill text-sm"></i>
                                Pending
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

                    {/* Table */}
                    <div className="overflow-x-auto px-2 sm:px-4 lg:px-[2.5rem] py-2 rounded-b-2xl" style={{backgroundColor: '#E5F5E0'}}>
                        <table className="w-full border-separate min-w-[800px]" style={{borderSpacing: '0 14px'}}>
                            <thead style={{backgroundColor: '#f7fcf5'}}>
                                
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Name</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Wallet ID</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Role ID & Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                                
                            </thead>
                            <tbody className="bg-green-50">
                                {/* Pending Row 1 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SF-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-time-fill text-amber-500 text-base"></i>
                                            <span className="text-sm text-gray-900">Pending</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>

                                {/* Pending Row 2 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SF-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-time-fill text-amber-500 text-base"></i>
                                            <span className="text-sm text-gray-900">Pending</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>

                                {/* Pending Row 3 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SF-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-time-fill text-amber-500 text-base"></i>
                                            <span className="text-sm text-gray-900">Pending</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>

                                {/* Verified Row 1 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SF-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-checkbox-circle-fill text-green-600 text-lg"></i>
                                            <span className="text-sm text-gray-900">Verified</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>

                                {/* Verified Row 2 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SF-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-checkbox-circle-fill text-green-600 text-lg"></i>
                                            <span className="text-sm text-gray-900">Verified</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>

                                {/* Rejected Row 1 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SE-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-close-circle-fill text-red-600 text-lg"></i>
                                            <span className="text-sm text-gray-900">Rejected</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>

                                {/* Rejected Row 2 */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <i className="ri-user-2-fill text-white text-xs"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">Kevin Rodrigo</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-center mt-1">Seller</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-gray-900">rHb9CJAw4jp*****</div>
                                        <div className="text-xs text-gray-500">XRPL</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 text-center">#SE-5648</div>
                                        <div className="text-xs text-gray-500 text-center">01 Dec 2025-23:21:56</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <i className="ri-close-circle-fill text-red-600 text-lg"></i>
                                            <span className="text-sm text-gray-900">Rejected</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
       </div>

       {isOpen && (
        <div className='fixed inset-0 bg-black/20 z-40 lg:hidden'
        onClick={() => setIsOpen(false)}>
        </div>
       )}
       </>
    )
}
