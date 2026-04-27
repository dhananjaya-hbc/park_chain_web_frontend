import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Main from '@/app/(protected)/admin/spot-management/components/Main';

// Mock the MapSearchBar component to isolate testing
jest.mock('@/app/(protected)/admin/spot-management/components/SearchBar/MapSearchBar', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="mock-searchbar">
      <div>search: {props.searchQuery}</div>
      <div>filter: {props.filterStatus}</div>
      <button onClick={() => props.onSearchChange('central')}>set search</button>
      <button onClick={() => props.onFilterChange('active')}>set active</button>
    </div>
  ),
}));

// Mock the SpotMap component to verify property updates
jest.mock('@/app/(protected)/admin/spot-management/components/MapView/SpotMap', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="mock-spotmap">
      <div>spotmap search: {props.searchQuery}</div>
      <div>spotmap filter: {props.filterStatus}</div>
      <div>spotmap selected: {props.selectedSpotId || 'none'}</div>
      <button onClick={() => props.onSpotSelect('spot-99')}>select spot</button>
    </div>
  ),
}));

describe('Main', () => {
  test('renders SearchBar and SpotMap with default state', () => {
    // Arrange & Act
    render(<Main />);

    // Assert components and their default values
    expect(screen.getByTestId('mock-searchbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-spotmap')).toBeInTheDocument();
    expect(screen.getByText('spotmap search:')).toBeInTheDocument();
    expect(screen.getByText('spotmap filter: all')).toBeInTheDocument();
    expect(screen.getByText('spotmap selected: none')).toBeInTheDocument();
  });

  test('updates SpotMap props when search and filter change', () => {
    // Arrange
    render(<Main />);

    // Act
    fireEvent.click(screen.getByText('set search'));
    fireEvent.click(screen.getByText('set active'));

    // Assert
    expect(screen.getByText('spotmap search: central')).toBeInTheDocument();
    expect(screen.getByText('spotmap filter: active')).toBeInTheDocument();
  });

  test('updates selected spot when SpotMap selects one', () => {
    // Arrange
    render(<Main />);

    // Act
    fireEvent.click(screen.getByText('select spot'));

    // Assert
    expect(screen.getByText('spotmap selected: spot-99')).toBeInTheDocument();
  });
});