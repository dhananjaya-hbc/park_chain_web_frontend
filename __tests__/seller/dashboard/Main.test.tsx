// __tests__/seller/dashboard/Main.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import SellerDashboardMain from "@/app/(protected)/seller/dashboard/Components/Main";

// Mock child components
jest.mock("@/app/(protected)/seller/dashboard/Components/StatsCards", () => {
  return function MockStatsCards() {
    return <div data-testid="stats-cards">Stats Cards Mock</div>;
  };
});

jest.mock("@/app/(protected)/seller/dashboard/Components/EarningsChart", () => {
  return function MockEarningsChart() {
    return <div data-testid="earnings-chart">Earnings Chart Mock</div>;
  };
});

jest.mock("@/app/(protected)/seller/dashboard/Components/ParkingSpotsTable", () => {
  return function MockParkingSpotsTable() {
    return <div data-testid="parking-spots-table">Parking Spots Table Mock</div>;
  };
});

describe("SellerDashboardMain Component", () => {
  // ════════════════════════════════════════════════════
  // GROUP 1: LABELS AND HEADER
  // ════════════════════════════════════════════════════
  describe("Labels", () => {
    test("shows main heading", () => {
      render(<SellerDashboardMain />);
      expect(screen.getByText("Overview")).toBeTruthy();
    });

    test("shows sub-heading welcome text", () => {
      render(<SellerDashboardMain />);
      expect(screen.getByText(/Welcome back, here's what's happening/i)).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: STRUCTURE
  // ════════════════════════════════════════════════════
  describe("Structure", () => {
    test("renders all child components", () => {
      render(<SellerDashboardMain />);
      expect(screen.getByTestId("stats-cards")).toBeTruthy();
      expect(screen.getByTestId("earnings-chart")).toBeTruthy();
      expect(screen.getByTestId("parking-spots-table")).toBeTruthy();
    });
  });
});
