'use client';

import { useEffect, useState, useCallback } from 'react';
import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

/**
 * Notification shape returned from the backend (PostgreSQL table)
 */
export interface BackendNotification {
  id: number;
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  sent_at: string;
  read_at: string | null;
}

/**
 * Normalized notification shape used by UI components
 */
export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  timestamp: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}

/**
 * Normalize a backend notification to the UI shape
 */
function normalizeNotification(n: BackendNotification): Notification {
  return {
    id: String(n.id),
    title: n.title,
    body: n.body,
    data: n.data,
    isRead: n.is_read,
    timestamp: new Date(n.sent_at).getTime(),
    type: (n.data?.type as Notification['type']) || 'info',
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * Fetch all notifications from the backend
   */
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS_LIST);
      console.log('[useNotifications] 📦 Raw API response:', response);

      // Extract the array from whichever wrapper the backend uses
      const raw: BackendNotification[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.notifications)
          ? response.notifications
          : Array.isArray(response?.data)
            ? response.data
            : [];

      const normalized = raw.map(normalizeNotification);
      setNotifications(normalized);

      // Also update unread count
      const unread = normalized.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch only the unread count from the backend
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
      const count = response.unreadCount ?? response.count ?? 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ Failed to fetch unread count:', error);
    }
  }, []);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await apiService.put(`${API_ENDPOINTS.NOTIFICATIONS_MARK_READ}/${notificationId}/read`);

        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('❌ Failed to mark notification as read:', error);
      }
    },
    []
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await apiService.put(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ);

      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('❌ Failed to mark all as read:', error);
    }
  }, []);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await apiService.delete(`${API_ENDPOINTS.NOTIFICATIONS_DELETE}/${notificationId}`);

      // Optimistic update
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== notificationId);
        const unread = updated.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
        return updated;
      });
    } catch (error) {
      console.error('❌ Failed to delete notification:', error);
    }
  }, []);

  /**
   * Delete all notifications
   */
  const deleteAllNotifications = useCallback(async () => {
    try {
      await apiService.delete(API_ENDPOINTS.NOTIFICATIONS_DELETE_ALL);

      // Optimistic update
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('❌ Failed to delete all notifications:', error);
    }
  }, []);

  /**
   * Fetch notifications on mount
   */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refetch: fetchNotifications,
    fetchUnreadCount,
  };
};
