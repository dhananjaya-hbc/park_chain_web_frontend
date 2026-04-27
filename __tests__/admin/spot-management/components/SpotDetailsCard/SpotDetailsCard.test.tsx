import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SpotDetailsCard from '@/app/(protected)/admin/spot-management/components/SpotDetailsCard/SpotDetailsCard';

const pushMock = jest.fn();

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('SpotDetailsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders active spot details and navigates to details page', () => {
    // Arrange
    render(
      <SpotDetailsCard
        spot={{
          id: 'spot-1',
          title: 'Downtown Spot',
          latitude: 1,
          longitude: 2,
          is_available: true,
          address: '123 Main St',
          description: 'Safe and covered',
        }}
      />
    );

    // Assert render contents
    expect(screen.getByText('Downtown Spot')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
    expect(screen.getByText('Safe and covered')).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByText('View Full Details'));
    
    // Assert navigation occurs
    expect(pushMock).toHaveBeenCalledWith('/admin/spot-management/view-details/spot-1');
  });

  test('shows inactive and no-description fallback', () => {
    // Arrange
    render(
      <SpotDetailsCard
        spot={{
          id: 'spot-2',
          title: 'Airport Spot',
          latitude: 1,
          longitude: 2,
          is_available: false,
        }}
      />
    );

    // Assert fallbacks are properly mapped
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });
});