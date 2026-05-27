"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import type { SellerData } from './SellerTable';

interface SellerTableRowProps {
    seller: SellerData;
}

export default function SellerTableRow({ seller }: SellerTableRowProps) {
    const isSuspended = seller.status === 'suspended';
    const [copiedId, setCopiedId] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Helpers to truncate long strings cleanly using asterisks
    const formatId = (id: string) => {
        if (!id) return '';
        if (id.length <= 12) return id;
        return `${id.slice(0, 6)}***${id.slice(-4)}`;
    };

    const formatEmail = (email: string) => {
        if (!email) return '';
        if (email.length <= 20) return email;
        const [username, domain] = email.split('@');
        if (!domain) return `${email.slice(0, 8)}***${email.slice(-4)}`; // Safe fallback
        return `${username.slice(0, 4)}***@${domain}`;
    };

    const copyToClipboard = (text: string, type: 'id' | 'email') => {
        navigator.clipboard.writeText(text);
        if (type === 'id') {
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } else {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Seller Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        {seller.image ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={seller.image} alt="" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-[#197729]/10 flex items-center justify-center text-[#197729] font-medium">
                                {seller.name ? seller.name.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                    </div>
                    <div className="ml-4 flex flex-col justify-center">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {seller.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5 gap-1.5">
                            <span className="font-mono">ID: #{formatId(seller.id)}</span>
                            <button 
                                onClick={() => copyToClipboard(seller.id, 'id')}
                                className="text-gray-400 hover:text-[#197729] transition-colors"
                                title="Copy full ID"
                            >
                                {copiedId ? (
                                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </td>

            {/* Contact Details Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center gap-1.5 mb-0.5">
                    {formatEmail(seller.email)}
                    {seller.email && (
                        <button 
                            onClick={() => copyToClipboard(seller.email, 'email')}
                            className="text-gray-400 hover:text-[#197729] transition-colors"
                            title="Copy full Email"
                        >
                            {copiedEmail ? (
                                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            )}
                        </button>
                    )}
                </div>
                <div className="text-sm text-gray-500">{seller.phone || 'N/A'}</div>
            </td>

            {/* Total Spots */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                    {seller.totalSpots || 0} {seller.totalSpots === 1 ? 'Spot' : 'Spots'}
                </div>
            </td>

            {/* Joined Date */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(seller.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                    {seller.status ? seller.status.charAt(0).toUpperCase() + seller.status.slice(1) : 'Unknown'}
                </span>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link 
                    href={`/admin/sellers/${seller.id}`}
                    className="text-[#197729] hover:text-[#135c20] bg-[#197729]/10 hover:bg-[#197729]/20 px-3 py-1.5 rounded-lg transition-colors inline-block"
                >
                    View Profile
                </Link>
            </td>
        </tr>
    );
}