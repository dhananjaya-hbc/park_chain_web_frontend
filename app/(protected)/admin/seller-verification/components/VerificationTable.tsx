import React from 'react'
import VerificationTableRow from './VerificationTableRow'

// Mock data - Replace with API call later
const verificationData = [
    {
        id: 1,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SF-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'pending' as const
    },
    {
        id: 2,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SF-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'pending' as const
    },
    {
        id: 3,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SF-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'pending' as const
    },
    {
        id: 4,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SF-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'verified' as const
    },
    {
        id: 5,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SF-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'verified' as const
    },
    {
        id: 6,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SE-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'rejected' as const
    },
    {
        id: 7,
        name: 'Kevin Rodrigo',
        role: 'Seller',
        walletId: 'rHb9CJAw4jp*****',
        blockchain: 'XRPL',
        roleId: '#SE-5648',
        date: '01 Dec 2025-23:21:56',
        status: 'rejected' as const
    },
]

export default function VerificationTable() {
    return (
        <div className="overflow-x-auto px-2 sm:px-4 lg:px-[2.5rem] py-2 rounded-b-2xl" style={{backgroundColor: '#E5F5E0'}}>
            <table className="w-full border-separate min-w-[800px]" style={{borderSpacing: '0 14px'}}>
                <thead style={{backgroundColor: '#f7fcf5'}}>
                    <tr>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Wallet ID</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Role ID & Date</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-green-50">
                    {verificationData.map((verification) => (
                        <VerificationTableRow 
                            key={verification.id}
                            {...verification}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}