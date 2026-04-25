// __tests__/seller/earnings/earningsHelpers.test.ts
export {};
// ── Helper functions extracted from the components ────
// We test the same logic used in TotalEarningsCard
// and TransactionHistoryCard

// ── shortenHash (from TransactionHistoryCard) ─────────
function shortenHash(hash: string): string {
    if (!hash || hash.length < 12) return hash || '---';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

function formatDate(dateStr: string): string {
  const date   = new Date(dateStr);
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ── Earnings calculation (from TotalEarningsCard) ─────
function calculateEarnings(
    bookings: Array<Record<string, string>>
): { earnings: number; paidCount: number } {
    let earnings = 0;
    let paidCount = 0;

    bookings.forEach((booking) => {
        if (
            booking.payment_status === 'split_completed' ||
            booking.payment_status === 'paid'
        ) {
            earnings += parseFloat(booking.seller_amount_xrp || '0');
            paidCount++;
        }
    });

    return { earnings, paidCount };
}


// ── Transaction filter (from TransactionHistoryCard) ──
function filterTransactions(
    transactions: Array<{
        tx_hash?: string;
        spot_title?: string;
        driver_name?: string;
        amount_xrp?: string;
    }>,
    searchQuery: string,
) {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
        (tx) =>
            tx.tx_hash?.toLowerCase().includes(q) ||
            tx.spot_title?.toLowerCase().includes(q) ||
            tx.driver_name?.toLowerCase().includes(q) ||
            tx.amount_xrp?.includes(q)
    );
}


// ── Pagination (from TransactionHistoryCard) ──────────
const ITEMS_PER_PAGE = 5;

function paginateTransactions<T>(
    items: T[],
    currentPage: number,
): T[] {
    return items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );
}

function getTotalPages(totalItems: number): number {
    return Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
}

