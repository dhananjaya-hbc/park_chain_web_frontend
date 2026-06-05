// __tests__/seller/dashboard/StatsCards.test.tsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StatsCards from "@/app/(protected)/seller/dashboard/Components/StatsCards";
import apiService from "@/lib/api/apiService";

jest.mock("@/lib/api/apiService");

describe("StatsCards Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: LABELS
  // ════════════════════════════════════════════════════
  describe("Labels", () => {
    test("shows Total Earnings label", async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ bookings: [], spots: [] });
      render(<StatsCards />);
      expect(screen.getByText("Total Earnings")).toBeTruthy();
    });

    test("shows Total Bookings label", async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ bookings: [], spots: [] });
      render(<StatsCards />);
      expect(screen.getByText("Total Bookings")).toBeTruthy();
    });

    test("shows Active Spots label", async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ bookings: [], spots: [] });
      render(<StatsCards />);
      expect(screen.getByText("Active Spots")).toBeTruthy();
    });

    test("shows Occupancy label", async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ bookings: [], spots: [] });
      render(<StatsCards />);
      expect(screen.getByText("Occupancy")).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: API DATA LOGIC & CALCULATION
  // ════════════════════════════════════════════════════
  describe("Calculations", () => {
    test("calculates earnings, bookings, spots, and occupancy correctly", async () => {
      // Mock explicit endpoints
      (apiService.get as jest.Mock).mockImplementation((url) => {
        if (url.includes("/bookings")) {
          return Promise.resolve({
            bookings: [
              { payment_status: "paid", seller_amount_xrp: "10.00" },
              { payment_status: "split_completed", seller_amount_xrp: "5.50" },
              { payment_status: "unpaid", seller_amount_xrp: "100.00" }, // should be ignored
            ],
          });
        }
        if (url.includes("/spots")) {
          return Promise.resolve({
            spots: [
              { status: "approved", is_active: true, total_slots: 2 },
              { status: "pending", is_active: false, total_slots: 1 },
              { status: "active", total_slots: 1 }, // implicit active
            ],
          });
        }
        return Promise.resolve({});
      });

      render(<StatsCards />);

      await waitFor(() => {
        // total earnings: 10.00 + 5.50 = 15.50
        expect(screen.getByText("15.50 XRP")).toBeTruthy();
      });

      // total bookings: 3
      expect(screen.getByText("3")).toBeTruthy();
      
      // active spots: 2 out of 3 match the "approved" / "active" filters
      expect(screen.getByText("2")).toBeTruthy();
      
      // occupancy: bookings (3) / total_slots (4) = 75%
      expect(screen.getByText("75%")).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: ERROR HANDLING & LOADING
  // ════════════════════════════════════════════════════
  describe("Loading & Error States", () => {
    test("shows loading placeholders initially", async () => {
      let resolveApi: any;
      (apiService.get as jest.Mock).mockReturnValue(
        new Promise((resolve) => { resolveApi = resolve; })
      );

      render(<StatsCards />);
      // Should show "..." four times initially
      const loadingIndicators = screen.getAllByText("...");
      expect(loadingIndicators.length).toBe(4);
      
      // Resolve and wait so state updates safely
      resolveApi({ bookings: [], spots: [] });
      await waitFor(() => {
        expect(screen.queryAllByText("...").length).toBe(0);
      });
    });

    test("handles undefined API responses without crashing", async () => {
      (apiService.get as jest.Mock).mockResolvedValue(undefined); // Broken API
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      render(<StatsCards />);

      await waitFor(() => {
        expect(screen.getByText("0.00 XRP")).toBeTruthy();
        expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1); // Bookings and Active Spots
        expect(screen.getByText("0%")).toBeTruthy(); // Occupancy
      });

      consoleSpy.mockRestore();
    });
  });
});
