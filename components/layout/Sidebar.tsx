"use client";

import { faClipboard, faHome, faMessage, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome" 

import Link from "next/link"

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    currentPage?: string;
    role?: 'admin' | 'seller';
}

export default function Sidebar({ isOpen, setIsOpen, handleLogout, disconnectLoading, currentPage = "dashboard", role = "admin" }: SidebarProps) {
    const sellerMenuItems = [
        { name: 'Dashboard', icon: 'ri-dashboard-line', href: '/seller/dashboard', key: 'dashboard' },
        { name: 'Spots', icon: 'ri-map-pin-line', href: '/seller/spots', key: 'spots' },
        { name: 'Add new', icon: 'ri-add-circle-line', href: '/seller/add-new', key: 'add-new' },
        { name: 'Booking Timeline', icon: 'ri-calendar-line', href: '/seller/bookings', key: 'bookings' },
        { name: 'Verifications', icon: 'ri-shield-check-line', href: '/seller/verifications', key: 'verifications' },
        { name: 'Earnings', icon: 'ri-money-dollar-circle-line', href: '/seller/earnings', key: 'earnings' },
    ];

    const adminMenuItems = [
        { name: 'Dashboard', icon: 'ri-dashboard-line', href: '/admin/dashboard', key: 'dashboard' },
        { name: 'User Management', icon: 'ri-group-line', href: '/admin/users', key: 'users' },
        { name: 'Verifications', icon: 'ri-shield-check-line', href: '/admin/seller-verification', key: 'verification' },
        { name: 'Feedback', icon: 'ri-message-3-line', href: '/admin/feedback', key: 'feedback' },
        { name: 'Account & Settings', icon: 'ri-settings-5-line', href: '/admin/settings', key: 'settings' },
    ];

    const menuItems = role === 'seller' ? sellerMenuItems : adminMenuItems;

    return (
        <> 
            <div className={`h-[calc(111vh-6rem)] w-[280px] pb-2 p-5 ml-4 mt-4 sidebar bg-white shadow-lg rounded-l-2xl  rounded-r-2xl fixed lg:relative transition-transform duration-300 z-50 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <div className="nav-logo text-left py-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-100/60 via-gray-50/30 to-transparent rounded-lg pointer-events-none"></div>
                            <img 
                                src="/ParkchainLogo.png" 
                                alt="ParkChain Logo" 
                                className="w-16 h-16 z-10 object-contain scale-175 drop-shadow-md translate-x-0.5 translate-y-0.5"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold font-sora text-[#4CAF50]">
                                Park Chain
                            </h1>
                            <p className="text-sm text-gray-400 font-sora">
                                {role === 'seller' ? 'Seller Portal' : 'Admin Portal'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300/60 to-transparent mb-3 shadow-sm"></div>
                <ul className="flex flex-col gap-2 sidebar-nav relative z-20 flex-1">
                    {menuItems.map((item) => (
                        <li
                            key={item.key}
                            className={`py-3 px-4 rounded-xl font-sora transition-colors duration-300 relative overflow-hidden ${
                                currentPage === item.key
                                    ? "bg-[#197729] text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {currentPage === item.key && (
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#71b98c]">
                                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-[#197729] rounded-l-xl"></div>
                                </div>
                            )}
                            {currentPage !== item.key && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/40 via-transparent to-transparent pointer-events-none rounded-xl"></div>
                            )}
                            <Link href={item.href} className="text-sm font-medium flex items-center gap-3 relative z-10">
                                <i className={`${item.icon} text-lg ${currentPage === item.key ? "text-white" : "text-[#197729]"}`}></i>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                
                <div className="mt-auto pt-4 space-y-3">
                    {role === 'seller' && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold">
                                SN
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">Sajan Nethsara</p>
                                <p className="text-xs text-gray-500">Owner Account</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <i className="ri-settings-3-line text-lg"></i>
                            </button>
                        </div>
                    )}
                    <button onClick={handleLogout} disabled={disconnectLoading} className="py-3 px-4 rounded-xl bg-white text-red-500 font-sora transition-colors duration-300 hover:bg-gray-50 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/40 via-transparent to-transparent pointer-events-none rounded-xl"></div>
                        <i className="ri-logout-box-r-line text-red-500 text-[18px] relative z-10"></i>
                        <span className="relative z-10">{disconnectLoading ? 'Logging out...' : 'Log Out'}</span>
                    </button>
                </div>
            </div>
        </>
    )
}
