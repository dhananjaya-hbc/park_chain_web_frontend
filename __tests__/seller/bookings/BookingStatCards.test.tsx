// __tests__/seller/bookings/BookingStatCards.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingStatCards from '@/app/(protected)/seller/bookings/Components/BookingStatCards';

describe('BookingStatCards Component', () => {

  const defaultStats = {
    total:     10,
    active:    3,
    confirmed: 2,
    completed: 5,
  };

  // ════════════════════════════════════════════════════
  // GROUP 1: LABELS
  // ✅ Use .toBeTruthy() instead of .toBeInTheDocument()
  // ════════════════════════════════════════════════════
  describe('Labels', () => {

    test('shows Total label', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('Total')).toBeTruthy();
    });

    test('shows Active label', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('Active')).toBeTruthy();
    });

    test('shows Upcoming label', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('Upcoming')).toBeTruthy();
    });

    test('shows Completed label', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('Completed')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: VALUES
  // ════════════════════════════════════════════════════
  describe('Values', () => {

    test('shows total count', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('10')).toBeTruthy();
    });

    test('shows active count', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('3')).toBeTruthy();
    });

    test('shows confirmed count', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('2')).toBeTruthy();
    });

    test('shows completed count', () => {
      render(<BookingStatCards stats={defaultStats} />);
      expect(screen.getByText('5')).toBeTruthy();
    });

    test('shows zero values correctly', () => {
      render(<BookingStatCards stats={{
        total: 0, active: 0, confirmed: 0, completed: 0,
      }} />);

      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBe(4);
    });

    test('shows large numbers correctly', () => {
      render(<BookingStatCards stats={{
        total: 1000, active: 500, confirmed: 300, completed: 200,
      }} />);

      expect(screen.getByText('1000')).toBeTruthy();
      expect(screen.getByText('500')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: STRUCTURE
  // ════════════════════════════════════════════════════
  describe('Structure', () => {

    test('renders 4 stat cards', () => {
      const { container } = render(
        <BookingStatCards stats={defaultStats} />
      );
      const cards = container.querySelectorAll('.rounded-xl');
      expect(cards.length).toBe(4);
    });

    test('renders correctly with different stats', () => {
      const stats = {
        total: 25, active: 8, confirmed: 7, completed: 10,
      };
      render(<BookingStatCards stats={stats} />);

      expect(screen.getByText('25')).toBeTruthy();
      expect(screen.getByText('8')).toBeTruthy();
      expect(screen.getByText('7')).toBeTruthy();
      expect(screen.getByText('10')).toBeTruthy();
    });
  });
});