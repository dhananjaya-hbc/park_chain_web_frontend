import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewsList from '@/app/(protected)/admin/spot-management/view-details/[id]/components/ReviewsList';

describe('ReviewsList', () => {
  test('renders empty state when no reviews are provided', () => {
    render(<ReviewsList />);
    expect(screen.getByText('Recent Feedback')).toBeInTheDocument();
    expect(screen.getByText('No reviews available for this spot yet.')).toBeInTheDocument();
  });

  test('renders reviews list when reviews are provided', () => {
    const mockReviews = [
      {
        id: '1',
        user_name: 'User #101',
        created_at: '2025-01-01T00:00:00.000Z',
        rating: 5,
        comment: 'Great spot!',
      },
      {
        id: '2',
        user_name: 'User #102',
        created_at: '2025-01-02T00:00:00.000Z',
        rating: 4,
        comment: 'Easy parking',
      },
    ];

    render(<ReviewsList reviews={mockReviews} />);
    expect(screen.getByText('Recent Feedback')).toBeInTheDocument();
    expect(screen.getByText('User #101')).toBeInTheDocument();
    expect(screen.getByText('User #102')).toBeInTheDocument();
    expect(screen.getByText('"Great spot!"')).toBeInTheDocument();
  });
});