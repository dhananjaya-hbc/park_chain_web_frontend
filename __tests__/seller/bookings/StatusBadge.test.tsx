// __tests__/seller/bookings/StatusBadge.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  StatusBadge,
} from '@/app/(protected)/seller/bookings/Components/BookingList';

describe('StatusBadge Component', () => {

  // ════════════════════════════════════════════════════
  // GROUP 1: TEXT DISPLAY
  // ✅ Use .toBeTruthy() instead of .toBeInTheDocument()
  // ════════════════════════════════════════════════════
  describe('Text Display', () => {

    test('shows Pending for pending status', () => {
      render(<StatusBadge status="pending" />);
      expect(screen.getByText('Pending')).toBeTruthy();
    });

    test('shows Confirmed for confirmed status', () => {
      render(<StatusBadge status="confirmed" />);
      expect(screen.getByText('Confirmed')).toBeTruthy();
    });

    test('shows Active for active status', () => {
      render(<StatusBadge status="active" />);
      expect(screen.getByText('Active')).toBeTruthy();
    });

    test('shows Completed for completed status', () => {
      render(<StatusBadge status="completed" />);
      expect(screen.getByText('Completed')).toBeTruthy();
    });

    test('shows Unpaid for unpaid payment status', () => {
      render(<StatusBadge status="unpaid" />);
      expect(screen.getByText('Unpaid')).toBeTruthy();
    });

    test('shows Processing for processing status', () => {
      render(<StatusBadge status="processing" />);
      expect(screen.getByText('Processing')).toBeTruthy();
    });

    test('shows Paid for paid status', () => {
      render(<StatusBadge status="paid" />);
      expect(screen.getByText('Paid')).toBeTruthy();
    });

    test('replaces underscore with space for split_completed', () => {
      render(<StatusBadge status="split_completed" />);
      expect(screen.getByText('Split Completed')).toBeTruthy();
    });

    test('shows Failed for failed status', () => {
      render(<StatusBadge status="failed" />);
      expect(screen.getByText('Failed')).toBeTruthy();
    });

    test('capitalizes first letter of each word', () => {
      render(<StatusBadge status="pending" />);
      const badge = screen.getByText('Pending');
      expect(badge.textContent?.[0]).toBe('P');
    });

    test('unknown status shows formatted text', () => {
      render(<StatusBadge status="unknown_status" />);
      expect(screen.getByText('Unknown Status')).toBeTruthy();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: CSS CLASSES
  // ════════════════════════════════════════════════════
  describe('CSS Classes', () => {

    test('pending badge has amber styling', () => {
      render(<StatusBadge status="pending" />);
      const badge = screen.getByText('Pending');
      expect(badge.className).toContain('amber');
    });

    test('active badge has emerald styling', () => {
      render(<StatusBadge status="active" />);
      const badge = screen.getByText('Active');
      expect(badge.className).toContain('emerald');
    });

    test('completed badge has gray styling', () => {
      render(<StatusBadge status="completed" />);
      const badge = screen.getByText('Completed');
      expect(badge.className).toContain('gray');
    });

    test('failed badge has red styling', () => {
      render(<StatusBadge status="failed" />);
      const badge = screen.getByText('Failed');
      expect(badge.className).toContain('red');
    });

    test('processing badge has blue styling', () => {
      render(<StatusBadge status="processing" />);
      const badge = screen.getByText('Processing');
      expect(badge.className).toContain('blue');
    });

    test('paid badge has emerald styling', () => {
      render(<StatusBadge status="paid" />);
      const badge = screen.getByText('Paid');
      expect(badge.className).toContain('emerald');
    });

    test('badge has border class', () => {
      render(<StatusBadge status="pending" />);
      const badge = screen.getByText('Pending');
      expect(badge.className).toContain('border');
    });

    test('badge is a span element', () => {
      render(<StatusBadge status="pending" />);
      const badge = screen.getByText('Pending');
      expect(badge.tagName).toBe('SPAN');
    });
  });
});