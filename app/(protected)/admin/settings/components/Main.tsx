"use client";
import React, { useState } from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import { User, KeyRound, Sliders, Copy, Check, ShieldAlert, Settings, Bell, Database } from 'lucide-react';

type TabType = 'profile' | 'security' | 'preferences';

export default function Main() {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [copied, setCopied] = useState(false);

    // Mock platform/system states
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [backupInterval, setBackupInterval] = useState('daily');
    const [platformFee, setPlatformFee] = useState(5.0);

    const adminWallet = typeof window !== 'undefined' ? localStorage.getItem('admin_wallet') || '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c' : '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c';

    const handleCopyWallet = () => {
        navigator.clipboard.writeText(adminWallet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto py-2">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your platform administration profile, security preferences, and system parameters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-1.5 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === 'profile'
                                ? 'bg-green-50 text-[#197729] shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <User className="w-4.5 h-4.5" />
                        <span>Profile & Wallet</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === 'security'
                                ? 'bg-green-50 text-[#197729] shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <KeyRound className="w-4.5 h-4.5" />
                        <span>Security</span>
                    </button>

                    {/* Hide System Settings for now
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === 'preferences'
                                ? 'bg-green-50 text-[#197729] shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Sliders className="w-4.5 h-4.5" />
                        <span>System Settings</span>
                    </button>
                    */}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-5">
                                <div className="p-2.5 bg-green-50 text-[#197729] rounded-xl">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>
                                    <p className="text-xs text-gray-500">Overview of the currently connected administration account</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#197729] to-[#4CAF50] flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-[#197729]/10">
                                    AD
                                </div>
                                <div className="text-center sm:text-left flex-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                        <h3 className="text-lg font-bold text-gray-900">Platform Administrator</h3>
                                        <span className="bg-green-100 text-[#197729] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                                            Owner
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Access Level: Global Control</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Type</label>
                                        <p className="text-sm font-semibold text-gray-800 mt-1">Main Administrator</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Security Clearance</label>
                                        <p className="text-sm font-semibold text-gray-800 mt-1">Tier-1 Access (Write/Execute)</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Connected Web3 Wallet</label>
                                    <div className="flex items-center gap-2 mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                                        <code className="text-xs font-mono text-gray-700 flex-1 truncate break-all">
                                            {adminWallet}
                                        </code>
                                        <button
                                            onClick={handleCopyWallet}
                                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors flex-shrink-0"
                                            title="Copy wallet address"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="shadow-sm rounded-2xl">
                            <ChangePasswordForm />
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-5">
                                <div className="p-2.5 bg-green-50 text-[#197729] rounded-xl">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">System Preferences</h2>
                                    <p className="text-xs text-gray-500">Configure global platform limits and notifications</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Platform Fee Setting */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Default Platform Fee</span>
                                            <p className="text-xs text-gray-500">Transaction commission charged on parking spot bookings</p>
                                        </div>
                                        <span className="text-sm font-bold text-[#197729] bg-green-50 border border-green-200 px-3 py-1 rounded-lg">
                                            {platformFee.toFixed(1)}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="15"
                                        step="0.5"
                                        value={platformFee}
                                        onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                                        className="w-full accent-[#197729] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                                    />
                                </div>

                                <div className="border-t border-gray-100 my-6"></div>

                                {/* Maintenance Mode Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg h-fit">
                                            <ShieldAlert className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Maintenance Mode</span>
                                            <p className="text-xs text-gray-500 max-w-md">Redirect all frontend users to maintenance page while database updates occur</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                            maintenanceMode ? 'bg-amber-500' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 my-6"></div>

                                {/* Email Toggles */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit">
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">System Notification Alerts</span>
                                            <p className="text-xs text-gray-500 max-w-md">Send emails to administrators when new KYC or KYB request is submitted</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEmailAlerts(!emailAlerts)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                            emailAlerts ? 'bg-[#197729]' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                emailAlerts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 my-6"></div>

                                {/* Backup Toggles */}
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg h-fit">
                                            <Database className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Automatic Database Backup</span>
                                            <p className="text-xs text-gray-500">Configure schedule for cloud backup synchronization</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {['daily', 'weekly', 'monthly'].map((interval) => (
                                                    <button
                                                        key={interval}
                                                        onClick={() => setBackupInterval(interval)}
                                                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border capitalize transition-all ${
                                                            backupInterval === interval
                                                                ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm'
                                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {interval}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}