"use client";

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type SlotRow = {
    id: number;
    slotType: string;
    slots: number;
    rate: string;
    isCustom: boolean;
};

const interStyle = { fontFamily: 'Inter, sans-serif' } as const;
const headingBaseClass = 'pb-4 text-[14px] font-medium text-[#374151] tracking-normal';
const slotTypeFieldClass = 'w-full h-[46px] bg-white border border-gray-200 rounded-[8px] px-4 text-[14px] font-medium text-[#374151]/80';
const focusClass = 'focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all';
const numberFieldBaseClass = 'w-24 h-[46px] block bg-white border border-gray-200 rounded-[8px] text-[14px] text-[#374151]/80 font-medium';

const tableHeadings = [
    { label: 'Slot type', className: `${headingBaseClass} w-[35%]` },
    { label: 'Number of slots', className: `${headingBaseClass} px-4 w-[30%] text-left` },
    { label: 'Hourly rate (XRP)', className: `${headingBaseClass} pl-4 w-[25%] text-left` },
] as const;

export default function PricingCapacityCard() {
    const [rows, setRows] = useState<SlotRow[]>([
        { id: 1, slotType: 'Car', slots: 0, rate: '0.00', isCustom: false },
        { id: 2, slotType: 'Bike', slots: 0, rate: '0.00', isCustom: false },
        { id: 3, slotType: 'Van', slots: 0, rate: '0.00', isCustom: false },
    ]);

    const addRow = () => {
        setRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                slotType: '',
                slots: 0,
                rate: '0.00',
                isCustom: true,
            },
        ]);
    };

    const updateRow = (id: number, field: 'slotType' | 'slots' | 'rate', value: string | number) => {
        setRows((prev) =>
            prev.map((row) => {
                if (row.id !== id) return row;

                if (field === 'slotType') {
                    const normalized = String(value).trim().toLowerCase();
                    const alreadyExists = prev.some(
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
            })
        );
    };

    const deleteRow = (id: number) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">Pricing & Capacity</h2>
                <button
                    type="button"
                    onClick={addRow}
                    className="text-sm font-semibold text-[#2e7d32] bg-[#e8f5e9] hover:bg-[#c8e6c9] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                    <Plus className="w-4 h-4 stroke-[3]" /> Add
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <th key={heading.label} className={heading.className} style={interStyle}>
                                    {heading.label}
                                </th>
                            ))}
                            <th className="pb-4 w-[10%]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td className="py-2 pr-4">
                                    {row.isCustom ? (
                                        <input
                                            type="text"
                                            value={row.slotType}
                                            onChange={(e) => updateRow(row.id, 'slotType', e.target.value)}
                                            placeholder="Enter slot type"
                                            className={`${slotTypeFieldClass} placeholder:text-[#374151]/60 ${focusClass}`}
                                            style={interStyle}
                                        />
                                    ) : (
                                        <div className={`${slotTypeFieldClass} flex items-center`} style={interStyle}>
                                            {`${row.slotType} Slots`}
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        value={row.slots}
                                        onChange={(e) => updateRow(row.id, 'slots', Number(e.target.value))}
                                        className={`${numberFieldBaseClass} pl-4 pr-2 text-left ${focusClass}`}
                                        style={interStyle}
                                    />
                                </td>
                                <td className="py-2 pl-4 pr-4">
                                    <input
                                        type="number"
                                        value={row.rate}
                                        step="0.01"
                                        onChange={(e) => updateRow(row.id, 'rate', e.target.value)}
                                        className={`${numberFieldBaseClass} pl-2 pr-1 text-right ${focusClass}`}
                                        style={interStyle}
                                    />
                                </td>
                                <td className="py-2 pl-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() => deleteRow(row.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                    >
                                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
