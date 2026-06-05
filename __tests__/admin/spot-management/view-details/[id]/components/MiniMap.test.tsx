import React from 'react';
import { render, screen } from '@testing-library/react';
import MiniMap from '@/app/(protected)/admin/spot-management/view-details/[id]/components/MiniMap';

// Mock google maps provider
jest.mock('@/components/custom/GoogleMapContainer', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="google-map">{children}</div>,
}));

// Mock vis.gl react components for stable rendering outside DOM context
jest.mock('@vis.gl/react-google-maps', () => ({
  AdvancedMarker: ({ children }: any) => <div data-testid="advanced-marker">{children}</div>,
}));

describe('MiniMap', () => {
  test('shows invalid coordinates state', () => {
    // Arrange & Act
    render(<MiniMap latitude={Number.NaN} longitude={122} />);
    expect(screen.getByText('Invalid Coordinates')).toBeInTheDocument();
  });

  test('renders map and marker for valid coordinates', () => {
    // Arrange & Act
    render(<MiniMap latitude={37.77} longitude={-122.41} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByTestId('advanced-marker')).toBeInTheDocument();
  });
});