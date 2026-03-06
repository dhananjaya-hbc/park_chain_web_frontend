"use client";

interface BadgeProps {
  status: string;
}

export default function ApprovalStatusBadge({ status }: BadgeProps) {
  let bg = "bg-gray-100";
  let text = "text-gray-700";
  let dot = "bg-gray-500";

  // Determine colors based on status
  if (status === "Pending Review") {
    bg = "bg-[#fef3c7]"; text = "text-[#b45309]"; dot = "bg-[#f59e0b]";
  } else if (status === "Verified") {
    bg = "bg-[#dcfce7]"; text = "text-[#15803d]"; dot = "bg-[#22c55e]";
  } else if (status === "Rejected") {
    bg = "bg-[#fee2e2]"; text = "text-[#b91c1c]"; dot = "bg-[#ef4444]";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
}