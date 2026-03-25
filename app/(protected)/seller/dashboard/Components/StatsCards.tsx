"use client";

import React from "react";
import { TrendingUp, Home, Users } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  sub: React.ReactNode;
  subColor: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatsCards() {
  const cards: StatCard[] = [
    {
      label: "Total Earnings",
      value: "4,250 XRP",
      sub: (
        <>
          +12.5%{" "}
          <span className="text-[#6B7280]">
            from
            <br />
            last month
          </span>
        </>
      ),
      subColor: "text-green-500",
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      iconBg: "bg-green-50",
    },
    {
      label: "Active Spots",
      value: "12",
      sub: <span className="text-[#6B7280]">Currently listed</span>,
      subColor: "text-gray-400",
      icon: <Home className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "Occupancy",
      value: "85%",
      sub: (
        <>
          +5%{" "}
          <span className="text-[#6B7280]">
            this week
          </span>
        </>
      ),
      subColor: "text-green-500",
      icon: <Users className="w-5 h-5 text-purple-500" />,
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{card.label}</span>
            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
