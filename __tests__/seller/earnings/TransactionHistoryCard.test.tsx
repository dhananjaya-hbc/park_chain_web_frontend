// __tests__/seller/earnings/TransactionHistoryCard.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionHistoryCard from '@/app/(protected)/seller/earnings/Components/TransactionHistoryCard';

// ── Mock apiService ───────────────────────────────────
jest.mock('@/lib/api/apiService', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

jest.mock('@/lib/api/endpoints', () => ({
    API_ENDPOINTS: {
        SELLER_TRANSACTIONS: '/payments/seller/transactions',
    },
}));

import apiService from '@/lib/api/apiService';
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// ── Sample transactions ───────────────────────────────
const makeTransaction = (
    overrides: Partial<{
        id: string;
        booking_id: string;
        tx_hash: string;
        from_address: string;
        to_address: string;
        amount_xrp: string;
        tx_type: string;
        status: string;
        created_at: string;
        spot_title: string;
        driver_name: string;
    }> = {}
) => ({
    id: 'tx-uuid-1',
    booking_id: 'booking-uuid-1',
    tx_hash: 'ABC123DEF456GHI789',
    from_address: 'rAdminWallet123',
    to_address: 'rSellerWallet456',
    amount_xrp: '3.200000',
    tx_type: 'admin_to_seller',
    status: 'validated',
    created_at: '2025-06-15T10:00:00Z',
    spot_title: 'City Parking',
    driver_name: 'John Smith',
    ...overrides,
});

const make6Transactions = () =>
    Array.from({ length: 6 }, (_, i) =>
        makeTransaction({
            id: `tx-${i + 1}`,
            tx_hash: `HASH${i + 1}ABCDEF123456`,
            spot_title: `Parking Spot ${i + 1}`,
            amount_xrp: `${(i + 1) * 1.6}`,
        })
    );

describe('TransactionHistoryCard Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: LOADING STATE
    // ════════════════════════════════════════════════════
    describe('Loading State', () => {

        test('shows loading spinner initially', () => {
            mockApiService.get.mockImplementation(
                () => new Promise(() => { }),
            );

            render(<TransactionHistoryCard />);

            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeTruthy();
        });

        test('shows loading text', () => {
            mockApiService.get.mockImplementation(
                () => new Promise(() => { }),
            );

            render(<TransactionHistoryCard />);

            expect(
                screen.getByText('Loading transactions...')
            ).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: HEADER & STRUCTURE
    // ════════════════════════════════════════════════════
    describe('Header & Structure', () => {

        beforeEach(() => {
            mockApiService.get.mockResolvedValue({
                transactions: [],
                earnings: { total_earned_xrp: '0' },
            });
        });

        test('shows Transaction History title', async () => {
            render(<TransactionHistoryCard />);

            await screen.findByText('Transaction History');
            expect(screen.getByText('Transaction History')).toBeTruthy();
        });

        test('shows 80% share subtitle', async () => {
            render(<TransactionHistoryCard />);

            await screen.findByText(
                'Payments received from bookings (80% share)'
            );
            expect(
                screen.getByText(
                    'Payments received from bookings (80% share)'
                )
            ).toBeTruthy();
        });

        test('shows table headers', async () => {
            render(<TransactionHistoryCard />);

            await screen.findByText('Transaction History');

            expect(screen.getByText('Transaction')).toBeTruthy();
            expect(screen.getByText('Date')).toBeTruthy();
            expect(screen.getByText('Status')).toBeTruthy();
            expect(screen.getByText('Amount')).toBeTruthy();
            expect(screen.getByText('Verify')).toBeTruthy();
        });

        test('shows search input', async () => {
            render(<TransactionHistoryCard />);

            await screen.findByText('Transaction History');

            const searchInput = screen.getByPlaceholderText('Search hash...');
            expect(searchInput).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: EMPTY STATE
    // ════════════════════════════════════════════════════
    describe('Empty State', () => {

        test('shows no transactions message', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('No transactions yet');
            expect(screen.getByText('No transactions yet')).toBeTruthy();
        });

        test('shows no search match message', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction()],
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('City Parking');

            // Search for something that doesn't exist
            const input = screen.getByPlaceholderText('Search hash...');
            fireEvent.change(input, {
                target: { value: 'nonexistent999' },
            });

            await screen.findByText(
                'No transactions match your search'
            );
            expect(
                screen.getByText('No transactions match your search')
            ).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: TRANSACTION DATA DISPLAY
    // ════════════════════════════════════════════════════
    describe('Transaction Data Display', () => {

        test('shows spot title', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ spot_title: 'Airport Parking' })],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Airport Parking');
            expect(screen.getByText('Airport Parking')).toBeTruthy();
        });

        test('shows shortened tx hash', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [
                    makeTransaction({ tx_hash: 'ABC123DEF456GHI789' }),
                ],
            });

            render(<TransactionHistoryCard />);

            // shortenHash('ABC123DEF456GHI789')
            // = 'ABC123...I789'
            await screen.findByText('ABC123...I789');
            expect(screen.getByText('ABC123...I789')).toBeTruthy();
        });

        test('shows amount with + prefix and XRP suffix', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ amount_xrp: '3.200000' })],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('+ 3.20 XRP');
            expect(screen.getByText('+ 3.20 XRP')).toBeTruthy();
        });

        test('shows validated status badge', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ status: 'validated' })],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Validated');
            expect(screen.getByText('Validated')).toBeTruthy();
        });

        test('shows pending status badge', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ status: 'pending' })],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Pending');
            expect(screen.getByText('Pending')).toBeTruthy();
        });

        test('shows failed status badge', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ status: 'failed' })],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Failed');
            expect(screen.getByText('Failed')).toBeTruthy();
        });

        test('shows XRPL verify link', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [
                    makeTransaction({ tx_hash: 'ABC123DEF456GHI789' }),
                ],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('XRPL');
            const link = screen.getByText('XRPL').closest('a');
            expect(link).toBeTruthy();
            expect(link?.href).toContain('testnet.xrpl.org');
            expect(link?.href).toContain('ABC123DEF456GHI789');
        });

        test('shows date correctly', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [
                    makeTransaction({ created_at: '2025-06-15T12:00:00Z' }),
                ],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Jun 15, 2025');
            expect(screen.getByText('Jun 15, 2025')).toBeTruthy();
        });

        test('shows Booking Payment as fallback when no spot title', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [
                    makeTransaction({ spot_title: undefined }),
                ],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Booking Payment');
            expect(screen.getByText('Booking Payment')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 5: SEARCH FUNCTIONALITY
    // ════════════════════════════════════════════════════
    describe('Search Functionality', () => {

        beforeEach(() => {
            mockApiService.get.mockResolvedValue({
                transactions: [
                    makeTransaction({
                        id: 'tx-1',
                        tx_hash: 'HASH1ABCDEF123456',
                        spot_title: 'City Parking',
                        amount_xrp: '3.20',
                    }),
                    makeTransaction({
                        id: 'tx-2',
                        tx_hash: 'HASH2XYZGHI789012',
                        spot_title: 'Airport Parking',
                        amount_xrp: '8.00',
                    }),
                ],
            });
        });

        test('search filters by spot title', async () => {
            render(<TransactionHistoryCard />);
            await screen.findByText('City Parking');

            const input = screen.getByPlaceholderText('Search hash...');
            fireEvent.change(input, { target: { value: 'City' } });

            await waitFor(() => {
                expect(screen.queryByText('Airport Parking')).toBeNull();
            });
            expect(screen.getByText('City Parking')).toBeTruthy();
        });

        test('search filters by tx hash', async () => {
            render(<TransactionHistoryCard />);
            await screen.findByText('City Parking');

            const input = screen.getByPlaceholderText('Search hash...');
            fireEvent.change(input, { target: { value: 'HASH1' } });

            await waitFor(() => {
                expect(screen.queryByText('Airport Parking')).toBeNull();
            });
        });

        test('empty search shows all transactions', async () => {
            render(<TransactionHistoryCard />);
            await screen.findByText('City Parking');

            const input = screen.getByPlaceholderText('Search hash...');
            fireEvent.change(input, { target: { value: '' } });

            await waitFor(() => {
                expect(screen.getByText('City Parking')).toBeTruthy();
                expect(screen.getByText('Airport Parking')).toBeTruthy();
            });
        });

        test('search is case insensitive', async () => {
            render(<TransactionHistoryCard />);
            await screen.findByText('City Parking');

            const input = screen.getByPlaceholderText('Search hash...');
            fireEvent.change(input, { target: { value: 'CITY' } });

            await waitFor(() => {
                expect(screen.getByText('City Parking')).toBeTruthy();
                expect(screen.queryByText('Airport Parking')).toBeNull();
            });
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 6: PAGINATION
    // ════════════════════════════════════════════════════
    describe('Pagination', () => {

        test('shows first 5 transactions on page 1', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Parking Spot 1');

            // First 5 show
            expect(screen.getByText('Parking Spot 1')).toBeTruthy();
            expect(screen.getByText('Parking Spot 5')).toBeTruthy();
            // 6th should NOT show on page 1
            expect(screen.queryByText('Parking Spot 6')).toBeNull();
        });

        test('shows pagination controls when > 5 items', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Parking Spot 1');

            expect(screen.getByText('Previous')).toBeTruthy();
            expect(screen.getByText('Next')).toBeTruthy();
        });

        test('no pagination when <= 5 items', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [
                    makeTransaction({ id: 'tx-1', spot_title: 'Spot 1' }),
                    makeTransaction({ id: 'tx-2', spot_title: 'Spot 2' }),
                ],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('Spot 1');

            expect(screen.queryByText('Previous')).toBeNull();
            expect(screen.queryByText('Next')).toBeNull();
        });

        test('Next button navigates to page 2', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('Parking Spot 1');

            // Click Next
            fireEvent.click(screen.getByText('Next'));

            await screen.findByText('Parking Spot 6');
            expect(screen.getByText('Parking Spot 6')).toBeTruthy();
            // Page 1 items gone
            expect(screen.queryByText('Parking Spot 1')).toBeNull();
        });

        test('Previous button goes back to page 1', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('Parking Spot 1');

            // Go to page 2
            fireEvent.click(screen.getByText('Next'));
            await screen.findByText('Parking Spot 6');

            // Go back to page 1
            fireEvent.click(screen.getByText('Previous'));
            await screen.findByText('Parking Spot 1');

            expect(screen.getByText('Parking Spot 1')).toBeTruthy();
        });

        test('shows correct pagination text', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('Parking Spot 1');

            // "Showing 1-5 of 6"
            expect(screen.getByText(/Showing 1-5 of 6/)).toBeTruthy();
        });

        test('Previous disabled on first page', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('Parking Spot 1');

            const prevBtn = screen.getByText('Previous');
            expect(prevBtn).toHaveProperty('disabled', true);
        });

        test('Next disabled on last page', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('Parking Spot 1');

            // Go to last page
            fireEvent.click(screen.getByText('Next'));
            await screen.findByText('Parking Spot 6');

            const nextBtn = screen.getByText('Next');
            expect(nextBtn).toHaveProperty('disabled', true);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 7: API CALL
    // ════════════════════════════════════════════════════
    describe('API Call', () => {

        test('calls seller transactions endpoint', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('No transactions yet');

            expect(mockApiService.get).toHaveBeenCalledWith(
                '/payments/seller/transactions'
            );
        });

        test('calls API exactly once on mount', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [],
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('No transactions yet');

            expect(mockApiService.get).toHaveBeenCalledTimes(1);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 8: ERROR HANDLING
    // ════════════════════════════════════════════════════
    describe('Error Handling', () => {

        test('shows no transactions on API error', async () => {
            mockApiService.get.mockRejectedValue(
                new Error('Network error')
            );

            render(<TransactionHistoryCard />);

            await screen.findByText('No transactions yet');
            expect(screen.getByText('No transactions yet')).toBeTruthy();
        });

        test('handles missing transactions key in response', async () => {
            mockApiService.get.mockResolvedValue({
                // no transactions key
                earnings: { total_earned_xrp: '0' },
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('No transactions yet');
            expect(screen.getByText('No transactions yet')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 9: XRPL VERIFY LINK
    // ════════════════════════════════════════════════════
    describe('XRPL Verify Link', () => {

        test('verify link points to testnet.xrpl.org', async () => {
            const txHash = 'ABC123DEF456GHI789';
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ tx_hash: txHash })],
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('XRPL');

            const link = screen.getByText('XRPL').closest('a');
            expect(link?.href).toContain('testnet.xrpl.org');
            expect(link?.href).toContain(txHash);
        });

        test('verify link opens in new tab', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction()],
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('XRPL');

            const link = screen.getByText('XRPL').closest('a');
            expect(link?.target).toBe('_blank');
            expect(link?.rel).toContain('noopener');
        });

        test('no verify link when tx_hash is empty', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: [makeTransaction({ tx_hash: '' })],
            });

            render(<TransactionHistoryCard />);

            await screen.findByText('City Parking'); 

            expect(screen.queryByText('XRPL')).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 10: SEARCH RESETS PAGINATION
    // ════════════════════════════════════════════════════
    describe('Search Resets Pagination', () => {

        test('searching resets to page 1', async () => {
            mockApiService.get.mockResolvedValue({
                transactions: make6Transactions(),
            });

            render(<TransactionHistoryCard />);
            await screen.findByText('Parking Spot 1');

            // Go to page 2
            fireEvent.click(screen.getByText('Next'));
            await screen.findByText('Parking Spot 6');

            // Search - should go back to page 1 of results
            const input = screen.getByPlaceholderText('Search hash...');
            fireEvent.change(input, { target: { value: 'Parking' } });

            // Should show page 1 results again
            await screen.findByText('Parking Spot 1');
            expect(screen.getByText('Parking Spot 1')).toBeTruthy();
        });
    });
});