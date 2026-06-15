'use client';

import { useFcmToken } from './useFcmToken';

/**
 * Hook to handle FCM token cleanup on logout
 * Removes the current device's FCM token from the backend
 */
export const useFcmTokenCleanup = () => {
  const { token, removeToken } = useFcmToken();

  const cleanupOnLogout = async () => {
    if (token) {
      try {
        console.log('🧹 Cleaning up FCM token on logout...');
        await removeToken(token);
        console.log('✅ FCM token cleaned up successfully');
      } catch (err) {
        console.error('⚠️ Failed to cleanup FCM token:', err);
        // Don't throw - logout should proceed even if cleanup fails
      }
    }
  };

  return { cleanupOnLogout, hasToken: !!token };
};
