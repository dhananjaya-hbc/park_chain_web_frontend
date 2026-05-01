// __tests__/seller/spots/map.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpotMap from '@/app/(protected)/seller/spots/Componenets/map';

// Mock dependencies
jest.mock('@vis.gl/react-google-maps', () => {
    const React = require('react');
    return {
        AdvancedMarker: ({ children, onClick, position }: any) => (
            <div 
                data-testid={`advanced-marker-${position.lat}-${position.lng}`}
                onClick={onClick}
            >
                {children}
            </div>
        ),
        InfoWindow: ({ children, onCloseClick }: any) => (
            <div data-testid="info-window" onClick={(e) => e.stopPropagation()}>
                <button data-testid="info-window-close" onClick={(e) => { e.stopPropagation(); onCloseClick(); }}>Close</button>
                {children}
            </div>
        ),
        useMap: () => ({
            setCenter: jest.fn(),
            setZoom: jest.fn(),
            fitBounds: jest.fn(),
        }),
        useMapsLibrary: () => ({
            LatLngBounds: class {
                extend = jest.fn();
            }
        }),
    };
});

jest.mock('@/components/custom/GoogleMapContainer', () => {
    return function MockGoogleMapContainer({ children }: any) {
        return <div data-testid="google-map-container">{children}</div>;
    };
});

describe('SpotMap Component', () => {
    const mockOnView = jest.fn();

    const mockSpots = [
        {
            id: 'spot-1',
            name: 'Central Parking',
            address: '123 Main St',
            latitude: 6.9271,
            longitude: 79.8612,
            isActive: true,
            activeBookings: 2,
            pricePerHour: 10,
        },
        {
            id: 'spot-2',
            name: 'North Garage',
            address: '456 North St',
            latitude: 6.9300,
            longitude: 79.8700,
            isActive: false,
            activeBookings: 0,
            pricePerHour: 5,
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: RENDER AND LOADING
    // ════════════════════════════════════════════════════
    describe('Render and Loading', () => {
        test('renders the map container', () => {
            render(<SpotMap spots={mockSpots} onView={mockOnView} />);
            expect(screen.getByTestId('google-map-container')).toBeTruthy();
        });

        test('shows loading indicator when isLoading is true', () => {
            render(<SpotMap spots={mockSpots} isLoading={true} />);
            expect(screen.getByText('Loading spots...')).toBeTruthy();
        });

        test('does not show loading indicator when isLoading is false', () => {
            render(<SpotMap spots={mockSpots} isLoading={false} />);
            expect(screen.queryByText('Loading spots...')).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: MARKERS
    // ════════════════════════════════════════════════════
    describe('Markers Rendering', () => {
        test('renders markers for all spots', () => {
            render(<SpotMap spots={mockSpots} />);
            
            expect(screen.getByTestId('advanced-marker-6.9271-79.8612')).toBeTruthy();
            expect(screen.getByTestId('advanced-marker-6.93-79.87')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: INFO WINDOW INTERACTIONS
    // ════════════════════════════════════════════════════
    describe('Info Window Interactions', () => {
        test('opens InfoWindow when a marker is clicked', () => {
            render(<SpotMap spots={mockSpots} />);

            const marker1 = screen.getByTestId('advanced-marker-6.9271-79.8612');
            fireEvent.click(marker1);

            expect(screen.getByTestId('info-window')).toBeTruthy();
            expect(screen.getByText('Central Parking')).toBeTruthy();
            expect(screen.getByText('123 Main St')).toBeTruthy();
            expect(screen.getByText('Active')).toBeTruthy(); // Because activeBookings: 2
        });

        test('displays Inactive status correctly in InfoWindow', () => {
            render(<SpotMap spots={mockSpots} />);

            const marker2 = screen.getByTestId('advanced-marker-6.93-79.87');
            fireEvent.click(marker2);

            expect(screen.getByText('North Garage')).toBeTruthy();
            expect(screen.getByText('Inactive')).toBeTruthy(); // Because activeBookings: 0
        });

        test('calls onView when View Details is clicked in InfoWindow', () => {
            render(<SpotMap spots={mockSpots} onView={mockOnView} />);

            const marker1 = screen.getByTestId('advanced-marker-6.9271-79.8612');
            fireEvent.click(marker1);

            const viewDetailsBtn = screen.getByText('View Details');
            fireEvent.click(viewDetailsBtn);

            expect(mockOnView).toHaveBeenCalledWith(mockSpots[0]);
        });

        test('closes InfoWindow when close button is clicked', () => {
            render(<SpotMap spots={mockSpots} />);

            const marker1 = screen.getByTestId('advanced-marker-6.9271-79.8612');
            fireEvent.click(marker1);

            expect(screen.getByTestId('info-window')).toBeTruthy();

            const closeBtn = screen.getByTestId('info-window-close');
            fireEvent.click(closeBtn);

            expect(screen.queryByTestId('info-window')).toBeNull();
        });
    });
});
