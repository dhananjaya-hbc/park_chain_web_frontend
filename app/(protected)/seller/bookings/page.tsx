"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

function BookingTimelinePage() {
  const [filter, setFilter] = useState('all');

  const bookings = [
    {
      id: 'JS',
      user: 'John Smith',
      userId: '#JS-1029-P',
      spot: 'Downtown Garage A12',
      spotDetails: 'Compact • Level 1',
      startDate: 'Oct 24, 2023',
      startTime: '05:00 AM',
      endTime: '05:00 PM',
      duration: '8h 00m',
      status: 'active',
      amount: '$24.00',
      color: 'blue'
    },
    {
      id: 'MR',
      user: 'Maria Rodriguez',
      userId: 'MR-8847-P',
      spot: 'Driveway #42 - Sunset Blvd',
      spotDetails: 'SUV • Outdoor',
      startDate: 'Oct 25, 2023',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      duration: '2h 00m',
      status: 'upcoming',
      amount: '$12.50',
      color: 'orange'
    },
    {
      id: 'DK',
      user: 'David Kim',
      userId: '#DK-1320-P',
      spot: 'City Center Mall - B2',
      spotDetails: 'Standard • Covered',
      startDate: 'Oct 22, 2023',
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      duration: '8h 00m',
      status: 'completed',
      amount: '$35.00',
      color: 'green'
    },
    {
      id: 'SL',
      user: 'Sarah Lee',
      userId: '#SL-1197-P',
      spot: 'Airport Valet Zone',
      spotDetails: 'Premium • Outdoor',
      startDate: 'Oct 26, 2023',
      startTime: '08:00 AM',
      endTime: '10:00 AM',
      duration: '4h 00m',
      status: 'cancelled',
      amount: '$0.00',
      color: 'pink'
    },
    {
      id: 'TR',
      user: 'Tom Riddle',
      userId: '#TR-5523-P',
      spot: 'Downtown Garage A15',
      spotDetails: 'Compact • Level 1',
      startDate: 'Oct 28, 2023',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      duration: '12h 00m',
      status: 'upcoming',
      amount: '$36.00',
      color: 'green'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={true} 
        setIsOpen={() => {}} 
        handleLogout={() => console.log('Logout')} 
        disconnectLoading={false}
        role="seller"
        currentPage="bookings"
      />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-500 mt-1">View and manage your booking details and availability below.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookings..."
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />
              <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-notification-3-line text-xl text-gray-600"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="ri-car-line text-green-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <i className="ri-time-line text-yellow-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Completed This Month</p>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-blue-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">156</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Revenue (Mo)</p>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-purple-500 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">$4,280</p>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'upcoming' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'completed' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'cancelled' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancelled
              </button>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <i className="ri-download-line"></i>
              Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Booking ID / User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Spot Details</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${booking.color}-100 rounded-full flex items-center justify-center text-${booking.color}-700 font-semibold text-sm`}>
                          {booking.id}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.user}</p>
                          <p className="text-sm text-gray-500">{booking.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{booking.spot}</p>
                      <p className="text-sm text-gray-500">{booking.spotDetails}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{booking.startDate}</p>
                      <p className="text-sm text-gray-500">{booking.startTime} - {booking.endTime}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{booking.duration}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        <i className="ri-checkbox-circle-fill"></i>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{booking.amount}</p>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <i className="ri-more-2-fill text-gray-400"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">248</span> results</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-green-600 border border-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingTimelinePage;