// __tests__/seller/bookings/BookingList.test.tsx

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingList, {
    Booking,
    StatusBadge,
    VehicleNumber,
} from '@/app/(protected)/seller/bookings/Components/BookingList';

// ── Booking factory ───────────────────────────────────
const makeBooking = (
    overrides: Partial<Booking> = {}
): Booking => ({
    id: 'booking-uuid-1',
    spot_title: 'City Parking',
    driver_name: 'John Smith',
    driver_email: 'john@test.com',
    vehicle_type: 'Car',
    vehicle_number: 'ABC-1234',
    start_time: '2025-06-15T09:00:00Z',
    end_time: '2025-06-15T11:00:00Z',
    expected_duration_hours: '2.00',
    actual_duration_hours: null,
    price_per_hour: '2.00',
    total_price_xrp: '4.000000',
    admin_fee_xrp: '0.800000',
    seller_amount_xrp: '3.200000',
    booking_status: 'pending',
    payment_status: 'unpaid',
    created_at: '2025-06-15T08:00:00Z',
    ...overrides,
});

// ── Default props ─────────────────────────────────────
const defaultProps = {
    isLoading: false,
    error: null,
    filteredBookings: [],
    searchQuery: '',
    setSearchQuery: jest.fn(),
    activeFilter: 'all',
    setActiveFilter: jest.fn(),
    selectedBooking: null,
    setSelectedBooking: jest.fn(),
    fetchBookings: jest.fn(),
};

// ── Helper: render with state management ──────────────
function BookingListWithState({
    bookings = [],
    error = null,
    isLoading = false,
}: {
    bookings?: Booking[];
    error?: string | null;
    isLoading?: boolean;
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const filtered = bookings.filter((b) => {
        if (activeFilter !== 'all' &&
            b.booking_status !== activeFilter) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                b.spot_title?.toLowerCase().includes(q) ||
                b.driver_name?.toLowerCase().includes(q) ||
                b.driver_email?.toLowerCase().includes(q) ||
                b.vehicle_number?.toLowerCase().includes(q) ||
                b.vehicle_type?.toLowerCase().includes(q) ||
                false
            );
        }
        return true;
    });

    return (
        <BookingList
            isLoading={isLoading}
            error={error}
            filteredBookings={filtered}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            fetchBookings={jest.fn()}
        />
    );
}

