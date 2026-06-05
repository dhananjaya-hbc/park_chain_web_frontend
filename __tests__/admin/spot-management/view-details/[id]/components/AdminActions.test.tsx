import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminActions from '@/app/(protected)/admin/spot-management/view-details/[id]/components/AdminActions';
import apiService from '@/lib/api/apiService';

// Mock API service
jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
  },
}));

jest.mock('@/lib/api/endpoints', () => ({
  API_ENDPOINTS: {
    ADMIN_TOGGLE_SPOT: (spotId: string) => '/admin/spots/' + spotId + '/toggle',
  },
}));

const mockApi = apiService as jest.Mocked<typeof apiService>;

describe('AdminActions', () => {
  beforeEach(() => {
    // Clean up between tests to ensure isolation
    jest.clearAllMocks();
  });

  test('renders active status and toggles to blocked on success', async () => {
    // Arrange
    mockApi.put.mockResolvedValue({ ok: true } as never);
    const onStatusChange = jest.fn();

    render(
      <AdminActions spotId="spot-1" initialStatus={true} onStatusChange={onStatusChange} />
    );

    // Act
    expect(screen.getByText('Active')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Block This Spot'));

    // Assert
    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/admin/spots/spot-1/toggle', {
        is_available: false,
      });
    });

    await waitFor(() => {
      expect(onStatusChange).toHaveBeenCalledWith(false);
    });

    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('Activate Spot')).toBeInTheDocument();
  });

  test('renders blocked status and toggles to active on success', async () => {
    // Arrange
    mockApi.put.mockResolvedValue({ ok: true } as never);
    const onStatusChange = jest.fn();

    render(
      <AdminActions spotId="spot-3" initialStatus={false} onStatusChange={onStatusChange} />
    );

    // Act
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Activate Spot'));

    // Assert
    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/admin/spots/spot-3/toggle', {
        is_available: true,
      });
    });

    expect(onStatusChange).toHaveBeenCalledWith(true);
  });

  test('shows error when toggle fails', async () => {
    // Arrange
    mockApi.put.mockRejectedValue(new Error('network error'));
    const onStatusChange = jest.fn();

    render(
      <AdminActions spotId="spot-2" initialStatus={false} onStatusChange={onStatusChange} />
    );

    // Act
    fireEvent.click(screen.getByText('Activate Spot'));

    // Assert
    expect(await screen.findByText('network error')).toBeInTheDocument();
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  test('shows default error when toggle fails with non-Error object', async () => {
    // Arrange
    mockApi.put.mockRejectedValue('unknown error string');
    
    render(
      <AdminActions spotId="spot-4" initialStatus={true} onStatusChange={jest.fn()} />
    );

    // Act
    fireEvent.click(screen.getByText('Block This Spot'));

    // Assert
    expect(await screen.findByText('Failed to update status')).toBeInTheDocument();
  });
});