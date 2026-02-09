"use client";
import { useState } from "react";
import Link from "next/link";

import { faSearch, faBars, faBell, faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons"  

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NavbarProps {
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    disconnectLoading: boolean;
    adminWallet: string;
}

export default function Navbar({ setIsOpen, handleLogout, disconnectLoading, adminWallet }: NavbarProps) {
    
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isTimeFilterOpen, setTimeFilterOpen] = useState(false);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState('This Week');

    const toggleUserMenu = () => {
        setUserMenuOpen(!isUserMenuOpen);
        setNotificationOpen(false);
        setTimeFilterOpen(false);
    };

    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
        setUserMenuOpen(false);
        setTimeFilterOpen(false);
    };

    const toggleTimeFilter = () => {
        setTimeFilterOpen(!isTimeFilterOpen);
        setUserMenuOpen(false);
        setNotificationOpen(false);
    };

    const handleTimeFilterSelect = (filter: string) => {
        setSelectedTimeFilter(filter);
        setTimeFilterOpen(false);
    };
    return (
<>
<div className="bg-white h-[90px] shadow-lg flex justify-between items-center gap-3 px-[2%]">
 <div className="search-box border border-[#dfe4e0] relative h-[45px] hidden lg:flex items-center rounded-full w-70 outline-none">

<input type="text" placeholder="Search" className="h-full w-full ps-4 outline-none"/>
<FontAwesomeIcon icon={faSearch} className=" absolute bg-[#06ca27] text-white right-0.5 p-3 rounded-[50%]"/>

</div>


<div className="toggle lg:hidden flex cursor-pointer text-2xl" onClick={() => setIsOpen(true)}>
<FontAwesomeIcon icon={faBars}/>
</div>

<div className="flex gap-3 items-center">
    {/* Time Filter Dropdown */}
    <div className="relative hidden lg:block">
        <button 
            onClick={toggleTimeFilter}
            className="border border-[#06ca27] hover:bg-[#06ca27] hover:text-white px-4 rounded-full py-2 cursor-pointer transition-colors duration-300 flex items-center gap-2"
        >
            <span>{selectedTimeFilter}</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-xs"/>
        </button>
        
        {isTimeFilterOpen && (
            <ul className="absolute top-12 right-0 bg-white w-[150px] p-3 flex flex-col gap-3 rounded-2xl shadow-xl animate-fade-in z-50">
                <li 
                    onClick={() => handleTimeFilterSelect('This Week')}
                    className="text-md text-black cursor-pointer hover:text-[#06ca27] transition-colors duration-300"
                >
                    This Week
                </li>
                <li 
                    onClick={() => handleTimeFilterSelect('This Month')}
                    className="text-md text-black cursor-pointer hover:text-[#06ca27] transition-colors duration-300"
                >
                    This Month
                </li>
                <li 
                    onClick={() => handleTimeFilterSelect('This Year')}
                    className="text-md text-black cursor-pointer hover:text-[#06ca27] transition-colors duration-300"
                >
                    This Year
                </li>
            </ul>
        )}
    </div>

<div className=" notification cursor-pointer border border-[#c1c4cc] rounded-full w-[50px] h-[50px] hidden lg:flex justify-center items-center text-xl p-2 relative hover:bg-[#06ca27] hover:text-white transition-colors duration-300" onClick={toggleNotification}>
<FontAwesomeIcon icon={faBell}/>
<span className=" badge text-xs  text-white bg-[#06ca27] px-1 rounded-2xl absolute top-0 right-0">
    1
</span>

    {isNotificationOpen && (
    <ul className="absolute top-14 right-0 bg-white w-[350px] p-3 flex flex-col gap-2 rounded-2xl shadow-xl animate-fade-in">
        <li className="text-sm text-gray-700">
            <Link href='/' className="w-full flex justify-between items-start">
            <div className="flex items-start gap-2">
                <div className="w-14 h-14 rounded-full bg-[#06ca27] flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white text-2xl"/>
                </div>
                <div>
                    <span className=" text-[#212529] sora -font text-lg">Ronald Richards</span>
                    <p className="text-[#4f586d] text-xs"> you can stitch between artboards </p>
                </div>
            </div>
            <span className= " text-[#4f586d] text-xs font-medium"> 23 Mins ago</span> 
             </Link>

        </li>
        
         </ul>
)}

</div>

<div className="user cursor-pointer rounded-[50%] w-[50px] h-[50px] flex justify-center items-center relative" onClick={toggleUserMenu}>
    <div className="w-full h-full rounded-full bg-[#06ca27] flex items-center justify-center">
        <FontAwesomeIcon icon={faUser} className="text-white text-xl"/>
    </div>
    {isUserMenuOpen && (
<ul className="absolute top-15 right-0 bg-white w-[200px] p-3 flex flex-col gap-3 rounded-2xl shadow-xl animate-fade-in">
   
  


        <li>
<Link href='/admin/settings' className="text-md hover:text-[#06ca27] transition-colors duration-300">
<i  className="ri-settings-5-line pe-2 text-[18px]"></i>
Settings
</Link> 
    </li>

        <li>
<button onClick={handleLogout} disabled={disconnectLoading} className="text-md hover:text-[#06ca27] transition-colors duration-300 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed">
<i  className="ri-shut-down-line pe-2 text-[18px]"></i>
{disconnectLoading ? 'Logging out...' : 'Logout'}
</button> 
    </li>

</ul>
)}
</div>

</div>

</div>
</>
    )
}
