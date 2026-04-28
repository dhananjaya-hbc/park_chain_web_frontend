// __tests__/seller/dashboard/EarningsChart.test.tsx

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EarningsChart from "@/app/(protected)/seller/dashboard/Components/EarningsChart";
import apiService from "@/lib/api/apiService";

jest.mock("@/lib/api/apiService");

// Mock the child RevenueLineChart to simplify testing
jest.mock("@/components/charts/RevenueLineChart", () => {
  return function MockRevenueLineChart(props: any) {
    return (
      <div data-testid="revenue-line-chart">
        <h2>{props.title}</h2>
        <span data-testid="currency-display">{props.currency}</span>
        <button
          data-testid="month-btn"
          onClick={() => props.onPeriodChange("Month")}
        >
          Month
        </button>
        <div data-testid="data-labels">{props.labels.join(",")}</div>
        <div data-testid="data-values">{props.datasets[0].values.join(",")}</div>
      </div>
    );
  };
});

describe("EarningsChart Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: INITIAL STATE & LOADING
  // ════════════════════════════════════════════════════
  describe("Initial State", () => {
    test("renders loading state initially", async () => {
      // Delay API resolution
      let resolveApi: any;
      (apiService.get as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveApi = resolve;
        })
      );

      render(<EarningsChart />);
      expect(screen.getByText("Earnings Overview (Loading...)")).toBeTruthy();
      
      resolveApi({
        period: "week",
        currency: "XRP",
        labels: ["Mon"],
        values: [10],
      });
      await waitFor(() => {
        expect(screen.queryByText("Earnings Overview (Loading...)")).toBeNull();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: API DATA FETCHING
  // ════════════════════════════════════════════════════
  describe("API Data", () => {
    test("fetches and displays weekly data by default", async () => {
      (apiService.get as jest.Mock).mockResolvedValueOnce({
        period: "week",
        currency: "XRP",
        labels: ["Mon", "Tue"],
        values: [10, 20],
      });

      render(<EarningsChart />);
      
      await waitFor(() => {
        expect(apiService.get).toHaveBeenCalledWith(
          expect.stringContaining("?period=week")
        );
      });

      expect(screen.getByText("Earnings Overview")).toBeTruthy();
      expect(screen.getByTestId("data-labels").textContent).toBe("Mon,Tue");
      expect(screen.getByTestId("data-values").textContent).toBe("10,20");
      expect(screen.getByTestId("currency-display").textContent).toBe("XRP");
    });

    test("handles API errors gracefully", async () => {
      (apiService.get as jest.Mock).mockRejectedValueOnce(new Error("API Failed"));
      // Suppress console.error
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      render(<EarningsChart />);
      
      await waitFor(() => {
        expect(screen.getByTestId("data-labels").textContent).toBe("");
      });

      expect(screen.getByTestId("data-values").textContent).toBe("");
      consoleSpy.mockRestore();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: INTERACTIONS (PERIOD CHANGE)
  // ════════════════════════════════════════════════════
  describe("Interactions", () => {
    test("changes period when button is clicked", async () => {
      (apiService.get as jest.Mock)
        .mockResolvedValueOnce({
          period: "week",
          currency: "XRP",
          labels: ["Mon"],
          values: [10],
        })
        .mockResolvedValueOnce({
          period: "month",
          currency: "$",
          labels: ["Week 1"],
          values: [50],
        });

      render(<EarningsChart />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("data-labels").textContent).toBe("Mon");
      });

      // Click "Month" period option
      fireEvent.click(screen.getByTestId("month-btn"));

      await waitFor(() => {
        expect(apiService.get).toHaveBeenCalledWith(
          expect.stringContaining("?period=month")
        );
      });

      expect(screen.getByTestId("data-labels").textContent).toBe("Week 1");
      expect(screen.getByTestId("currency-display").textContent).toBe("$");
    });
  });
});
