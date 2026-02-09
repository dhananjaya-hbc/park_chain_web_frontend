import { faClipboard, faHome, faMessage, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome" 

import Link from "next/link"

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
}

export default function Sidebar({ isOpen, setIsOpen, handleLogout, disconnectLoading }: SidebarProps) {
    return (
        <> 
            <div className={`h-screen w-[320px] min-h-screen pb-0 p-5 sidebar bg-white shadow-xl fixed lg:relative transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <div className="nav-logo text-center py-2">
                    <Link href='/' className="cursor-pointer">
                        <h1 className="text-3xl font-semibold font-unbounded">
                            Park<span className="text-[#06ca27] font-unbounded">Chain</span>
                        </h1>
                    </Link>
                </div>
                <span className="h-[1.5px] bg-[#dfe0e4] w-full block my-2"></span>
                <p className="text-neutral-500 font-sora tracking-wide py-3">Welcome Admin , </p>
                <ul className="flex flex-col gap-3 sidebar-nav relative z-20">
                    <li className="py-4 px-4 rounded-xl active text-neutral-500 font-sora transition-colors duration-300 hover:bg-[#06ca27] hover:text-white group">
                        <Link href="/admin/dashboard" className="text-md">
                            <FontAwesomeIcon icon={faHome} className="pe-2 text-[#06ca27] transition-colors duration-300 group-hover:text-white"/>
                            Dashboard
                        </Link>
                    </li>

                    <li className="py-4 px-4 rounded-xl text-neutral-500 font-sora transition-colors duration-300 hover:bg-[#06ca27] hover:text-white group">
                        <Link href="/admin/users" className="text-md">
                            <FontAwesomeIcon icon={faUserCircle} className="pe-2 text-[#06ca27] transition-colors duration-300 group-hover:text-white"/>
                            User Management
                        </Link>
                    </li>

                    <li className="py-4 px-4 rounded-xl text-neutral-500 font-sora transition-colors duration-300 hover:bg-[#06ca27] hover:text-white group">
                        <Link href="/admin/feedback" className="text-md">
                            <FontAwesomeIcon icon={faMessage} className="pe-2 text-[#06ca27] transition-colors duration-300 group-hover:text-white"/>
                            Feedback
                        </Link>
                    </li>

                    <li className="py-4 px-4 rounded-xl text-neutral-500 font-sora transition-colors duration-300 hover:bg-[#06ca27] hover:text-white group">
                        <Link href="/admin/seller-verification" className="text-md">
                            <FontAwesomeIcon icon={faClipboard} className="pe-2 text-[#06ca27] transition-colors duration-300 group-hover:text-white"/>
                            User Verification
                        </Link>
                    </li>

                    <li className="py-4 px-4 rounded-xl text-neutral-500 font-sora transition-colors duration-300 hover:bg-[#06ca27] hover:text-white group">
                        <Link href="/admin/settings" className="text-md">
                            <i className="ri-settings-5-line pe-2 text-[#06ca27] text-[20px] transition-colors duration-300 group-hover:text-white"></i>
                            Account & Settings 
                        </Link>
                    </li>

                    <li className="py-4 px-4 rounded-xl text-neutral-500 font-sora transition-colors duration-300 hover:bg-[#06ca27] hover:text-white group">
                        <button onClick={handleLogout} disabled={disconnectLoading} className="text-md w-full text-left disabled:opacity-50 disabled:cursor-not-allowed">
                            <i className="ri-logout-box-r-line pe-2 text-[#06ca27] text-[20px] transition-colors duration-300 group-hover:text-white"></i>
                            {disconnectLoading ? 'Logging out...' : 'Logout'}
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}