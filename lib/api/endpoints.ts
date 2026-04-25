// lib/api/endpoints.ts

export const API_ENDPOINTS = {
  // Auth
  XAMAN_LOGIN: '/auth/xaman',        
  ADMIN_LOGIN: '/auth/admin/login',
  AUTH_ME: '/auth/me',

  // Spots
  SPOTS: '/spots',
  PENDING_SPOTS: '/spots/pending',
  ADMIN_TOGGLE_SPOT: (spotId: string) => `/spots/${spotId}/admin-toggle`,

  SPOT_IMAGES : (spotId: string) => `/spots/${spotId}/images`,

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