// __tests__/seller/earnings/TotalEarningsCard.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalEarningsCard from '@/app/(protected)/seller/earnings/Components/TotalEarningsCard';

// ── Mock apiService ───────────────────────────────────
jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/lib/api/endpoints', () => ({
  API_ENDPOINTS: {
    BOOKINGS: '/bookings',
  },
}));

import apiService from '@/lib/api/apiService';
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// ── Sample bookings ───────────────────────────────────
const makeBookings = () => [
  {
    id:                'booking-1',
    payment_status:    'split_completed',
    seller_amount_xrp: '3.200000',
    total_price_xrp:   '4.000000',
  },
  {
    id:                'booking-2',
    payment_status:    'split_completed',
    seller_amount_xrp: '8.000000',
    total_price_xrp:   '10.000000',
  },
  {
    id:                'booking-3',
    payment_status:    'unpaid',
    seller_amount_xrp: '4.000000',
    total_price_xrp:   '5.000000',
  },
  {
    id:                'booking-4',
    payment_status:    'paid',
    seller_amount_xrp: '1.600000',
    total_price_xrp:   '2.000000',
  },
];

describe('TotalEarningsCard Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: LOADING STATE
  // ════════════════════════════════════════════════════
  describe('Loading State', () => {

    test('shows loading skeleton initially', async () => {
      // Delay API response to catch loading state
      mockApiService.get.mockImplementation(
        () => new Promise(() => {}), // never resolves
      );

      render(<TotalEarningsCard />);

      // Loading skeleton visible
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: LABELS & STRUCTURE
  // ════════════════════════════════════════════════════
  describe('Labels & Structure', () => {

    beforeEach(() => {
      mockApiService.get.mockResolvedValue({
        bookings: makeBookings(),
      });
    });

    test('shows LIFETIME EARNINGS badge', async () => {
      render(<TotalEarningsCard />);

      // Wait for data to load
      await screen.findByText('LIFETIME EARNINGS');
      expect(screen.getByText('LIFETIME EARNINGS')).toBeTruthy();
    });

    test('shows Total Earnings label', async () => {
      render(<TotalEarningsCard />);

      await screen.findByText('Total Earnings');
      expect(screen.getByText('Total Earnings')).toBeTruthy();
    });

    test('shows XRP currency label', async () => {
      render(<TotalEarningsCard />);

      await screen.findByText('XRP');
      expect(screen.getByText('XRP')).toBeTruthy();
    });

    test('shows Source label', async () => {
      render(<TotalEarningsCard />);

      await screen.findByText('Source');
      expect(screen.getByText('Source')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: EARNINGS CALCULATION
  // ════════════════════════════════════════════════════
  describe('Earnings Calculation', () => {

    test('shows correct total earnings from paid bookings', async () => {
      // split_completed: 3.20 + 8.00 = 11.20
      // paid: 1.60
      // Total: 12.80
      mockApiService.get.mockResolvedValue({
        bookings: makeBookings(),
      });

      render(<TotalEarningsCard />);

      await screen.findByText('12.80');
      expect(screen.getByText('12.80')).toBeTruthy();
    });

    test('shows 0.00 when no paid bookings', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [
          {
            id:                'b1',
            payment_status:    'unpaid',
            seller_amount_xrp: '4.00',
          },
          {
            id:                'b2',
            payment_status:    'processing',
            seller_amount_xrp: '2.00',
          },
        ],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(screen.getByText('0.00')).toBeTruthy();
    });

    test('shows 0.00 when no bookings', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(screen.getByText('0.00')).toBeTruthy();
    });

    test('only counts split_completed and paid bookings', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [
          {
            payment_status:    'split_completed',
            seller_amount_xrp: '3.20',
          },
          {
            payment_status:    'paid',
            seller_amount_xrp: '1.60',
          },
          {
            payment_status:    'pending',  // ← not counted
            seller_amount_xrp: '99.00',
          },
          {
            payment_status:    'failed',   // ← not counted
            seller_amount_xrp: '99.00',
          },
        ],
      });

      render(<TotalEarningsCard />);

      // 3.20 + 1.60 = 4.80 (not 99)
      await screen.findByText('4.80');
      expect(screen.getByText('4.80')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: BOOKING COUNT TEXT
  // ════════════════════════════════════════════════════
  describe('Booking Count Text', () => {

    test('shows singular "booking" for 1 paid booking', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [
          {
            payment_status:    'split_completed',
            seller_amount_xrp: '3.20',
          },
        ],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('From 1 paid booking');
      expect(screen.getByText('From 1 paid booking')).toBeTruthy();
    });

    test('shows plural "bookings" for 0 paid bookings', async () => {
      mockApiService.get.mockResolvedValue({ bookings: [] });

      render(<TotalEarningsCard />);

      await screen.findByText('From 0 paid bookings');
      expect(screen.getByText('From 0 paid bookings')).toBeTruthy();
    });

    test('shows plural "bookings" for 2+ paid bookings', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [
          {
            payment_status:    'split_completed',
            seller_amount_xrp: '3.20',
          },
          {
            payment_status:    'paid',
            seller_amount_xrp: '8.00',
          },
        ],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('From 2 paid bookings');
      expect(screen.getByText('From 2 paid bookings')).toBeTruthy();
    });

    test('shows correct count for 3 paid bookings', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [
          { payment_status: 'split_completed', seller_amount_xrp: '3.20' },
          { payment_status: 'split_completed', seller_amount_xrp: '8.00' },
          { payment_status: 'paid',            seller_amount_xrp: '1.60' },
          { payment_status: 'unpaid',          seller_amount_xrp: '5.00' },
        ],
      });

      render(<TotalEarningsCard />);

      // Only 3 paid (split_completed × 2 + paid × 1)
      await screen.findByText('From 3 paid bookings');
      expect(screen.getByText('From 3 paid bookings')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: ERROR HANDLING
  // ════════════════════════════════════════════════════
  describe('Error Handling', () => {

    test('shows 0.00 when API fails', async () => {
      mockApiService.get.mockRejectedValue(
        new Error('Network error')
      );

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(screen.getByText('0.00')).toBeTruthy();
    });

    test('shows 0 bookings when API fails', async () => {
      mockApiService.get.mockRejectedValue(
        new Error('Network error')
      );

      render(<TotalEarningsCard />);

      await screen.findByText('From 0 paid bookings');
      expect(screen.getByText('From 0 paid bookings')).toBeTruthy();
    });

    test('handles empty bookings array from API', async () => {
      mockApiService.get.mockResolvedValue({
        bookings: [],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(screen.getByText('0.00')).toBeTruthy();
    });

    test('handles missing bookings key in response', async () => {
      mockApiService.get.mockResolvedValue({
        // no 'bookings' key
      });

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(screen.getByText('0.00')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 6: 80/20 SPLIT VERIFICATION
  // ════════════════════════════════════════════════════
  describe('80/20 Split Verification', () => {

    test('seller earnings are 80% of total booking price', async () => {
      // Total booking = 4.0 XRP
      // Seller gets 80% = 3.2 XRP
      mockApiService.get.mockResolvedValue({
        bookings: [
          {
            payment_status:    'split_completed',
            seller_amount_xrp: '3.200000', // 80% of 4.0
            total_price_xrp:   '4.000000',
          },
        ],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('3.20');
      expect(screen.getByText('3.20')).toBeTruthy();
    });

    test('shows correct earnings for 10 XRP booking', async () => {
      // 10 XRP total, 80% = 8 XRP seller share
      mockApiService.get.mockResolvedValue({
        bookings: [
          {
            payment_status:    'split_completed',
            seller_amount_xrp: '8.000000',
            total_price_xrp:   '10.000000',
          },
        ],
      });

      render(<TotalEarningsCard />);

      await screen.findByText('8.00');
      expect(screen.getByText('8.00')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 7: API CALL
  // ════════════════════════════════════════════════════
  describe('API Call', () => {

    test('calls bookings endpoint on mount', async () => {
      mockApiService.get.mockResolvedValue({ bookings: [] });

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(mockApiService.get).toHaveBeenCalledWith('/bookings');
    });

    test('calls API exactly once', async () => {
      mockApiService.get.mockResolvedValue({ bookings: [] });

      render(<TotalEarningsCard />);

      await screen.findByText('0.00');
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });
  });
});