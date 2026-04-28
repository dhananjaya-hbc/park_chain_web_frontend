import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinalizeCard from '@/app/(protected)/seller/addnew/Components/FinalizeCard';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

// Mock API responses
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('FinalizeCard Component', () => {
    const mockRouter = { push: jest.fn() };
    const mockSetSubmissionState = jest.fn();
    const mockResetForm = jest.fn();
    const mockPrepareSubmissionPayload = jest.fn();

    const defaultFormState: any = {
        title: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        imageFiles: [],
        slots: [],
        isSubmitting: false,
        submitError: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        mockPrepareSubmissionPayload.mockReturnValue({
            title: 'Test Spot',
            description: 'Test Desc',
            address: '123 Test St',
            latitude: 6.1,
            longitude: 79.1,
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
        test('renders component properly', () => {
            render(
                <FinalizeCard 
                    formState={defaultFormState}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            expect(screen.getByText('Finalize')).toBeTruthy();
            expect(screen.getByText('Submit for Review')).toBeTruthy();
            expect(screen.getByText('Cancel & Discard')).toBeTruthy();
        });

        test('displays loading state when submitting', () => {
            render(
                <FinalizeCard 
                    formState={{ ...defaultFormState, isSubmitting: true }}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            expect(screen.getByText('Submitting...')).toBeTruthy();
            expect(screen.getByText('Submitting...').closest('button')).toHaveProperty('disabled', true);
            expect(screen.getByText('Cancel & Discard')).toHaveProperty('disabled', true);
        });

        test('displays submit error from form state', () => {
            render(
                <FinalizeCard 
                    formState={{ ...defaultFormState, submitError: 'Validation failed' }}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            expect(screen.getByText('Validation failed')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: SUBMISSION FLOW
    // ════════════════════════════════════════════════════
    describe('Submission Flow', () => {
        test('handles successful submission', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            render(
                <FinalizeCard 
                    formState={{ ...defaultFormState, imageFiles: [new File([''], 'img.jpg')] }}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                    kybSubmissionId="kyb-123"
                />
            );

            const submitBtn = screen.getByText('Submit for Review');
            fireEvent.click(submitBtn);

            expect(mockSetSubmissionState).toHaveBeenCalledWith(true);

            await waitFor(() => {
                expect(screen.getByText('Success!')).toBeTruthy();
            });

            // Click go back home
            fireEvent.click(screen.getByText('Go back home'));
            expect(mockResetForm).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/seller/spots');
        });

        test('handles submission error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Server error occurred' })
            });

            render(
                <FinalizeCard 
                    formState={defaultFormState}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            const submitBtn = screen.getByText('Submit for Review');
            fireEvent.click(submitBtn);

            await waitFor(() => {
                expect(mockSetSubmissionState).toHaveBeenCalledWith(false, 'Server error occurred');
                expect(screen.getByText('Server error occurred')).toBeTruthy();
            });
        });
        
        test('handles fetch network error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network failure'));

            render(
                <FinalizeCard 
                    formState={defaultFormState}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            const submitBtn = screen.getByText('Submit for Review');
            fireEvent.click(submitBtn);

            await waitFor(() => {
                expect(mockSetSubmissionState).toHaveBeenCalledWith(false, 'Network failure');
            });
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: DISCARD FLOW
    // ════════════════════════════════════════════════════
    describe('Discard Flow', () => {
        test('does nothing on cancel if form is completely empty', () => {
            render(
                <FinalizeCard 
                    formState={defaultFormState}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            const cancelBtn = screen.getByText('Cancel & Discard');
            fireEvent.click(cancelBtn);

            // Should not open the popup
            expect(screen.queryByText('Are you sure?')).toBeNull();
        });

        test('opens discard popup if form has input', () => {
            render(
                <FinalizeCard 
                    formState={{ ...defaultFormState, title: 'Some Title' }}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            const cancelBtn = screen.getByText('Cancel & Discard');
            fireEvent.click(cancelBtn);

            expect(screen.getByText('Are you sure?')).toBeTruthy();
        });

        test('handles discard cancellation', () => {
            render(
                <FinalizeCard 
                    formState={{ ...defaultFormState, title: 'Some Title' }}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            fireEvent.click(screen.getByText('Cancel & Discard'));
            
            const noBtn = screen.getAllByText('Cancel')[0]; // The popup's Cancel button
            fireEvent.click(noBtn);

            expect(screen.queryByText('Are you sure?')).toBeNull();
        });

        test('handles discard confirmation', () => {
            render(
                <FinalizeCard 
                    formState={{ ...defaultFormState, title: 'Some Title' }}
                    setSubmissionState={mockSetSubmissionState}
                    resetForm={mockResetForm}
                    prepareSubmissionPayload={mockPrepareSubmissionPayload}
                />
            );

            fireEvent.click(screen.getByText('Cancel & Discard'));
            
            const deleteBtn = screen.getByText('Delete');
            fireEvent.click(deleteBtn);

            expect(mockResetForm).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/seller/approvals');
        });
    });
});
