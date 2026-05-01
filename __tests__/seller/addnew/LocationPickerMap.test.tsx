import React from 'react';
import { render, screen } from '@testing-library/react';
import LocationPickerMap from '@/app/(protected)/seller/addnew/Components/LocationPickerMap';

// Mock dependencies
jest.mock('@/components/custom/GoogleMapContainer', () => {
    return function MockGoogleMapContainer({ children, defaultCenter, gestureHandling }: any) {
        return (
            <div data-testid="mock-google-map" data-center={JSON.stringify(defaultCenter)} data-gesture={gestureHandling}>
                {children}
            </div>
        );
    };
});

jest.mock('@vis.gl/react-google-maps', () => ({
    AdvancedMarker: ({ children, position }: any) => (
        <div data-testid="advanced-marker" data-position={JSON.stringify(position)}>
            {children}
        </div>
    ),
    useMap: () => ({
        addListener: jest.fn(),
        getZoom: jest.fn().mockReturnValue(12),
        setZoom: jest.fn(),
        panTo: jest.fn()
    })
}));

// Mock global google object
(global as any).google = {
    maps: {
        event: {
            removeListener: jest.fn()
        }
    }
};

describe('LocationPickerMap Component', () => {
    const mockOnSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders map container with default center when no position is selected', () => {
        render(<LocationPickerMap selectedPosition={null} onSelect={mockOnSelect} />);
        
        const mapContainer = screen.getByTestId('mock-google-map');
        expect(mapContainer).toBeTruthy();
        // default center is Colombo
        expect(mapContainer.getAttribute('data-center')).toContain('"lat":6.9271');
        
        // No marker should be rendered
        expect(screen.queryByTestId('advanced-marker')).toBeNull();
    });

    test('renders marker when position is selected', () => {
        render(<LocationPickerMap selectedPosition={[6.1, 79.1]} onSelect={mockOnSelect} />);
        
        const marker = screen.getByTestId('advanced-marker');
        expect(marker).toBeTruthy();
        expect(marker.getAttribute('data-position')).toContain('"lat":6.1');
    });

    test('sets gestureHandling to none when readOnly is true', () => {
        render(<LocationPickerMap selectedPosition={[6.1, 79.1]} onSelect={mockOnSelect} readOnly={true} />);
        
        const mapContainer = screen.getByTestId('mock-google-map');
        expect(mapContainer.getAttribute('data-gesture')).toBe('none');
    });
});
