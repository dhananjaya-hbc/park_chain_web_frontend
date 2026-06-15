import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import KycSuccessPage from '@/app/(protected)/kyc-success/page';
import apiService from '@/lib/api/apiService';
import { useSessionStore } from '@/lib/stores/sessionStore';
import { getRoleDashboard } from '@/lib/utils/roleUtils';

const mockPush = jest.fn();
const mockSearchParamsGet = jest.fn();
const mockRouter = { push: mockPush };
const mockSearchParams = { get: mockSearchParamsGet };

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@/lib/stores/sessionStore', () => ({
  useSessionStore: jest.fn(),
}));

jest.mock('@/lib/utils/roleUtils', () => ({
  getRoleDashboard: jest.fn(),
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockUseSessionStore = useSessionStore as unknown as jest.Mock;
const mockGetRoleDashboard = getRoleDashboard as jest.Mock;

describe('Seller KYC Success Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockUseSessionStore.mockReturnValue({ role: 'seller' });
    mockGetRoleDashboard.mockReturnValue('/seller/dashboard');

    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === 'status') return 'completed';
      if (key === 'verificationSessionId') return 'session-123';
      return null;
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('calls status API with query params from URL', async () => {
    mockApiService.get.mockResolvedValue({ kyc_status: 'DECLINED' });

    render(<KycSuccessPage />);

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith(
        '/kyc-status?status=completed&session=session-123'
      );
    });
  });

  test('shows approved message and redirects to role dashboard after delay when profile is completed', async () => {
    mockApiService.get.mockImplementation((url: string) => {
      if (url.includes('/kyc-status')) {
        return Promise.resolve({ kyc_status: 'APPROVED' });
      }
      if (url.includes('/users/profile')) {
        return Promise.resolve({ data: { profileCompleted: true } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<KycSuccessPage />);

    expect(await screen.findByText('Success! Your identity has been verified.')).toBeTruthy();
    expect(screen.getByText('Redirecting to your dashboard...')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockGetRoleDashboard).toHaveBeenCalledWith('seller');
    expect(mockPush).toHaveBeenCalledWith('/seller/dashboard');
  });

  test('shows approved message and redirects to complete-profile after delay when profile is incomplete', async () => {
    mockApiService.get.mockImplementation((url: string) => {
      if (url.includes('/kyc-status')) {
        return Promise.resolve({ kyc_status: 'APPROVED' });
      }
      if (url.includes('/users/profile')) {
        return Promise.resolve({ data: { profileCompleted: false } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<KycSuccessPage />);

    expect(await screen.findByText('Success! Your identity has been verified.')).toBeTruthy();
    expect(screen.getByText('Redirecting to your dashboard...')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockPush).toHaveBeenCalledWith('/seller/complete-profile');
  });

  test('shows retry UI for declined verification and routes back to KYC on click', async () => {
    mockApiService.get.mockResolvedValue({ kyc_status: 'DECLINED' });

    render(<KycSuccessPage />);

    expect(
      await screen.findByText('Verification was not completed or declined by Didit.')
    ).toBeTruthy();

    const retryButton = screen.getByRole('button', { name: 'Verify Identity Again' });
    expect(retryButton).toBeTruthy();

    fireEvent.click(retryButton);
    expect(mockPush).toHaveBeenCalledWith('/kyc');
  });

  test('treats pending/incomplete status as failed and shows detailed status text', async () => {
    mockApiService.get.mockResolvedValue({ kyc_status: 'PENDING' });

    render(<KycSuccessPage />);

    expect(
      await screen.findByText(/Verification is currently: PENDING/i)
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Verify Identity Again' })).toBeTruthy();
  });

  test('shows fallback pending text when backend status is missing', async () => {
    mockApiService.get.mockResolvedValue({});

    render(<KycSuccessPage />);

    expect(
      await screen.findByText(/Verification is currently: Pending/i)
    ).toBeTruthy();
  });

  test('shows error state when status check fails', async () => {
    mockApiService.get.mockRejectedValue(new Error('network down'));

    render(<KycSuccessPage />);

    expect(
      await screen.findByText('An error occurred while checking your status. Please refresh or try again.')
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Verify Identity Again' })).toBeTruthy();
  });
});
