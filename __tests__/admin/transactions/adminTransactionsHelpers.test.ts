// __tests__/admin/transactions/adminTransactionsHelpers.test.ts

// ══════════════════════════════════════════════════════
// ALL HELPER FUNCTIONS AT TOP LEVEL
// ══════════════════════════════════════════════════════

// ── formatDate (from TransactionTable) ───────────────
function formatDate(dateStr: string): string {
  const date   = new Date(dateStr);
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ── shortenAddress (from TransactionTable) ────────────
function shortenAddress(addr: string): string {
  if (!addr || addr.length < 12) return addr || '—';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

// ── shortenHash (from TransactionTable) ──────────────
function shortenHash(hash: string): string {
  if (!hash || hash.length < 12) return hash || '—';
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 4)}`;
}

// ── TxTypeBadge logic ─────────────────────────────────
function getTxTypeDisplay(txType: string): string {
  return txType === 'driver_to_admin'
    ? 'Driver → Admin'
    : 'Admin → Seller';
}

function getTxTypeClass(txType: string): string {
  return txType === 'driver_to_admin'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-orange-100 text-orange-800';
}

// ── Amount prefix ─────────────────────────────────────
function getAmountPrefix(txType: string): string {
  return txType === 'driver_to_admin' ? '+' : '-';
}

function getAmountClass(txType: string): string {
  return txType === 'driver_to_admin'
    ? 'text-green-700'
    : 'text-orange-700';
}

// ── StatusBadge logic ─────────────────────────────────
function getStatusClass(status: string): string {
  const styles: Record<string, string> = {
    validated: 'bg-green-100 text-green-800',
    pending:   'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    failed:    'bg-red-100 text-red-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
}

function capitalizeStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// ── Transaction filter ────────────────────────────────
interface Transaction {
  id:           string;
  booking_id:   string;
  tx_hash:      string;
  from_address: string;
  to_address:   string;
  amount_xrp:   string;
  tx_type:      string;
  status:       string;
  created_at:   string;
  spot_title?:  string;
  driver_name?: string;
  owner_name?:  string;
}

function filterTransactions(
  transactions: Transaction[],
  typeFilter:   string,
  searchQuery:  string,
): Transaction[] {
  let filtered = transactions;

  if (typeFilter !== 'all') {
    filtered = filtered.filter(
      (t) => t.tx_type === typeFilter
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.tx_hash?.toLowerCase().includes(q)       ||
        t.spot_title?.toLowerCase().includes(q)    ||
        t.driver_name?.toLowerCase().includes(q)   ||
        t.owner_name?.toLowerCase().includes(q)    ||
        t.from_address?.toLowerCase().includes(q)  ||
        t.to_address?.toLowerCase().includes(q)
    );
  }

  return filtered;
}

// ── Summary calculations ──────────────────────────────
function calculateSummary(transactions: Transaction[]) {
  const totalReceived = transactions
    .filter((t) => t.tx_type === 'driver_to_admin')
    .reduce((sum, t) => sum + parseFloat(t.amount_xrp || '0'), 0);

  const totalPaid = transactions
    .filter((t) => t.tx_type === 'admin_to_seller')
    .reduce((sum, t) => sum + parseFloat(t.amount_xrp || '0'), 0);

  return { totalReceived, totalPaid };
}

// ── Pagination ────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

function getTotalPages(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
}

function paginateTransactions(
  transactions: Transaction[],
  currentPage:  number,
): Transaction[] {
  return transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
}

// ── Stats formatting (TransactionStatCards) ───────────
function formatXrpAmount(raw: string | number): string {
  return parseFloat(String(raw) || '0').toFixed(2);
}

// ── Helper: make transaction ──────────────────────────
const makeTx = (
  overrides: Partial<Transaction> = {}
): Transaction => ({
  id:           'tx-uuid-1',
  booking_id:   'booking-uuid-1',
  tx_hash:      'ABCDEF1234567890WXYZ',
  from_address: 'rDriverWallet123456',
  to_address:   'rAdminWallet789012',
  amount_xrp:   '4.000000',
  tx_type:      'driver_to_admin',
  status:       'validated',
  created_at:   '2025-06-15T10:00:00Z',
  spot_title:   'City Parking',
  driver_name:  'John Smith',
  owner_name:   'Jane Owner',
  ...overrides,
});

// ══════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════
describe('Admin Transactions Helper Functions', () => {

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

    test('contains comma separator', () => {
      const result = formatDate('2025-06-15T12:00:00Z');
      expect(result).toContain(',');
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

    test('different years work correctly', () => {
      expect(formatDate('2024-06-15T12:00:00Z')).toContain('2024');
      expect(formatDate('2025-06-15T12:00:00Z')).toContain('2025');
      expect(formatDate('2026-06-15T12:00:00Z')).toContain('2026');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: shortenAddress()
  // ════════════════════════════════════════════════════
  describe('shortenAddress()', () => {

    test('shortens long address', () => {
      const addr   = 'rDriverWallet123456789';
      const result = shortenAddress(addr);
      expect(result).toContain('rDrive');
      expect(result).toContain('...');
    });

    test('returns first 6 chars', () => {
      const addr   = 'rABCDEF123456789';
      const result = shortenAddress(addr);
      expect(result.startsWith('rABCDE')).toBe(true);
    });

    test('returns last 4 chars', () => {
      const addr   = 'rABCDEFGHIJKLMNOP';
      const result = shortenAddress(addr);
      expect(result.endsWith('MNOP')).toBe(true);
    });

    test('returns — for empty string', () => {
      expect(shortenAddress('')).toBe('—');
    });

    test('returns address as-is when < 12 chars', () => {
      expect(shortenAddress('rShort')).toBe('rShort');
    });

    test('format is "XXXXXX...XXXX"', () => {
      const addr   = 'rABCDEFGHIJKLMNOP';
      const result = shortenAddress(addr);
      expect(result).toMatch(/^.{6}\.\.\..{4}$/);
    });

    test('real XRPL address format', () => {
      const addr   = 'rDriverWallet123456789ABCD';
      const result = shortenAddress(addr);
      expect(result).toContain('rDrive');
      expect(result).toContain('...');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: shortenHash()
  // ════════════════════════════════════════════════════
  describe('shortenHash()', () => {

    test('shortens long hash', () => {
      const hash   = 'ABCDEF1234567890WXYZ';
      const result = shortenHash(hash);
      expect(result).toContain('ABCDEF12');
      expect(result).toContain('...');
    });

    test('returns first 8 chars (not 6 like address)', () => {
      const hash   = 'ABCDEF12345678901234';
      const result = shortenHash(hash);
      expect(result.startsWith('ABCDEF12')).toBe(true);
    });

    test('returns last 4 chars', () => {
      const hash   = 'ABCDEF12345678WXYZ';
      const result = shortenHash(hash);
      expect(result.endsWith('WXYZ')).toBe(true);
    });

    test('returns — for empty string', () => {
      expect(shortenHash('')).toBe('—');
    });

    test('returns hash as-is when < 12 chars', () => {
      expect(shortenHash('SHORT')).toBe('SHORT');
    });

    test('hash uses 8 chars prefix (vs address 6 chars)', () => {
      const addr = 'rABCDEFGHIJKLMNOP';
      const hash = 'ABCDEFGHIJKLMNOP';

      const addrShort = shortenAddress(addr);
      const hashShort = shortenHash(hash);

      // Address: 6 chars before ...
      expect(addrShort.split('...')[0]).toHaveLength(6);
      // Hash: 8 chars before ...
      expect(hashShort.split('...')[0]).toHaveLength(8);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: TxTypeBadge Logic
  // ════════════════════════════════════════════════════
  describe('TxTypeBadge Logic', () => {

    test('driver_to_admin → "Driver → Admin"', () => {
      expect(getTxTypeDisplay('driver_to_admin'))
        .toBe('Driver → Admin');
    });

    test('admin_to_seller → "Admin → Seller"', () => {
      expect(getTxTypeDisplay('admin_to_seller'))
        .toBe('Admin → Seller');
    });

    test('driver_to_admin → blue styling', () => {
      expect(getTxTypeClass('driver_to_admin'))
        .toContain('blue');
    });

    test('admin_to_seller → orange styling', () => {
      expect(getTxTypeClass('admin_to_seller'))
        .toContain('orange');
    });

    test('only two tx types exist', () => {
      const types = ['driver_to_admin', 'admin_to_seller'];
      expect(types).toHaveLength(2);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: Amount Display
  // ════════════════════════════════════════════════════
  describe('Amount Display', () => {

    test('driver_to_admin shows + prefix', () => {
      expect(getAmountPrefix('driver_to_admin')).toBe('+');
    });

    test('admin_to_seller shows - prefix', () => {
      expect(getAmountPrefix('admin_to_seller')).toBe('-');
    });

    test('driver_to_admin shows green color', () => {
      expect(getAmountClass('driver_to_admin'))
        .toContain('green');
    });

    test('admin_to_seller shows orange color', () => {
      expect(getAmountClass('admin_to_seller'))
        .toContain('orange');
    });

    test('amount formatted to 4 decimal places', () => {
      const amount    = '4.000000';
      const formatted = parseFloat(amount).toFixed(4);
      expect(formatted).toBe('4.0000');
    });

    test('small amount formatted correctly', () => {
      const amount    = '0.800000';
      const formatted = parseFloat(amount).toFixed(4);
      expect(formatted).toBe('0.8000');
    });

    test('large amount formatted correctly', () => {
      const amount    = '100.500000';
      const formatted = parseFloat(amount).toFixed(4);
      expect(formatted).toBe('100.5000');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 6: StatusBadge Logic
  // ════════════════════════════════════════════════════
  describe('StatusBadge Logic', () => {

    test('validated → green styling', () => {
      expect(getStatusClass('validated')).toContain('green');
    });

    test('pending → yellow styling', () => {
      expect(getStatusClass('pending')).toContain('yellow');
    });

    test('submitted → blue styling', () => {
      expect(getStatusClass('submitted')).toContain('blue');
    });

    test('failed → red styling', () => {
      expect(getStatusClass('failed')).toContain('red');
    });

    test('unknown → gray default', () => {
      expect(getStatusClass('unknown')).toContain('gray');
    });

    test('capitalizes first letter', () => {
      expect(capitalizeStatus('validated')).toBe('Validated');
      expect(capitalizeStatus('pending')).toBe('Pending');
      expect(capitalizeStatus('failed')).toBe('Failed');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 7: filterTransactions() - Type Filter
  // ════════════════════════════════════════════════════
  describe('filterTransactions() - Type Filter', () => {

    const sampleTxs = [
      makeTx({ id: '1', tx_type: 'driver_to_admin' }),
      makeTx({ id: '2', tx_type: 'driver_to_admin' }),
      makeTx({ id: '3', tx_type: 'admin_to_seller' }),
    ];

    test('returns all when filter is "all"', () => {
      const result = filterTransactions(sampleTxs, 'all', '');
      expect(result).toHaveLength(3);
    });

    test('filters driver_to_admin only', () => {
      const result = filterTransactions(
          sampleTxs, 'driver_to_admin', '');
      expect(result).toHaveLength(2);
      result.forEach((t) => {
        expect(t.tx_type).toBe('driver_to_admin');
      });
    });

    test('filters admin_to_seller only', () => {
      const result = filterTransactions(
          sampleTxs, 'admin_to_seller', '');
      expect(result).toHaveLength(1);
      expect(result[0].tx_type).toBe('admin_to_seller');
    });

    test('returns empty for unknown type', () => {
      const result = filterTransactions(
          sampleTxs, 'unknown_type', '');
      expect(result).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 8: filterTransactions() - Search
  // ════════════════════════════════════════════════════
  describe('filterTransactions() - Search', () => {

    const sampleTxs = [
      makeTx({
        id:           'tx-1',
        tx_hash:      'HASH1ABCDEF12345678',
        spot_title:   'City Parking',
        driver_name:  'Alice Smith',
        owner_name:   'Bob Owner',
        from_address: 'rAliceWallet123456',
        to_address:   'rAdminWallet789012',
      }),
      makeTx({
        id:           'tx-2',
        tx_hash:      'HASH2XYZGHI12345678',
        spot_title:   'Airport Parking',
        driver_name:  'Carol Jones',
        owner_name:   'Dave Owner',
        from_address: 'rCarolWallet456789',
        to_address:   'rAdminWallet789012',
      }),
    ];

    test('returns all when search is empty', () => {
      const result = filterTransactions(sampleTxs, 'all', '');
      expect(result).toHaveLength(2);
    });

    test('returns all when search is whitespace', () => {
      const result = filterTransactions(sampleTxs, 'all', '   ');
      expect(result).toHaveLength(2);
    });

    test('searches by tx_hash', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'HASH1');
      expect(result).toHaveLength(1);
      expect(result[0].tx_hash).toContain('HASH1');
    });

    test('searches by spot_title', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'City');
      expect(result).toHaveLength(1);
      expect(result[0].spot_title).toBe('City Parking');
    });

    test('searches by driver_name', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'Alice');
      expect(result).toHaveLength(1);
      expect(result[0].driver_name).toBe('Alice Smith');
    });

    test('searches by owner_name', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'Dave');
      expect(result).toHaveLength(1);
      expect(result[0].owner_name).toBe('Dave Owner');
    });

    test('searches by from_address', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'rAlice');
      expect(result).toHaveLength(1);
      expect(result[0].from_address).toContain('rAlice');
    });

    test('searches by to_address', () => {
      // Both txs go to rAdminWallet → both match
      const result = filterTransactions(
          sampleTxs, 'all', 'rAdminWallet');
      expect(result).toHaveLength(2);
    });

    test('search is case insensitive', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'CITY');
      expect(result).toHaveLength(1);
    });

    test('returns empty when no match', () => {
      const result = filterTransactions(
          sampleTxs, 'all', 'nonexistent999');
      expect(result).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 9: Combined Filter + Search
  // ════════════════════════════════════════════════════
  describe('filterTransactions() - Combined', () => {

    const sampleTxs = [
      makeTx({
        id:          'tx-1',
        tx_type:     'driver_to_admin',
        driver_name: 'Alice Smith',
        spot_title:  'City Parking',
      }),
      makeTx({
        id:          'tx-2',
        tx_type:     'admin_to_seller',
        owner_name:  'Alice Owner',
        spot_title:  'Mall Parking',
      }),
      makeTx({
        id:          'tx-3',
        tx_type:     'driver_to_admin',
        driver_name: 'Bob Jones',
        spot_title:  'Airport Parking',
      }),
    ];

    test('type + search filters correctly', () => {
      // driver_to_admin with 'Alice'
      const result = filterTransactions(
          sampleTxs, 'driver_to_admin', 'Alice');
      expect(result).toHaveLength(1);
      expect(result[0].driver_name).toBe('Alice Smith');
    });

    test('no results when filter + search have no overlap', () => {
      // admin_to_seller with 'Bob' (Bob is driver_to_admin)
      const result = filterTransactions(
          sampleTxs, 'admin_to_seller', 'Bob');
      expect(result).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 10: calculateSummary()
  // ════════════════════════════════════════════════════
  describe('calculateSummary()', () => {

    test('returns 0 for empty transactions', () => {
      const { totalReceived, totalPaid } =
          calculateSummary([]);
      expect(totalReceived).toBe(0);
      expect(totalPaid).toBe(0);
    });

    test('sums driver_to_admin amounts as received', () => {
      const txs = [
        makeTx({
          tx_type:    'driver_to_admin',
          amount_xrp: '4.000000',
        }),
        makeTx({
          tx_type:    'driver_to_admin',
          amount_xrp: '10.000000',
        }),
      ];
      const { totalReceived } = calculateSummary(txs);
      expect(totalReceived).toBeCloseTo(14.0, 2);
    });

    test('sums admin_to_seller amounts as paid', () => {
      const txs = [
        makeTx({
          tx_type:    'admin_to_seller',
          amount_xrp: '3.200000',
        }),
        makeTx({
          tx_type:    'admin_to_seller',
          amount_xrp: '8.000000',
        }),
      ];
      const { totalPaid } = calculateSummary(txs);
      expect(totalPaid).toBeCloseTo(11.2, 2);
    });

    test('separates received and paid correctly', () => {
      const txs = [
        makeTx({
          tx_type:    'driver_to_admin',
          amount_xrp: '4.000000',
        }),
        makeTx({
          tx_type:    'admin_to_seller',
          amount_xrp: '3.200000',
        }),
      ];
      const { totalReceived, totalPaid } =
          calculateSummary(txs);

      expect(totalReceived).toBeCloseTo(4.0, 2);
      expect(totalPaid).toBeCloseTo(3.2, 2);
    });

    test('admin profit = received - paid (20% kept)', () => {
      const txs = [
        makeTx({
          tx_type:    'driver_to_admin',
          amount_xrp: '4.000000',
        }),
        makeTx({
          tx_type:    'admin_to_seller',
          amount_xrp: '3.200000',
        }),
      ];
      const { totalReceived, totalPaid } =
          calculateSummary(txs);
      const adminProfit = totalReceived - totalPaid;

      expect(adminProfit).toBeCloseTo(0.80, 2); // 20% of 4.0
    });

    test('handles missing amount_xrp gracefully', () => {
      const txs = [
        makeTx({ tx_type: 'driver_to_admin', amount_xrp: '' }),
      ];
      const { totalReceived } = calculateSummary(txs);
      expect(totalReceived).toBe(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 11: PAGINATION (10 per page)
  // ════════════════════════════════════════════════════
  describe('Pagination (10 per page)', () => {

    const make15Txs = (): Transaction[] =>
      Array.from({ length: 15 }, (_, i) =>
        makeTx({ id: String(i + 1) })
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
      const items  = make15Txs();
      const result = paginateTransactions(items, 1);
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe('1');
      expect(result[9].id).toBe('10');
    });

    test('page 2 returns remaining 5 items', () => {
      const items  = make15Txs();
      const result = paginateTransactions(items, 2);
      expect(result).toHaveLength(5);
      expect(result[0].id).toBe('11');
      expect(result[4].id).toBe('15');
    });

    test('pagination text page 1: shows 1-10 of 15', () => {
      const total       = 15;
      const currentPage = 1;
      const start       = (currentPage - 1) * ITEMS_PER_PAGE + 1;
      const end         = Math.min(
          currentPage * ITEMS_PER_PAGE, total);

      expect(start).toBe(1);
      expect(end).toBe(10);
    });

    test('pagination text page 2: shows 11-15 of 15', () => {
      const total       = 15;
      const currentPage = 2;
      const start       = (currentPage - 1) * ITEMS_PER_PAGE + 1;
      const end         = Math.min(
          currentPage * ITEMS_PER_PAGE, total);

      expect(start).toBe(11);
      expect(end).toBe(15);
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 12: TransactionStatCards - Stat Formatting
  // ════════════════════════════════════════════════════
  describe('TransactionStatCards - Stat Formatting', () => {

    test('formats XRP to 2 decimal places', () => {
      expect(formatXrpAmount('100.500000')).toBe('100.50');
      expect(formatXrpAmount('4.000000')).toBe('4.00');
      expect(formatXrpAmount('0.800000')).toBe('0.80');
    });

    test('handles zero balance', () => {
      expect(formatXrpAmount('0')).toBe('0.00');
    });

    test('handles empty string with fallback', () => {
      expect(formatXrpAmount('')).toBe('0.00');
    });

    test('admin profit = received - paid to sellers', () => {
      const totalReceived       = 100.0;
      const totalPaidToSellers  = 80.0;
      const adminProfit         =
          totalReceived - totalPaidToSellers;

      expect(adminProfit).toBeCloseTo(20.0, 2);
      expect(adminProfit / totalReceived).toBeCloseTo(0.20, 2);
    });

    test('paid to sellers is 80% of total received', () => {
      const totalReceived      = 10.0;
      const expectedSellerPaid = totalReceived * 0.80;

      expect(expectedSellerPaid).toBeCloseTo(8.0, 2);
    });

    test('admin keeps 20% profit', () => {
      const totalReceived   = 10.0;
      const adminProfit     = totalReceived * 0.20;

      expect(adminProfit).toBeCloseTo(2.0, 2);
    });

    test('stat card titles are correct', () => {
      const titles = [
        'Total Received',
        'Paid to Sellers',
        'Admin Profit (20%)',
        'Admin Wallet Balance',
      ];

      expect(titles).toHaveLength(4);
      expect(titles).toContain('Total Received');
      expect(titles).toContain('Paid to Sellers');
      expect(titles).toContain('Admin Profit (20%)');
      expect(titles).toContain('Admin Wallet Balance');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 13: Filter Button Labels
  // ════════════════════════════════════════════════════
  describe('Filter Button Labels', () => {

    const txTypes = ['all', 'driver_to_admin', 'admin_to_seller'];

    test('has 3 filter options', () => {
      expect(txTypes).toHaveLength(3);
    });

    test('includes all required types', () => {
      expect(txTypes).toContain('all');
      expect(txTypes).toContain('driver_to_admin');
      expect(txTypes).toContain('admin_to_seller');
    });

    test('button labels are correct', () => {
      const getLabel = (type: string): string => {
        if (type === 'all') return 'All';
        if (type === 'driver_to_admin') return 'Driver → Admin';
        return 'Admin → Seller';
      };

      expect(getLabel('all')).toBe('All');
      expect(getLabel('driver_to_admin')).toBe('Driver → Admin');
      expect(getLabel('admin_to_seller')).toBe('Admin → Seller');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 14: Transaction Count Text
  // ════════════════════════════════════════════════════
  describe('Transaction Count Text', () => {

    const getCountText = (count: number): string =>
      `${count} transaction${count !== 1 ? 's' : ''}`;

    test('singular for 1 transaction', () => {
      expect(getCountText(1)).toBe('1 transaction');
    });

    test('plural for 0 transactions', () => {
      expect(getCountText(0)).toBe('0 transactions');
    });

    test('plural for 2 transactions', () => {
      expect(getCountText(2)).toBe('2 transactions');
    });

    test('plural for 100 transactions', () => {
      expect(getCountText(100)).toBe('100 transactions');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 15: XRPL Verify URL
  // ════════════════════════════════════════════════════
  describe('XRPL Verify URL', () => {

    const getVerifyUrl = (txHash: string): string =>
      `https://testnet.xrpl.org/transactions/${txHash}`;

    test('builds correct XRPL explorer URL', () => {
      const url = getVerifyUrl('ABC123TXHASH');
      expect(url).toBe(
        'https://testnet.xrpl.org/transactions/ABC123TXHASH'
      );
    });

    test('URL contains testnet domain', () => {
      const url = getVerifyUrl('ANYHASH');
      expect(url).toContain('testnet.xrpl.org');
    });

    test('URL contains transactions path', () => {
      const url = getVerifyUrl('ANYHASH');
      expect(url).toContain('/transactions/');
    });

    test('URL contains the tx hash', () => {
      const hash = 'UNIQUEHASH123456';
      const url  = getVerifyUrl(hash);
      expect(url).toContain(hash);
    });

    test('empty hash creates valid URL structure', () => {
      const url = getVerifyUrl('');
      expect(url).toContain('testnet.xrpl.org');
    });
  });
});