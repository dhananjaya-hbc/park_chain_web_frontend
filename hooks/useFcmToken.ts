'use client';

import { useState, useCallback } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase/app';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const registerToken = useCallback(async (fcmToken: string) => {
    try {
      console.log('📤 Registering FCM token with backend...');
      
      // Get device label (browser info)
      const deviceLabel = `${navigator.userAgent.substring(0, 50)}...`;
      
      await apiService.post(API_ENDPOINTS.NOTIFICATIONS_TOKEN_REGISTER, {
        fcm_token: fcmToken,
        device_type: 'web',
        device_label: deviceLabel,
      });
      console.log('✅ FCM token registered successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register FCM token';
      console.error('❌ Error registering FCM token:', errorMessage);
      console.error('Full error:', err);
      throw err;
    }
  }, []);

  const removeToken = useCallback(async (fcmToken: string) => {
    try {
      console.log('🗑️ Removing FCM token from backend...');
      await apiService.delete(API_ENDPOINTS.NOTIFICATIONS_TOKEN_REMOVE, {
        fcm_token: fcmToken,
      });
      console.log('✅ FCM token removed successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove FCM token';
      console.error('❌ Error removing FCM token:', errorMessage);
      throw err;
    }
  }, []);

  const listTokens = useCallback(async () => {
    try {
      console.log('📋 Fetching active FCM tokens from backend...');
      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS_TOKENS_LIST);
      console.log('✅ Tokens fetched successfully:', response);
      return response.tokens || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tokens';
      console.error('❌ Error fetching tokens:', errorMessage);
      throw err;
    }
  }, []);

  const initializeFcm = useCallback(async () => {
    try {
      console.log('🚀 Starting FCM initialization...');

      // Check if messaging is supported
      if (!messaging) {
        console.log('⚠️ Firebase messaging not supported in this environment');
        setError('Firebase messaging not supported');
        setIsLoading(false);
        return;
      }

      console.log('✅ Firebase messaging is available');

      // Check if VAPID key is configured
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        const errorMsg = 'VAPID key not configured in .env.local';
        console.error('❌', errorMsg);
        console.warn('ℹ️ Add this to your .env.local:');
        console.warn('NEXT_PUBLIC_FIREBASE_VAPID_KEY=<your-vapid-key>');
        console.warn('Get it from Firebase Console → Project Settings → Cloud Messaging');
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      console.log('✅ VAPID key is configured');

      // Register Service Worker
      if ('serviceWorker' in navigator) {
        try {
          console.log('🔧 Registering Service Worker from /firebase-messaging-sw.js...');
          
          // Unregister any previous service workers with the same script
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            if (registration.scope === new URL('/', window.location.origin).href) {
              console.log('🧹 Cleaning up existing service worker registration');
              // Don't unregister, just note it
            }
          }
          
          const registration = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js',
            { 
              scope: '/',
              updateViaCache: 'none' // Always fetch the latest version
            }
          );
          console.log('✅ Service Worker registered successfully');
          console.log('📍 Service Worker scope:', registration.scope);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.error('❌ Service Worker registration failed');
          console.error('Error:', errorMsg);
          console.error('Full error object:', err);
          console.warn('⚠️ Background notifications will not work, but foreground notifications will still function');
          // Don't stop initialization - we can still get FCM token for foreground notifications
        }
      } else {
        console.warn('⚠️ Service Workers not supported in this browser');
      }

      // Request notification permission
      console.log('🔔 Requesting notification permission...');
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('⚠️ Notification permission denied by user');
        setError('Notification permission denied');
        setIsLoading(false);
        return;
      }

      console.log('✅ Notification permission granted');

      // Get FCM token
      console.log('🔑 Requesting FCM token from Firebase...');
      const fcmToken = await getToken(messaging, {
        vapidKey: vapidKey,
      });

      if (fcmToken) {
        console.log('✅ FCM token obtained successfully');
        console.log('📊 Token length:', fcmToken.length, 'characters');
        setToken(fcmToken);
        
        // Register token with backend
        try {
          await registerToken(fcmToken);
        } catch (backendErr) {
          console.error('⚠️ Token obtained but backend registration failed');
          console.error('Backend error:', backendErr);
          // Still set token locally even if backend fails
          setToken(fcmToken);
        }
      } else {
        const errorMsg = 'No FCM token obtained from Firebase';
        console.error('❌', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during FCM initialization';
      console.error('❌ FCM initialization error:', errorMessage);
      console.error('Full error:', err);
      console.error('Error type:', typeof err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [registerToken]);

  // NOTE: Do NOT auto-initialize FCM on mount.
  // Login pages call initializeFcm() explicitly after authentication succeeds,
  // ensuring the JWT token is available for backend registration.

  return { 
    token, 
    isLoading, 
    error, 
    initializeFcm,
    registerToken,
    removeToken,
    listTokens,
  };
};
