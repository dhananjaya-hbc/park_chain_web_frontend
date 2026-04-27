import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MapSearchBar from '@/app/(protected)/admin/spot-management/components/SearchBar/MapSearchBar';

// Mock fontawesome icons to simplify test rendering
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faSearch: {},
  faSliders: {},
}));

describe('MapSearchBar', () => {
  test('renders input value and calls onSearchChange', () => {
    // Arrange
    const onSearchChange = jest.fn();
    const onFilterChange = jest.fn();

    render(
      <MapSearchBar 
        searchQuery="old query" 
        onSearchChange={onSearchChange} 
        filterStatus="all" 
        onFilterChange={onFilterChange} 
      />
    );

    const input = screen.getByPlaceholderText('Search spots by name...') as HTMLInputElement;
    
    // Assert initial value
    expect(input.value).toBe('old query');

    // Act & Assert change event
    fireEvent.change(input, { target: { value: 'new query' } });
    expect(onSearchChange).toHaveBeenCalledWith('new query');
  });

  test('expands filters on focus and toggles filter selection', () => {
    // Arrange
    const onSearchChange = jest.fn();
    const onFilterChange = jest.fn();

    render(
      <MapSearchBar searchQuery="" onSearchChange={onSearchChange} filterStatus="all" onFilterChange={onFilterChange} />
    );

    const input = screen.getByPlaceholderText('Search spots by name...');
    
    // Act - expand filters
    fireEvent.focus(input);
    expect(screen.getByText('Filter by Status')).toBeInTheDocument();

    // Act & Assert - toggle selection
    fireEvent.click(screen.getByText('Active'));
    expect(onFilterChange).toHaveBeenCalledWith('active');
  });

  test('collapses filter panel on outside click', () => {
    // Arrange
    render(
      <MapSearchBar searchQuery="" onSearchChange={jest.fn()} filterStatus="all" onFilterChange={jest.fn()} />
    );

    fireEvent.focus(screen.getByPlaceholderText('Search spots by name...'));
    expect(screen.getByText('Filter by Status')).toBeInTheDocument();

    // Act
    fireEvent.mouseDown(document.body);

    // Assert
    expect(screen.queryByText('Filter by Status')).toBeNull();
  });

  test('handles form submission or enter key gracefully', () => {
    // Arrange
    render(
      <MapSearchBar searchQuery="" onSearchChange={jest.fn()} filterStatus="all" onFilterChange={jest.fn()} />
    );
    const input = screen.getByPlaceholderText('Search spots by name...');
    
    // Act
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
});