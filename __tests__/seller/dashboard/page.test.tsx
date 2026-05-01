// __tests__/seller/dashboard/page.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import SellerDashboard from "@/app/(protected)/seller/dashboard/page";

// Mock the Main component
jest.mock("@/app/(protected)/seller/dashboard/Components/Main", () => {
  return function MockSellerDashboardMain() {
    return <div data-testid="seller-dashboard-main">Seller Dashboard Main</div>;
  };
});

describe("Seller Dashboard Page", () => {
  // ════════════════════════════════════════════════════
  // GROUP 1: RENDERING
  // ════════════════════════════════════════════════════
  describe("Rendering", () => {
    test("renders the Main component", () => {
      render(<SellerDashboard />);
      expect(screen.getByTestId("seller-dashboard-main")).toBeTruthy();
    });
  });
});
