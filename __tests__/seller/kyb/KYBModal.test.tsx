import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import KYBModal from '@/app/(protected)/seller/addnew/Components/KYBModal';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Seller KYB Modal', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn() as unknown as typeof fetch;
    if (typeof window !== 'undefined') {
      window.URL.createObjectURL = jest.fn().mockReturnValue('mock-object-url');
      window.URL.revokeObjectURL = jest.fn();
    }
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  function fillRequiredFields() {
    fireEvent.change(
      screen.getByPlaceholderText('e.g. City Center Plaza Parking'),
      { target: { value: 'City Center Plaza Parking' } }
    );

    fireEvent.change(screen.getByPlaceholderText('Enter full address'), {
      target: { value: '12 Main Street, Downtown' },
    });

    fireEvent.change(
      screen.getByPlaceholderText('https://maps.google.com/... (Google Maps location link from address bar)'),
      { target: { value: 'https://maps.google.com/?q=12.9716,77.5946' } }
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Spot Type' }), {
      target: { value: 'garage' },
    });

    const fileInput = document.getElementById('document') as HTMLInputElement;
    const file = new File(['proof'], 'utility-bill.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
      configurable: true,
    });
    fireEvent.change(fileInput);
  }

  function submitForm() {
    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
  }

  test('renders KYB details fields and action buttons', () => {
    render(<KYBModal />);

    expect(screen.getByText('Verify Your Parking Spot (KYB)')).toBeTruthy();
    expect(screen.getByPlaceholderText('e.g. City Center Plaza Parking')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter full address')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Spot Type' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit for Verification' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
  });

  test('closes modal when Cancel is clicked', () => {
    render(<KYBModal />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText('Verify Your Parking Spot (KYB)')).toBeNull();
  });

  test('submits KYB form with token and shows success state', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    localStorage.setItem('park_chain_token', 'token-123');

    render(<KYBModal />);
    fillRequiredFields();
    submitForm();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://localhost:3001/api/kyb');
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer token-123');
    expect(options.body instanceof FormData).toBe(true);

    expect(await screen.findByText('Under Review')).toBeTruthy();
    expect(
      screen.getByText(/submitted successfully\. This is currently under review/i)
    ).toBeTruthy();
  });

  test('navigates to dashboard after successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<KYBModal />);
    fillRequiredFields();
    submitForm();

    expect(await screen.findByRole('button', { name: 'Go to Dashboard' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Go to Dashboard' }));
    expect(mockPush).toHaveBeenCalledWith('/seller/dashboard');
  });

  test('shows backend message when submission fails with response error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Verification failed by server' }),
    });

    render(<KYBModal />);
    fillRequiredFields();
    submitForm();

    expect(await screen.findByText('Verification failed by server')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit for Verification' })).toBeTruthy();
  });

  test('shows fallback error when non-Error rejection happens', async () => {
    (global.fetch as jest.Mock).mockRejectedValue('unknown failure');

    render(<KYBModal />);
    fillRequiredFields();
    submitForm();

    expect(await screen.findByText('An unexpected error occurred. Please try again.')).toBeTruthy();
  });

  test('shows loading state while submit is in progress', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<KYBModal />);
    fillRequiredFields();
    submitForm();

    const submittingButton = screen.getByRole('button', { name: 'Submitting...' }) as HTMLButtonElement;
    expect(submittingButton).toBeTruthy();
    expect(submittingButton.disabled).toBe(true);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement;
    expect(cancelButton.disabled).toBe(true);
  });

  test('shows validation error when file size is greater than 5MB', async () => {
    render(<KYBModal />);
    
    // Fill text inputs
    fireEvent.change(
      screen.getByPlaceholderText('e.g. City Center Plaza Parking'),
      { target: { value: 'City Center Plaza Parking' } }
    );
    fireEvent.change(screen.getByPlaceholderText('Enter full address'), {
      target: { value: '12 Main Street, Downtown' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('https://maps.google.com/... (Google Maps location link from address bar)'),
      { target: { value: 'https://maps.google.com/?q=12.9716,77.5946' } }
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Spot Type' }), {
      target: { value: 'garage' },
    });

    const fileInput = document.getElementById('document') as HTMLInputElement;
    // Create a 6MB file
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large-bill.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
      writable: false,
      configurable: true,
    });
    fireEvent.change(fileInput);

    expect(screen.getByText('File size must be 5 MB or less.')).toBeTruthy();
  });

  test('shows validation error when file format is unsupported', async () => {
    render(<KYBModal />);
    
    const fileInput = document.getElementById('document') as HTMLInputElement;
    const invalidFile = new File(['dummy content'], 'document.txt', { type: 'text/plain' });
    Object.defineProperty(fileInput, 'files', {
      value: [invalidFile],
      writable: false,
      configurable: true,
    });
    fireEvent.change(fileInput);

    expect(screen.getByText('Please upload a JPG or PNG file.')).toBeTruthy();
  });
});