describe('BookingList Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: LOADING STATE (lines 108-115)
    // ════════════════════════════════════════════════════
    describe('Loading State', () => {

        test('shows loading spinner when isLoading is true', () => {
            render(
                <BookingList
                    {...defaultProps}
                    isLoading={true}
                />
            );
            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeTruthy();
        });

        test('shows loading text', () => {
            render(
                <BookingList
                    {...defaultProps}
                    isLoading={true}
                />
            );
            expect(
                screen.getByText('Loading bookings...')
            ).toBeTruthy();
        });

        test('does not show booking list when loading', () => {
            render(
                <BookingList
                    {...defaultProps}
                    isLoading={true}
                    filteredBookings={[makeBooking()]}
                />
            );
            expect(
                screen.queryByText('City Parking')
            ).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: ERROR STATE (lines 116-127)
    // ════════════════════════════════════════════════════
    describe('Error State', () => {

        test('shows error message', () => {
            render(
                <BookingList
                    {...defaultProps}
                    error="Failed to load bookings"
                />
            );
            expect(
                screen.getByText('Failed to load bookings')
            ).toBeTruthy();
        });

        test('shows Try Again button on error', () => {
            render(
                <BookingList
                    {...defaultProps}
                    error="Network error"
                />
            );
            expect(screen.getByText('Try Again')).toBeTruthy();
        });

        test('calls fetchBookings when Try Again clicked', () => {
            const fetchBookings = jest.fn();
            render(
                <BookingList
                    {...defaultProps}
                    error="Network error"
                    fetchBookings={fetchBookings}
                />
            );
            fireEvent.click(screen.getByText('Try Again'));
            expect(fetchBookings).toHaveBeenCalledTimes(1);
        });

        test('does not show booking list on error', () => {
            render(
                <BookingList
                    {...defaultProps}
                    error="Error"
                    filteredBookings={[makeBooking()]}
                />
            );
            expect(
                screen.queryByText('City Parking')
            ).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: EMPTY STATE (lines 128-145)
    // ════════════════════════════════════════════════════
    describe('Empty State', () => {

        test('shows No bookings found when empty', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[]}
                />
            );
            expect(
                screen.getByText('No bookings found')
            ).toBeTruthy();
        });

        test('shows default message when no filter active', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[]}
                    searchQuery=""
                    activeFilter="all"
                />
            );
            expect(
                screen.getByText(
                    'When a driver books your spot, it will appear here.'
                )
            ).toBeTruthy();
        });

        test('shows filter message when search active', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[]}
                    searchQuery="something"
                    activeFilter="all"
                />
            );
            expect(
                screen.getByText('Try adjusting your search or filter.')
            ).toBeTruthy();
        });

        test('shows filter message when status filter active', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[]}
                    searchQuery=""
                    activeFilter="active"
                />
            );
            expect(
                screen.getByText('Try adjusting your search or filter.')
            ).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: BOOKING ROW DISPLAY (lines 146-195)
    // ════════════════════════════════════════════════════
    describe('Booking Row Display', () => {

        test('shows spot title in row', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ spot_title: 'Airport Parking' }),
                    ]}
                />
            );
            expect(screen.getByText('Airport Parking')).toBeTruthy();
        });

        test('shows driver name in row', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ driver_name: 'Alice Driver' }),
                    ]}
                />
            );
            expect(screen.getByText('Alice Driver')).toBeTruthy();
        });

        test('shows vehicle type when provided', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ vehicle_type: 'Bike' }),
                    ]}
                />
            );
            expect(screen.getByText('Bike')).toBeTruthy();
        });

        test('shows vehicle number when provided', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ vehicle_number: 'XYZ-9999' }),
                    ]}
                />
            );
            expect(screen.getByText('XYZ-9999')).toBeTruthy();
        });

        test('hides vehicle type when null', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ vehicle_type: null }),
                    ]}
                />
            );
            // No car icon text visible
            expect(screen.queryByText('Car')).toBeNull();
        });

        test('hides vehicle number when null', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ vehicle_number: null }),
                    ]}
                />
            );
            expect(screen.queryByText('ABC-1234')).toBeNull();
        });

        test('shows Earnings label', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[makeBooking()]}
                />
            );
            expect(screen.getByText('Earnings')).toBeTruthy();
        });

        test('shows seller amount correctly', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ seller_amount_xrp: '3.200000' }),
                    ]}
                />
            );
            expect(screen.getByText('3.20')).toBeTruthy();
            expect(screen.getByText('XRP')).toBeTruthy();
        });

        test('shows booking status badge', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({ booking_status: 'active' }),
                    ]}
                />
            );

            // 'Active' appears in filter button AND status badge
            // Use getAllByText and check at least one is a span
            const elements = screen.getAllByText('Active');
            const badge = elements.find((el) => el.tagName === 'SPAN');
            expect(badge).toBeTruthy();
        });

        test('shows ChevronDown icon initially', () => {
            const { container } = render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[makeBooking()]}
                />
            );
            // ChevronDown should be visible (not expanded)
            const chevron = container.querySelector(
                '.lucide-chevron-down'
            );
            expect(chevron).toBeTruthy();
        });

        test('renders multiple bookings', () => {
            render(
                <BookingList
                    {...defaultProps}
                    filteredBookings={[
                        makeBooking({
                            id: 'b1',
                            spot_title: 'Parking A',
                        }),
                        makeBooking({
                            id: 'b2',
                            spot_title: 'Parking B',
                        }),
                        makeBooking({
                            id: 'b3',
                            spot_title: 'Parking C',
                        }),
                    ]}
                />
            );
            expect(screen.getByText('Parking A')).toBeTruthy();
            expect(screen.getByText('Parking B')).toBeTruthy();
            expect(screen.getByText('Parking C')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 5: ROW CLICK - EXPAND/COLLAPSE (lines 196-250)
    // ════════════════════════════════════════════════════
    describe('Row Click - Expand/Collapse', () => {

        test('click row shows expanded details', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ driver_email: 'john@test.com' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(screen.getByText('Driver')).toBeTruthy();
            expect(screen.getByText('john@test.com')).toBeTruthy();
        });

        test('click row shows Vehicle section', () => {
            render(
                <BookingListWithState
                    bookings={[makeBooking({ vehicle_type: 'Car' })]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(screen.getByText('Vehicle')).toBeTruthy();
        });

        test('click row shows Duration & Rate section', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            expected_duration_hours: '2.00',
                            price_per_hour: '2.00',
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(screen.getByText('Duration & Rate')).toBeTruthy();
            expect(screen.getByText('2.0 hrs')).toBeTruthy();
        });

        test('click row shows Payment section', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ payment_status: 'unpaid' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(screen.getByText('Payment')).toBeTruthy();
        });

        test('click row shows booking ID', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ id: 'booking-uuid-test' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(
                screen.getByText('booking-uuid-test')
            ).toBeTruthy();
        });

        test('click again collapses expanded row', async () => {
            render(
                <BookingListWithState
                    bookings={[makeBooking()]}
                />
            );

            // Expand
            fireEvent.click(screen.getByText('City Parking'));
            expect(screen.getByText('Driver')).toBeTruthy();

            // Collapse
            fireEvent.click(screen.getByText('City Parking'));
            await waitFor(() => {
                expect(screen.queryByText('Driver')).toBeNull();
            });
        });

        test('shows ChevronUp when expanded', () => {
            const { container } = render(
                <BookingListWithState
                    bookings={[makeBooking()]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            const chevronUp = container.querySelector(
                '.lucide-chevron-up'
            );
            expect(chevronUp).toBeTruthy();
        });

        test('shows driver email in expanded view', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ driver_email: 'alice@example.com' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(
                screen.getByText('alice@example.com')
            ).toBeTruthy();
        });

        test('shows "Not provided" when no vehicle info', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            vehicle_type: null,
                            vehicle_number: null,
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(screen.getByText('Not provided')).toBeTruthy();
        });

        test('shows vehicle type in expanded view', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ vehicle_type: 'Bike' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            // 'Bike' appears in both row and expanded
            const bikeElements = screen.getAllByText('Bike');
            expect(bikeElements.length).toBeGreaterThan(0);
        });

        test('shows vehicle number in expanded view', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ vehicle_number: 'XYZ-5678' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            const numElements = screen.getAllByText('XYZ-5678');
            expect(numElements.length).toBeGreaterThan(0);
        });

        test('shows actual duration when available', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            expected_duration_hours: '2.00',
                            actual_duration_hours: '2.50', // stayed longer
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            // Shows actual (2.5) not expected (2.0)
            expect(screen.getByText('2.5 hrs')).toBeTruthy();
        });

        test('falls back to expected duration when actual is null', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            expected_duration_hours: '3.00',
                            actual_duration_hours: null,
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(screen.getByText('3.0 hrs')).toBeTruthy();
        });

        test('shows price per hour in expanded view', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ price_per_hour: '2.00' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(
                screen.getByText('@ 2.00 XRP/hr')
            ).toBeTruthy();
        });

        test('shows Booked date in footer', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            created_at: '2025-06-15T08:00:00Z',
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(
                screen.getByText(/Booked/)
            ).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 6: FILTER TABS (toolbar section)
    // ════════════════════════════════════════════════════
    describe('Filter Tabs', () => {

        test('shows all 4 filter tabs', () => {
            render(<BookingList {...defaultProps} />);

            expect(screen.getByText('All')).toBeTruthy();
            expect(screen.getByText('Active')).toBeTruthy();
            expect(screen.getByText('Confirmed')).toBeTruthy();
            expect(screen.getByText('Completed')).toBeTruthy();
        });

        test('calls setActiveFilter when tab clicked', () => {
            const setActiveFilter = jest.fn();
            render(
                <BookingList
                    {...defaultProps}
                    setActiveFilter={setActiveFilter}
                />
            );

            // Use getByRole('button') to be specific
            fireEvent.click(
                screen.getByRole('button', { name: 'Active' })
            );
            expect(setActiveFilter).toHaveBeenCalledWith('active');
        });


        test('calls setActiveFilter with "all" for All tab', () => {
            const setActiveFilter = jest.fn();
            render(
                <BookingList
                    {...defaultProps}
                    setActiveFilter={setActiveFilter}
                    activeFilter="active"
                />
            );

            fireEvent.click(screen.getByText('All'));
            expect(setActiveFilter).toHaveBeenCalledWith('all');
        });

        test('calls setActiveFilter with "confirmed"', () => {
            const setActiveFilter = jest.fn();
            render(
                <BookingList
                    {...defaultProps}
                    setActiveFilter={setActiveFilter}
                />
            );

            fireEvent.click(screen.getByText('Confirmed'));
            expect(setActiveFilter).toHaveBeenCalledWith('confirmed');
        });

        test('calls setActiveFilter with "completed"', () => {
            const setActiveFilter = jest.fn();
            render(
                <BookingList
                    {...defaultProps}
                    setActiveFilter={setActiveFilter}
                />
            );

            fireEvent.click(screen.getByText('Completed'));
            expect(setActiveFilter).toHaveBeenCalledWith('completed');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 7: SEARCH INPUT
    // ════════════════════════════════════════════════════
    describe('Search Input', () => {

        test('shows search input', () => {
            render(<BookingList {...defaultProps} />);

            expect(
                screen.getByPlaceholderText('Search spot, driver, plate...')
            ).toBeTruthy();
        });

        test('calls setSearchQuery when typing', () => {
            const setSearchQuery = jest.fn();
            render(
                <BookingList
                    {...defaultProps}
                    setSearchQuery={setSearchQuery}
                />
            );

            const input = screen.getByPlaceholderText(
                'Search spot, driver, plate...'
            );
            fireEvent.change(input, { target: { value: 'City' } });

            expect(setSearchQuery).toHaveBeenCalledWith('City');
        });

        test('shows current search value', () => {
            render(
                <BookingList
                    {...defaultProps}
                    searchQuery="Airport"
                />
            );

            const input = screen.getByPlaceholderText(
                'Search spot, driver, plate...'
            ) as HTMLInputElement;

            expect(input.value).toBe('Airport');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 8: PAYMENT STATUS IN EXPANDED
    // ════════════════════════════════════════════════════
    describe('Payment Status in Expanded View', () => {

        test('shows Unpaid badge in expanded', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ payment_status: 'unpaid' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            const unpaidElements = screen.getAllByText('Unpaid');
            expect(unpaidElements.length).toBeGreaterThan(0);
        });

        test('shows Split Completed badge in expanded', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ payment_status: 'split_completed' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            expect(
                screen.getByText('Split Completed')
            ).toBeTruthy();
        });

        test('shows Paid badge in expanded', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({ payment_status: 'paid' }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('City Parking'));

            const paidElements = screen.getAllByText('Paid');
            expect(paidElements.length).toBeGreaterThan(0);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 9: MULTIPLE BOOKINGS - EXPAND ONE AT A TIME
    // ════════════════════════════════════════════════════
    describe('Multiple Bookings - Expand Behavior', () => {

        test('expanding one booking shows its details', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            id: 'b1',
                            spot_title: 'Parking Alpha',
                            driver_email: 'alpha@test.com',
                        }),
                        makeBooking({
                            id: 'b2',
                            spot_title: 'Parking Beta',
                            driver_email: 'beta@test.com',
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('Parking Alpha'));

            expect(screen.getByText('alpha@test.com')).toBeTruthy();
            expect(
                screen.queryByText('beta@test.com')
            ).toBeNull();
        });

        test('expanding second booking shows its details', () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            id: 'b1',
                            spot_title: 'Parking Alpha',
                            driver_email: 'alpha@test.com',
                        }),
                        makeBooking({
                            id: 'b2',
                            spot_title: 'Parking Beta',
                            driver_email: 'beta@test.com',
                        }),
                    ]}
                />
            );

            fireEvent.click(screen.getByText('Parking Beta'));

            expect(screen.getByText('beta@test.com')).toBeTruthy();
            expect(
                screen.queryByText('alpha@test.com')
            ).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 10: INTEGRATION - FULL FLOW
    // ════════════════════════════════════════════════════
    describe('Integration - Full Flow', () => {

        // ── Fix 1: filter then expand booking ────────────────
        test('filter then expand booking', async () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            id: 'b1',
                            spot_title: 'Active Spot',
                            booking_status: 'active',
                            driver_email: 'active@test.com',
                        }),
                        makeBooking({
                            id: 'b2',
                            spot_title: 'Pending Spot',
                            booking_status: 'pending',
                            driver_email: 'pending@test.com',
                        }),
                    ]}
                />
            );

            // Use getByRole('button') to target the filter button
            fireEvent.click(
                screen.getByRole('button', { name: 'Active' })
            );

            // Only Active Spot visible
            await waitFor(() => {
                expect(screen.queryByText('Pending Spot')).toBeNull();
            });

            // Expand the active booking
            fireEvent.click(screen.getByText('Active Spot'));
            expect(screen.getByText('active@test.com')).toBeTruthy();
        });

        test('search then expand booking', async () => {
            render(
                <BookingListWithState
                    bookings={[
                        makeBooking({
                            id: 'b1',
                            spot_title: 'Mall Parking',
                            driver_name: 'Bob Smith',
                            driver_email: 'bob@test.com',
                        }),
                        makeBooking({
                            id: 'b2',
                            spot_title: 'Airport Parking',
                            driver_name: 'Alice Jones',
                            driver_email: 'alice@test.com',
                        }),
                    ]}
                />
            );

            // Search for Bob
            const input = screen.getByPlaceholderText(
                'Search spot, driver, plate...'
            );
            fireEvent.change(input, { target: { value: 'Bob' } });

            await waitFor(() => {
                expect(
                    screen.queryByText('Airport Parking')
                ).toBeNull();
            });

            // Expand Bob's booking
            fireEvent.click(screen.getByText('Mall Parking'));
            expect(screen.getByText('bob@test.com')).toBeTruthy();
        });
    });
});