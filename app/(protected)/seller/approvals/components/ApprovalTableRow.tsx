"use client";

import ApprovalStatusBadge from "./ApprovalStatusBadge";

// Export this interface so we can use it in the main table file too
export interface ApprovalData {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  type: string;
  date: string;
  time: string;
  status: string;
  action: string;
}

export default function ApprovalTableRow({ row }: { row: ApprovalData }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Name & Avatar Column */}
      <td className="px-6 py-4 flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${row.avatarBg}`}>
          {row.initials}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-base">{row.name}</p>
          {row.id && <p className="text-xs text-gray-400">{row.id}</p>}
        </div>
      </td>

      {/* Verification Type */}
      <td className="px-6 py-4 text-gray-600">{row.type}</td>

      {/* Date Submitted */}
      <td className="px-6 py-4">
        <p className="text-gray-700">{row.date}</p>
        <p className="text-xs text-gray-500">{row.time}</p>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4">
        <ApprovalStatusBadge status={row.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 font-medium">
        <button className={`hover:underline ${row.action === "Review" ? "text-[#4CAF50]" : "text-gray-500"}`}>
          {row.action}
        </button>
      </td>
    </tr>
  );
}