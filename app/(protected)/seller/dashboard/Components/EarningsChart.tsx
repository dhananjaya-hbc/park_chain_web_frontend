"use client";

import React, { useEffect, useMemo, useState } from "react";
import RevenueLineChart from "@/components/charts/RevenueLineChart";

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

const getEarningsChartUrl = (base: string, period: ApiPeriod) => {
  const normalizedBase = base.replace(/\/+$/, "");
  const path = normalizedBase.endsWith("/api")
    ? "/payments/seller/earnings-chart"
    : "/api/payments/seller/earnings-chart";

  return `${normalizedBase}${path}?period=${period}`;
};

export default function EarningsChart() {
  const [period, setPeriod] = useState<Period>("Week");
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [currency, setCurrency] = useState<"XRP" | "$">("XRP");
  const [loading, setLoading] = useState(false);

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    []
  );

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("park_chain_token");
        const apiPeriod = periodToApi(period);

        const response = await fetch(getEarningsChartUrl(apiBase, apiPeriod), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chart data: ${response.status}`);
        }

        const data: EarningsChartResponse = await response.json();

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
  }, [period, apiBase]);

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