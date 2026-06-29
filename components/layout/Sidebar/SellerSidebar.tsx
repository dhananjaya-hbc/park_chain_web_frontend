import BaseSidebar, { NavItem } from "./BaseSidebar";

interface SellerSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    currentPage?: string;
}

const sellerNavItems: NavItem[] =[
    { id: "dashboard", label: "Dashboard", href: "/seller/dashboard", iconClass: "ri-dashboard-line" },
    { id: "spots", label: "Spots", href: "/seller/spots", iconClass: "ri-map-pin-line" },
    { id: "add-new", label: "Add New Spot", href: "/seller/addnew", iconClass: "ri-add-circle-line" },
    { id: "bookings", label: "Booking Timeline", href: "/seller/bookings", iconClass: "ri-calendar-todo-line" },
    { id: "approvals", label: "Submissions", href: "/seller/approvals", iconClass: "ri-shield-check-line" },
    { id: "earnings", label: "Earnings", href: "/seller/earnings", iconClass: "ri-wallet-3-line" },
];

export default function SellerSidebar(props: SellerSidebarProps) {
    return (
        <BaseSidebar 
            {...props} 
            navItems={sellerNavItems} 
            portalName="Seller Portal" 
        />
    );
}