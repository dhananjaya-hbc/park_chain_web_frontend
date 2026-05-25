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
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 align-middle">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <i className="ri-building-4-fill text-gray-600 text-sm"></i>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{entityName}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 align-middle">
                <div className="text-sm text-gray-700 capitalize">{spotType}</div>
            </td>
            <td className="px-6 py-4 align-middle">
                <div className="max-w-[240px]">
                    <div className="text-sm text-gray-900 truncate" title={address}>{address}</div>
                    <div className="text-xs text-gray-500 mt-1">{date}</div>
                </div>
            </td>
            <td className="px-6 py-4 align-middle">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-4 align-middle text-right">
                <Link href={`/admin/kyb/${id}`}>
                    <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-colors">
                        View Details
                    </button>
                </Link>
            </td>
        </tr>
    )
}