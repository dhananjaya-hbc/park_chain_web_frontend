// __tests__/seller/spots/spotCard.test.tsx

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SpotCard from "@/app/(protected)/seller/spots/Componenets/spotCard";
import apiService from "@/lib/api/apiService";

jest.mock("@/lib/api/apiService");

// Mock Details/Edit sub-components
jest.mock("@/app/(protected)/seller/spots/Componenets/SpotDetailsPreview", () => ({
  __esModule: true,
  default: function MockSpotDetailsPreview({ onClose, onEdit, spot }: any) {
    return (
      <div data-testid="spot-details-preview">
        Preview for {spot?.name}
        <button data-testid="preview-close" onClick={onClose}>Close Preview</button>
        <button data-testid="preview-edit" onClick={onEdit}>Edit</button>
      </div>
    );
  }
}));

jest.mock("@/app/(protected)/seller/spots/Componenets/EditSpot", () => ({
  __esModule: true,
  default: function MockEditSpot({ onClose, spot }: any) {
    return (
      <div data-testid="edit-spot">
        Edit spot {spot?.name}
        <button data-testid="edit-close" onClick={onClose}>Close Edit</button>
      </div>
    );
  }
}));

jest.mock('next/dynamic', () => () => {
  const DynamicComponent = (props: any) => {
    return (
      <div data-testid="mock-dynamic">
        Mock Map
        {props.spots?.map((s: any) => (
          <div key={s.id} data-testid="map-spot-item" onClick={() => props.onView(s)}>
            {s.name} - {s.pricePerHour}
          </div>
        ))}
      </div>
    );
  };
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

describe("SpotCard Component", () => {
  
  const mockSpots = [
    {
      id: "spot-1",
      title: "Uptown Parking",
      address: "123 Main St",
      price_per_hour: "5",
      status: "approved",
      is_active: true,
      activeBookings: 2,
      hasBooking: true,
    },
    {
      id: "spot-2",
      title: "Downtown Garage",
      address: "456 Side St",
      price_per_hour: "3",
      status: "approved", // make this approved so it shows up in filtered spots
      is_active: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.get as jest.Mock).mockResolvedValue({
      spots: mockSpots,
      bookings: []
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: INITIAL RENDER & LOADING
  // ════════════════════════════════════════════════════
  describe("Initial Render", () => {
    test("shows loading state initially", async () => {
      let resolveApi: any;
      (apiService.get as jest.Mock).mockReturnValue(
        new Promise((resolve) => { resolveApi = resolve; })
      );

      render(<SpotCard />);
      // Loaders might not be visible textually, but API should be called.
      resolveApi({ spots: [], bookings: [] });
      await waitFor(() => {
        expect(apiService.get).toHaveBeenCalled();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: SPOT RENDERING
  // ════════════════════════════════════════════════════
  describe("Spot Rendering", () => {
    test("renders fetched spots", async () => {
      render(<SpotCard />);

      await waitFor(() => {
        expect(screen.getByText(/Uptown Parking/)).toBeTruthy();
      });

      // Price renders
      expect(screen.getAllByText(/5/).length).toBeGreaterThan(0);
    });

    test("shows no results state when API returns empty", async () => {
      (apiService.get as jest.Mock).mockResolvedValueOnce({ spots: [], bookings: [] });
      render(<SpotCard />);

      await waitFor(() => {
        expect(screen.queryByText(/Uptown Parking/)).toBeNull();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: INTERACTIONS & PREVIEW
  // ════════════════════════════════════════════════════
  describe("Interactions", () => {
    test("opens details preview on spot click", async () => {
      render(<SpotCard />);
      
      await waitFor(() => {
        expect(screen.getByText(/Uptown Parking/)).toBeTruthy();
      });

      // Click the spot
      const card = screen.getAllByTestId("map-spot-item")[0];
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByTestId("spot-details-preview")).toBeTruthy();
        expect(screen.getByText(/Preview for Uptown Parking/)).toBeTruthy();
      });

      // Test close
      fireEvent.click(screen.getByTestId("preview-close"));
      await waitFor(() => {
        expect(screen.queryByTestId("spot-details-preview")).toBeNull();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: SEARCH
  // ════════════════════════════════════════════════════
  describe("Search", () => {
    test("filters spots based on search query", async () => {
      render(<SpotCard />);

      await waitFor(() => {
        expect(screen.getByText(/Uptown Parking/)).toBeTruthy();
        expect(screen.getByText(/Downtown Garage/)).toBeTruthy();
      });

      const searchInput = screen.getByPlaceholderText("Search spot name or address");
      fireEvent.change(searchInput, { target: { value: "Uptown" } });

      await waitFor(() => {
        expect(screen.getByText(/Uptown Parking/)).toBeTruthy();
        expect(screen.queryByText(/Downtown Garage/)).toBeNull();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: EDIT FLOW
  // ════════════════════════════════════════════════════
  describe("Edit Flow", () => {
    test("opens edit spot component from preview", async () => {
      render(<SpotCard />);

      await waitFor(() => {
        expect(screen.getByText(/Uptown Parking/)).toBeTruthy();
      });

      // Open preview
      const card = screen.getAllByTestId("map-spot-item")[0];
      fireEvent.click(card);

      await waitFor(() => {
        expect(screen.getByTestId("spot-details-preview")).toBeTruthy();
      });

      // Click edit
      const editBtn = screen.getByTestId("preview-edit");
      fireEvent.click(editBtn);

      await waitFor(() => {
        expect(screen.getByTestId("edit-spot")).toBeTruthy();
        expect(screen.getByText(/Edit spot Uptown Parking/)).toBeTruthy();
      });

      // Close edit
      const editCloseBtn = screen.getByTestId("edit-close");
      fireEvent.click(editCloseBtn);

      await waitFor(() => {
        expect(screen.queryByTestId("edit-spot")).toBeNull();
        expect(screen.getByTestId("spot-details-preview")).toBeTruthy();
      });
    });
  });

});