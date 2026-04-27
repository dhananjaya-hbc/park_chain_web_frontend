import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OwnerCard from '@/app/(protected)/admin/spot-management/view-details/[id]/components/OwnerCard';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('OwnerCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders owner details and routes to listed spots anchor', () => {
    render(
      <OwnerCard
        ownerId="owner-1"
        name="Alice"
        email="alice@example.com"
        phone="+1 555 111"
        joinDate="2025-01-01T00:00:00.000Z"
      />
    );

    expect(screen.getByText('Owner Details')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();

    fireEvent.click(screen.getByText('View Listed Spots'));
    expect(pushMock).toHaveBeenCalledWith('/admin/spot-management/owner-profile/owner-1#listed-spots');
  });

  test('routes to owner profile page', () => {
    render(
      <OwnerCard
        ownerId="owner-1"
        name="Bob"
        email="bob@example.com"
        phone="N/A"
        joinDate="2025-01-01T00:00:00.000Z"
      />
    );

    fireEvent.click(screen.getByText('View Owner Profile'));
    expect(pushMock).toHaveBeenCalledWith('/admin/spot-management/owner-profile/owner-1');
  });

  test('handles missing or undefined contact details gracefully', () => {
    render(
      <OwnerCard
        ownerId="owner-2"
        name="Chris"
        email={undefined as any}
        phone={undefined as any}
        joinDate="2025-01-01T00:00:00.000Z"
      />
    );
  });
});