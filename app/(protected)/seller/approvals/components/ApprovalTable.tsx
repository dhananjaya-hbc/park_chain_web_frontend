"use client";

import ApprovalTableRow, { ApprovalData } from "./ApprovalTableRow";
import ApprovalTablePagination from "./ApprovalTablePagination";

// The mock data
const approvalData: ApprovalData[] =[
  { id: "#USR-8821", name: "Spot at katubedda", initials: "JS", avatarBg: "bg-blue-100 text-blue-600", type: "Spot", date: "Oct 29, 2023", time: "10:42 AM", status: "Pending Review", action: "Review" },
  { id: "", name: "Sajan Nethsara", initials: "", avatarBg: "bg-green-200", type: "National ID", date: "Oct 28, 2023", time: "02:15 PM", status: "Verified", action: "View Details" },
  { id: "#USR-7731", name: "Spot at Pannipitiya", initials: "MK", avatarBg: "bg-purple-100 text-purple-600", type: "Spot", date: "Oct 27, 2023", time: "09:30 AM", status: "Rejected", action: "Re-Open" },
  { id: "#USR-1029", name: "Spot at Ambalangoda", initials: "", avatarBg: "bg-green-200", type: "Spot", date: "Oct 26, 2023", time: "11:15 AM", status: "Pending Review", action: "Review" },
  { id: "#USR-5501", name: "Spot at Nandikadal", initials: "DT", avatarBg: "bg-orange-100 text-orange-600", type: "Spot", date: "Oct 26, 2023", time: "04:45 PM", status: "Verified", action: "View Details" },
];

export default function ApprovalTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          
          {/* Table Headers */}
          <thead className="text-gray-500 font-medium bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Verification Type</th>
              <th className="px-6 py-4 font-semibold">Date Submitted</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body (Calls the Row component) */}
          <tbody className="divide-y divide-gray-200">
            {approvalData.map((row, idx) => (
              <ApprovalTableRow key={idx} row={row} />
            ))}
          </tbody>
          
        </table>
      </div>

      {/* Pagination (Calls the Pagination component) */}
      <ApprovalTablePagination />
      
    </div>
  );
}