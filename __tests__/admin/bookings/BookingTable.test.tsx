// __tests__/admin/bookings/BookingTable.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingTable from '@/app/(protected)/admin/bookings/Components/BookingTable';

// ── Mock FontAwesome ──────────────────────────────────
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faCalendarCheck: {},
  faSpinner:       {},
  faCheckCircle:   {},
}));

// ── Mock apiService ───────────────────────────────────
jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('@/lib/api/endpoints', () => ({
  API_ENDPOINTS: { BOOKINGS: '/bookings' },
}));

import apiService from '@/lib/api/apiService';
const mockApi = apiService as jest.Mocked<typeof apiService>;

// ── Booking factory ───────────────────────────────────
const makeBooking = (overrides: Record<string, string> = {}) => ({
  id:                      'booking-uuid-1',
  driver_name:             'John Smith',
  driver_email:            'john@test.com',
  spot_title:              'City Parking',
  owner_name:              'Jane Owner',
  vehicle_type:            'Car',
  booking_status:          'pending',
  payment_status:          'unpaid',
  price_per_hour:          '2.00',
  expected_duration_hours: '2.00',
  total_price_xrp:         '4.000000',
  admin_fee_xrp:           '0.800000',
  seller_amount_xrp:       '3.200000',
  start_time:              '2025-06-15T09:00:00Z',
  end_time:                '2025-06-15T11:00:00Z',
  created_at:              '2025-06-15T08:00:00Z',
  ...overrides,
});

const make11Bookings = () =>
  Array.from({ length: 11 }, (_, i) =>
    makeBooking({
      id:          `uuid-${i + 1}`,
      driver_name: `Driver ${i + 1}`,
      spot_title:  `Parking Spot ${i + 1}`,
    })
  );

