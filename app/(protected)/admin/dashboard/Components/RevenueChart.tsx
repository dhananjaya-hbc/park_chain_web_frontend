"use client";

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const RevenueLineChart = dynamic(
  () => import('@/components/charts/RevenueLineChart'),
  { ssr: false }
)

type Period = "Week" | "Month" | "Year";
type ApiPeriod = "week" | "month" | "year";

type RevenueChartResponse = {
  period: ApiPeriod;
  currency: string;
  labels: string[];
  values: number[];
};

const PERIODS: Period[] = ["Week", "Month", "Year"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

const periodToApi = (period: Period): ApiPeriod => {
  if (period === "Week") return "week";
  if (period === "Month") return "month";
  return "year";
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<Period>("Week");
  const [fromYear, setFromYear] = useState<number>(currentYear);
  const [toYear, setToYear] = useState<number>(currentYear);
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [currency, setCurrency] = useState<"XRP" | "$">("XRP");
  const [loading, setLoading] = useState(false);

  // Validation: automatically adjust toYear if fromYear is greater
  const handleFromYearChange = (year: number) => {
    setFromYear(year);
    if (toYear < year) {
      setToYear(year);
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const apiPeriod = periodToApi(period);
        let url = `${API_ENDPOINTS.ADMIN_REVENUE_CHART}?period=${apiPeriod}`;
        if (period === "Year") {
          url += `&fromYear=${fromYear}&toYear=${toYear}`;
        }
        const data: RevenueChartResponse = await apiService.get(url);

        setLabels(Array.isArray(data.labels) ? data.labels : []);
        setValues(
          Array.isArray(data.values)
            ? data.values.map((v: number) => Number(v) || 0)
            : []
        );
        setCurrency(data.currency === "$" ? "$" : "XRP");
      } catch (error) {
        console.error("Revenue chart fetch error:", error);
        setLabels([]);
        setValues([]);
        setCurrency("XRP");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period, fromYear, toYear]);

  const yearRangeSelector = period === "Year" ? (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 font-medium">From:</span>
        <select
          value={fromYear}
          onChange={(e) => handleFromYearChange(Number(e.target.value))}
          className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 font-medium">To:</span>
        <select
          value={toYear}
          onChange={(e) => setToYear(Number(e.target.value))}
          className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          {YEARS.filter((y) => y >= fromYear).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : null;

  return (
    <div className='mb-5'>
      <RevenueLineChart
        title={loading ? "Revenue Analytics (Loading...)" : "Revenue Analytics"}
        titleClassName="text-base font-bold text-gray-900"
        labels={labels}
        datasets={[{ label: "Revenue", values }]}
        showPeriodSelector
        periods={PERIODS}
        selectedPeriod={period}
        onPeriodChange={(p) => setPeriod(p as Period)}
        currency={currency}
        height="280"
        extraHeaderControls={yearRangeSelector}
      />
    </div>
  )
}