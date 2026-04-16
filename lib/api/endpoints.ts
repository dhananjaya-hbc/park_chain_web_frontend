// lib/api/endpoints.ts

export const API_ENDPOINTS = {
  // Auth
  XAMAN_LOGIN: '/auth/xaman',        // ← replaces WEB3AUTH_LOGIN
  ADMIN_LOGIN: '/auth/admin/login',
  AUTH_ME: '/auth/me',

  // Spots
  SPOTS: '/spots',
  PENDING_SPOTS: '/spots/pending',

  // Bookings
  BOOKINGS: '/bookings',

  // Payments
  BALANCE: '/payments/balance',
  TRANSACTIONS: '/payments/transactions',
  SELLER_TRANSACTIONS: '/payments/seller/transactions',
  SELLER_EARNINGS_CHART: '/payments/seller/earnings-chart',
  ADMIN_BALANCE: '/payments/admin/balance',
  VERIFY_TX: '/payments/verify',
  GENERATE_WALLET: '/payments/generate-wallet'
};