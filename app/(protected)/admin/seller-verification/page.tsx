"use client"

import { useState } from 'react'  
import { useRouter } from 'next/navigation'
import { useWeb3AuthDisconnect } from "@web3auth/modal/react"
import { useRole } from '@/hooks/useRole'
import Sidebar from '@/components/layout/Sidebar/AdminSidebar'
import Navbar from '@/components/layout/Navbar/AdminNavbar'
import Main from './components/Main'

export default function SellerVerificationPage() {
    const [isOpen, setIsOpen] = useState(false)
    const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect()
    const { clearRole } = useRole()
    const router = useRouter()
    const [adminWallet, setAdminWallet] = useState<string>(() => {
        return typeof window !== 'undefined' ? localStorage.getItem('admin_wallet') || '' : ''
    })

    const handleLogout = async () => {
        try {
            await disconnect()
            clearRole()
            router.push('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
       <>
       <div className='flex min-h-screen h-screen overflow-y-hidden bg-gray-100'>
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          handleLogout={handleLogout} 
          disconnectLoading={disconnectLoading} 
          currentPage="verification"
        />
        
        <div className='flex-1 bg-gray-100 h-screen min-h-screen overflow-y-scroll'>
            <Navbar 
              setIsOpen={setIsOpen} 
              handleLogout={handleLogout} 
              disconnectLoading={disconnectLoading} 
              adminWallet={adminWallet} 
              title="Verifications" 
              showSearch={false}
            />

            <div className='main-content px-4 sm:px-6 pt-5 pb-6 bg-gray-100'>
                <Main />
            </div>
        </div>
       </div>

       {isOpen && (
        <div 
          className='fixed inset-0 bg-black/20 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
       )}
       </>
    )
}