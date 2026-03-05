import Link from "next/link"

// Define the shape of a navigation item
export interface NavItem {
    id: string;
    label: string;
    href: string;
    iconClass: string;
}

interface BaseSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    currentPage?: string;
    navItems: NavItem[];    // Passed from the specific sidebars
    portalName: string;     // Passed from the specific sidebars (e.g., "Admin Portal")
}

export default function BaseSidebar({ 
    isOpen, 
    setIsOpen, 
    handleLogout, 
    disconnectLoading, 
    currentPage = "dashboard",
    navItems,
    portalName
}: BaseSidebarProps) {
    return (
        <> 
            <div className={`h-[calc(111vh-6rem)] w-[280px] pb-2 p-5 ml-4 mt-4 sidebar bg-white shadow-lg rounded-l-2xl rounded-r-2xl fixed lg:relative transition-transform duration-300 z-50 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                {/* Logo Section */}
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
                                {portalName}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300/60 to-transparent mb-3 shadow-sm"></div>
                
                {/* Dynamic Navigation Links */}
                <ul className="flex flex-col gap-2 sidebar-nav relative z-20 flex-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = currentPage === item.id;
                        
                        return (
                            <li key={item.id} className={`py-3 px-4 rounded-xl font-sora transition-colors duration-300 relative overflow-hidden ${
                                isActive 
                                ? "bg-[#197729] text-white" 
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}>
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#71b98c]">
                                        <div className="absolute right-0 top-0 bottom-0 w-10 bg-[#197729] rounded-l-xl"></div>
                                    </div>
                                )}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200/40 via-transparent to-transparent pointer-events-none rounded-xl"></div>
                                )}
                                <Link href={item.href} className="text-sm font-medium flex items-center gap-3 relative z-10">
                                    <i className={`${item.iconClass} ${isActive ? "text-white" : "text-[#197729]"} text-lg`}></i>
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                
                {/* Logout Button */}
                <div className="mt-auto pt-4">
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