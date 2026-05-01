import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PricingCapacityCard from '@/app/(protected)/seller/addnew/Components/PricingCapacityCard';

describe('PricingCapacityCard Component', () => {
    const mockSetSlots = jest.fn();
    const mockSetTotalSlots = jest.fn();
    
    const defaultSlots = [
        { id: 1, slotType: 'Car', slots: 0, rate: '0', isCustom: false },
        { id: 2, slotType: 'Bike', slots: 0, rate: '0', isCustom: false },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: RENDERING
    // ════════════════════════════════════════════════════
    describe('Rendering', () => {
        test('renders component properly', () => {
            render(
                <PricingCapacityCard 
                    slots={defaultSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={0} 
                    setTotalSlots={mockSetTotalSlots} 
                />
            );

            expect(screen.getByText('Pricing & Capacity')).toBeTruthy();
            expect(screen.getByText('Car Slots')).toBeTruthy();
            expect(screen.getByText('Bike Slots')).toBeTruthy();
        });

        test('renders populated slots correctly', () => {
            const populatedSlots = [
                { id: 1, slotType: 'Car', slots: 5, rate: '10.50', isCustom: false }
            ];

            render(
                <PricingCapacityCard 
                    slots={populatedSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={5} 
                    setTotalSlots={mockSetTotalSlots} 
                />
            );

            const numberInputs = screen.getAllByDisplayValue('5');
            const rateInputs = screen.getAllByDisplayValue('10.50');
            
            expect(numberInputs.length).toBeGreaterThan(0);
            expect(rateInputs.length).toBeGreaterThan(0);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: USER INTERACTIONS
    // ════════════════════════════════════════════════════
    describe('User Interactions', () => {
        test('calls setSlots when slot count changes', () => {
            render(
                <PricingCapacityCard 
                    slots={defaultSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={0} 
                    setTotalSlots={mockSetTotalSlots} 
                />
            );

            const slotInputs = screen.getAllByPlaceholderText('0');
            fireEvent.change(slotInputs[0], { target: { value: '3' } });

            expect(mockSetSlots).toHaveBeenCalled();
            const updateCall = mockSetSlots.mock.calls[0][0];
            expect(updateCall[0].slots).toBe(3);
        });

        test('calls setSlots when rate changes', () => {
            render(
                <PricingCapacityCard 
                    slots={defaultSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={0} 
                    setTotalSlots={mockSetTotalSlots} 
                />
            );

            const rateInputs = screen.getAllByPlaceholderText('0.00');
            fireEvent.change(rateInputs[0], { target: { value: '15' } });

            expect(mockSetSlots).toHaveBeenCalled();
            const updateCall = mockSetSlots.mock.calls[0][0];
            expect(updateCall[0].rate).toBe('15');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: PARTIAL ROW LOCKING
    // ════════════════════════════════════════════════════
    describe('Partial Row Locking', () => {
        test('shows warning message when a row is partially filled', () => {
            const partialSlots = [
                { id: 1, slotType: 'Car', slots: 5, rate: '0', isCustom: false },
                { id: 2, slotType: 'Bike', slots: 0, rate: '0', isCustom: false },
            ];

            render(
                <PricingCapacityCard 
                    slots={partialSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={5} 
                    setTotalSlots={mockSetTotalSlots} 
                />
            );

            expect(screen.getByText(/Fill both/)).toBeTruthy();
            expect(screen.getAllByText(/Car/).length).toBeGreaterThan(0);
            expect(screen.getByText(/before editing other rows/)).toBeTruthy();
        });

        test('disables other rows when one row is partially filled', () => {
            const partialSlots = [
                { id: 1, slotType: 'Car', slots: 5, rate: '0', isCustom: false },
                { id: 2, slotType: 'Bike', slots: 0, rate: '0', isCustom: false },
            ];

            render(
                <PricingCapacityCard 
                    slots={partialSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={5} 
                    setTotalSlots={mockSetTotalSlots} 
                />
            );

            const rateInputs = screen.getAllByPlaceholderText('0.00');
            // Second row should be locked
            expect(rateInputs[1]).toHaveProperty('disabled', true);
            // First row should remain editable to fill the rate
            expect(rateInputs[0]).toHaveProperty('disabled', false);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: LOCK SLOT COUNT
    // ════════════════════════════════════════════════════
    describe('Lock Slot Count', () => {
        test('disables slot inputs when lockSlotCount is true', () => {
            render(
                <PricingCapacityCard 
                    slots={defaultSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={0} 
                    setTotalSlots={mockSetTotalSlots} 
                    lockSlotCount={true}
                />
            );

            const slotInputs = screen.getAllByPlaceholderText('0');
            expect(slotInputs[0]).toHaveProperty('readOnly', true);
            expect(slotInputs[1]).toHaveProperty('readOnly', true);
        });

        test('prevents updating slots when lockSlotCount is true', () => {
            render(
                <PricingCapacityCard 
                    slots={defaultSlots} 
                    setSlots={mockSetSlots} 
                    totalSlots={0} 
                    setTotalSlots={mockSetTotalSlots} 
                    lockSlotCount={true}
                />
            );

            const slotInputs = screen.getAllByPlaceholderText('0');
            fireEvent.change(slotInputs[0], { target: { value: '5' } });

            // Ensure setSlots was NOT called
            expect(mockSetSlots).not.toHaveBeenCalled();
        });
    });
});
