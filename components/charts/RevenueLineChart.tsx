"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDataset {
  label: string;
  values: number[];
}

interface RevenueLineChartProps {
  title: string;
  titleClassName?: string;
  labels: string[];
  datasets: ChartDataset[];
  showGrowthIndicator?: boolean;
  growthPercentage?: string;
  showPeriodSelector?: boolean;
  periods?: string[];
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  currency?: "XRP" | "$";
  height?: string;
}

export default function RevenueLineChart({
  title,
  titleClassName = "font-semibold text-lg text-gray-900",
  labels,
  datasets,
  showGrowthIndicator = false,
  growthPercentage = "+18%",
  showPeriodSelector = false,
  periods = [],
  selectedPeriod = "",
  onPeriodChange,
  currency = "XRP",
  height = "75",
}: RevenueLineChartProps) {
  const chartData = {
    labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.values,
      borderColor: "#197729",
      backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(6, 202, 39, 0.18)");
        gradient.addColorStop(1, "rgba(6, 202, 39, 0.01)");
        return gradient;
      },
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: "#197729",
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#fff",
        titleColor: "#212529",
        bodyColor: "#4f586d",
        borderColor: "#dfe0e4",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => ` ${currency}${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4f586d", font: { size: 12 } },
      },
      y: {
        grid: { color: "#f0f0f0" },
        ticks: {
          color: "#4f586d",
          font: { size: 12 },
          callback: (value) => `${currency}${value}`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={titleClassName}>{title}</h3>
        <div className="flex items-center gap-3">
          {showPeriodSelector && periods.length > 0 && (
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => onPeriodChange?.(period)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period
                      ? "bg-[#2e7d32] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}

          {showGrowthIndicator && (
            <span className="px-3 py-1 bg-green-50 text-[#197729] rounded-full text-xs font-medium">
              {growthPercentage}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
