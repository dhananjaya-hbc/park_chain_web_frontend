import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import KybDetailMain from '@/app/(protected)/admin/kyb/[id]/components/Main';
import apiService from '@/lib/api/apiService';

const mockPush = jest.fn();
const mockAlert = jest.fn();
type MockRouteParams = { id?: string } | null;
const mockUseParams = jest.fn<MockRouteParams, []>(() => ({ id: 'kyb-123' }));

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('@/app/(protected)/admin/kyb/[id]/components/VerificationHeader', () => ({
  __esModule: true,
  default: ({ entityName, submittedDate }: { entityName: string; submittedDate: string }) => (
    <div>
      Header:{entityName} Date:{submittedDate}
    </div>
  ),
}));

jest.mock('@/app/(protected)/admin/kyb/[id]/components/PersonalInfo', () => ({
  __esModule: true,
  default: ({ ownerName }: { ownerName: string }) => <div>Owner:{ownerName}</div>,
}));

jest.mock('@/app/(protected)/admin/kyb/[id]/components/DocumentsSection', () => ({
  __esModule: true,
  default: () => <div>DocumentsSection</div>,
}));

jest.mock('@/app/(protected)/admin/kyb/[id]/components/AdminNotes', () => ({
  __esModule: true,
  default: ({ onSave }: { onSave?: (notes: string) => void }) => (
    <button onClick={() => onSave && onSave('Please re-upload a clearer document.')}>Set Admin Note</button>
  ),
}));

const mockApi = apiService as jest.Mocked<typeof apiService>;

const detailResponse = {
  id: 123,
  entityName: 'City Center Plaza',
  ownerName: 'Alex Seller',
  address: '12 Main Street',
  googleMapsLink: 'https://maps.google.com/?q=12.9716,77.5946',
  spotType: 'garage',
  status: 'pending',
  adminNotes: '',
  createdAt: '2026-01-20',
};

describe('Admin KYB Detail Review Main', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: 'kyb-123' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).alert = mockAlert;
  });

  test('loads KYB details by id and renders review actions', async () => {
    mockApi.get.mockResolvedValue(detailResponse as never);

    render(<KybDetailMain />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/admin/kyb/kyb-123');
    });

    expect(await screen.findByText(/Header:\s*City Center Plaza/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Approve KYB' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeTruthy();
  });

  test('approves KYB with admin note and routes back to admin kyb list', async () => {
    mockApi.get.mockResolvedValue(detailResponse as never);
    mockApi.put.mockResolvedValue({ ok: true } as never);

    render(<KybDetailMain />);

    await screen.findByText(/Header:\s*City Center Plaza/);
    fireEvent.click(screen.getByRole('button', { name: 'Set Admin Note' }));
    fireEvent.click(screen.getByRole('button', { name: 'Approve KYB' }));

    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/admin/kyb/kyb-123/status', {
        status: 'verified',
        adminNotes: 'Please re-upload a clearer document.',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/admin/kyb');
  });

  test('rejects KYB with admin note and routes back to admin kyb list', async () => {
    mockApi.get.mockResolvedValue(detailResponse as never);
    mockApi.put.mockResolvedValue({ ok: true } as never);

    render(<KybDetailMain />);

    await screen.findByText(/Header:\s*City Center Plaza/);
    fireEvent.click(screen.getByRole('button', { name: 'Set Admin Note' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));

    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/admin/kyb/kyb-123/status', {
        status: 'rejected',
        adminNotes: 'Please re-upload a clearer document.',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/admin/kyb');
  });

  test('shows alert and does not navigate when status update fails', async () => {
    mockApi.get.mockResolvedValue(detailResponse as never);
    mockApi.put.mockRejectedValue(new Error('update failed'));

    render(<KybDetailMain />);

    await screen.findByText(/Header:\s*City Center Plaza/);
    fireEvent.click(screen.getByRole('button', { name: 'Approve KYB' }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Failed to update status. Check backend connection.');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  test('shows error message when detail fetch fails', async () => {
    mockApi.get.mockRejectedValue(new Error('backend down'));

    render(<KybDetailMain />);

    expect(
      await screen.findByText('Failed to load verification details. Check backend connection.')
    ).toBeTruthy();
  });

  test('shows no-data state when backend returns falsy primitive payload', async () => {
    mockApi.get.mockResolvedValue(0 as never);

    render(<KybDetailMain />);

    expect(await screen.findByText('No details found.')).toBeTruthy();
  });

  test('uses existing adminNotes from API when updating without editing notes', async () => {
    mockApi.get.mockResolvedValue({ ...detailResponse, adminNotes: 'Existing backend note' } as never);
    mockApi.put.mockResolvedValue({ ok: true } as never);

    render(<KybDetailMain />);

    await screen.findByText(/Header:City Center Plaza/);
    fireEvent.click(screen.getByRole('button', { name: 'Approve KYB' }));

    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/admin/kyb/kyb-123/status', {
        status: 'verified',
        adminNotes: 'Existing backend note',
      });
    });
  });

  test('uses owner name fallback from nested owner object', async () => {
    mockApi.get.mockResolvedValue({ ...detailResponse, ownerName: '', owner: { name: 'Nested Owner' } } as never);

    render(<KybDetailMain />);

    expect(await screen.findByText('Owner:Nested Owner')).toBeTruthy();
  });

  test('uses Unknown Owner fallback when owner name is missing', async () => {
    mockApi.get.mockResolvedValue({ ...detailResponse, ownerName: '', owner: undefined } as never);

    render(<KybDetailMain />);

    expect(await screen.findByText('Owner:Unknown Owner')).toBeTruthy();
  });

  test('prefers date over createdAt for submittedDate', async () => {
    mockApi.get.mockResolvedValue({ ...detailResponse, date: '2026-02-10', createdAt: '2026-01-20' } as never);

    render(<KybDetailMain />);

    expect(await screen.findByText('Header:City Center Plaza Date:2026-02-10')).toBeTruthy();
  });

  test('uses Recently when both date and createdAt are missing', async () => {
    mockApi.get.mockResolvedValue({ ...detailResponse, date: '', createdAt: '' } as never);

    render(<KybDetailMain />);

    expect(await screen.findByText('Header:City Center Plaza Date:Recently')).toBeTruthy();
  });

  test('keeps loading and does not fetch when route id is missing', async () => {
    mockUseParams.mockReturnValue({});

    render(<KybDetailMain />);

    expect(screen.getByText('Loading details from database...')).toBeTruthy();
    await waitFor(() => {
      expect(mockApi.get).not.toHaveBeenCalled();
    });
  });

  test('keeps loading and does not fetch when params is null', async () => {
    mockUseParams.mockReturnValue(null);

    render(<KybDetailMain />);

    expect(screen.getByText('Loading details from database...')).toBeTruthy();
    await waitFor(() => {
      expect(mockApi.get).not.toHaveBeenCalled();
    });
  });
});
