import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneralInfoCard from '@/app/(protected)/seller/addnew/Components/GeneralInfoCard';

describe('GeneralInfoCard Component', () => {
    const mockSetGeneralInfo = jest.fn();
    const defaultFormState: any = {
        title: '',
        description: '',
        address: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: RENDERING
    // ════════════════════════════════════════════════════
    describe('Rendering', () => {
        test('renders all input fields correctly', () => {
            render(
                <GeneralInfoCard 
                    formState={defaultFormState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                />
            );

            expect(screen.getByText('General Information')).toBeTruthy();
            expect(screen.getByPlaceholderText('e.g. Secure Downtown Garage')).toBeTruthy();
            expect(screen.getByPlaceholderText('e.g. No 457, 5th Avenue, Colombo 07')).toBeTruthy();
            expect(screen.getByPlaceholderText(/Describe the accessibility/i)).toBeTruthy();
        });

        test('displays current form state values', () => {
            const populatedState: any = {
                title: 'Test Spot',
                description: 'A very nice spot.',
                address: '123 Test Ave',
            };

            render(
                <GeneralInfoCard 
                    formState={populatedState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                />
            );

            expect(screen.getByDisplayValue('Test Spot')).toBeTruthy();
            expect(screen.getByDisplayValue('A very nice spot.')).toBeTruthy();
            expect(screen.getByDisplayValue('123 Test Ave')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: INTERACTIONS
    // ════════════════════════════════════════════════════
    describe('User Interactions', () => {
        test('calls setGeneralInfo when title changes', () => {
            render(
                <GeneralInfoCard 
                    formState={defaultFormState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                />
            );

            const titleInput = screen.getByPlaceholderText('e.g. Secure Downtown Garage');
            fireEvent.change(titleInput, { target: { value: 'New Title' } });

            expect(mockSetGeneralInfo).toHaveBeenCalledWith({ title: 'New Title' });
        });

        test('calls setGeneralInfo when address changes', () => {
            render(
                <GeneralInfoCard 
                    formState={defaultFormState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                />
            );

            const addressInput = screen.getByPlaceholderText('e.g. No 457, 5th Avenue, Colombo 07');
            fireEvent.change(addressInput, { target: { value: 'New Address' } });

            expect(mockSetGeneralInfo).toHaveBeenCalledWith({ address: 'New Address' });
        });

        test('calls setGeneralInfo when description changes', () => {
            render(
                <GeneralInfoCard 
                    formState={defaultFormState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                />
            );

            const descInput = screen.getByPlaceholderText(/Describe the accessibility/i);
            fireEvent.change(descInput, { target: { value: 'New Description' } });

            expect(mockSetGeneralInfo).toHaveBeenCalledWith({ description: 'New Description' });
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: LOCK STATE (isSpotIdentityLocked)
    // ════════════════════════════════════════════════════
    describe('Lock State', () => {
        test('sets readOnly attribute when isSpotIdentityLocked is true', () => {
            render(
                <GeneralInfoCard 
                    formState={defaultFormState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                    isSpotIdentityLocked={true}
                />
            );

            const titleInput = screen.getByPlaceholderText('e.g. Secure Downtown Garage');
            const addressInput = screen.getByPlaceholderText('e.g. No 457, 5th Avenue, Colombo 07');
            const descInput = screen.getByPlaceholderText(/Describe the accessibility/i);

            expect(titleInput).toHaveProperty('readOnly', true);
            expect(addressInput).toHaveProperty('readOnly', true);
            
            // Description is never locked based on the component's code
            expect(descInput).toHaveProperty('readOnly', false);
        });

        test('applies correct disabled styling when locked', () => {
            render(
                <GeneralInfoCard 
                    formState={defaultFormState} 
                    setGeneralInfo={mockSetGeneralInfo} 
                    isSpotIdentityLocked={true}
                />
            );

            const titleInput = screen.getByPlaceholderText('e.g. Secure Downtown Garage');
            expect(titleInput.className).toContain('cursor-not-allowed');
            expect(titleInput.className).toContain('bg-gray-50');
        });
    });
});
