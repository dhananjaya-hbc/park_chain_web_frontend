import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VerificationTable from '@/app/(protected)/admin/kyb/components/VerificationTable';

jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/app/(protected)/admin/kyb/components/VerificationTableRow', () => ({
  __esModule: true,
  default: ({ entityName, status }: { entityName: string; status: string }) => (
    <tr>
      <td>{entityName}</td>
      <td>{status}</td>
    </tr>
  ),
}));

import apiService from '@/lib/api/apiService';
const mockApi = apiService as jest.Mocked<typeof apiService>;

const sampleRows = [
  {
    id: 1,
    entityName: 'City Center Plaza',
    spotType: 'garage',
    address: 'Downtown',
    date: '2026-01-10',
    status: 'pending',
  },
  {
    id: 2,
    entityName: 'Riverside Open Lot',
    spotType: 'open',
    address: 'Riverside',
    date: '2026-01-11',
    status: 'verified',
  },
  {
    id: 3,
    entityName: 'Mall Basement',
    spotType: 'underground',
    address: 'City Mall',
    date: '2026-01-12',
    status: 'rejected',
  },
];

describe('Admin KYB VerificationTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state while KYB list is being fetched', () => {
    mockApi.get.mockImplementation(() => new Promise(() => {}));

    render(<VerificationTable selectedFilter="all" />);

    expect(
      screen.getByText('Loading verification details from database...')
    ).toBeTruthy();
  });

  test('calls admin kyb endpoint and shows all rows for all filter', async () => {
    mockApi.get.mockResolvedValue(sampleRows as never);

    render(<VerificationTable selectedFilter="all" />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/admin/kyb');
    });

    expect(await screen.findByText('City Center Plaza')).toBeTruthy();
    expect(screen.getByText('Riverside Open Lot')).toBeTruthy();
    expect(screen.getByText('Mall Basement')).toBeTruthy();
  });

  test('shows only pending rows for pending filter', async () => {
    mockApi.get.mockResolvedValue(sampleRows as never);

    render(<VerificationTable selectedFilter="pending" />);

    expect(await screen.findByText('City Center Plaza')).toBeTruthy();
    expect(screen.queryByText('Riverside Open Lot')).toBeNull();
    expect(screen.queryByText('Mall Basement')).toBeNull();
  });

  test('shows empty message when no KYB requests match selected filter', async () => {
    mockApi.get.mockResolvedValue([
      {
        id: 90,
        entityName: 'Verified Only Spot',
        spotType: 'garage',
        address: 'Main Ave',
        date: '2026-02-01',
        status: 'verified',
      },
    ] as never);

    render(<VerificationTable selectedFilter="pending" />);

    expect(
      await screen.findByText('No KYB verification requests found for this status.')
    ).toBeTruthy();
  });

  test('shows error state when KYB list fetch fails', async () => {
    mockApi.get.mockRejectedValue(new Error('backend down'));

    render(<VerificationTable selectedFilter="all" />);

    expect(
      await screen.findByText('Unable to load table data. Check backend connection.')
    ).toBeTruthy();
  });

  test('shows no-data message when backend returns no requests', async () => {
    mockApi.get.mockResolvedValue([] as never);

    render(<VerificationTable selectedFilter="all" />);

    expect(
      await screen.findByText('No KYB verification requests found for this status.')
    ).toBeTruthy();
  });

  test('uses data array when backend wraps result in object', async () => {
    mockApi.get.mockResolvedValue({ data: sampleRows } as never);

    render(<VerificationTable selectedFilter="all" />);

    expect(await screen.findByText('City Center Plaza')).toBeTruthy();
    expect(screen.getByText('Riverside Open Lot')).toBeTruthy();
    expect(screen.getByText('Mall Basement')).toBeTruthy();
  });

  test('falls back to empty list when wrapped response has no data field', async () => {
    mockApi.get.mockResolvedValue({} as never);

    render(<VerificationTable selectedFilter="all" />);

    expect(
      await screen.findByText('No KYB verification requests found for this status.')
    ).toBeTruthy();
  });

  test('handles search query across entity, address, spotType, date, and status', async () => {
    mockApi.get.mockResolvedValue(sampleRows as never);

    render(<VerificationTable selectedFilter="all" searchQuery="Downtown" />);
    expect(await screen.findByText('City Center Plaza')).toBeTruthy();
    expect(screen.queryByText('Riverside Open Lot')).toBeNull();
  });

  test('sorts non-pending records with oldest first when sortOrder is oldest', async () => {
    mockApi.get.mockResolvedValue([
      {
        id: 1,
        entityName: 'Spot 1',
        spotType: 'garage',
        address: 'A',
        date: '2026-01-01',
        status: 'verified',
      },
      {
        id: 2,
        entityName: 'Spot 2',
        spotType: 'garage',
        address: 'B',
        date: '2026-02-01',
        status: 'verified',
      },
    ] as never);

    render(<VerificationTable selectedFilter="all" sortOrder="oldest" />);
    expect(await screen.findByText('Spot 1')).toBeTruthy();
  });
});
