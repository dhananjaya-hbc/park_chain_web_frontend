"use client";

import { useState } from "react";
import Link from "next/link";
import { faSearch, faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BaseNavbarProps {
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    walletAddress?: string;
    title?: string;
    showSearch?: boolean;
    // New dynamic props for composition
    userName: string;
    userRole: string;
    settingsLink: string;
}

export default function BaseNavbar({ 
    setIsOpen, 
    handleLogout, 
    disconnectLoading, 
    walletAddress, 
    title = "Dashboard", 
    showSearch = true,
    userName,
    userRole,
    settingsLink
}: BaseNavbarProps) {
    const[isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);

    const toggleUserMenu = () => {
        setUserMenuOpen(!isUserMenuOpen);
        setNotificationOpen(false);
    };

    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
        setUserMenuOpen(false);
    };

    return (
        <div className="bg-white h-20 shadow-md rounded-2xl flex justify-between items-center gap-4 px-6 mt-4 mx-4 mb-0 sticky top-0 z-40">
            {/* Left side: Hamburger & Title */}
            <div className="flex items-center gap-6">
                <div className="toggle lg:hidden flex cursor-pointer text-xl text-gray-600" onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <h2 className="text-xl font-bold text-green-700 hidden lg:flex items-center pl-4 border-l-4 border-green-700 h-12">
                    {title}
                </h2>
            </div>

            {/* Middle: Search Bar */}
            {showSearch && (
                <div className="search-box border border-gray-300 relative h-11 hidden lg:flex items-center rounded-lg flex-1 max-w-xl bg-gray-100">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 text-green-700 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search users, parking slots, verifications..." 
                        className="h-full w-full ps-11 pe-4 outline-none text-sm rounded-lg bg-gray-100 placeholder:text-gray-900"
                    />
                </div>
            )}

            {/* Right side: Notifications & Profile */}
            <div className="flex gap-3 items-center">
                {/* Notification Dropdown */}
                <div className="notification cursor-pointer bg-gray-100 rounded-lg w-12 h-12 hidden lg:flex justify-center items-center relative hover:bg-gray-200 transition-colors duration-200" onClick={toggleNotification}>
                    <i className="ri-notification-3-line text-green-700 text-xl"></i>
                    <span className="badge text-[11px] font-bold text-white bg-red-500 w-5 h-5 flex items-center justify-center rounded-full absolute -top-1 -right-1 shadow-md">
                        3
                    </span>

                    {isNotificationOpen && (
                        <ul className="absolute top-14 right-0 bg-white w-[350px] p-3 flex flex-col gap-2 rounded-2xl shadow-xl animate-fade-in z-50">
                            <li className="text-sm text-gray-700">
                                <Link href='/' className="w-full flex justify-between items-start">
                                    <div className="flex items-start gap-2">
                                        <div className="w-14 h-14 rounded-full bg-[#197729] flex items-center justify-center shrink-0">
                                            <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
                                        </div>
                                        <div>
                                            <span className="text-[#212529] font-sora text-lg block">Ronald Richards</span>
                                            <p className="text-[#010102] text-xs mt-1">New parking reservation received. Review details in the dashboard.</p>
                                        </div>
                                    </div>
                                    <span className="text-[#4f586d] text-xs font-medium shrink-0 ml-2">23 Mins ago</span> 
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="user cursor-pointer flex items-center gap-3 relative px-3 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200" onClick={toggleUserMenu}>
                    <div className="w-10 h-10 rounded-2xl bg-green-700 flex items-center justify-center flex-shrink-0">
                        <i className="ri-user-3-line text-white text-lg"></i>
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                        <span className="text-base font-bold text-gray-900">{userName}</span>
                        <span className="text-sm text-gray-400 font-normal">{userRole}</span>
                    </div>

                    {isUserMenuOpen && (
                        <ul className="absolute top-16 right-0 bg-white w-[200px] p-3 flex flex-col gap-3 rounded-xl shadow-xl animate-fade-in z-50">
                            <li>
                                <Link href={settingsLink} className="text-sm flex items-center hover:text-[#197729] transition-colors duration-300">
                                    <i className="ri-settings-5-line pe-2 text-[18px]"></i>
                                    Settings
                                </Link> 
                            </li>
                            <li>
                                <button onClick={handleLogout} disabled={disconnectLoading} className="text-sm flex items-center hover:text-[#197729] transition-colors duration-300 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed">
                                    <i className="ri-shut-down-line pe-2 text-[18px]"></i>
                                    {disconnectLoading ? 'Logging out...' : 'Logout'}
                                </button> 
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}