import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OwnerHeader from '@/app/(protected)/admin/spot-management/owner-profile/[id]/components/OwnerHeader';

const backMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
  }),
  usePathname: () => '/admin/spot-management/owner-profile/1',
}));

describe('OwnerHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders owner info and approved badge', () => {
    render(
      <OwnerHeader
        name="Alice"
        email="alice@example.com"
        phone="+1 555 000"
        joinDate="2025-01-15T00:00:00.000Z"
        kycStatus="APPROVED"
        walletAddress="rABC123"
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Verified Host')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 555 000')).toBeInTheDocument();
    expect(screen.getByText('rABC123')).toBeInTheDocument();
  });

  test('shows wallet fallback and can go back', () => {
    render(
      <OwnerHeader
        name="Bob"
        email="bob@example.com"
        phone="N/A"
        joinDate="2024-09-01T00:00:00.000Z"
        kycStatus="PENDING"
      />
    );

    expect(screen.getByText('Pending Verification')).toBeInTheDocument();
    expect(screen.getByText('Not available')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Back to Spot'));
    expect(backMock).toHaveBeenCalled();
  });

  test('shows pending verification badge as fallback when KYC is rejected', () => {
    render(
      <OwnerHeader
        name="Charlie"
        email="charles@example.com"
        phone="N/A"
        joinDate="2024-09-01T00:00:00.000Z"
        kycStatus="REJECTED"
      />
    );

    expect(screen.getByText(/Pending Verification/i)).toBeInTheDocument();
  });
});