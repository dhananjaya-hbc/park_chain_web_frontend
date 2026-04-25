// __tests__/admin/bookings/adminBookingsHelpers.test.ts

// ── Same logic used in BookingTable.tsx ───────────────

// ── formatDate ────────────────────────────────────────
function formatDate(dateStr: string): string {
  const date   = new Date(dateStr);
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ── StatusBadge logic ─────────────────────────────────
function getBookingStatusClass(status: string): string {
  const styles: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active:    'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
}

function getPaymentStatusClass(status: string): string {
  const styles: Record<string, string> = {
    unpaid:         'bg-gray-100 text-gray-800',
    processing:     'bg-yellow-100 text-yellow-800',
    paid:           'bg-blue-100 text-blue-800',
    split_completed:'bg-green-100 text-green-800',
    failed:         'bg-red-100 text-red-800',
    refunded:       'bg-purple-100 text-purple-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
}

function formatStatusText(status: string): string {
  return status
    .replace('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Filter logic ──────────────────────────────────────
interface Booking {
  id:              string;
  driver_name:     string;
  driver_email?:   string;
  spot_title:      string;
  owner_name:      string;
  vehicle_type?:   string;
  booking_status:  string;
  payment_status:  string;
  price_per_hour:  string;
  expected_duration_hours: string;
  total_price_xrp:    string;
  admin_fee_xrp:      string;
  seller_amount_xrp:  string;
  start_time:  string;
  end_time:    string;
  created_at:  string;
}

function filterBookings(
  bookings:     Booking[],
  statusFilter: string,
  searchQuery:  string,
): Booking[] {
  let filtered = bookings;

  if (statusFilter !== 'all') {
    filtered = filtered.filter(
      (b) => b.booking_status === statusFilter
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.driver_name?.toLowerCase().includes(q)  ||
        b.spot_title?.toLowerCase().includes(q)   ||
        b.owner_name?.toLowerCase().includes(q)   ||
        b.vehicle_type?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q)
    );
  }

  return filtered;
}

// ── Pagination ────────────────────────────────────────
const ADMIN_BOOKINGS_ITEMS_PER_PAGE = 10;

function getTotalPages(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / ADMIN_BOOKINGS_ITEMS_PER_PAGE));
}

function paginateBookings(
  bookings:    Booking[],
  currentPage: number,
): Booking[] {
  return bookings.slice(
    (currentPage - 1) * ADMIN_BOOKINGS_ITEMS_PER_PAGE,
    currentPage * ADMIN_BOOKINGS_ITEMS_PER_PAGE,
  );
}

// ── Stats calculation ─────────────────────────────────
function calculateStats(bookings: Booking[]) {
  return {
    total:     bookings.length,
    active:    bookings.filter(
        (b) => b.booking_status === 'active').length,
    completed: bookings.filter(
        (b) => b.booking_status === 'completed').length,
  };
}

// ── Helper: make booking ──────────────────────────────
const makeBooking = (
  overrides: Partial<Booking> = {}
): Booking => ({
  id:                      'booking-uuid-1',
  driver_name:             'John Smith',
  driver_email:            'john@test.com',
  spot_title:              'City Parking',
  owner_name:              'Jane Owner',
  vehicle_type:            'Car',
  booking_status:          'pending',
  payment_status:          'unpaid',
  price_per_hour:          '2.00',
  expected_duration_hours: '2.00',
  total_price_xrp:         '4.000000',
  admin_fee_xrp:           '0.800000',
  seller_amount_xrp:       '3.200000',
  start_time:              '2025-06-15T09:00:00Z',
  end_time:                '2025-06-15T11:00:00Z',
  created_at:              '2025-06-15T08:00:00Z',
  ...overrides,
});

// ══════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════
describe('Admin Bookings Helper Functions', () => {

  // ════════════════════════════════════════════════════
  // GROUP 1: formatDate()
  // ════════════════════════════════════════════════════
  describe('formatDate()', () => {

    test('formats June date correctly', () => {
      const result = formatDate('2025-06-15T12:00:00Z');
      expect(result).toContain('Jun');
      expect(result).toContain('2025');
    });

    test('returns "Mon DD, YYYY" format', () => {
      const result = formatDate('2025-06-15T12:00:00Z');
      expect(result).toMatch(/[A-Z][a-z]{2} \d+, \d{4}/);
    });

    test('all 12 months formatted correctly', () => {
      const months = [
        'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec',
      ];
      months.forEach((month, index) => {
        const num    = String(index + 1).padStart(2, '0');
        const result = formatDate(`2025-${num}-15T12:00:00Z`);
        expect(result).toContain(month);
      });
    });

    test('contains comma separator', () => {
      const result = formatDate('2025-06-15T12:00:00Z');
      expect(result).toContain(',');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: StatusBadge - Booking Status Colors
  // ════════════════════════════════════════════════════
  describe('Booking Status Colors', () => {

    test('pending → yellow styling', () => {
      expect(getBookingStatusClass('pending'))
        .toContain('yellow');
    });

    test('confirmed → blue styling', () => {
      expect(getBookingStatusClass('confirmed'))
        .toContain('blue');
    });

    test('active → green styling', () => {
      expect(getBookingStatusClass('active'))
        .toContain('green');
    });

    test('completed → emerald styling', () => {
      expect(getBookingStatusClass('completed'))
        .toContain('emerald');
    });

    test('cancelled → red styling', () => {
      expect(getBookingStatusClass('cancelled'))
        .toContain('red');
    });

    test('unknown status → gray default', () => {
      expect(getBookingStatusClass('unknown'))
        .toContain('gray');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: StatusBadge - Payment Status Colors
  // ════════════════════════════════════════════════════
  describe('Payment Status Colors', () => {

    test('unpaid → gray styling', () => {
      expect(getPaymentStatusClass('unpaid'))
        .toContain('gray');
    });

    test('processing → yellow styling', () => {
      expect(getPaymentStatusClass('processing'))
        .toContain('yellow');
    });

    test('paid → blue styling', () => {
      expect(getPaymentStatusClass('paid'))
        .toContain('blue');
    });

    test('split_completed → green styling', () => {
      expect(getPaymentStatusClass('split_completed'))
        .toContain('green');
    });

    test('failed → red styling', () => {
      expect(getPaymentStatusClass('failed'))
        .toContain('red');
    });

    test('refunded → purple styling', () => {
      expect(getPaymentStatusClass('refunded'))
        .toContain('purple');
    });

    test('unknown → gray default', () => {
      expect(getPaymentStatusClass('unknown'))
        .toContain('gray');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: formatStatusText()
  // ════════════════════════════════════════════════════
  describe('formatStatusText()', () => {

    test('capitalizes first letter', () => {
      expect(formatStatusText('pending')).toBe('Pending');
    });

    test('replaces underscore with space', () => {
      expect(formatStatusText('split_completed'))
        .toBe('Split Completed');
    });

    test('capitalizes each word', () => {
      expect(formatStatusText('split_completed'))
        .toBe('Split Completed');
    });

    test('all booking statuses format correctly', () => {
      expect(formatStatusText('pending')).toBe('Pending');
      expect(formatStatusText('confirmed')).toBe('Confirmed');
      expect(formatStatusText('active')).toBe('Active');
      expect(formatStatusText('completed')).toBe('Completed');
      expect(formatStatusText('cancelled')).toBe('Cancelled');
    });

    test('all payment statuses format correctly', () => {
      expect(formatStatusText('unpaid')).toBe('Unpaid');
      expect(formatStatusText('processing')).toBe('Processing');
      expect(formatStatusText('paid')).toBe('Paid');
      expect(formatStatusText('split_completed'))
        .toBe('Split Completed');
      expect(formatStatusText('failed')).toBe('Failed');
      expect(formatStatusText('refunded')).toBe('Refunded');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: filterBookings() - Status Filter
  // ════════════════════════════════════════════════════
  describe('filterBookings() - Status Filter', () => {

    const sampleBookings = [
      makeBooking({ id: '1', booking_status: 'pending',   driver_name: 'Alice' }),
      makeBooking({ id: '2', booking_status: 'confirmed', driver_name: 'Bob' }),
      makeBooking({ id: '3', booking_status: 'active',    driver_name: 'Carol' }),
      makeBooking({ id: '4', booking_status: 'completed', driver_name: 'Dave' }),
      makeBooking({ id: '5', booking_status: 'cancelled', driver_name: 'Eve' }),
    ];

    test('returns all when filter is "all"', () => {
      const result = filterBookings(sampleBookings, 'all', '');
      expect(result).toHaveLength(5);
    });

    test('filters pending bookings', () => {
      const result = filterBookings(
          sampleBookings, 'pending', '');
      expect(result).toHaveLength(1);
      expect(result[0].booking_status).toBe('pending');
    });

    test('filters confirmed bookings', () => {
      const result = filterBookings(
          sampleBookings, 'confirmed', '');
      expect(result).toHaveLength(1);
      expect(result[0].booking_status).toBe('confirmed');
    });

    test('filters active bookings', () => {
      const result = filterBookings(
          sampleBookings, 'active', '');
      expect(result).toHaveLength(1);
      expect(result[0].booking_status).toBe('active');
    });

    test('filters completed bookings', () => {
      const result = filterBookings(
          sampleBookings, 'completed', '');
      expect(result).toHaveLength(1);
      expect(result[0].booking_status).toBe('completed');
    });

    test('filters cancelled bookings', () => {
      const result = filterBookings(
          sampleBookings, 'cancelled', '');
      expect(result).toHaveLength(1);
      expect(result[0].booking_status).toBe('cancelled');
    });

    test('returns empty for unmatched status', () => {
      const result = filterBookings(
          sampleBookings, 'refunded', '');
      expect(result).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 6: filterBookings() - Search
  // ════════════════════════════════════════════════════
  describe('filterBookings() - Search', () => {

    const sampleBookings = [
      makeBooking({
        id:           'uuid-1',
        driver_name:  'John Smith',
        spot_title:   'City Parking',
        owner_name:   'Alice Owner',
        vehicle_type: 'Car',
        driver_email: 'john@test.com',
      }),
      makeBooking({
        id:           'uuid-2',
        driver_name:  'Jane Doe',
        spot_title:   'Airport Parking',
        owner_name:   'Bob Owner',
        vehicle_type: 'Bike',
        driver_email: 'jane@test.com',
      }),
      makeBooking({
        id:           'uuid-3',
        driver_name:  'Bob Wilson',
        spot_title:   'Mall Parking',
        owner_name:   'Carol Owner',
        vehicle_type: 'Van',
        driver_email: 'bob@test.com',
      }),
    ];

    test('returns all when search is empty', () => {
      const result = filterBookings(sampleBookings, 'all', '');
      expect(result).toHaveLength(3);
    });

    test('searches by driver name', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'John');
      expect(result).toHaveLength(1);
      expect(result[0].driver_name).toBe('John Smith');
    });

    test('searches by spot title', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'Airport');
      expect(result).toHaveLength(1);
      expect(result[0].spot_title).toBe('Airport Parking');
    });

    test('searches by owner name', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'Carol');
      expect(result).toHaveLength(1);
      expect(result[0].owner_name).toBe('Carol Owner');
    });

    test('searches by vehicle type', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'Bike');
      expect(result).toHaveLength(1);
      expect(result[0].vehicle_type).toBe('Bike');
    });

    test('searches by booking ID', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'uuid-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('uuid-1');
    });

    test('search is case insensitive', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'JOHN');
      expect(result).toHaveLength(1);
      expect(result[0].driver_name).toBe('John Smith');
    });

    test('returns empty when no match', () => {
      const result = filterBookings(
          sampleBookings, 'all', 'nonexistent');
      expect(result).toHaveLength(0);
    });

    test('partial search works', () => {
      // 'Parking' matches all 3 spot titles
      const result = filterBookings(
          sampleBookings, 'all', 'Parking');
      expect(result).toHaveLength(3);
    });

    test('whitespace-only search returns all', () => {
      const result = filterBookings(
          sampleBookings, 'all', '   ');
      expect(result).toHaveLength(3);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 7: Combined Filter + Search
  // ════════════════════════════════════════════════════
  describe('filterBookings() - Combined', () => {

    const sampleBookings = [
      makeBooking({
        id:            '1',
        booking_status: 'active',
        driver_name:   'John Smith',
      }),
      makeBooking({
        id:            '2',
        booking_status: 'completed',
        driver_name:   'John Doe',
      }),
      makeBooking({
        id:            '3',
        booking_status: 'active',
        driver_name:   'Jane Wilson',
      }),
    ];

    test('status + search returns correct results', () => {
      // Active bookings with "John"
      const result = filterBookings(
          sampleBookings, 'active', 'John');
      expect(result).toHaveLength(1);
      expect(result[0].driver_name).toBe('John Smith');
    });

    test('status filter removes non-matching status', () => {
      // Completed with "John" → only John Doe (id=2)
      const result = filterBookings(
          sampleBookings, 'completed', 'John');
      expect(result).toHaveLength(1);
      expect(result[0].driver_name).toBe('John Doe');
    });

    test('no results when filter + search have no overlap', () => {
      // Active bookings with 'Doe' (Doe is completed not active)
      const result = filterBookings(
          sampleBookings, 'active', 'Doe');
      expect(result).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 8: PAGINATION
  // ════════════════════════════════════════════════════
  describe('Pagination (10 per page)', () => {

    const make15Bookings = (): Booking[] =>
      Array.from({ length: 15 }, (_, i) =>
        makeBooking({ id: String(i + 1) })
      );

    test('getTotalPages returns 1 for 0 items', () => {
      expect(getTotalPages(0)).toBe(1);
    });

    test('getTotalPages returns 1 for 10 items', () => {
      expect(getTotalPages(10)).toBe(1);
    });

    test('getTotalPages returns 2 for 11 items', () => {
      expect(getTotalPages(11)).toBe(2);
    });

    test('getTotalPages returns 2 for 15 items', () => {
      expect(getTotalPages(15)).toBe(2);
    });

    test('getTotalPages returns 3 for 21 items', () => {
      expect(getTotalPages(21)).toBe(3);
    });

    test('page 1 returns first 10 items', () => {
      const items  = make15Bookings();
      const result = paginateBookings(items, 1);
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe('1');
      expect(result[9].id).toBe('10');
    });

    test('page 2 returns remaining 5 items', () => {
      const items  = make15Bookings();
      const result = paginateBookings(items, 2);
      expect(result).toHaveLength(5);
      expect(result[0].id).toBe('11');
      expect(result[4].id).toBe('15');
    });

    test('pagination text shows correct range', () => {
      const total       = 15;
      const currentPage = 1;
      const start       = (currentPage - 1) * ADMIN_BOOKINGS_ITEMS_PER_PAGE + 1;
      const end         = Math.min(
          currentPage * ADMIN_BOOKINGS_ITEMS_PER_PAGE, total);

      expect(start).toBe(1);
      expect(end).toBe(10);
    });

    test('last page pagination text correct', () => {
      const total       = 15;
      const currentPage = 2;
      const start       = (currentPage - 1) * ADMIN_BOOKINGS_ITEMS_PER_PAGE + 1;
      const end         = Math.min(
          currentPage * ADMIN_BOOKINGS_ITEMS_PER_PAGE, total);

      expect(start).toBe(11);
      expect(end).toBe(15);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 9: STATS CALCULATION
  // ════════════════════════════════════════════════════
  describe('calculateStats()', () => {

    test('returns zeros for empty bookings', () => {
      const stats = calculateStats([]);
      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.completed).toBe(0);
    });

    test('counts total bookings', () => {
      const bookings = [
        makeBooking({ booking_status: 'pending' }),
        makeBooking({ booking_status: 'active' }),
        makeBooking({ booking_status: 'completed' }),
      ];
      const stats = calculateStats(bookings);
      expect(stats.total).toBe(3);
    });

    test('counts active bookings correctly', () => {
      const bookings = [
        makeBooking({ booking_status: 'active' }),
        makeBooking({ booking_status: 'active' }),
        makeBooking({ booking_status: 'pending' }),
      ];
      const stats = calculateStats(bookings);
      expect(stats.active).toBe(2);
    });

    test('counts completed bookings correctly', () => {
      const bookings = [
        makeBooking({ booking_status: 'completed' }),
        makeBooking({ booking_status: 'active' }),
        makeBooking({ booking_status: 'completed' }),
      ];
      const stats = calculateStats(bookings);
      expect(stats.completed).toBe(2);
    });

    test('pending not counted in active or completed', () => {
      const bookings = [
        makeBooking({ booking_status: 'pending' }),
        makeBooking({ booking_status: 'pending' }),
      ];
      const stats = calculateStats(bookings);
      expect(stats.active).toBe(0);
      expect(stats.completed).toBe(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 10: BOOKING AMOUNT DISPLAY
  // ════════════════════════════════════════════════════
  describe('Booking Amount Display', () => {

    test('total price formatted to 4 decimals', () => {
      const booking = makeBooking({ total_price_xrp: '4.000000' });
      const display = parseFloat(
          booking.total_price_xrp).toFixed(4);
      expect(display).toBe('4.0000');
    });

    test('admin fee formatted to 4 decimals', () => {
      const booking = makeBooking({ admin_fee_xrp: '0.800000' });
      const display = parseFloat(
          booking.admin_fee_xrp).toFixed(4);
      expect(display).toBe('0.8000');
    });

    test('seller amount formatted to 4 decimals', () => {
      const booking = makeBooking({
          seller_amount_xrp: '3.200000' });
      const display = parseFloat(
          booking.seller_amount_xrp).toFixed(4);
      expect(display).toBe('3.2000');
    });

    test('admin fee is 20% of total', () => {
      const total = 4.0;
      const admin = total * 0.20;
      expect(admin).toBeCloseTo(0.80, 2);
    });

    test('seller amount is 80% of total', () => {
      const total  = 4.0;
      const seller = total * 0.80;
      expect(seller).toBeCloseTo(3.20, 2);
    });

    test('admin + seller = total', () => {
      const booking = makeBooking({
        total_price_xrp:   '4.000000',
        admin_fee_xrp:     '0.800000',
        seller_amount_xrp: '3.200000',
      });

      const total  = parseFloat(booking.total_price_xrp);
      const admin  = parseFloat(booking.admin_fee_xrp);
      const seller = parseFloat(booking.seller_amount_xrp);

      expect(admin + seller).toBeCloseTo(total, 4);
    });

    test('price per hour formatted to 2 decimals', () => {
      const booking = makeBooking({ price_per_hour: '2.00' });
      const display = parseFloat(
          booking.price_per_hour).toFixed(2);
      expect(display).toBe('2.00');
    });

    test('admin fee to 6 decimals in expanded view', () => {
      const booking = makeBooking({ admin_fee_xrp: '0.800000' });
      const display = parseFloat(
          booking.admin_fee_xrp).toFixed(6);
      expect(display).toBe('0.800000');
    });

    test('seller amount to 6 decimals in expanded view', () => {
      const booking = makeBooking({
          seller_amount_xrp: '3.200000' });
      const display = parseFloat(
          booking.seller_amount_xrp).toFixed(6);
      expect(display).toBe('3.200000');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 11: BOOKING COUNTS TEXT
  // ════════════════════════════════════════════════════
  describe('Booking Count Text', () => {

    const getCountText = (count: number): string =>
      `${count} booking${count !== 1 ? 's' : ''} found`;

    test('singular for 1 booking', () => {
      expect(getCountText(1)).toBe('1 booking found');
    });

    test('plural for 0 bookings', () => {
      expect(getCountText(0)).toBe('0 bookings found');
    });

    test('plural for 2 bookings', () => {
      expect(getCountText(2)).toBe('2 bookings found');
    });

    test('plural for 100 bookings', () => {
      expect(getCountText(100)).toBe('100 bookings found');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 12: EXPANDED ROW - BOOKING ID DISPLAY
  // ════════════════════════════════════════════════════
  describe('Expanded Row - Booking ID Display', () => {

    test('booking ID shortened to first 8 chars + ...', () => {
      const booking = makeBooking({
        id: 'abc12345-uuid-full-id-here',
      });
      const display = `${booking.id.substring(0, 8)}...`;
      expect(display).toBe('abc12345...');
    });

    test('short booking ID handled', () => {
      const booking = makeBooking({ id: 'short' });
      const display = `${booking.id.substring(0, 8)}...`;
      expect(display).toBe('short...');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 13: STATUS FILTER BUTTONS
  // ════════════════════════════════════════════════════
  describe('Status Filter Buttons', () => {

    const statuses = [
      'all', 'pending', 'confirmed',
      'active', 'completed', 'cancelled',
    ];

    test('has 6 status filter options', () => {
      expect(statuses).toHaveLength(6);
    });

    test('includes all required statuses', () => {
      expect(statuses).toContain('all');
      expect(statuses).toContain('pending');
      expect(statuses).toContain('confirmed');
      expect(statuses).toContain('active');
      expect(statuses).toContain('completed');
      expect(statuses).toContain('cancelled');
    });

    test('capitalizes status for display', () => {
      const display = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1);

      expect(display('all')).toBe('All');
      expect(display('pending')).toBe('Pending');
      expect(display('confirmed')).toBe('Confirmed');
      expect(display('active')).toBe('Active');
      expect(display('completed')).toBe('Completed');
      expect(display('cancelled')).toBe('Cancelled');
    });
  });
});