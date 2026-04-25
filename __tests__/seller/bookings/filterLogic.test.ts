// __tests__/seller/bookings/filterLogic.test.ts

import { Booking } from '@/app/(protected)/seller/bookings/Components/BookingList';

// ── Helper: create fake booking ───────────────────────
const makeBooking = (overrides: Partial<Booking> = {}): Booking => ({
    id: 'booking-uuid-1',
    spot_title: 'City Parking',
    driver_name: 'John Driver',
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

// ── Filter function (same as Main.tsx) ────────────────
const filterBookings = (
    bookings: Booking[],
    activeFilter: string,
    searchQuery: string,
): Booking[] => {
    let filtered = bookings;

    if (activeFilter !== 'all') {
        filtered = filtered.filter(
            (b) => b.booking_status === activeFilter
        );
    }

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
            (b) =>
                b.spot_title?.toLowerCase().includes(q) ||
                b.driver_name?.toLowerCase().includes(q) ||
                b.driver_email?.toLowerCase().includes(q) ||
                b.vehicle_number?.toLowerCase().includes(q) ||
                b.vehicle_type?.toLowerCase().includes(q)
        );
    }

    return filtered;
};

// ── Stats function (same as Main.tsx) ─────────────────
const calculateStats = (bookings: Booking[]) => ({
    total: bookings.length,
    active: bookings.filter(
        (b) => b.booking_status === 'active').length,
    confirmed: bookings.filter(
        (b) => b.booking_status === 'confirmed').length,
    completed: bookings.filter(
        (b) => b.booking_status === 'completed').length,
});

