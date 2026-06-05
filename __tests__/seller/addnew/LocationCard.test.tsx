import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationCard from '@/app/(protected)/seller/addnew/Components/LocationCard';

// Mock the dynamic map component
jest.mock('next/dynamic', () => () => {
    return function MockLocationPickerMap({ selectedPosition, onSelect, readOnly }: any) {
        return (
            <div data-testid="mock-location-picker-map">
                Mock Map
                <div data-testid="map-pos">{selectedPosition ? `${selectedPosition[0]},${selectedPosition[1]}` : 'none'}</div>
                <button 
                    data-testid="simulate-map-click" 
                    onClick={() => onSelect([6.9271, 79.8612])}
                    disabled={readOnly}
                >
                    Simulate Click
                </button>
            </div>
        );
    };
});

describe('LocationCard Component', () => {
    const mockSetLocation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: RENDERING
    // ════════════════════════════════════════════════════
    describe('Rendering', () => {
        test('renders component properly', () => {
            render(<LocationCard latitude="" longitude="" setLocation={mockSetLocation} />);

            expect(screen.getByText('Location')).toBeTruthy();
            expect(screen.getByTestId('mock-location-picker-map')).toBeTruthy();
            const inputs = screen.getAllByPlaceholderText('Auto-filled from KYB');
            expect(inputs.length).toBe(2);
        });

        test('displays formatted latitude and longitude', () => {
            render(
                <LocationCard 
                    latitude="6.927079" 
                    longitude="79.861244" 
                    setLocation={mockSetLocation} 
                />
            );

            expect(screen.getByDisplayValue('6.927079')).toBeTruthy();
            expect(screen.getByDisplayValue('79.861244')).toBeTruthy();
            expect(screen.getByTestId('map-pos').textContent).toBe('6.927079,79.861244');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: INTERACTIONS
    // ════════════════════════════════════════════════════
    describe('User Interactions', () => {
        test('calls setLocation when map is clicked', () => {
            render(<LocationCard latitude="" longitude="" setLocation={mockSetLocation} />);

            const clickBtn = screen.getByTestId('simulate-map-click');
            fireEvent.click(clickBtn);

            expect(mockSetLocation).toHaveBeenCalledWith('6.9271', '79.8612');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: READ-ONLY MODE
    // ════════════════════════════════════════════════════
    describe('Read-Only Mode', () => {
        test('displays read-only warning message', () => {
            render(<LocationCard latitude="" longitude="" setLocation={mockSetLocation} readOnly={true} />);

            expect(screen.getByText(/Location is automatically set from your KYB submission/i)).toBeTruthy();
        });

        test('disables input fields', () => {
            render(<LocationCard latitude="" longitude="" setLocation={mockSetLocation} readOnly={true} />);

            const inputs = screen.getAllByPlaceholderText('Auto-filled from KYB');
            const latInput = inputs[0];
            const lngInput = inputs[1];

            expect(latInput).toHaveProperty('disabled', true);
            expect(lngInput).toHaveProperty('disabled', true);
        });
    });
});
