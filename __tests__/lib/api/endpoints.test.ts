// __tests__/lib/api/endpoints.test.ts

import { API_ENDPOINTS } from '@/lib/api/endpoints';

describe('API_ENDPOINTS', () => {

  // ════════════════════════════════════════════════════
  // GROUP 1: ENDPOINT EXISTENCE
  // ════════════════════════════════════════════════════
  describe('Endpoint Existence', () => {

    test('has XAMAN_LOGIN endpoint', () => {
      expect(API_ENDPOINTS.XAMAN_LOGIN).toBeDefined();
    });

    test('has ADMIN_LOGIN endpoint', () => {
      expect(API_ENDPOINTS.ADMIN_LOGIN).toBeDefined();
    });

    test('has AUTH_ME endpoint', () => {
      expect(API_ENDPOINTS.AUTH_ME).toBeDefined();
    });

    test('has SPOTS endpoint', () => {
      expect(API_ENDPOINTS.SPOTS).toBeDefined();
    });

    test('has BOOKINGS endpoint', () => {
      expect(API_ENDPOINTS.BOOKINGS).toBeDefined();
    });

    test('has BALANCE endpoint', () => {
      expect(API_ENDPOINTS.BALANCE).toBeDefined();
    });

    test('has TRANSACTIONS endpoint', () => {
      expect(API_ENDPOINTS.TRANSACTIONS).toBeDefined();
    });

    test('has SELLER_TRANSACTIONS endpoint', () => {
      expect(API_ENDPOINTS.SELLER_TRANSACTIONS).toBeDefined();
    });

    test('has ADMIN_BALANCE endpoint', () => {
      expect(API_ENDPOINTS.ADMIN_BALANCE).toBeDefined();
    });

    test('has VERIFY_TX endpoint', () => {
      expect(API_ENDPOINTS.VERIFY_TX).toBeDefined();
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: ENDPOINT VALUES
  // ════════════════════════════════════════════════════
  describe('Endpoint Values', () => {

    test('BOOKINGS is /bookings', () => {
      expect(API_ENDPOINTS.BOOKINGS).toBe('/bookings');
    });

    test('SPOTS is /spots', () => {
      expect(API_ENDPOINTS.SPOTS).toBe('/spots');
    });

    test('BALANCE is /payments/balance', () => {
      expect(API_ENDPOINTS.BALANCE).toBe('/payments/balance');
    });

    test('TRANSACTIONS is /payments/transactions', () => {
      expect(API_ENDPOINTS.TRANSACTIONS)
        .toBe('/payments/transactions');
    });

    test('SELLER_TRANSACTIONS is /payments/seller/transactions', () => {
      expect(API_ENDPOINTS.SELLER_TRANSACTIONS)
        .toBe('/payments/seller/transactions');
    });

    test('ADMIN_BALANCE is /payments/admin/balance', () => {
      expect(API_ENDPOINTS.ADMIN_BALANCE)
        .toBe('/payments/admin/balance');
    });

    test('AUTH_ME is /auth/me', () => {
      expect(API_ENDPOINTS.AUTH_ME).toBe('/auth/me');
    });

    test('ADMIN_LOGIN is /auth/admin/login', () => {
      expect(API_ENDPOINTS.ADMIN_LOGIN).toBe('/auth/admin/login');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: ENDPOINT FORMAT
  // ════════════════════════════════════════════════════
  describe('Endpoint Format', () => {

    test('all endpoints start with /', () => {
      Object.values(API_ENDPOINTS).forEach((endpoint) => {
        expect(endpoint).toMatch(/^\//);
      });
    });

    test('no endpoint has trailing slash', () => {
      Object.values(API_ENDPOINTS).forEach((endpoint) => {
        expect(endpoint).not.toMatch(/\/$/);
      });
    });

    test('no endpoint contains full URL', () => {
      Object.values(API_ENDPOINTS).forEach((endpoint) => {
        expect(endpoint).not.toContain('http');
        expect(endpoint).not.toContain('localhost');
      });
    });

    test('payment endpoints are under /payments/', () => {
      expect(API_ENDPOINTS.BALANCE)
        .toContain('/payments/');
      expect(API_ENDPOINTS.TRANSACTIONS)
        .toContain('/payments/');
      expect(API_ENDPOINTS.SELLER_TRANSACTIONS)
        .toContain('/payments/');
      expect(API_ENDPOINTS.ADMIN_BALANCE)
        .toContain('/payments/');
    });

    test('auth endpoints are under /auth/', () => {
      expect(API_ENDPOINTS.XAMAN_LOGIN).toContain('/auth/');
      expect(API_ENDPOINTS.ADMIN_LOGIN).toContain('/auth/');
      expect(API_ENDPOINTS.AUTH_ME).toContain('/auth/');
    });
  });
});