import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Main from '@/app/(protected)/seller/addnew/Components/Main';
import { useAddNewSpotForm } from '@/hooks/useAddNewSpotForm';
import apiService from '@/lib/api/apiService';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));
jest.mock('@/hooks/useAddNewSpotForm');
jest.mock('@/lib/api/apiService');

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

describe('Main Component (Add New Spot)', () => {
    const mockRouter = { push: jest.fn() };
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const mockFormProps = {
        formState: {
            title: '',
            description: '',
            address: '',
            latitude: '',
            longitude: '',
            totalSlots: 0,
            slots: [],
            imageFiles: [],
            isSubmitting: false,
            submitError: null,
            kybSubmissionId: null
        },
        setGeneralInfo: jest.fn(),
        setLocation: jest.fn(),
        setTotalSlots: jest.fn(),
        setSlots: jest.fn(),
        setImageFiles: jest.fn(),
        setSubmissionState: jest.fn(),
        resetForm: jest.fn(),
        setKybSubmissionId: jest.fn(),
        prepareSubmissionPayload: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAddNewSpotForm as jest.Mock).mockReturnValue(mockFormProps);
        
        mockFormProps.prepareSubmissionPayload.mockReturnValue({
            title: 'Test Spot',
            description: 'Test Desc',
            address: '123 Test St',
            latitude: '6.1',
            longitude: '79.1',
            totalSlots: 5,
            vehicleTypes: ['Car'],
            slotsPerType: [5],
            pricesPerHour: [10],
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: RENDERING
    // ════════════════════════════════════════════════════
    describe('Rendering', () => {
        test('renders all child components properly', () => {
            render(<Main />);
            
            expect(screen.getByText('Add New Parking Spot')).toBeTruthy();
            expect(screen.getByTestId('general-info-card')).toBeTruthy();
            expect(screen.getByTestId('pricing-capacity-card')).toBeTruthy();
            expect(screen.getByTestId('spot-images-card')).toBeTruthy();
            expect(screen.getByTestId('location-card')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: KYB PREFILL
    // ════════════════════════════════════════════════════
    describe('KYB Prefill', () => {
        test('fetches KYB data and sets form state if kybId is provided', async () => {
            (apiService.get as jest.Mock).mockResolvedValueOnce({
                kybId: 'kyb-123',
                name: 'KYB Spot',
                address: '456 KYB Ave',
                googleMapsLink: 'https://maps.google.com/?q=6.123,79.123'
            });

            render(<Main kybId="kyb-123" />);

            await waitFor(() => {
                expect(apiService.get).toHaveBeenCalledWith('/seller/kyb/kyb-123');
                expect(mockFormProps.setGeneralInfo).toHaveBeenCalledWith({
                    title: 'KYB Spot',
                    address: '456 KYB Ave'
                });
                expect(mockFormProps.setKybSubmissionId).toHaveBeenCalledWith('kyb-123');
                expect(mockFormProps.setLocation).toHaveBeenCalledWith('6.123', '79.123');
            });
        });
        
        test('handles KYB fetch error gracefully', async () => {
            (apiService.get as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            render(<Main kybId="kyb-123" />);

            await waitFor(() => {
                expect(apiService.get).toHaveBeenCalledWith('/seller/kyb/kyb-123');
            });
            
            // Should not throw, should just not prefill
            expect(mockFormProps.setGeneralInfo).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: SUBMISSION FLOW
    // ════════════════════════════════════════════════════
    describe('Submission Flow', () => {
        test('validates required fields before submitting', async () => {
            // Setup an incomplete form payload
            mockFormProps.prepareSubmissionPayload.mockReturnValue({
                title: '',
                description: '',
            });

            render(<Main />);
            
            fireEvent.click(screen.getByText('Submit'));
            
            await waitFor(() => {
                expect(mockFormProps.setSubmissionState).toHaveBeenCalledWith(false, 'Spot name is required.');
            });
        });

        test('handles successful submission', async () => {
            // Full payload setup
            const formWithImages = {
                ...mockFormProps,
                formState: {
                    ...mockFormProps.formState,
                    imageFiles: [new File([''], 'img.jpg')]
                }
            };
            (useAddNewSpotForm as jest.Mock).mockReturnValue(formWithImages);
            
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            render(<Main />);
            
            fireEvent.click(screen.getByText('Submit'));

            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalled();
                expect(screen.getByText('Success!')).toBeTruthy();
            });

            // Click go back home
            fireEvent.click(screen.getByText('Go back home'));
            expect(mockFormProps.resetForm).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/seller/spots');
        });

        test('handles submission error gracefully', async () => {
            const formWithImages = {
                ...mockFormProps,
                formState: {
                    ...mockFormProps.formState,
                    imageFiles: [new File([''], 'img.jpg')]
                }
            };
            (useAddNewSpotForm as jest.Mock).mockReturnValue(formWithImages);
            
            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Invalid data' })
            });

            render(<Main />);
            
            fireEvent.click(screen.getByText('Submit'));

            await waitFor(() => {
                expect(mockFormProps.setSubmissionState).toHaveBeenCalledWith(false, 'Invalid data');
            });
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: DISCARD FLOW
    // ════════════════════════════════════════════════════
    describe('Discard Flow', () => {
        test('shows discard popup when form has data and cancel is clicked', () => {
            const formWithData = {
                ...mockFormProps,
                formState: {
                    ...mockFormProps.formState,
                    title: 'Something'
                }
            };
            (useAddNewSpotForm as jest.Mock).mockReturnValue(formWithData);

            render(<Main />);
            
            fireEvent.click(screen.getByText('Cancel & Discard'));
            
            expect(screen.getByText('Are you sure?')).toBeTruthy();
        });

        test('does nothing if form is empty', () => {
            render(<Main />);
            
            fireEvent.click(screen.getByText('Cancel & Discard'));
            
            expect(screen.queryByText('Are you sure?')).toBeNull();
        });

        test('handles discard confirmation', () => {
            const formWithData = {
                ...mockFormProps,
                formState: {
                    ...mockFormProps.formState,
                    title: 'Something'
                }
            };
            (useAddNewSpotForm as jest.Mock).mockReturnValue(formWithData);

            render(<Main />);
            
            fireEvent.click(screen.getByText('Cancel & Discard'));
            
            const deleteBtn = screen.getByText('Delete');
            fireEvent.click(deleteBtn);

            expect(mockFormProps.resetForm).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/seller/approvals');
        });
    });
});
