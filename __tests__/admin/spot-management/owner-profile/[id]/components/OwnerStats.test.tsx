import React from 'react';
import { render, screen } from '@testing-library/react';
import OwnerStats from '@/app/(protected)/admin/spot-management/owner-profile/[id]/components/OwnerStats';

describe('OwnerStats', () => {
  test('renders all stat cards and formats rating', () => {
    // Arrange & Act
    render(<OwnerStats totalSpots={12} totalBookings={345} averageRating={4.84} />);

    // Assert metric outputs are mapped properly
    expect(screen.getByText('Total Spots Listed')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText('Total Bookings')).toBeInTheDocument();
    expect(screen.getByText('345')).toBeInTheDocument();

    expect(screen.getByText('Average Rating')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });
});