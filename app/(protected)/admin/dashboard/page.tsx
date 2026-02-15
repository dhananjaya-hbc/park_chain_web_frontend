"use client"

import { useState, useEffect } from 'react'  
import { useRouter } from 'next/navigation'
import { useWeb3AuthDisconnect } from "@web3auth/modal/react"
import { useRole } from '@/hooks/useRole'
import Sidebar from './Components/Sidebar'
import Navbar from './Components/Navbar'
import Main from './Components/Main'


export default function DashboardPage() {
    const [isOpen, setIsOpen] = useState(false);
    const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
    const { clearRole } = useRole();
    const router = useRouter();
    const [adminWallet, setAdminWallet] = useState<string>(() => {
        // Get admin wallet from localStorage
        return typeof window !== 'undefined' ? localStorage.getItem('admin_wallet') || '' : '';
    });

    const handleLogout = async () => {
        try {
            await disconnect();
            clearRole();
            router.push('/admin-login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
       <>
       <div className='flex min-h-[100vh] h-100vh overflow-y-hidden'>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} disconnectLoading={disconnectLoading}/>
        
        <div className='flex-1 bg-gray-100 h-screen min-h-screen overflow-y-scroll'>
            <Navbar setIsOpen={setIsOpen} handleLogout={handleLogout} disconnectLoading={disconnectLoading} adminWallet={adminWallet}/>

            <div className='main-content p-5 bg-[#f3f8fe]'>
                <Main/>
            </div>
        </div>
       </div>

       {isOpen && (
        <div className='fixed inset-0 bg-black/20 z-40 lg:hidden'
        onClick={() => setIsOpen(false)}>
        </div>
       )}
       </>
    )
}
