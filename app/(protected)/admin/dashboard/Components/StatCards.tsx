"use client";

import React, { useState, useEffect } from 'react'
import { faUsers, faStore, faDollarSign, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import apiService from '@/lib/api/apiService'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
interface StatCardProps {
    title: string
    value: string | number
    icon: IconDefinition
    bgColor?: string
}

const StatCard = ({ title, value, icon, bgColor = 'bg-[#197729]' }: StatCardProps) => (
    <div className='p-5 rounded-xl bg-white w-full flex justify-between items-start gap-3 shadow-xl'>
        <div>
            <p className='text-[#4f586d] text-md font-normal'>{title}</p>
            <h6 className='text-[#404a60] text-2xl font-medium pb-3'>{value}</h6>
        </div>
        <div className={`${bgColor} min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer`}>
            <FontAwesomeIcon icon={icon} className='text-white text-xl'/>
        </div>
    </div>
)

export default function StatCards() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeSellers, setActiveSellers] = useState(0);
    const [platformRevenue, setPlatformRevenue] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // Fetch Total Users
                const usersResponse = await apiService.get(API_ENDPOINTS.USERS);
                const users = Array.isArray(usersResponse) ? usersResponse : [];
                setTotalUsers(users.length);

                // Fetch Active Sellers
                const sellersResponse = await apiService.get('/users?role=seller');
                const sellers = Array.isArray(sellersResponse) ? sellersResponse : [];
                const activeSellersCount = sellers.filter((s: any) => s.status === 'active' || s.is_active === true).length;
                setActiveSellers(activeSellersCount);

                // Fetch Platform Revenue
                const balanceResponse = await apiService.get(API_ENDPOINTS.ADMIN_BALANCE);
                if (balanceResponse?.earnings?.admin_profit_xrp) {
                    setPlatformRevenue(parseFloat(balanceResponse.earnings.admin_profit_xrp));
                }

                // Fetch Total Bookings
                const bookingsResponse = await apiService.get(API_ENDPOINTS.BOOKINGS);
                if (bookingsResponse?.bookings && Array.isArray(bookingsResponse.bookings)) {
                    setTotalBookings(bookingsResponse.bookings.length);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const stats = [
        {
            title: 'Total Users',
            value: isLoading ? '...' : totalUsers.toLocaleString(),
            icon: faUsers,
        },
        {
            title: 'Active Sellers',
            value: isLoading ? '...' : activeSellers.toLocaleString(),
            icon: faStore,
        },
        {
            title: 'Platform Revenue',
            value: isLoading ? '...' : `${platformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XRP`,
            icon: faDollarSign,
        },
        {
            title: 'Total Bookings',
            value: isLoading ? '...' : totalBookings.toLocaleString(),
            icon: faCalendarCheck,
        },
    ]

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                />
            ))}
        </div>
    )
}