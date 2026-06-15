"use client";

import { useState } from "react";
import Link from "next/link";
import { faSearch, faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotifications } from "@/hooks/useNotifications";

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
    const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead, isLoading } = useNotifications();

    const toggleUserMenu = () => {
        setUserMenuOpen(!isUserMenuOpen);
        setNotificationOpen(false);
    };

    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
        setUserMenuOpen(false);
    };

    const handleNotificationClick = async (notificationId: string) => {
        await markAsRead(notificationId);
    };

    const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        await deleteNotification(notificationId);
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
                    {unreadCount > 0 && (
                        <span className="badge text-[11px] font-bold text-white bg-red-500 w-5 h-5 flex items-center justify-center rounded-full absolute -top-1 -right-1 shadow-md">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}

                    {isNotificationOpen && (
                        <ul className="absolute top-14 right-0 bg-white w-[400px] max-h-[500px] overflow-y-auto flex flex-col rounded-2xl shadow-xl z-50 border border-gray-200">
                            {/* Header */}
                            <li className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Notifications ({unreadCount} unread)</span>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={() => markAllAsRead()}
                                        className="text-xs text-green-700 hover:text-green-800 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </li>

                            {/* Notifications List */}
                            {isLoading ? (
                                <li className="p-4 text-center text-gray-500 text-sm">Loading notifications...</li>
                            ) : notifications.length === 0 ? (
                                <li className="p-4 text-center text-gray-500 text-sm">No notifications yet</li>
                            ) : (
                                notifications.map((notification) => (
                                    <li 
                                        key={notification.id} 
                                        className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                                            notification.isRead 
                                                ? 'bg-white hover:bg-gray-50' 
                                                : 'bg-blue-50 hover:bg-blue-100'
                                        }`}
                                        onClick={() => handleNotificationClick(notification.id)}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2">
                                                    {/* Icon based on type */}
                                                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                                                        notification.type === 'success' ? 'bg-green-500' :
                                                        notification.type === 'error' ? 'bg-red-500' :
                                                        notification.type === 'warning' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                                    }`}></div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-semibold text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <p className={`text-xs mt-1 line-clamp-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                                            {notification.body}
                                                        </p>
                                                        <span className="text-xs text-gray-400 mt-1 block">
                                                            {new Date(notification.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => handleDeleteNotification(e, notification.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                title="Delete notification"
                                            >
                                                <i className="ri-close-line text-lg"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
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