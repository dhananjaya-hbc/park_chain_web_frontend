import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import KybDetailMain from '@/app/(protected)/admin/kyb/[id]/components/Main';
import apiService from '@/lib/api/apiService';

const mockPush = jest.fn();
const mockAlert = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'kyb-123' }),
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
  default: ({ entityName }: { entityName: string }) => <div>Header:{entityName}</div>,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).alert = mockAlert;
  });

  test('loads KYB details by id and renders review actions', async () => {
    mockApi.get.mockResolvedValue(detailResponse as never);

    render(<KybDetailMain />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/admin/kyb/kyb-123');
    });

    expect(await screen.findByText('Header:City Center Plaza')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Approve KYB' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeTruthy();
  });

  test('approves KYB with admin note and routes back to admin kyb list', async () => {
    mockApi.get.mockResolvedValue(detailResponse as never);
    mockApi.put.mockResolvedValue({ ok: true } as never);

    render(<KybDetailMain />);

    await screen.findByText('Header:City Center Plaza');
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

    await screen.findByText('Header:City Center Plaza');
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

    await screen.findByText('Header:City Center Plaza');
    fireEvent.click(screen.getByRole('button', { name: 'Approve KYB' }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Failed to update status. Check backend connection.');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
