import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SpotHeader from '@/app/(protected)/admin/spot-management/view-details/[id]/components/SpotHeader';

describe('SpotHeader', () => {
  test('renders title, address, pricing and review metadata', () => {
    // Arrange
    const onBack = jest.fn();

    // Act
    render(
      <SpotHeader 
        title="Downtown Metro Parking" 
        address="123 Market St" 
        price="6 XRP / hr" 
        rating={4.8} 
        reviewCount={124} 
        onBack={onBack} 
      />
    );

    // Assert
    expect(screen.getByText('Downtown Metro Parking')).toBeInTheDocument();
    expect(screen.getByText(/123 Market St/)).toBeInTheDocument();
    expect(screen.getByText('6 XRP / hr')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(124 reviews)')).toBeInTheDocument();
  });

  test('triggers onBack when back button is clicked', () => {
    // Arrange
    const onBack = jest.fn();

    render(
      <SpotHeader 
        title="Spot" 
        address="Address" 
        price="N/A" 
        rating={4} 
        reviewCount={1} 
        onBack={onBack} 
      />
    );

    // Act
    fireEvent.click(screen.getByText('Back to Map'));
    
    // Assert
    expect(onBack).toHaveBeenCalled();
  });
});