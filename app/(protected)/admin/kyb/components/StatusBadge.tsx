import React from 'react'

interface StatusBadgeProps {
    status: 'pending' | 'verified' | 'rejected'
}

const statusConfig = {
    pending: {
        icon: 'ri-time-fill',
        iconColor: 'text-amber-500',
        label: 'Pending',
    },
    verified: {
        icon: 'ri-checkbox-circle-fill',
        iconColor: 'text-green-600',
        label: 'Verified',
    },
    rejected: {
        icon: 'ri-close-circle-fill',
        iconColor: 'text-red-600',
        label: 'Rejected',
    },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status]
    const iconSize = status === 'pending' ? 'text-base' : 'text-lg'

    return (
        <div className="flex items-center justify-center gap-2">
            <i className={`${config.icon} ${config.iconColor} ${iconSize}`}></i>
            <span className="text-sm text-gray-900">{config.label}</span>
        </div>
    )
}