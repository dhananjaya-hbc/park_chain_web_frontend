// __tests__/admin/transactions/TransactionTable.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionTable from '@/app/(protected)/admin/transactions/Components/TransactionTable';

// ── Mocks ─────────────────────────────────────────────
jest.mock('@/lib/api/apiService', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

jest.mock('@/lib/api/endpoints', () => ({
    API_ENDPOINTS: {
        TRANSACTIONS: '/payments/transactions',
    },
}));

import apiService from '@/lib/api/apiService';
const mockApi = apiService as jest.Mocked<typeof apiService>;

// ── Transaction factory ───────────────────────────────
const makeTx = (overrides: Record<string, string> = {}) => ({
    id: 'tx-uuid-1',
    booking_id: 'booking-uuid-1',
    tx_hash: 'ABCDEF1234567890WXYZ',
    from_address: 'rDriverWallet123456',
    to_address: 'rAdminWallet789012',
    amount_xrp: '4.000000',
    tx_type: 'driver_to_admin',
    status: 'validated',
    created_at: '2025-06-15T10:00:00Z',
    spot_title: 'City Parking',
    driver_name: 'John Smith',
    owner_name: 'Jane Owner',
    ...overrides,
});

const make11Txs = () =>
    Array.from({ length: 11 }, (_, i) =>
        makeTx({
            id: `tx-${i + 1}`,
            tx_hash: `HASH${i + 1}ABCDEF12345678`,
            spot_title: `Parking Spot ${i + 1}`,
        })
    );

describe('TransactionTable Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: LOADING STATE
    // ════════════════════════════════════════════════════
    describe('Loading State', () => {

        test('shows loading spinner initially', () => {
            mockApi.get.mockImplementation(
                () => new Promise(() => { })
            );
            render(<TransactionTable />);

            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeTruthy();
        });

        test('shows loading text', () => {
            mockApi.get.mockImplementation(
                () => new Promise(() => { })
            );
            render(<TransactionTable />);

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
            mockApi.get.mockResolvedValue({ transactions: [] });
        });

        test('shows All Transactions title', async () => {
            render(<TransactionTable />);
            await screen.findByText('All Transactions');
            expect(screen.getByText('All Transactions')).toBeTruthy();
        });

        test('shows table column headers', async () => {
            render(<TransactionTable />);
            await screen.findByText('All Transactions');

            expect(screen.getByText('Transaction')).toBeTruthy();
            expect(screen.getByText('Type')).toBeTruthy();
            expect(screen.getByText('Status')).toBeTruthy();
            expect(screen.getByText('Amount')).toBeTruthy();
            expect(screen.getByText('Verify')).toBeTruthy();
        });

        test('shows search input', async () => {
            render(<TransactionTable />);
            await screen.findByText('All Transactions');

            expect(
                screen.getByPlaceholderText('Search hash, spot, driver...')
            ).toBeTruthy();
        });

        test('shows filter buttons', async () => {
            render(<TransactionTable />);
            await screen.findByText('All Transactions');

            expect(screen.getByText('All')).toBeTruthy();
            expect(screen.getByText('Driver → Admin')).toBeTruthy();
            expect(screen.getByText('Admin → Seller')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: EMPTY STATE
    // ════════════════════════════════════════════════════
    describe('Empty State', () => {

        test('shows no transactions message', async () => {
            mockApi.get.mockResolvedValue({ transactions: [] });
            render(<TransactionTable />);

            await screen.findByText('No transactions yet');
            expect(screen.getByText('No transactions yet')).toBeTruthy();
        });

        test('shows filter message when search active', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [makeTx()],
            });
            render(<TransactionTable />);
            await screen.findByText('City Parking');

            const input = screen.getByPlaceholderText(
                'Search hash, spot, driver...'
            );
            fireEvent.change(input, {
                target: { value: 'nonexistent999' },
            });

            await screen.findByText(
                'No transactions match your filters'
            );
            expect(
                screen.getByText('No transactions match your filters')
            ).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: DATA DISPLAY
    // ════════════════════════════════════════════════════
    describe('Data Display', () => {

        test('shows spot title', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [makeTx({ spot_title: 'Airport Parking' })],
            });
            render(<TransactionTable />);

            await screen.findByText('Airport Parking');
            expect(screen.getByText('Airport Parking')).toBeTruthy();
        });

        test('shows driver name for driver_to_admin tx', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        tx_type: 'driver_to_admin',
                        driver_name: 'Alice Driver',
                    }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText('Alice Driver');
            expect(screen.getByText('Alice Driver')).toBeTruthy();
        });

        test('shows owner name for admin_to_seller tx', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        tx_type: 'admin_to_seller',
                        owner_name: 'Bob Owner',
                    }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText('Bob Owner');
            expect(screen.getByText('Bob Owner')).toBeTruthy();
        });

        test('shows Driver → Admin type badge', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [makeTx({ tx_type: 'driver_to_admin' })],
            });
            render(<TransactionTable />);

            await screen.findByText('Driver → Admin');
            expect(screen.getByText('Driver → Admin')).toBeTruthy();
        });

        test('shows Admin → Seller type badge', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({ tx_type: 'admin_to_seller' }),
                ],
            });
            render(<TransactionTable />);

            // Use getAllByText since it appears in button + badge
            await screen.findByText('All Transactions');
            const elements = screen.getAllByText('Admin → Seller');

            // At least one should be a span (the badge)
            const badge = elements.find(
                (el) => el.tagName === 'SPAN'
            );
            expect(badge).toBeTruthy();
        });
        test('shows validated status badge', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [makeTx({ status: 'validated' })],
            });
            render(<TransactionTable />);

            await screen.findByText('Validated');
            expect(screen.getByText('Validated')).toBeTruthy();
        });

        test('shows + prefix for driver_to_admin amount', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        tx_type: 'driver_to_admin',
                        amount_xrp: '4.000000',
                    }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText('+ 4.0000 XRP');
            expect(screen.getByText('+ 4.0000 XRP')).toBeTruthy();
        });

        test('shows - prefix for admin_to_seller amount', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        tx_type: 'admin_to_seller',
                        amount_xrp: '3.200000',
                    }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText('- 3.2000 XRP');
            expect(screen.getByText('- 3.2000 XRP')).toBeTruthy();
        });

        test('shows XRPL verify link', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({ tx_hash: 'ABCDEF1234567890WXYZ' }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText('XRPL');
            const link = screen.getByText('XRPL').closest('a');
            expect(link).toBeTruthy();
            expect(link?.href).toContain('testnet.xrpl.org');
        });

        test('shows shortened tx hash', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({ tx_hash: 'ABCDEF1234567890WXYZ' }),
                ],
            });
            render(<TransactionTable />);

            // shortenHash uses 8 chars: ABCDEF12...WXYZ
            await screen.findByText('ABCDEF12...WXYZ');
            expect(screen.getByText('ABCDEF12...WXYZ')).toBeTruthy();
        });

        test('shows date correctly', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({ created_at: '2025-06-15T12:00:00Z' }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText('Jun 15, 2025');
            expect(screen.getByText('Jun 15, 2025')).toBeTruthy();
        });

        test('shows Booking Payment when no spot title', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [makeTx({ spot_title: '' })],
            });
            render(<TransactionTable />);

            await screen.findByText('Booking Payment');
            expect(screen.getByText('Booking Payment')).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 5: TYPE FILTER BUTTONS
    // ════════════════════════════════════════════════════
    // Replace the entire Type Filter Buttons describe block:

    // ── Fix: Update beforeEach in Type Filter Buttons describe ──
    describe('Type Filter Buttons', () => {

        beforeEach(() => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        id: 'tx-filter-1',  
                        tx_type: 'driver_to_admin',
                        spot_title: 'Filter Spot 1',
                    }),
                    makeTx({
                        id: 'tx-filter-2',
                        tx_type: 'driver_to_admin',
                        spot_title: 'Filter Spot 2',
                    }),
                    makeTx({
                        id: 'tx-filter-3',  
                        tx_type: 'admin_to_seller',
                        spot_title: 'Filter Spot 3',
                    }),
                ],
            });
        });

        test('All filter shows all transactions', async () => {
            render(<TransactionTable />);

            //  Wait for unique text to load
            await screen.findByText('Filter Spot 1');

            //  Check all 3 spots visible
            expect(screen.getByText('Filter Spot 1')).toBeTruthy();
            expect(screen.getByText('Filter Spot 2')).toBeTruthy();
            expect(screen.getByText('Filter Spot 3')).toBeTruthy();
        });

        test('Driver → Admin filter shows only those', async () => {
            render(<TransactionTable />);
            await screen.findByText('Filter Spot 1');

            const driverAdminBtn = screen.getByRole('button', {
                name: 'Driver → Admin',
            });
            fireEvent.click(driverAdminBtn);

            // Filter Spot 1 and 2 remain, Spot 3 gone
            await waitFor(() => {
                expect(screen.queryByText('Filter Spot 3')).toBeNull();
            });
            expect(screen.getByText('Filter Spot 1')).toBeTruthy();
            expect(screen.getByText('Filter Spot 2')).toBeTruthy();
        });

        test('Admin → Seller filter shows only those', async () => {
            render(<TransactionTable />);
            await screen.findByText('Filter Spot 1');

            const adminSellerBtn = screen.getByRole('button', {
                name: 'Admin → Seller',
            });
            fireEvent.click(adminSellerBtn);

            // Only Spot 3 remains
            await waitFor(() => {
                expect(screen.queryByText('Filter Spot 1')).toBeNull();
                expect(screen.queryByText('Filter Spot 2')).toBeNull();
            });
            expect(screen.getByText('Filter Spot 3')).toBeTruthy();
        });

        test('clicking All restores all transactions', async () => {
            render(<TransactionTable />);
            await screen.findByText('Filter Spot 1');

            // Filter to driver_to_admin
            const driverAdminBtn = screen.getByRole('button', {
                name: 'Driver → Admin',
            });
            fireEvent.click(driverAdminBtn);

            await waitFor(() => {
                expect(screen.queryByText('Filter Spot 3')).toBeNull();
            });

            // Click All
            const allBtn = screen.getByRole('button', { name: 'All' });
            fireEvent.click(allBtn);

            // All spots back
            await screen.findByText('Filter Spot 3');
            expect(screen.getByText('Filter Spot 1')).toBeTruthy();
            expect(screen.getByText('Filter Spot 2')).toBeTruthy();
            expect(screen.getByText('Filter Spot 3')).toBeTruthy();
        });
    });
    // ════════════════════════════════════════════════════
    // GROUP 6: SEARCH
    // ════════════════════════════════════════════════════
    describe('Search Functionality', () => {

        beforeEach(() => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        id: 'tx-1',
                        spot_title: 'City Parking',
                        driver_name: 'Alice Smith',
                    }),
                    makeTx({
                        id: 'tx-2',
                        spot_title: 'Airport Parking',
                        driver_name: 'Bob Jones',
                    }),
                ],
            });
        });

        test('search filters by spot title', async () => {
            render(<TransactionTable />);
            await screen.findByText('City Parking');

            const input = screen.getByPlaceholderText(
                'Search hash, spot, driver...'
            );
            fireEvent.change(input, { target: { value: 'City' } });

            await waitFor(() => {
                expect(
                    screen.queryByText('Airport Parking')
                ).toBeNull();
            });
            expect(screen.getByText('City Parking')).toBeTruthy();
        });

        test('search filters by driver name', async () => {
            render(<TransactionTable />);
            await screen.findByText('Alice Smith');

            const input = screen.getByPlaceholderText(
                'Search hash, spot, driver...'
            );
            fireEvent.change(input, { target: { value: 'Alice' } });

            await waitFor(() => {
                expect(screen.queryByText('Bob Jones')).toBeNull();
            });
            expect(screen.getByText('Alice Smith')).toBeTruthy();
        });

        test('empty search shows all', async () => {
            render(<TransactionTable />);
            await screen.findByText('Alice Smith');

            const input = screen.getByPlaceholderText(
                'Search hash, spot, driver...'
            );
            fireEvent.change(input, { target: { value: 'Alice' } });

            await waitFor(() => {
                expect(screen.queryByText('Bob Jones')).toBeNull();
            });

            fireEvent.change(input, { target: { value: '' } });

            await waitFor(() => {
                expect(screen.getByText('Bob Jones')).toBeTruthy();
            });
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 7: PAGINATION
    // ════════════════════════════════════════════════════
    describe('Pagination', () => {

        test('shows first 10 when 11 transactions', async () => {
            mockApi.get.mockResolvedValue({
                transactions: make11Txs(),
            });
            render(<TransactionTable />);

            await screen.findByText('Parking Spot 1');

            expect(screen.getByText('Parking Spot 1')).toBeTruthy();
            expect(screen.getByText('Parking Spot 10')).toBeTruthy();
            expect(
                screen.queryByText('Parking Spot 11')
            ).toBeNull();
        });

        test('shows pagination controls when > 10 items', async () => {
            mockApi.get.mockResolvedValue({
                transactions: make11Txs(),
            });
            render(<TransactionTable />);
            await screen.findByText('Parking Spot 1');

            expect(screen.getByText('Previous')).toBeTruthy();
            expect(screen.getByText('Next')).toBeTruthy();
        });

        test('no pagination when <= 10 items', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [makeTx()],
            });
            render(<TransactionTable />);
            await screen.findByText('City Parking');

            expect(screen.queryByText('Previous')).toBeNull();
            expect(screen.queryByText('Next')).toBeNull();
        });

        test('Next navigates to page 2', async () => {
            mockApi.get.mockResolvedValue({
                transactions: make11Txs(),
            });
            render(<TransactionTable />);
            await screen.findByText('Parking Spot 1');

            fireEvent.click(screen.getByText('Next'));

            await screen.findByText('Parking Spot 11');
            expect(screen.getByText('Parking Spot 11')).toBeTruthy();
            expect(
                screen.queryByText('Parking Spot 1')
            ).toBeNull();
        });

        test('Previous goes back to page 1', async () => {
            mockApi.get.mockResolvedValue({
                transactions: make11Txs(),
            });
            render(<TransactionTable />);
            await screen.findByText('Parking Spot 1');

            fireEvent.click(screen.getByText('Next'));
            await screen.findByText('Parking Spot 11');

            fireEvent.click(screen.getByText('Previous'));
            await screen.findByText('Parking Spot 1');
            expect(screen.getByText('Parking Spot 1')).toBeTruthy();
        });

        test('shows correct pagination text', async () => {
            mockApi.get.mockResolvedValue({
                transactions: make11Txs(),
            });
            render(<TransactionTable />);
            await screen.findByText('Parking Spot 1');

            expect(
                screen.getByText(/Showing 1-10 of 11/)
            ).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 8: SUMMARY DISPLAY
    // ════════════════════════════════════════════════════
    describe('Summary Display', () => {

        test('shows total in and out when filter is all', async () => {
            mockApi.get.mockResolvedValue({
                transactions: [
                    makeTx({
                        tx_type: 'driver_to_admin',
                        amount_xrp: '4.000000',
                    }),
                    makeTx({
                        tx_type: 'admin_to_seller',
                        amount_xrp: '3.200000',
                    }),
                ],
            });
            render(<TransactionTable />);

            await screen.findByText(/4.00 XRP in/);
            expect(screen.getByText(/4.00 XRP in/)).toBeTruthy();
            expect(screen.getByText(/3.20 XRP out/)).toBeTruthy();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 9: API CALL
    // ════════════════════════════════════════════════════
    describe('API Call', () => {

        test('calls transactions endpoint', async () => {
            mockApi.get.mockResolvedValue({ transactions: [] });
            render(<TransactionTable />);

            await screen.findByText('No transactions yet');
            expect(mockApi.get).toHaveBeenCalledWith(
                '/payments/transactions'
            );
        });

        test('calls API exactly once', async () => {
            mockApi.get.mockResolvedValue({ transactions: [] });
            render(<TransactionTable />);

            await screen.findByText('No transactions yet');
            expect(mockApi.get).toHaveBeenCalledTimes(1);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 10: ERROR HANDLING
    // ════════════════════════════════════════════════════
    describe('Error Handling', () => {

        test('shows no transactions when API fails', async () => {
            mockApi.get.mockRejectedValue(
                new Error('Network error')
            );
            render(<TransactionTable />);

            await screen.findByText('No transactions yet');
            expect(screen.getByText('No transactions yet')).toBeTruthy();
        });

        test('handles missing transactions key', async () => {
            mockApi.get.mockResolvedValue({});
            render(<TransactionTable />);

            await screen.findByText('No transactions yet');
            expect(screen.getByText('No transactions yet')).toBeTruthy();
        });
    });
});