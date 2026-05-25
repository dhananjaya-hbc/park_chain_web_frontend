import React from 'react'

interface StatusBadgeProps {
    status: 'pending' | 'verified' | 'rejected'
}

const statusConfig = {
    pending: {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Pending',
    },
    verified: {
        className: 'bg-green-100 text-green-800',
        label: 'Verified',
    },
    rejected: {
        className: 'bg-red-100 text-red-800',
        label: 'Rejected',
    },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <span className={`inline-flex items-center justify-center text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
            {config.label}
        </span>
    )
}