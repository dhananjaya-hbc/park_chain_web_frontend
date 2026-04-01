"use client";

import React, { useState, useEffect } from 'react';
import { faArrowDown, faArrowUp, faCoins, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: IconDefinition;
    bgColor?: string;
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
);

export default function TransactionStatCards() {
    const [earnings, setEarnings] = useState({
        total_payments: 0,
        total_received_xrp: '0',
        total_paid_sellers_xrp: '0',
        admin_profit_xrp: '0',
    });
    const [adminBalance, setAdminBalance] = useState('0');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.get(API_ENDPOINTS.ADMIN_BALANCE);
                setAdminBalance(response.currentBalance || '0');
                if (response.earnings) {
                    setEarnings(response.earnings);
                }
            } catch (err) {
                console.error('Failed to fetch admin earnings:', err);
            }
        };
        fetchData();
    }, []);

    const stats = [
        {
            title: 'Total Received',
            value: `${parseFloat(earnings.total_received_xrp).toFixed(2)} XRP`,
            icon: faArrowDown,
            bgColor: 'bg-[#1565c0]',
        },
        {
            title: 'Paid to Sellers',
            value: `${parseFloat(earnings.total_paid_sellers_xrp).toFixed(2)} XRP`,
            icon: faArrowUp,
            bgColor: 'bg-[#e65100]',
        },
        {
            title: 'Admin Profit (20%)',
            value: `${parseFloat(earnings.admin_profit_xrp).toFixed(2)} XRP`,
            icon: faCoins,
            bgColor: 'bg-[#197729]',
        },
        {
            title: 'Admin Wallet Balance',
            value: `${parseFloat(adminBalance).toFixed(2)} XRP`,
            icon: faChartLine,
            bgColor: 'bg-[#6a1b9a]',
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
            {stats.map((stat, index) => (
                <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} bgColor={stat.bgColor} />
            ))}
        </div>
    );
}