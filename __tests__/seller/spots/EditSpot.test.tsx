// __tests__/seller/spots/EditSpot.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditSpot from '@/app/(protected)/seller/spots/Componenets/EditSpot';
import { useAddNewSpotForm } from '@/hooks/useAddNewSpotForm';
import apiService from '@/lib/api/apiService';

// Mock dependencies
jest.mock('@/lib/api/apiService');
jest.mock('@/hooks/useAddNewSpotForm');

// Mock Sub-Components
jest.mock('@/app/(protected)/seller/addnew/Components/GeneralInfoCard', () => {
    return function MockGeneralInfoCard() {
        return <div data-testid="general-info-card">Mock General Info Card</div>;
    };
});
jest.mock('@/app/(protected)/seller/addnew/Components/PricingCapacityCard', () => {
    return function MockPricingCapacityCard() {
        return <div data-testid="pricing-capacity-card">Mock Pricing Capacity Card</div>;
    };
});
jest.mock('@/app/(protected)/seller/addnew/Components/SpotImagesCard', () => {
    return function MockSpotImagesCard() {
        return <div data-testid="spot-images-card">Mock Spot Images Card</div>;
    };
});
jest.mock('@/app/(protected)/seller/addnew/Components/LocationCard', () => {
    return function MockLocationCard() {
        return <div data-testid="location-card">Mock Location Card</div>;
    };
});

