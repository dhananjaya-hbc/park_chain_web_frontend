// __tests__/seller/dashboard/ParkingSpotsTable.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ParkingSpotsTable from '@/app/(protected)/seller/dashboard/Components/ParkingSpotsTable';

// ── Mock apiService ───────────────────────────────────
jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('@/lib/api/endpoints', () => ({
  API_ENDPOINTS: {
    SPOTS: '/spots',
    SELLER_TRANSACTIONS: '/payments/seller/transactions',
    BOOKINGS: '/bookings',
  },
}));

import apiService from '@/lib/api/apiService';
const mockApi = apiService as jest.Mocked<typeof apiService>;

// ── Factory helpers ───────────────────────────────────
const makeSpot = (overrides: Record<string, unknown> = {}) => ({
  id: 'spot-uuid-1',
  title: 'City Center Spot',
  address: '12 Main Street',
  is_approved: true,
  ...overrides,
});

const makeTx = (overrides: Record<string, unknown> = {}) => ({
  spot_id: 'spot-uuid-1',
  amount_xrp: '4.5',
  created_at: new Date().toISOString(),
  ...overrides,
});

describe('ParkingSpotsTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: LOADING STATE
  // ════════════════════════════════════════════════════
  describe('Loading State', () => {
    test('shows loading text while data is being fetched', () => {
      mockApi.get.mockImplementation(() => new Promise(() => {}));

      render(<ParkingSpotsTable />);

      expect(screen.getByText('Loading spots...')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: HEADER & STRUCTURE
  // ════════════════════════════════════════════════════
  describe('Header & Structure', () => {
    beforeEach(() => {
      mockApi.get
        .mockResolvedValueOnce({ spots: [] })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });
    });

    test('shows table title', async () => {
      render(<ParkingSpotsTable />);

      await screen.findByText('Your Parking Spots');
      expect(screen.getByText('Your Parking Spots')).toBeTruthy();
    });

    test('shows total badge', async () => {
      render(<ParkingSpotsTable />);

      await screen.findByText('0 Total');
      expect(screen.getByText('0 Total')).toBeTruthy();
    });

    test('shows table column headers', async () => {
      render(<ParkingSpotsTable />);

      await screen.findByText('Your Parking Spots');

      expect(screen.getByText('Title')).toBeTruthy();
      expect(screen.getByText('Location')).toBeTruthy();
      expect(screen.getByText('Spot ID')).toBeTruthy();
      expect(screen.getByText('Status')).toBeTruthy();
      expect(screen.getByText('Earnings (Mo)')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: EMPTY STATE
  // ════════════════════════════════════════════════════
  describe('Empty State', () => {
    test('shows no spots message when no approved spots exist', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [makeSpot({ is_approved: false })],
        })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('No spots found.');
      expect(screen.getByText('No spots found.')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: DATA DISPLAY
  // ════════════════════════════════════════════════════
  describe('Data Display', () => {
    test('shows only approved spots', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [
            makeSpot({ id: 'approved-1', title: 'Approved Spot', is_approved: true }),
            makeSpot({ id: 'pending-1', title: 'Pending Spot', is_approved: false }),
          ],
        })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('Approved Spot');
      expect(screen.getByText('Approved Spot')).toBeTruthy();
      expect(screen.queryByText('Pending Spot')).toBeNull();
    });

    test('shows location text for spot', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [makeSpot({ address: 'Palm Road, Colombo' })],
        })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('Palm Road, Colombo');
      expect(screen.getByText('Palm Road, Colombo')).toBeTruthy();
    });

    test('shows Approved status badge for approved spot', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [makeSpot({ is_approved: true })],
        })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('Approved');
      expect(screen.getByText('Approved')).toBeTruthy();
    });

    test('shows monthly earnings in XRP format', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [makeSpot({ id: 'spot-1' })],
        })
        .mockResolvedValueOnce({
          transactions: [
            makeTx({ spot_id: 'spot-1', amount_xrp: '3.20' }),
            makeTx({ spot_id: 'spot-1', amount_xrp: '1.80' }),
          ],
        })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('5.00 XRP');
      expect(screen.getByText('5.00 XRP')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: PAGINATION
  // ════════════════════════════════════════════════════
  describe('Pagination', () => {
    test('shows pagination controls when there are more than ITEMS_PER_PAGE (5) spots', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [
            makeSpot({ id: 's1', title: 'Spot 1' }),
            makeSpot({ id: 's2', title: 'Spot 2' }),
            makeSpot({ id: 's3', title: 'Spot 3' }),
            makeSpot({ id: 's4', title: 'Spot 4' }),
            makeSpot({ id: 's5', title: 'Spot 5' }),
            makeSpot({ id: 's6', title: 'Spot 6' }),
          ],
        })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('Spot 1');
      expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeTruthy();
      expect(screen.queryByText('Spot 6')).toBeNull();
    });

    test('navigates pages with Next and Previous buttons', async () => {
      mockApi.get
        .mockResolvedValueOnce({
          spots: [
            makeSpot({ id: 's1', title: 'Spot 1' }),
            makeSpot({ id: 's2', title: 'Spot 2' }),
            makeSpot({ id: 's3', title: 'Spot 3' }),
            makeSpot({ id: 's4', title: 'Spot 4' }),
            makeSpot({ id: 's5', title: 'Spot 5' }),
            makeSpot({ id: 's6', title: 'Spot 6' }),
          ],
        })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await screen.findByText('Spot 1');

      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(await screen.findByText('Spot 6')).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
      expect(await screen.findByText('Spot 1')).toBeTruthy();
      expect(screen.queryByText('Spot 6')).toBeNull();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 6: API CALLS
  // ════════════════════════════════════════════════════
  describe('API Calls', () => {
    test('calls all required endpoints on mount', async () => {
      mockApi.get
        .mockResolvedValueOnce({ spots: [] })
        .mockResolvedValueOnce({ transactions: [] })
        .mockResolvedValueOnce({ bookings: [] });

      render(<ParkingSpotsTable />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith('/spots');
        expect(mockApi.get).toHaveBeenCalledWith('/payments/seller/transactions');
        expect(mockApi.get).toHaveBeenCalledWith('/bookings');
      });

      expect(mockApi.get).toHaveBeenCalledTimes(3);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 7: ERROR HANDLING
  // ════════════════════════════════════════════════════
  describe('Error Handling', () => {
    test('shows empty state when API call fails', async () => {
      mockApi.get.mockRejectedValue(new Error('backend down'));

      render(<ParkingSpotsTable />);

      await screen.findByText('No spots found.');
      expect(screen.getByText('No spots found.')).toBeTruthy();
    });
  });
});
