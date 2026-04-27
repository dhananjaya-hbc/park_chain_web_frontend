import React from 'react'
import Link from 'next/link'
import StatusBadge from './StatusBadge'

interface VerificationTableRowProps {
    id: number
    entityName: string
    spotType: string
    address: string
    date: string
    status: 'pending' | 'verified' | 'rejected'
}

export default function VerificationTableRow({
    id,
    entityName,
    spotType,
    address,
    date,
    status
}: VerificationTableRowProps) {
    return (
        <tr className="bg-white">
            <td className="px-6 py-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                            <i className="ri-building-4-fill text-white text-xs"></i>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{entityName}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <div className="text-sm text-gray-900 capitalize">{spotType}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 text-center truncate max-w-[200px]" title={address}>{address}</div>
                <div className="text-xs text-gray-500 text-center">{date}</div>
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-4 text-center">
                <Link href={`/admin/kyb/${id}`}>
                    <button className="px-4 py-2 border border-black rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md transition-colors">
                        View Details
                    </button>
                </Link>
            </td>
        </tr>
    )
}