describe('BookingTable Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: LOADING STATE
  // ════════════════════════════════════════════════════
  describe('Loading State', () => {

    test('shows loading spinner initially', () => {
      mockApi.get.mockImplementation(
        () => new Promise(() => {})
      );
      render(<BookingTable />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    test('shows loading text', () => {
      mockApi.get.mockImplementation(
        () => new Promise(() => {})
      );
      render(<BookingTable />);

      expect(
        screen.getByText('Loading bookings...')
      ).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: HEADER & STRUCTURE
  // ════════════════════════════════════════════════════
  describe('Header & Structure', () => {

    beforeEach(() => {
      mockApi.get.mockResolvedValue({ bookings: [] });
    });

    test('shows All Bookings title', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');
      expect(screen.getByText('All Bookings')).toBeTruthy();
    });

    test('shows table column headers', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');

      expect(screen.getByText('Driver & Spot')).toBeTruthy();
      expect(screen.getByText('Date & Time')).toBeTruthy();
      expect(screen.getByText('Vehicle')).toBeTruthy();
      expect(screen.getByText('Status')).toBeTruthy();
      expect(screen.getByText('Amount (XRP)')).toBeTruthy();
      expect(screen.getByText('Split Breakdown')).toBeTruthy();
    });

    test('shows search input', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');

      const input = screen.getByPlaceholderText(
        'Search driver, spot, owner...'
      );
      expect(input).toBeTruthy();
    });

    test('shows status filter buttons', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');

      expect(screen.getByText('All')).toBeTruthy();
      expect(screen.getByText('Pending')).toBeTruthy();
      expect(screen.getByText('Confirmed')).toBeTruthy();
      expect(screen.getByText('Active')).toBeTruthy();
      expect(screen.getByText('Completed')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: EMPTY STATE
  // ════════════════════════════════════════════════════
  describe('Empty State', () => {

    test('shows no bookings message', async () => {
      mockApi.get.mockResolvedValue({ bookings: [] });
      render(<BookingTable />);

      await screen.findByText('No bookings yet');
      expect(screen.getByText('No bookings yet')).toBeTruthy();
    });

    test('shows 0 bookings found', async () => {
      mockApi.get.mockResolvedValue({ bookings: [] });
      render(<BookingTable />);

      await screen.findByText('0 bookings found');
      expect(screen.getByText('0 bookings found')).toBeTruthy();
    });

    test('shows filter message when search active', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking()],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      const input = screen.getByPlaceholderText(
        'Search driver, spot, owner...'
      );
      fireEvent.change(input, {
        target: { value: 'nonexistent999' },
      });

      await screen.findByText(
        'No bookings match your filters'
      );
      expect(
        screen.getByText('No bookings match your filters')
      ).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: DATA DISPLAY
  // ════════════════════════════════════════════════════
  describe('Data Display', () => {

    test('shows driver name', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ driver_name: 'Alice Driver' })],
      });
      render(<BookingTable />);

      await screen.findByText('Alice Driver');
      expect(screen.getByText('Alice Driver')).toBeTruthy();
    });

    test('shows spot title', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ spot_title: 'Airport Parking' })],
      });
      render(<BookingTable />);

      await screen.findByText('Airport Parking');
      expect(screen.getByText('Airport Parking')).toBeTruthy();
    });

    test('shows owner name', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ owner_name: 'Bob Owner' })],
      });
      render(<BookingTable />);

      await screen.findByText(/Owner: Bob Owner/);
      expect(
        screen.getByText(/Owner: Bob Owner/)
      ).toBeTruthy();
    });

    test('shows vehicle type', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ vehicle_type: 'Bike' })],
      });
      render(<BookingTable />);

      await screen.findByText('Bike');
      expect(screen.getByText('Bike')).toBeTruthy();
    });

    test('shows total amount in XRP', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ total_price_xrp: '4.000000' })],
      });
      render(<BookingTable />);

      await screen.findByText('4.0000');
      expect(screen.getByText('4.0000')).toBeTruthy();
      expect(screen.getAllByText('XRP').length).toBeGreaterThanOrEqual(1);
    });

    test('shows booking status badge', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ booking_status: 'active' })],
      });
      render(<BookingTable />);

      await screen.findByText('Active');
      expect(screen.getByText('Active')).toBeTruthy();
    });

    test('shows payment status badge', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [
          makeBooking({ payment_status: 'split_completed' }),
        ],
      });
      render(<BookingTable />);

      await screen.findByText('Split Completed');
      expect(screen.getByText('Split Completed')).toBeTruthy();
    });

    test('shows 1 booking found text', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking()],
      });
      render(<BookingTable />);

      await screen.findByText('1 booking found');
      expect(screen.getByText('1 booking found')).toBeTruthy();
    });

    test('shows correct booking count', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [
          makeBooking({ id: '1' }),
          makeBooking({ id: '2' }),
          makeBooking({ id: '3' }),
        ],
      });
      render(<BookingTable />);

      await screen.findByText('3 bookings found');
      expect(screen.getByText('3 bookings found')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: EXPANDED ROW
  // ════════════════════════════════════════════════════
  describe('Expanded Row Details', () => {

    test('click row shows expanded details', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking({ driver_email: 'john@test.com' })],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      // Click the row
      fireEvent.click(screen.getByText('John Smith'));

      await screen.findByText('Booking ID');
      expect(screen.getByText('Booking ID')).toBeTruthy();
      expect(screen.getByText('Driver Email')).toBeTruthy();
    });

    test('shows driver email in expanded view', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [
          makeBooking({ driver_email: 'alice@test.com' }),
        ],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      fireEvent.click(screen.getByText('John Smith'));

      await screen.findByText('alice@test.com');
      expect(screen.getByText('alice@test.com')).toBeTruthy();
    });

    test('shows Admin Fee (20%) label', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking()],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      fireEvent.click(screen.getByText('John Smith'));

      await screen.findByText('Admin Fee (20%)');
      expect(screen.getByText('Admin Fee (20%)')).toBeTruthy();
    });

    test('shows Seller Amount (80%) label', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking()],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      fireEvent.click(screen.getByText('John Smith'));

      await screen.findByText('Seller Amount (80%)');
      expect(
        screen.getByText('Seller Amount (80%)')
      ).toBeTruthy();
    });

    test('click again collapses expanded row', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking()],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      // Expand
      fireEvent.click(screen.getByText('John Smith'));
      await screen.findByText('Booking ID');

      // Collapse
      fireEvent.click(screen.getByText('John Smith'));
      await waitFor(() => {
        expect(
          screen.queryByText('Booking ID')
        ).toBeNull();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 6: STATUS FILTER BUTTONS
  // ════════════════════════════════════════════════════
  describe('Status Filter Buttons', () => {

    beforeEach(() => {
      mockApi.get.mockResolvedValue({
        bookings: [
          makeBooking({ id: '1', booking_status: 'active' }),
          makeBooking({ id: '2', booking_status: 'completed' }),
          makeBooking({ id: '3', booking_status: 'pending' }),
        ],
      });
    });

    test('clicking Active filter shows only active', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');

      fireEvent.click(screen.getByText('Active'));

      await screen.findByText('1 booking found');
      expect(screen.getByText('1 booking found')).toBeTruthy();
    });

    test('clicking Completed filter shows only completed', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');

      fireEvent.click(screen.getByText('Completed'));

      await screen.findByText('1 booking found');
      expect(screen.getByText('1 booking found')).toBeTruthy();
    });

    test('clicking All shows all bookings', async () => {
      render(<BookingTable />);
      await screen.findByText('All Bookings');

      // Filter first
      fireEvent.click(screen.getByText('Active'));
      await screen.findByText('1 booking found');

      // Then click All
      fireEvent.click(screen.getByText('All'));
      await screen.findByText('3 bookings found');
      expect(screen.getByText('3 bookings found')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 7: SEARCH
  // ════════════════════════════════════════════════════
  describe('Search Functionality', () => {

    beforeEach(() => {
      mockApi.get.mockResolvedValue({
        bookings: [
          makeBooking({
            id:          'uuid-1',
            driver_name: 'Alice Smith',
            spot_title:  'City Parking',
          }),
          makeBooking({
            id:          'uuid-2',
            driver_name: 'Bob Jones',
            spot_title:  'Airport Parking',
          }),
        ],
      });
    });

    test('search filters by driver name', async () => {
      render(<BookingTable />);
      await screen.findByText('Alice Smith');

      const input = screen.getByPlaceholderText(
        'Search driver, spot, owner...'
      );
      fireEvent.change(input, { target: { value: 'Alice' } });

      await waitFor(() => {
        expect(
          screen.queryByText('Bob Jones')
        ).toBeNull();
      });
      expect(screen.getByText('Alice Smith')).toBeTruthy();
    });

    test('search filters by spot title', async () => {
      render(<BookingTable />);
      await screen.findByText('Alice Smith');

      const input = screen.getByPlaceholderText(
        'Search driver, spot, owner...'
      );
      fireEvent.change(input, { target: { value: 'Airport' } });

      await waitFor(() => {
        expect(
          screen.queryByText('City Parking')
        ).toBeNull();
      });
      expect(screen.getByText('Airport Parking')).toBeTruthy();
    });

    test('empty search shows all bookings', async () => {
      render(<BookingTable />);
      await screen.findByText('Alice Smith');

      const input = screen.getByPlaceholderText(
        'Search driver, spot, owner...'
      );
      fireEvent.change(input, { target: { value: 'Alice' } });

      await waitFor(() => {
        expect(screen.queryByText('Bob Jones')).toBeNull();
      });

      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Bob Jones')).toBeTruthy();
        expect(screen.getByText('Alice Smith')).toBeTruthy();
      });
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 8: PAGINATION
  // ════════════════════════════════════════════════════
  describe('Pagination', () => {

    test('shows first 10 when 11 bookings', async () => {
      mockApi.get.mockResolvedValue({
        bookings: make11Bookings(),
      });
      render(<BookingTable />);

      await screen.findByText('Driver 1');

      expect(screen.getByText('Driver 1')).toBeTruthy();
      expect(screen.getByText('Driver 10')).toBeTruthy();
      expect(screen.queryByText('Driver 11')).toBeNull();
    });

    test('shows pagination when > 10 items', async () => {
      mockApi.get.mockResolvedValue({
        bookings: make11Bookings(),
      });
      render(<BookingTable />);
      await screen.findByText('Driver 1');

      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    test('no pagination when <= 10 items', async () => {
      mockApi.get.mockResolvedValue({
        bookings: [makeBooking()],
      });
      render(<BookingTable />);
      await screen.findByText('John Smith');

      expect(screen.queryByText('Previous')).toBeNull();
      expect(screen.queryByText('Next')).toBeNull();
    });

    test('Next navigates to page 2', async () => {
      mockApi.get.mockResolvedValue({
        bookings: make11Bookings(),
      });
      render(<BookingTable />);
      await screen.findByText('Driver 1');

      fireEvent.click(screen.getByText('Next'));

      await screen.findByText('Driver 11');
      expect(screen.getByText('Driver 11')).toBeTruthy();
      expect(screen.queryByText('Driver 1')).toBeNull();
    });

    test('Previous goes back to page 1', async () => {
      mockApi.get.mockResolvedValue({
        bookings: make11Bookings(),
      });
      render(<BookingTable />);
      await screen.findByText('Driver 1');

      fireEvent.click(screen.getByText('Next'));
      await screen.findByText('Driver 11');

      fireEvent.click(screen.getByText('Previous'));
      await screen.findByText('Driver 1');
      expect(screen.getByText('Driver 1')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 9: API CALL
  // ════════════════════════════════════════════════════
  describe('API Call', () => {

    test('calls bookings endpoint', async () => {
      mockApi.get.mockResolvedValue({ bookings: [] });
      render(<BookingTable />);

      await screen.findByText('No bookings yet');
      expect(mockApi.get).toHaveBeenCalledWith('/bookings');
    });

    test('calls API exactly once on mount', async () => {
      mockApi.get.mockResolvedValue({ bookings: [] });
      render(<BookingTable />);

      await screen.findByText('No bookings yet');
      expect(mockApi.get).toHaveBeenCalledTimes(1);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 10: ERROR HANDLING
  // ════════════════════════════════════════════════════
  describe('Error Handling', () => {

    test('shows no bookings when API fails', async () => {
      mockApi.get.mockRejectedValue(
        new Error('Network error')
      );
      render(<BookingTable />);

      await screen.findByText('No bookings yet');
      expect(screen.getByText('No bookings yet')).toBeTruthy();
    });

    test('handles missing bookings key', async () => {
      mockApi.get.mockResolvedValue({});
      render(<BookingTable />);

      await screen.findByText('No bookings yet');
      expect(screen.getByText('No bookings yet')).toBeTruthy();
    });
  });
});