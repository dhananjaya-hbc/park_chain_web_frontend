import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import KycPage from '@/app/(protected)/kyc/page';
import apiService from '@/lib/api/apiService';

jest.mock('@/lib/api/apiService', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('Seller KYC Start Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders verification content and action button', () => {
    render(<KycPage />);

    expect(screen.getByText('Verify Your Identity')).toBeTruthy();
    expect(
      screen.getByText(/we require all users to complete a quick identity verification/i)
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Verify Identity' })).toBeTruthy();
  });

  test('starts KYC and calls backend endpoint', async () => {
    mockApiService.post.mockResolvedValue({ didit_url: 'https://didit.example/flow' });

    render(<KycPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify Identity' }));

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/create-didit-session');
    });
  });

  test('shows loading state while request is pending', async () => {
    mockApiService.post.mockImplementation(() => new Promise(() => {}));

    render(<KycPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify Identity' }));

    const loadingButton = screen.getByRole('button', { name: 'Starting Verification...' }) as HTMLButtonElement;
    expect(loadingButton).toBeTruthy();
    expect(loadingButton.disabled).toBe(true);
  });

  test('handles success response with didit URL', async () => {
    const diditUrl = 'https://didit.example/session-123';
    mockApiService.post.mockResolvedValue({ didit_url: diditUrl });

    render(<KycPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify Identity' }));

    await waitFor(() => {
      expect(mockApiService.post).toHaveBeenCalledWith('/create-didit-session');
    });

    expect(screen.queryByText('No redirect URL received from server')).toBeNull();
  });

  test('shows backend error message when API throws Error', async () => {
    mockApiService.post.mockRejectedValue(new Error('Unable to start KYC'));

    render(<KycPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify Identity' }));

    expect(await screen.findByText('Unable to start KYC')).toBeTruthy();
    const button = screen.getByRole('button', { name: 'Verify Identity' }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  test('shows object error message when API throws an error object', async () => {
    mockApiService.post.mockRejectedValue({ error: 'Session creation failed' });

    render(<KycPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify Identity' }));

    expect(await screen.findByText('Session creation failed')).toBeTruthy();
  });

  test('shows fallback message when redirect URL is missing', async () => {
    mockApiService.post.mockResolvedValue({});

    render(<KycPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify Identity' }));

    expect(await screen.findByText('No redirect URL received from server')).toBeTruthy();
  });
});