describe('EditSpot Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSpotUpdated = jest.fn();
    const mockFetch = jest.fn();
    
    const mockSpot = {
        id: 'spot-123',
        name: 'Downtown Garage',
        address: '456 Main St',
        description: 'Secure garage',
        latitude: 6.9271,
        longitude: 79.8612,
        totalSlots: 10,
        vehicleTypes: ['Car', 'Bike'],
        slotsPerType: [6, 4],
        pricesPerHour: [15, 5],
        imageUrl: 'http://example.com/image.jpg'
    };

    const mockFormProps = {
        formState: {
            description: 'Secure garage',
            slots: [
                { slotType: 'Car', slots: 6, rate: '15' },
                { slotType: 'Bike', slots: 4, rate: '5' }
            ],
            imageFiles: [new File([''], 'test.jpg')],
            latitude: '6.9271',
            longitude: '79.8612',
            totalSlots: 10,
            isSubmitting: false,
        },
        setGeneralInfo: jest.fn(),
        setLocation: jest.fn(),
        setTotalSlots: jest.fn(),
        setSlots: jest.fn(),
        setImageFiles: jest.fn(),
        setSubmissionState: jest.fn(),
        resetForm: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (apiService.get as jest.Mock).mockResolvedValue({ minSlotsPerType: {} });
        global.fetch = jest.fn((url: string | URL | Request) => {
            const urlStr = typeof url === 'string' ? url : url.toString();
            if (urlStr.includes('image.jpg')) {
                return Promise.resolve({
                    blob: () => Promise.resolve(new Blob([''], { type: 'image/jpeg' }))
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });
        }) as jest.Mock;
        
        // Setup default hook return value
        (useAddNewSpotForm as jest.Mock).mockReturnValue(mockFormProps);
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: INITIAL RENDER & PRE-FILL
    // ════════════════════════════════════════════════════
    describe('Initial Render & Pre-fill', () => {
        test('renders all child components', () => {
            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );
            
            expect(screen.getByTestId('general-info-card')).toBeTruthy();
            expect(screen.getByTestId('pricing-capacity-card')).toBeTruthy();
            expect(screen.getByTestId('spot-images-card')).toBeTruthy();
            expect(screen.getByTestId('location-card')).toBeTruthy();
        });

        test('pre-fills form with spot data on mount', () => {
            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            expect(mockFormProps.setGeneralInfo).toHaveBeenCalledWith({
                title: 'Downtown Garage',
                address: '456 Main St',
                description: 'Secure garage',
            });

            expect(mockFormProps.setLocation).toHaveBeenCalledWith('6.9271', '79.8612');
            expect(mockFormProps.setTotalSlots).toHaveBeenCalledWith(10);
        });

        test('does not pre-fill if spot is null', () => {
            render(
                <EditSpot 
                    spot={null} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            expect(mockFormProps.setGeneralInfo).not.toHaveBeenCalled();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: SUBMISSION FLOW
    // ════════════════════════════════════════════════════
    describe('Submission Flow', () => {
        test('successfully updates spot and shows success popup', async () => {
            // The default global.fetch mock in beforeEach handles the success case

            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            const saveBtn = screen.getByText('Save Changes');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockFormProps.setSubmissionState).toHaveBeenCalledWith(true);
            });

            // check if popup appears
            await waitFor(() => {
                expect(screen.getByText('Successfully Saved!')).toBeTruthy();
            });

            // click back to spots
            const backBtn = screen.getByText('Back to Spots');
            fireEvent.click(backBtn);

            expect(mockOnSpotUpdated).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });

        test('handles submission error gracefully', async () => {
            (global.fetch as jest.Mock).mockImplementation((url: string | URL | Request) => {
                const urlStr = typeof url === 'string' ? url : url.toString();
                if (urlStr.includes('image.jpg')) {
                    return Promise.resolve({
                        blob: () => Promise.resolve(new Blob([''], { type: 'image/jpeg' }))
                    });
                }
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: 'Invalid data' })
                });
            });

            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            const saveBtn = screen.getByText('Save Changes');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(screen.getByText('Invalid data')).toBeTruthy();
                expect(mockFormProps.setSubmissionState).toHaveBeenCalledWith(false, 'Invalid data');
            });
        });

        test('validates missing rate before submission', async () => {
            const formWithMissingRate = {
                ...mockFormProps,
                formState: {
                    ...mockFormProps.formState,
                    slots: [
                        { slotType: 'Car', slots: 5, rate: '0' } // Incomplete row
                    ]
                }
            };
            (useAddNewSpotForm as jest.Mock).mockReturnValue(formWithMissingRate);

            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            const saveBtn = screen.getByText('Save Changes');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(screen.getByText('At least one pricing row must be filled with a slot count and hourly rate.')).toBeTruthy();
            });
        });

        test('shows loading state on button when submitting', () => {
            const submittingForm = {
                ...mockFormProps,
                formState: { ...mockFormProps.formState, isSubmitting: true }
            };
            (useAddNewSpotForm as jest.Mock).mockReturnValue(submittingForm);

            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            expect(screen.getByText('Saving...')).toBeTruthy();
            expect((screen.getByText('Saving...').closest('button') as HTMLButtonElement).disabled).toBe(true);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: CANCELLATION FLOW
    // ════════════════════════════════════════════════════
    describe('Cancellation Flow', () => {
        test('shows confirm discard popup on cancel', () => {
            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            const cancelBtn = screen.getByText('Cancel');
            fireEvent.click(cancelBtn);

            expect(screen.getByText('Cancel Editing?')).toBeTruthy();
        });

        test('closes discard popup on Keep Editing', () => {
            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            fireEvent.click(screen.getByText('Cancel'));
            expect(screen.getByText('Cancel Editing?')).toBeTruthy();

            const keepEditingBtn = screen.getByText('Keep Editing');
            fireEvent.click(keepEditingBtn);

            expect(screen.queryByText('Cancel Editing?')).toBeNull();
        });

        test('closes editor on Cancel confirmation', () => {
            render(
                <EditSpot 
                    spot={mockSpot} 
                    onClose={mockOnClose} 
                    onSpotUpdated={mockOnSpotUpdated} 
                />
            );

            fireEvent.click(screen.getByText('Cancel')); // Main cancel button
            
            const popupCancelBtn = screen.getAllByText('Cancel')[1]; // Cancel button in popup
            fireEvent.click(popupCancelBtn);

            expect(mockFormProps.resetForm).toHaveBeenCalled();
            expect(mockOnSpotUpdated).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
