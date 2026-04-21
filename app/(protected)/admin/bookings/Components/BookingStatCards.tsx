"use client";

import React, { useState, useEffect } from 'react';
import { faCalendarCheck, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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

interface Booking {
    booking_status: string;
    payment_status: string;
}

export default function BookingStatCards() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await apiService.get(API_ENDPOINTS.BOOKINGS);
                setBookings(response.bookings || []);
            } catch (err) {
                console.error('Failed to fetch bookings for stats:', err);
            }
        };
        fetchBookings();
    }, []);

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.booking_status === 'active').length;
    const completedBookings = bookings.filter(b => b.booking_status === 'completed').length;

    const stats = [
        { title: 'Total Bookings', value: totalBookings, icon: faCalendarCheck, bgColor: 'bg-[#197729]' },
        { title: 'Active Now', value: activeBookings, icon: faSpinner, bgColor: 'bg-[#1565c0]' },
        { title: 'Completed', value: completedBookings, icon: faCheckCircle, bgColor: 'bg-[#2e7d32]' },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-5'>
            {stats.map((stat, index) => (
                <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} bgColor={stat.bgColor} />
            ))}
        </div>
    );
}