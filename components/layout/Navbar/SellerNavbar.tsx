"use client";

import BaseNavbar from "./BaseNavbar";

interface SellerNavbarProps {
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    sellerWallet?: string;
    title?: string;
    showSearch?: boolean;
}

export default function SellerNavbar(props: SellerNavbarProps) {
    return (
        <BaseNavbar 
            {...props}
            showSearch={false}
            walletAddress={props.sellerWallet}
            userName="Seller"
            userRole="Owner Account"
            settingsLink="/seller/settings"
        />
    );
}