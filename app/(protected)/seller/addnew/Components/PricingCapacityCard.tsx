import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function PricingCapacityCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Pricing & Capacity</h2>
                <button className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1.5 transition-colors">
                    <Plus className="w-4 h-4 stroke-[3]" /> Add Slot Type
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[35%]">Slot Type</th>
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[30%] text-center">Number of Slots</th>
                            <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[25%] text-right pr-4">Hourly Rate ($)</th>
                            <th className="pb-4 w-[10%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-5 pr-4">
                                <div className="relative">
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all">
                                        <option>Car</option>
                                        <option>Bike</option>
                                        <option>Van</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5 px-4">
                                <input type="number" defaultValue={10} className="w-24 mx-auto block bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-center text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all" />
                            </td>
                            <td className="py-5 pl-4 pr-4">
                                <input type="number" defaultValue="0.00" step="0.01" className="w-24 ml-auto block bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-right text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all" />
                            </td>
                            <td className="py-5 pl-2 text-right">
                                <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group">
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-5 pr-4">
                                <div className="relative">
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all">
                                        <option>Bike</option>
                                        <option>Car</option>
                                        <option>Van</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5 px-4">
                                <input type="number" defaultValue={5} className="w-24 mx-auto block bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-center text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all" />
                            </td>
                            <td className="py-5 pl-4 pr-4">
                                <input type="number" defaultValue="0.00" step="0.01" className="w-24 ml-auto block bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-right text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#43a047]/30 focus:border-[#43a047] transition-all" />
                            </td>
                            <td className="py-5 pl-2 text-right">
                                <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group">
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
