// lib/api/endpoints.ts

export const API_ENDPOINTS = {
  // Auth
  WEB3AUTH_LOGIN: '/auth/web3auth',
  ADMIN_LOGIN: '/auth/admin/login',
  AUTH_ME: '/auth/me',

  // Spots
  SPOTS: '/spots',
  PENDING_SPOTS: '/spots/pending',

  // Bookings
  BOOKINGS: '/bookings',

  // Payments
  GENERATE_WALLET: '/payments/generate-wallet',
  BALANCE: '/payments/balance',
  PROCESS_PAYMENT: '/payments/process',
  TRANSACTIONS: '/payments/transactions',
  SELLER_TRANSACTIONS: '/payments/seller/transactions', 
  ADMIN_BALANCE: '/payments/admin/balance',
  VERIFY_TX: '/payments/verify',
};