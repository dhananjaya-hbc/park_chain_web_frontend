interface Props {
  stats: {
    total: number;
    active: number;
    confirmed: number;
    completed: number;
  };
}

export default function BookingStatCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: "Total", value: stats.total, color: "text-gray-900", bg: "bg-white", border: "border-gray-200" },
        { label: "Active", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Upcoming", value: stats.confirmed, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Completed", value: stats.completed, color: "text-gray-700", bg: "bg-white", border: "border-gray-200" },
      ].map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border ${stat.border} shadow-sm`}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
          <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}



