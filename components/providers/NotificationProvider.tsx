'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { onMessage } from '@/lib/firebase/app';
import { messaging } from '@/lib/firebase/app';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { addNotification: addToast } = useNotificationStore();
  const { refetch } = useNotifications();
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Listen for background notifications from Service Worker
  useEffect(() => {
    try {
      broadcastChannelRef.current = new BroadcastChannel('park_chain_notifications');
      
      broadcastChannelRef.current.onmessage = async (event) => {
        const { type, title, body, notificationType } = event.data;
        
        if (type === 'NEW_NOTIFICATION') {
          console.log('📢 Background notification received — showing toast and refetching from backend');
          
          // Show toast for background notification
          addToast({
            title: title || 'Notification',
            body: body || '',
            type: notificationType || 'info',
          });
          
          // Refetch notifications from backend to update navbar
          try {
            await refetch();
          } catch (error) {
            console.error('❌ Failed to refetch notifications:', error);
          }
        }
      };
      
      console.log('👂 Listening for Service Worker notifications via Broadcast Channel');
    } catch (error) {
      console.error('❌ Broadcast Channel not supported:', error);
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [addToast, refetch]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging) {
      console.log('📱 Firebase messaging not available for foreground notifications');
      return;
    }

    console.log('👂 Listening for foreground notifications...');

    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('📬 Foreground message received:', payload);

        const title = payload.notification?.title || 'Notification';
        const body = payload.notification?.body || '';
        const type = (payload.data?.type as any) || 'info';

        // Show toast notification (temporary on-screen)
        addToast({
          title,
          body,
          type,
        });

        // Refetch notifications from backend (the backend already persisted it)
        refetch().catch((error) => {
          console.error('❌ Failed to refetch notifications after foreground message:', error);
        });
      });
    } catch (error) {
      console.error('❌ Failed to setup foreground message listener:', error);
      return;
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [addToast, refetch]);

  return <>{children}</>;
}
