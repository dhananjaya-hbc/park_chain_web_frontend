// __tests__/seller/spots/page.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import SellerSpotsPage from "@/app/(protected)/seller/spots/page";

// Mock the Main component inside spots
jest.mock("@/app/(protected)/seller/spots/Componenets/main", () => {
  return function MockMain() {
    return <div data-testid="spots-main">Seller Spots Main</div>;
  };
});

describe("Seller Spots Page Component", () => {
  // ════════════════════════════════════════════════════
  // GROUP 1: RENDERING
  // ════════════════════════════════════════════════════
  describe("Rendering", () => {
    test("renders the Main component", () => {
      render(<SellerSpotsPage />);
      expect(screen.getByTestId("spots-main")).toBeTruthy();
    });
  });
});
