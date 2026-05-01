import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BookingHistory from '@/app/(protected)/admin/spot-management/view-details/[id]/components/BookingHistory';
import apiService from '@/lib/api/apiService';

// Mock API calls for fetching history
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

const mockApi = apiService as jest.Mocked<typeof apiService>;

describe('BookingHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state while fetching', () => {
    // Arrange (ensure promise doesn't resolve to keep loading state mounted)
    mockApi.get.mockImplementation(() => new Promise(() => {}));
    
    // Act
    render(<BookingHistory spotId="spot-1" />);

    // Assert
    expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
  });

  test('filters bookings by spot id and renders matching row', async () => {
    // Arrange
    mockApi.get.mockResolvedValue({
      bookings: [
        {
          id: 'b1',
          spot_id: 'spot-1',
          driver_name: 'John',
          created_at: '2026-01-01T00:00:00.000Z',
          start_time: '2026-01-01T10:00:00.000Z',
          end_time: '2026-01-01T12:00:00.000Z',
          total_price_xrp: '6',
          booking_status: 'completed',
        },
        {
          id: 'b2',
          spot_id: 'spot-2',
          driver_name: 'Mary',
          created_at: '2026-01-01T00:00:00.000Z',
          total_price_xrp: '4',
          booking_status: 'pending',
        },
      ],
    } as never);

    // Act
    render(<BookingHistory spotId="spot-1" />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/bookings');
    });

    // Assert that rows are rendered & properly filtered
    expect(await screen.findByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Mary')).toBeNull();
    expect(screen.getByText('2 hrs')).toBeInTheDocument();
    expect(screen.getByText('6 XRP')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('shows empty state when no bookings match selected spot', async () => {
    // Arrange
    mockApi.get.mockResolvedValue({
      bookings: [{ id: 'b3', spot_id: 'spot-99', driver_name: 'Ghost' }],
    } as never);

    // Act & Assert
    render(<BookingHistory spotId="spot-1" />);
    expect(await screen.findByText('No bookings found for this spot.')).toBeInTheDocument();
  });

  test('handles missing bookings list gracefully', async () => {
    mockApi.get.mockResolvedValue({} as never);
    render(<BookingHistory spotId="spot-1" />);
    expect(await screen.findByText('No bookings found for this spot.')).toBeInTheDocument();
  });

  test('handles api error gracefully', async () => {
    mockApi.get.mockRejectedValue(new Error('fetch error'));
    render(<BookingHistory spotId="spot-1" />);
    await waitFor(() => {
      expect(screen.queryByText('Loading bookings...')).toBeNull();
    });
  });
});