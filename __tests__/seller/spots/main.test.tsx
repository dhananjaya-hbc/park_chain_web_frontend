// __tests__/seller/spots/main.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "@/app/(protected)/seller/spots/Componenets/main";

// Mock the SpotCard component
jest.mock("@/app/(protected)/seller/spots/Componenets/spotCard", () => {
  return function MockSpotCard() {
    return <div data-testid="spot-card">Spot Card Component</div>;
  };
});

describe("Seller Spots Main Component", () => {
  // ════════════════════════════════════════════════════
  // GROUP 1: RENDERING & LAYOUT
  // ════════════════════════════════════════════════════
  describe("Rendering", () => {
    test("renders layout correctly", () => {
      render(<Main />);
      expect(screen.getByTestId("spot-card")).toBeTruthy();
    });
  });
});