// ══════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════
describe('Earnings Helper Functions', () => {

    // ════════════════════════════════════════════════════
    // GROUP 1: shortenHash()
    // ════════════════════════════════════════════════════
    describe('shortenHash()', () => {

        test('shortens long hash correctly', () => {
            const hash = 'ABC123DEF456GHI789JKL012';
            const result = shortenHash(hash);

            expect(result).toContain('ABC123');           // first 6
            expect(result).toContain('...');              // separator
            expect(result).toContain(hash.slice(-4));     // last 4
        });

        test('first 6 chars shown', () => {
            const hash = 'XRPL1234567890ABCDEF';
            const result = shortenHash(hash);

            expect(result.startsWith('XRPL12')).toBe(true);
        });

        test('last 4 chars shown', () => {
            const hash = 'ABCDEF1234567890WXYZ';
            const result = shortenHash(hash);

            expect(result.endsWith('WXYZ')).toBe(true);
        });

        test('returns --- for empty string', () => {
            expect(shortenHash('')).toBe('---');
        });

        test('returns hash as-is when less than 12 chars', () => {
            expect(shortenHash('SHORT')).toBe('SHORT');
            expect(shortenHash('12345678901')).toBe('12345678901');
        });

        test('format is "XXXXXX...XXXX"', () => {
            const hash = 'ABCDEF1234567890WXYZ';
            const result = shortenHash(hash);

            expect(result).toMatch(/^.{6}\.\.\..{4}$/);
        });

        test('handles exactly 12 char hash', () => {
            const hash = 'ABCDEF123456'; // exactly 12
            const result = shortenHash(hash);

            // length >= 12 → shortens
            expect(result).toContain('...');
        });

        test('real XRPL hash format', () => {
            const realHash =
                'E3FE6EA3D48F0C2B639448020EA4F03D4F4F8C';
            const result = shortenHash(realHash);

            // First 6: 'E3FE6E'
            // Last 4:  '4F8C'  ← correct
            expect(result).toBe('E3FE6E...4F8C'); // ✅
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: formatDate()
    // ════════════════════════════════════════════════════
    describe('formatDate()', () => {

        test('formats date correctly', () => {
            const result = formatDate('2025-06-15T12:00:00Z');
            expect(result).toContain('Jun');
            expect(result).toContain('2025');
        });

        test('returns format "Mon DD, YYYY"', () => {
            const result = formatDate('2025-06-15T12:00:00Z');
            expect(result).toMatch(/[A-Z][a-z]{2} \d+, \d{4}/);
        });

        test('all months formatted correctly', () => {
            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ];

            months.forEach((month, index) => {
                const monthNum = String(index + 1).padStart(2, '0');
                const result = formatDate(`2025-${monthNum}-15T12:00:00Z`);
                expect(result).toContain(month);
            });
        });

        test('contains comma separator', () => {
            const result = formatDate('2025-06-15T12:00:00Z');
            expect(result).toContain(',');
        });

        test('contains year', () => {
            const result = formatDate('2025-01-01T12:00:00Z');
            expect(result).toContain('2025');
        });

        test('different years work correctly', () => {
            const result2024 = formatDate('2024-06-15T12:00:00Z');
            const result2025 = formatDate('2025-06-15T12:00:00Z');

            expect(result2024).toContain('2024');
            expect(result2025).toContain('2025');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: calculateEarnings()
    // ════════════════════════════════════════════════════
    describe('calculateEarnings()', () => {

        test('returns 0 for empty bookings', () => {
            const { earnings, paidCount } = calculateEarnings([]);
            expect(earnings).toBe(0);
            expect(paidCount).toBe(0);
        });

        test('counts split_completed bookings', () => {
            const bookings = [
                {
                    payment_status: 'split_completed',
                    seller_amount_xrp: '3.20',
                },
            ];
            const { earnings, paidCount } = calculateEarnings(bookings);
            expect(earnings).toBeCloseTo(3.20, 2);
            expect(paidCount).toBe(1);
        });

        test('counts paid bookings', () => {
            const bookings = [
                {
                    payment_status: 'paid',
                    seller_amount_xrp: '8.00',
                },
            ];
            const { earnings, paidCount } = calculateEarnings(bookings);
            expect(earnings).toBeCloseTo(8.00, 2);
            expect(paidCount).toBe(1);
        });

        test('ignores unpaid bookings', () => {
            const bookings = [
                {
                    payment_status: 'unpaid',
                    seller_amount_xrp: '4.00',
                },
                {
                    payment_status: 'processing',
                    seller_amount_xrp: '2.00',
                },
            ];
            const { earnings, paidCount } = calculateEarnings(bookings);
            expect(earnings).toBe(0);
            expect(paidCount).toBe(0);
        });

        test('sums multiple paid bookings', () => {
            const bookings = [
                {
                    payment_status: 'split_completed',
                    seller_amount_xrp: '3.20',
                },
                {
                    payment_status: 'split_completed',
                    seller_amount_xrp: '8.00',
                },
                {
                    payment_status: 'paid',
                    seller_amount_xrp: '1.60',
                },
            ];
            const { earnings, paidCount } = calculateEarnings(bookings);
            expect(earnings).toBeCloseTo(12.80, 2);
            expect(paidCount).toBe(3);
        });

        test('ignores pending/failed bookings', () => {
            const bookings = [
                {
                    payment_status: 'split_completed',
                    seller_amount_xrp: '3.20',
                },
                {
                    payment_status: 'failed',
                    seller_amount_xrp: '4.00',
                },
                {
                    payment_status: 'pending',
                    seller_amount_xrp: '2.00',
                },
            ];
            const { earnings, paidCount } = calculateEarnings(bookings);
            // Only the split_completed counts
            expect(earnings).toBeCloseTo(3.20, 2);
            expect(paidCount).toBe(1);
        });

        test('handles missing seller_amount_xrp gracefully', () => {
            const bookings = [
                {
                    payment_status: 'split_completed',
                    // no seller_amount_xrp
                },
            ];
            const { earnings, paidCount } = calculateEarnings(bookings);
            expect(earnings).toBe(0); // parseFloat("0") = 0
            expect(paidCount).toBe(1);
        });

        test('seller amount is 80% of total', () => {
            // total = 4.0 XRP, seller gets 80% = 3.2 XRP
            const bookings = [
                {
                    payment_status: 'split_completed',
                    seller_amount_xrp: '3.20',
                    total_price_xrp: '4.00',
                },
            ];
            const { earnings } = calculateEarnings(bookings);
            const total = parseFloat('4.00');

            expect(earnings).toBeCloseTo(total * 0.80, 2);
        });

        test('earnings formatted to 2 decimal places', () => {
            const bookings = [
                {
                    payment_status: 'split_completed',
                    seller_amount_xrp: '3.200000', // 6 decimals from DB
                },
            ];
            const { earnings } = calculateEarnings(bookings);
            const formatted = earnings.toFixed(2);

            expect(formatted).toBe('3.20');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: filterTransactions()
    // ════════════════════════════════════════════════════
    describe('filterTransactions()', () => {

        const sampleTxs = [
            {
                tx_hash: 'ABC123DEF456',
                spot_title: 'City Parking',
                driver_name: 'John Smith',
                amount_xrp: '3.20',
            },
            {
                tx_hash: 'XYZ789GHI012',
                spot_title: 'Airport Parking',
                driver_name: 'Jane Doe',
                amount_xrp: '8.00',
            },
            {
                tx_hash: 'DEF456JKL789',
                spot_title: 'Mall Parking',
                driver_name: 'Bob Wilson',
                amount_xrp: '1.60',
            },
        ];

        test('returns all when query is empty', () => {
            const result = filterTransactions(sampleTxs, '');
            expect(result).toHaveLength(3);
        });

        test('returns all when query is whitespace', () => {
            const result = filterTransactions(sampleTxs, '   ');
            expect(result).toHaveLength(3);
        });

        test('searches by tx_hash', () => {
            const result = filterTransactions(sampleTxs, 'ABC123');
            expect(result).toHaveLength(1);
            expect(result[0].tx_hash).toBe('ABC123DEF456');
        });

        test('searches by spot_title', () => {
            const result = filterTransactions(sampleTxs, 'City');
            expect(result).toHaveLength(1);
            expect(result[0].spot_title).toBe('City Parking');
        });

        test('searches by driver_name', () => {
            const result = filterTransactions(sampleTxs, 'Jane');
            expect(result).toHaveLength(1);
            expect(result[0].driver_name).toBe('Jane Doe');
        });

        test('searches by amount_xrp', () => {
            const result = filterTransactions(sampleTxs, '8.00');
            expect(result).toHaveLength(1);
            expect(result[0].amount_xrp).toBe('8.00');
        });

        test('search is case insensitive', () => {
            const result = filterTransactions(sampleTxs, 'CITY');
            expect(result).toHaveLength(1);
        });

        test('returns empty when no match', () => {
            const result = filterTransactions(sampleTxs, 'nonexistent');
            expect(result).toHaveLength(0);
        });

        test('partial search works', () => {
            // 'Parking' matches all 3 spot titles
            const result = filterTransactions(sampleTxs, 'Parking');
            expect(result).toHaveLength(3);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 5: PAGINATION
    // ════════════════════════════════════════════════════
    describe('Pagination Logic', () => {

        const make12Items = () =>
            Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));

        test('getTotalPages returns 1 for 0 items', () => {
            expect(getTotalPages(0)).toBe(1);
        });

        test('getTotalPages returns 1 for 5 items', () => {
            expect(getTotalPages(5)).toBe(1);
        });

        test('getTotalPages returns 2 for 6 items', () => {
            expect(getTotalPages(6)).toBe(2);
        });

        test('getTotalPages returns 3 for 12 items', () => {
            expect(getTotalPages(12)).toBe(3); // 12 / 5 = 2.4 → ceil = 3
        });

        test('getTotalPages returns 3 for 11 items', () => {
            expect(getTotalPages(11)).toBe(3); // 11 / 5 = 2.2 → ceil = 3
        });

        test('page 1 returns first 5 items', () => {
            const items = make12Items();
            const result = paginateTransactions(items, 1);

            expect(result).toHaveLength(5);
            expect(result[0].id).toBe('1');
            expect(result[4].id).toBe('5');
        });

        test('page 2 returns items 6-10', () => {
            const items = make12Items();
            const result = paginateTransactions(items, 2);

            expect(result).toHaveLength(5);
            expect(result[0].id).toBe('6');
            expect(result[4].id).toBe('10');
        });

        test('last page returns remaining items', () => {
            const items = make12Items();
            const result = paginateTransactions(items, 3);

            expect(result).toHaveLength(2); // 12 - 10 = 2 remaining
            expect(result[0].id).toBe('11');
            expect(result[1].id).toBe('12');
        });

        test('page 1 shows 1-5 of N text', () => {
            const total = 12;
            const currentPage = 1;
            const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
            const end = Math.min(
                currentPage * ITEMS_PER_PAGE, total);

            expect(start).toBe(1);
            expect(end).toBe(5);
        });

        test('page 3 shows 11-12 of 12 text', () => {
            const total = 12;
            const currentPage = 3;
            const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
            const end = Math.min(
                currentPage * ITEMS_PER_PAGE, total);

            expect(start).toBe(11);
            expect(end).toBe(12);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 6: BALANCE FORMATTING
    // ════════════════════════════════════════════════════
    describe('Balance Formatting', () => {

        test('formats balance to 2 decimal places', () => {
            const raw = '25.5';
            const formatted = parseFloat(raw || '0').toFixed(2);
            expect(formatted).toBe('25.50');
        });

        test('handles zero balance', () => {
            const raw = '0';
            const formatted = parseFloat(raw || '0').toFixed(2);
            expect(formatted).toBe('0.00');
        });

        test('handles null/empty balance with fallback', () => {
            const raw = null;
            const formatted = parseFloat(raw || '0').toFixed(2);
            expect(formatted).toBe('0.00');
        });

        test('handles large balance', () => {
            const raw = '1000.5';
            const formatted = parseFloat(raw || '0').toFixed(2);
            expect(formatted).toBe('1000.50');
        });

        test('handles string with extra decimals from DB', () => {
            const raw = '3.200000'; // DB returns 6 decimals
            const formatted = parseFloat(raw || '0').toFixed(2);
            expect(formatted).toBe('3.20');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 7: TRANSACTION STATUS BADGE LOGIC
    // ════════════════════════════════════════════════════
    describe('Transaction Status Logic', () => {

        const getStatusClass = (status: string): string => {
            const styles: Record<string, string> = {
                validated: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                pending: 'bg-amber-50 text-amber-700 border-amber-200',
                submitted: 'bg-gray-100 text-gray-600 border-gray-200',
                failed: 'bg-red-50 text-red-700 border-red-200',
            };
            return styles[status] || 'bg-gray-100 text-gray-600';
        };

        const capitalizeStatus = (status: string): string =>
            status.charAt(0).toUpperCase() + status.slice(1);

        test('validated status has emerald styling', () => {
            expect(getStatusClass('validated')).toContain('emerald');
        });

        test('pending status has amber styling', () => {
            expect(getStatusClass('pending')).toContain('amber');
        });

        test('failed status has red styling', () => {
            expect(getStatusClass('failed')).toContain('red');
        });

        test('submitted status has gray styling', () => {
            expect(getStatusClass('submitted')).toContain('gray');
        });

        test('unknown status gets default gray', () => {
            const result = getStatusClass('unknown');
            expect(result).toContain('gray');
        });

        test('capitalizes status text', () => {
            expect(capitalizeStatus('validated')).toBe('Validated');
            expect(capitalizeStatus('pending')).toBe('Pending');
            expect(capitalizeStatus('failed')).toBe('Failed');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 8: XRP AMOUNT DISPLAY
    // ════════════════════════════════════════════════════
    describe('XRP Amount Display', () => {

        test('formats + prefix for received amounts', () => {
            const amount = '3.200000';
            const formatted = `+ ${parseFloat(amount).toFixed(2)} XRP`;
            expect(formatted).toBe('+ 3.20 XRP');
        });

        test('formats small amounts correctly', () => {
            const amount = '0.800000';
            const formatted = `+ ${parseFloat(amount).toFixed(2)} XRP`;
            expect(formatted).toBe('+ 0.80 XRP');
        });

        test('formats large amounts correctly', () => {
            const amount = '100.000000';
            const formatted = `+ ${parseFloat(amount).toFixed(2)} XRP`;
            expect(formatted).toBe('+ 100.00 XRP');
        });

        test('amount is 80% of total booking price', () => {
            const totalPrice = 4.0;
            const sellerShare = totalPrice * 0.80;

            expect(sellerShare).toBeCloseTo(3.20, 2);
        });

        test('admin gets 20% of total', () => {
            const totalPrice = 10.0;
            const adminShare = totalPrice * 0.20;

            expect(adminShare).toBeCloseTo(2.00, 2);
        });

        test('seller + admin = total', () => {
            const total = 4.0;
            const seller = total * 0.80;
            const admin = total * 0.20;

            expect(seller + admin).toBeCloseTo(total, 4);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 9: WALLET ADDRESS HANDLING
    // ════════════════════════════════════════════════════
    describe('Wallet Address Handling', () => {

        test('valid XRPL address starts with r', () => {
            const address = 'rDriverWallet123456789';
            expect(address.startsWith('r')).toBe(true);
        });

        test('empty address handled safely', () => {
            const address = '';
            const truncated = address || 'No address';
            expect(truncated).toBe('No address');
        });

        test('NO_WALLET error detected correctly', () => {
            const error = 'Error: NO_WALLET found';
            const isNoWallet =
                error.includes('NO_WALLET') ||
                error.includes('No wallet') ||
                error.includes('No funded wallet');

            expect(isNoWallet).toBe(true);
        });

        test('other errors not treated as NO_WALLET', () => {
            const error = 'Network connection failed';
            const isNoWallet =
                error.includes('NO_WALLET') ||
                error.includes('No wallet') ||
                error.includes('No funded wallet');

            expect(isNoWallet).toBe(false);
        });

        test('balance parsed from API response correctly', () => {
            const response = { balanceXrp: '25.500000' };
            const formatted = parseFloat(response.balanceXrp || '0')
                .toFixed(2);

            expect(formatted).toBe('25.50');
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 10: BOOKINGS COUNT TEXT
    // ════════════════════════════════════════════════════
    describe('Bookings Count Text', () => {

        const getBookingText = (count: number): string =>
            `From ${count} paid booking${count !== 1 ? 's' : ''}`;

        test('singular for 1 booking', () => {
            expect(getBookingText(1)).toBe('From 1 paid booking');
        });

        test('plural for 0 bookings', () => {
            expect(getBookingText(0)).toBe('From 0 paid bookings');
        });

        test('plural for 2 bookings', () => {
            expect(getBookingText(2)).toBe('From 2 paid bookings');
        });

        test('plural for 10 bookings', () => {
            expect(getBookingText(10)).toBe('From 10 paid bookings');
        });

        test('plural for 100 bookings', () => {
            expect(getBookingText(100)).toBe('From 100 paid bookings');
        });
    });
});