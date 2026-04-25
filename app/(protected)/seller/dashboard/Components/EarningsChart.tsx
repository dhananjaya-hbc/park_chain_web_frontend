"use client";

import React, { useEffect, useState } from "react";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import apiService from "@/lib/api/apiService";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

type Period = "Week" | "Month" | "Year";
type ApiPeriod = "week" | "month" | "year";

type EarningsChartResponse = {
  period: ApiPeriod;
  currency: string;
  labels: string[];
  values: number[];
};

const PERIODS: Period[] = ["Week", "Month", "Year"];

const periodToApi = (period: Period): ApiPeriod => {
  if (period === "Week") return "week";
  if (period === "Month") return "month";
  return "year";
};

export default function EarningsChart() {
  const [period, setPeriod] = useState<Period>("Week");
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [currency, setCurrency] = useState<"XRP" | "$">("XRP");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const apiPeriod = periodToApi(period);
        const data: EarningsChartResponse = await apiService.get(
          `${API_ENDPOINTS.SELLER_EARNINGS_CHART}?period=${apiPeriod}`
        );

        setLabels(Array.isArray(data.labels) ? data.labels : []);
        setValues(
          Array.isArray(data.values)
            ? data.values.map((v) => Number(v) || 0)
            : []
        );
        setCurrency(data.currency === "$" ? "$" : "XRP");
      } catch (error) {
        console.error("Earnings chart fetch error:", error);
        setLabels([]);
        setValues([]);
        setCurrency("XRP");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period]);

  return (
    <RevenueLineChart
      title={loading ? "Earnings Overview (Loading...)" : "Earnings Overview"}
      titleClassName="text-base font-bold text-gray-900"
      labels={labels}
      datasets={[{ label: "Earnings", values }]}
      showPeriodSelector
      periods={PERIODS}
      selectedPeriod={period}
      onPeriodChange={(p) => setPeriod(p as Period)}
      currency={currency}
      height="260"
    />
  );
}