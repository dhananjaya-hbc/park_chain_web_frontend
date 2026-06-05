import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewsList from '@/app/(protected)/admin/spot-management/view-details/[id]/components/ReviewsList';

describe('ReviewsList', () => {
  test('renders title, static reviews and action button', () => {
    // Arrange & Act
    render(<ReviewsList />);

    // Assert content structure
    expect(screen.getByText('Recent Feedback')).toBeInTheDocument();
    expect(screen.getByText('User #101')).toBeInTheDocument();
    expect(screen.getByText('User #102')).toBeInTheDocument();
    expect(screen.getByText('View All Reviews')).toBeInTheDocument();
  });
});