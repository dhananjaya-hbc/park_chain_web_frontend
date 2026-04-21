"use client";

import React from 'react';
import type { SlotRow } from '@/hooks/useAddNewSpotForm';

interface PricingCapacityCardProps {
    slots: SlotRow[];
    setSlots: (slots: SlotRow[]) => void;
    totalSlots: number;
    setTotalSlots: (total: number) => void;
}

const headingBaseClass = 'pb-4 text-[14px] font-medium text-[#374151] tracking-normal';
const slotTypeFieldClass = 'w-full h-[46px] bg-white border border-gray-200 rounded-[8px] px-4 text-[14px] font-medium text-[#374151]/80';
const focusClass = 'focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all';
const numberFieldBaseClass = 'w-24 h-[46px] block bg-white border border-gray-200 rounded-[8px] text-[14px] text-[#374151]/80 font-medium';

const tableHeadings = [
    { label: 'Slot type', className: `${headingBaseClass} w-[35%]` },
    { label: 'Number of slots', className: `${headingBaseClass} px-4 w-[30%] text-left` },
    { label: 'Hourly rate (XRP)', className: `${headingBaseClass} pl-4 w-[25%] text-left` },
] as const;

export default function PricingCapacityCard({ slots, setSlots, totalSlots, setTotalSlots }: PricingCapacityCardProps) {
    const updateRow = (id: number, field: 'slotType' | 'slots' | 'rate', value: string | number) => {
        setSlots(slots.map((row) => {
            if (row.id !== id) return row;

            if (field === 'slotType') {
                const normalized = String(value).trim().toLowerCase();
                const alreadyExists = slots.some(
                    (item) => item.id !== id && item.slotType.trim().toLowerCase() === normalized
                );

                if (normalized && alreadyExists) {
                    return row;
                }
            }

            return {
                ...row,
                [field]: value,
            };
        }));
    };

    // A row is partial when exactly one of (slots, rate) is filled
    const isRowPartial = (row: SlotRow): boolean => {
        const hasSlots = row.slots > 0;
        const hasRate = parseFloat(row.rate) > 0;
        return hasSlots !== hasRate;
    };

    // The one partial row (if any) — others get locked until it's completed
    const partialRow = slots.find(isRowPartial);
    const hasPartialRow = Boolean(partialRow);

    // A row's inputs should be disabled when a DIFFERENT row is partial
    const isRowLocked = (row: SlotRow) => hasPartialRow && partialRow?.id !== row.id;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 pb-10 shadow-sm">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">Pricing &amp; Capacity</h2>
            </div>
            {hasPartialRow && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                    Fill both <strong>slot count</strong> and <strong>hourly rate</strong> for <strong>{partialRow?.slotType}</strong> before editing other rows.
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <th key={heading.label} className={heading.className}>
                                    {heading.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((row) => (
                            <tr key={row.id}>
                                <td className="py-2 pr-4">
                                    {row.isCustom ? (
                                        <input
                                            type="text"
                                            value={row.slotType}
                                            onChange={(e) => updateRow(row.id, 'slotType', e.target.value)}
                                            placeholder="Enter slot type"
                                            className={`${slotTypeFieldClass} placeholder:text-[#374151]/60 ${focusClass}`}
                                        />
                                    ) : (
                                        <div className={`${slotTypeFieldClass} flex items-center`}>
                                            {`${row.slotType} Slots`}
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={row.slots === 0 ? '' : row.slots}
                                        disabled={isRowLocked(row)}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            updateRow(row.id, 'slots', val === '' ? 0 : Math.max(0, parseInt(val, 10)));
                                        }}
                                        className={`${numberFieldBaseClass} pl-4 pr-2 text-left ${focusClass} disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50`}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="py-2 pl-4 pr-4">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={row.rate === '0.00' || row.rate === '0' ? '' : row.rate}
                                        disabled={isRowLocked(row)}
                                        onChange={(e) => updateRow(row.id, 'rate', e.target.value)}
                                        className={`${numberFieldBaseClass} pl-2 pr-1 text-right ${focusClass} disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50`}
                                        placeholder="0.00"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
