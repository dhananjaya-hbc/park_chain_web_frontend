"use client";

import BaseNavbar from "./BaseNavbar";

interface AdminNavbarProps {
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    adminWallet?: string;
    title?: string;
    showSearch?: boolean;
}

export default function AdminNavbar(props: AdminNavbarProps) {
    return (
        <BaseNavbar 
            {...props}
            walletAddress={props.adminWallet}
            userName="Admin"
            userRole="Administrator"
            settingsLink="/admin/settings"
        />
    );
}