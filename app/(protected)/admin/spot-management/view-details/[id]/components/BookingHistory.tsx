import React from 'react';

export default function BookingHistory() {
    const history = [
        { id: 1, user: "Mike T.", date: "Apr 22, 2024", duration: "2 hrs", amount: "$12.00", status: "Completed" },
        { id: 2, user: "Jenny W.", date: "Apr 20, 2024", duration: "4 hrs", amount: "$24.00", status: "Completed" },
        { id: 3, user: "Robert P.", date: "Apr 18, 2024", duration: "1 hr", amount: "$6.00", status: "Cancelled" },
        { id: 4, user: "Alice K.", date: "Apr 15, 2024", duration: "8 hrs", amount: "$40.00", status: "Completed" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold text-lg">Booking History</h3>
                <button className="text-sm text-[#197729] font-medium hover:underline">Download CSV</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">User</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 rounded-r-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-medium text-gray-900">{item.user}</td>
                                <td className="px-4 py-4 text-gray-500">{item.date}</td>
                                <td className="px-4 py-4 text-gray-500">{item.duration}</td>
                                <td className="px-4 py-4 font-medium text-gray-900">{item.amount}</td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.status === 'Completed' 
                                            ? 'bg-green-50 text-green-700' 
                                            : 'bg-red-50 text-red-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
