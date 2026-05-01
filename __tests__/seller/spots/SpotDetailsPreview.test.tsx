// __tests__/seller/spots/SpotDetailsPreview.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SpotDetailsPreview from "@/app/(protected)/seller/spots/Componenets/SpotDetailsPreview";
import apiService from "@/lib/api/apiService";

jest.mock("@/lib/api/apiService");

describe("SpotDetailsPreview Component", () => {
  const mockSpot = {
    id: "spot-123",
    name: "Test Spot Station",
    address: "123 Test St",
    description: "Great parking near the hub.",
    pricePerHour: 10,
    totalSlots: 5,
    activeBookings: 1,
    totalBookings: 1,
    pendingBookings: 0,
    vehicleTypes: ["Car", "Bike"],
    slotsPerType: [3, 2],
    pricesPerHour: [10, 5],
  };

  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnSpotDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: INITIAL RENDER & DETAILS
  // ════════════════════════════════════════════════════
  describe("Details Render", () => {
    test("renders spot details correctly", () => {
      render(
        <SpotDetailsPreview
          spot={mockSpot}
          status="active"
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onSpotDeleted={mockOnSpotDeleted}
        />
      );

      expect(screen.getByText("Test Spot Station")).toBeTruthy();
      expect(screen.getByText("123 Test St")).toBeTruthy();
      expect(screen.getByText("Great parking near the hub.")).toBeTruthy();
      
      // Shows active badge
      expect(screen.getByText("Active")).toBeTruthy();
    });

    test("renders pricing row mapped details", () => {
      render(
        <SpotDetailsPreview
          spot={mockSpot}
          onClose={mockOnClose}
        />
      );
      
      // Car and Bike text (using vehicle types logic)
      expect(screen.getByText(/Car spots/i)).toBeTruthy();
      expect(screen.getByText(/Bike spots/i)).toBeTruthy();
      
      // Rate display
      expect(screen.getByText(/10\.00/)).toBeTruthy();
      expect(screen.getByText(/5\.00/)).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: ACTION BUTTONS (EDIT/DELETE)
  // ════════════════════════════════════════════════════
  describe("Action Buttons logic", () => {
    test("allows edit when there are no pending bookings", () => {
      render(
        <SpotDetailsPreview
          spot={{ ...mockSpot, pendingBookings: 0 }}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
        />
      );
      
      const editBtn = screen.getByText("Edit");
      expect((editBtn as HTMLButtonElement).className).not.toMatch(/opacity-45/);
      
      fireEvent.click(editBtn);
      expect(mockOnEdit).toHaveBeenCalled();
    });

    test("disables edit when pending bookings exist", () => {
      render(
        <SpotDetailsPreview
          spot={{ ...mockSpot, pendingBookings: 2 }}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
        />
      );
      
      const editBtn = screen.getByText("Edit");
      fireEvent.click(editBtn);
      expect(screen.getByText("Cannot edit this spot while there are pending bookings.")).toBeTruthy();
    });

    test("disables delete when active bookings exist", () => {
      render(
        <SpotDetailsPreview
          spot={{ ...mockSpot, activeBookings: 1 }}
          onClose={mockOnClose}
        />
      );
      
      const deleteBtns = screen.getAllByText("Delete");
      fireEvent.click(deleteBtns[0]);
      expect(screen.getByText("Cannot delete this spot while there are active bookings.")).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: DELETE FLOW
  // ════════════════════════════════════════════════════
  describe("Delete Flow", () => {
    test("triggers delete successfully", async () => {
      (apiService.delete as jest.Mock).mockResolvedValueOnce({});
      
      render(
        <SpotDetailsPreview
          spot={{ ...mockSpot, activeBookings: 0 }}
          onClose={mockOnClose}
          onSpotDeleted={mockOnSpotDeleted}
        />
      );
      
      const mainDeleteBtn = screen.getByText("Delete");
      fireEvent.click(mainDeleteBtn);

      // Confirm popup should have opened
      await waitFor(() => {
        expect(screen.getByText(/Do you really want to delete/)).toBeTruthy();
      });

      // Confirm popup's Delete button (index 1 if there are 2, or just find it in the modal context)
      const confirmDeleteBtn = screen.getAllByText("Delete")[1];
      fireEvent.click(confirmDeleteBtn);

      await waitFor(() => {
        expect(apiService.delete).toHaveBeenCalled();
        expect(screen.getAllByText(/Successfully Deleted/i).length).toBeGreaterThan(0);
      });

      // Close the success modal
      const closeBtn = screen.getByText("Back");
      fireEvent.click(closeBtn);
      expect(mockOnSpotDeleted).toHaveBeenCalled();
    });

    test("handles delete error", async () => {
      (apiService.delete as jest.Mock).mockRejectedValueOnce(new Error("Unable to delete"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      
      render(
        <SpotDetailsPreview
          spot={{ ...mockSpot, activeBookings: 0 }}
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByText("Delete"));
      await waitFor(() => {
        expect(screen.getByText(/Do you really want to delete/)).toBeTruthy();
      });

      fireEvent.click(screen.getAllByText("Delete")[1]);

      await waitFor(() => {
        expect(screen.getByText(/Failed to delete spot. Please try again./)).toBeTruthy();
      });
      
      consoleSpy.mockRestore();
    });
  });
});
