// lib/api/endpoints.ts

export const API_ENDPOINTS = {
  // Auth
  XAMAN_LOGIN: '/auth/xaman',        
  ADMIN_LOGIN: '/auth/admin/login',
  AUTH_ME: '/auth/me',

  // Push Notifications (FCM)
  NOTIFICATIONS_TOKEN_REGISTER: '/notifications/token',
  NOTIFICATIONS_TOKEN_REMOVE: '/notifications/token',
  NOTIFICATIONS_TOKENS_LIST: '/notifications/tokens',

  // Notification History (CRUD)
  NOTIFICATIONS_LIST: '/notifications',
  NOTIFICATIONS_UNREAD_COUNT: '/notifications/unread',
  NOTIFICATIONS_MARK_READ: '/notifications',       // PUT /:id/read
  NOTIFICATIONS_MARK_ALL_READ: '/notifications/read-all',
  NOTIFICATIONS_DELETE: '/notifications',           // DELETE /:id
  NOTIFICATIONS_DELETE_ALL: '/notifications',       // DELETE /

  // Spots
  SPOTS: '/spots',
  PENDING_SPOTS: '/spots/pending',
  ADMIN_TOGGLE_SPOT: (spotId: string) => `/spots/${spotId}/admin-toggle`,

  SPOT_IMAGES : (spotId: string) => `/spots/${spotId}/images`,

    // Users
  USERS: '/users',

  // Bookings
  BOOKINGS: '/bookings',

  // Payments
  BALANCE: '/payments/balance',
  TRANSACTIONS: '/payments/transactions',
  SELLER_TRANSACTIONS: '/payments/seller/transactions',
  SELLER_EARNINGS_CHART: '/payments/seller/earnings-chart',
  ADMIN_BALANCE: '/payments/admin/balance',
  ADMIN_REVENUE_CHART: '/payments/admin/revenue-chart',
  VERIFY_TX: '/payments/verify',
  GENERATE_WALLET: '/payments/generate-wallet',

  // Reviews
  REVIEWS: '/reviews',
};