"use client";

import React, { useState } from "react";
import RevenueLineChart from "@/components/charts/RevenueLineChart";

type Period = "Week" | "Month" | "Year";

const DATA: Record<Period, { labels: string[]; values: number[] }> = {
  Week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [120, 180, 150, 290, 210, 380, 310],
  },
  Month: {
    labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
    values: [820, 1100, 970, 1360],
  },
  Year: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    values: [400, 600, 500, 800, 700, 950, 850, 1100, 980, 1200, 1050, 1400],
  },
};

export default function EarningsChart() {
  const [period, setPeriod] = useState<Period>("Week");
  const periods: Period[] = ["Week", "Month", "Year"];

  return (
    <RevenueLineChart
      title="Earnings Overview"
      titleClassName="text-base font-bold text-gray-900"
      labels={DATA[period].labels}
      datasets={[{ label: "Earnings", values: DATA[period].values }]}
      showPeriodSelector
      periods={periods}
      selectedPeriod={period}
      onPeriodChange={(p) => setPeriod(p as Period)}
      currency="XRP"
      height="260"
    />
  );
}