describe('Booking Filter Logic', () => {

    // ── Sample data ────────────────────────────────────
    const sampleBookings: Booking[] = [
        makeBooking({
            id: '1',
            booking_status: 'active',
            spot_title: 'City Parking',
            driver_name: 'John Smith',
            driver_email: 'john.smith@test.com',
            vehicle_number: 'ABC-1234',
            vehicle_type: 'Car',
        }),
        makeBooking({
            id: '2',
            booking_status: 'confirmed',
            spot_title: 'Airport Parking',
            driver_name: 'Jane Doe',
            driver_email: 'jane.doe@test.com',
            vehicle_number: 'XYZ-9999',
            vehicle_type: 'Bike',
        }),
        makeBooking({
            id: '3',
            booking_status: 'completed',
            spot_title: 'Mall Parking',
            driver_name: 'Bob Wilson',
            driver_email: 'bob.wilson@test.com',
            vehicle_number: 'DEF-5678',
            vehicle_type: 'Car',
        }),
        makeBooking({
            id: '4',
            booking_status: 'pending',
            spot_title: 'Hospital Parking',
            driver_name: 'Alice Brown',
            driver_email: 'alice.brown@test.com',
            vehicle_number: 'GHI-3456',
            vehicle_type: 'Van',
        }),
    ];

    // ════════════════════════════════════════════════════
    // GROUP 1: STATUS FILTER
    // ════════════════════════════════════════════════════
    describe('Status Filter', () => {

        test('returns all bookings when filter is "all"', () => {
            const result = filterBookings(sampleBookings, 'all', '');
            expect(result).toHaveLength(4);
        });

        test('filters active bookings correctly', () => {
            const result = filterBookings(sampleBookings, 'active', '');
            expect(result).toHaveLength(1);
            expect(result[0].booking_status).toBe('active');
        });

        test('filters confirmed bookings correctly', () => {
            const result = filterBookings(sampleBookings, 'confirmed', '');
            expect(result).toHaveLength(1);
            expect(result[0].booking_status).toBe('confirmed');
        });

        test('filters completed bookings correctly', () => {
            const result = filterBookings(sampleBookings, 'completed', '');
            expect(result).toHaveLength(1);
            expect(result[0].booking_status).toBe('completed');
        });

        test('returns empty when no bookings match filter', () => {
            const result = filterBookings(sampleBookings, 'cancelled', '');
            expect(result).toHaveLength(0);
        });

        test('filter is case sensitive for status', () => {
            // 'Active' (capital A) should not match 'active'
            const result = filterBookings(
                sampleBookings, 'Active', '');
            expect(result).toHaveLength(0);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: SEARCH FILTER
    // ════════════════════════════════════════════════════
    describe('Search Filter', () => {

        test('returns all when search is only whitespace', () => {
            const result = filterBookings(sampleBookings, 'all', '   ');
            expect(result).toHaveLength(4);
        });
        test('searches by spot title', () => {
            const result = filterBookings(
                sampleBookings, 'all', 'City');
            expect(result).toHaveLength(1);
            expect(result[0].spot_title).toBe('City Parking');
        });

        test('searches by driver name', () => {
            const result = filterBookings(sampleBookings, 'all', 'Jane');
            expect(result).toHaveLength(1);
            expect(result[0].driver_name).toBe('Jane Doe');
        });

        test('searches by vehicle number', () => {
            const result = filterBookings(
                sampleBookings, 'all', 'ABC-1234');
            expect(result).toHaveLength(1);
            expect(result[0].vehicle_number).toBe('ABC-1234');
        });

        test('searches by vehicle type', () => {
            const result = filterBookings(
                sampleBookings, 'all', 'bike');
            expect(result).toHaveLength(1);
            expect(result[0].vehicle_type).toBe('Bike');
        });

        test('search is case insensitive', () => {
            // 'CITY' matches 'City Parking'
            const result = filterBookings(
                sampleBookings, 'all', 'CITY');
            expect(result).toHaveLength(1);
        });

        test('returns all when search is only whitespace', () => {
            const result = filterBookings(sampleBookings, 'all', '   ');
            expect(result).toHaveLength(4);
        });

        test('exact text search works correctly', () => {
            const result = filterBookings(sampleBookings, 'all', 'John');
            expect(result).toHaveLength(1);
            expect(result[0].driver_name).toBe('John Smith'); // ✅ was 'John'
        });
        test('returns empty when no match', () => {
            const result = filterBookings(
                sampleBookings, 'all', 'nonexistent');
            expect(result).toHaveLength(0);
        });

        test('partial search works', () => {
            // 'Park' matches 'City Parking', 'Airport Parking', etc.
            const result = filterBookings(
                sampleBookings, 'all', 'Parking');
            expect(result).toHaveLength(4); // all have "Parking"
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: COMBINED FILTER + SEARCH
    // ════════════════════════════════════════════════════
    describe('Combined Filter + Search', () => {

        test('filter by status AND search by name', () => {
            const result = filterBookings(sampleBookings, 'active', 'John');
            expect(result).toHaveLength(1);
            expect(result[0].booking_status).toBe('active');
            expect(result[0].driver_name).toBe('John Smith'); // ✅ was 'John'
        });
        test('filter + search returns empty when no match', () => {
            // Active bookings with "Jane" (Jane is confirmed, not active)
            const result = filterBookings(
                sampleBookings, 'active', 'Jane');
            expect(result).toHaveLength(0);
        });

        test('all filter with search still searches', () => {
            const result = filterBookings(sampleBookings, 'all', 'Bob');
            expect(result).toHaveLength(1);
            expect(result[0].driver_name).toBe('Bob Wilson'); // ✅ was 'Bob'
        });

    });

    // ════════════════════════════════════════════════════
    // GROUP 4: STATS CALCULATION
    // ════════════════════════════════════════════════════
    describe('Stats Calculation', () => {

        test('total counts all bookings', () => {
            const stats = calculateStats(sampleBookings);
            expect(stats.total).toBe(4);
        });

        test('active count is correct', () => {
            const stats = calculateStats(sampleBookings);
            expect(stats.active).toBe(1);
        });

        test('confirmed count is correct', () => {
            const stats = calculateStats(sampleBookings);
            expect(stats.confirmed).toBe(1);
        });

        test('completed count is correct', () => {
            const stats = calculateStats(sampleBookings);
            expect(stats.completed).toBe(1);
        });

        test('stats are zero when no bookings', () => {
            const stats = calculateStats([]);
            expect(stats.total).toBe(0);
            expect(stats.active).toBe(0);
            expect(stats.confirmed).toBe(0);
            expect(stats.completed).toBe(0);
        });

        test('stats correct with multiple same status', () => {
            const multiActive = [
                makeBooking({ id: '1', booking_status: 'active' }),
                makeBooking({ id: '2', booking_status: 'active' }),
                makeBooking({ id: '3', booking_status: 'completed' }),
            ];
            const stats = calculateStats(multiActive);

            expect(stats.total).toBe(3);
            expect(stats.active).toBe(2);
            expect(stats.completed).toBe(1);
        });

        test('pending bookings not counted in active/confirmed/completed', () => {
            const pendingOnly = [
                makeBooking({ id: '1', booking_status: 'pending' }),
                makeBooking({ id: '2', booking_status: 'pending' }),
            ];
            const stats = calculateStats(pendingOnly);

            expect(stats.total).toBe(2);
            expect(stats.active).toBe(0);
            expect(stats.confirmed).toBe(0);
            expect(stats.completed).toBe(0);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 5: EARNINGS CALCULATION
    // ════════════════════════════════════════════════════
    describe('Earnings Calculation', () => {

        test('seller amount is 80% of total', () => {
            const booking = makeBooking({
                total_price_xrp: '4.000000',
                admin_fee_xrp: '0.800000',
                seller_amount_xrp: '3.200000',
            });

            const total = parseFloat(booking.total_price_xrp);
            const admin = parseFloat(booking.admin_fee_xrp);
            const seller = parseFloat(booking.seller_amount_xrp);

            expect(seller).toBeCloseTo(total * 0.80, 4);
            expect(admin).toBeCloseTo(total * 0.20, 4);
        });

        test('admin + seller = total', () => {
            const booking = makeBooking({
                total_price_xrp: '10.000000',
                admin_fee_xrp: '2.000000',
                seller_amount_xrp: '8.000000',
            });

            const total = parseFloat(booking.total_price_xrp);
            const admin = parseFloat(booking.admin_fee_xrp);
            const seller = parseFloat(booking.seller_amount_xrp);

            expect(admin + seller).toBeCloseTo(total, 4);
        });

        test('seller amount formatted to 2 decimals for display', () => {
            const booking = makeBooking({
                seller_amount_xrp: '3.200000',
            });

            const display = parseFloat(
                booking.seller_amount_xrp || '0'
            ).toFixed(2);

            expect(display).toBe('3.20');
        });

        test('handles null seller amount safely', () => {
            const booking = makeBooking({
                seller_amount_xrp: '',
            });

            const amount = parseFloat(
                booking.seller_amount_xrp || '0'
            ).toFixed(2);

            expect(amount).toBe('0.00');
        });

        test('duration uses actual over expected when available', () => {
            const booking = makeBooking({
                expected_duration_hours: '2.00',
                actual_duration_hours: '2.50', // stayed 30min extra
            });

            // UI uses: actual_duration_hours || expected_duration_hours
            const duration = parseFloat(
                booking.actual_duration_hours ||
                booking.expected_duration_hours
            ).toFixed(1);

            expect(duration).toBe('2.5');
        });

        test('duration falls back to expected when actual is null', () => {
            const booking = makeBooking({
                expected_duration_hours: '2.00',
                actual_duration_hours: null,
            });

            const duration = parseFloat(
                booking.actual_duration_hours ||
                booking.expected_duration_hours
            ).toFixed(1);

            expect(duration).toBe('2.0');
        });
    });
});