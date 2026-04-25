// __tests__/seller/bookings/VehicleNumber.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  VehicleNumber,
} from '@/app/(protected)/seller/bookings/Components/BookingList';

describe('VehicleNumber Component', () => {

  test('renders vehicle number text', () => {
    render(<VehicleNumber value="ABC-1234" />);
    expect(screen.getByText('ABC-1234')).toBeTruthy();
  });

  test('renders different vehicle numbers', () => {
    const numbers = ['ABC-1234', 'XYZ-9999', 'KL1234'];

    numbers.forEach((number) => {
      const { unmount } = render(<VehicleNumber value={number} />);
      expect(screen.getByText(number)).toBeTruthy();
      unmount();
    });
  });

  test('is a span element', () => {
    render(<VehicleNumber value="ABC-1234" />);
    const el = screen.getByText('ABC-1234');
    expect(el.tagName).toBe('SPAN');
  });

  test('has tracking-wider class', () => {
    render(<VehicleNumber value="ABC-1234" />);
    const el = screen.getByText('ABC-1234');
    expect(el.className).toContain('tracking-wider');
  });

  test('has font-semibold class', () => {
    render(<VehicleNumber value="ABC-1234" />);
    const el = screen.getByText('ABC-1234');
    expect(el.className).toContain('font-semibold');
  });

  test('shows empty string without crash', () => {
    const { container } = render(<VehicleNumber value="" />);
    expect(container).toBeTruthy();
  });

  test('displays text content correctly', () => {
    render(<VehicleNumber value="TEST-999" />);
    const el = screen.getByText('TEST-999');
    expect(el.textContent).toBe('TEST-999');
  });
});