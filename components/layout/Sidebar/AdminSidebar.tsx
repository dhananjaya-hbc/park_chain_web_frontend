// components/layout/Sidebar/AdminSidebar.tsx

import BaseSidebar, { NavItem } from "./BaseSidebar";

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    currentPage?: string;
}

const adminNavItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", iconClass: "ri-dashboard-line" },
    { id: "verification", label: "Verifications", href: "/admin/kyb", iconClass: "ri-shield-check-line" },
    { id: "sellers", label: "Sellers", href: "/admin/sellers", iconClass: "ri-store-2-line" },
    { id: "bookings", label: "Bookings", href: "/admin/bookings", iconClass: "ri-calendar-check-line" },
    { id: "transactions", label: "Transactions", href: "/admin/transactions", iconClass: "ri-exchange-funds-line" },
    { id: "spot-management", label: "Spot Management", href: "/admin/spot-management", iconClass: "ri-parking-box-line" },
    { id: "settings", label: "Account & Settings", href: "/admin/settings", iconClass: "ri-settings-5-line" },
];

export default function AdminSidebar(props: AdminSidebarProps) {
    return (
        <BaseSidebar
            {...props}
            navItems={adminNavItems}
            portalName="Admin Portal"
        />
    );
}