// Firebase Service Worker for handling push notifications
// Import Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
const firebaseConfig = {
  apiKey: "AIzaSyDlNrHD9EqEebJAvjzuQPW_SB5etsfGOg0",
  authDomain: "park-chain-2026.firebaseapp.com",
  projectId: "park-chain-2026",
  storageBucket: "park-chain-2026.firebasestorage.app",
  messagingSenderId: "798392656405",
  appId: "1:798392656405:web:5d96db31c38699ad81a41c"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] 📬 Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'Park Chain Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/ParkchainLogo.png',
      badge: '/ParkchainLogo.png',
      data: payload.data || {},
      tag: 'notification',
      requireInteraction: false,
    };

    // Notify all clients to refetch notifications from the backend
    try {
      const channel = new BroadcastChannel('park_chain_notifications');
      channel.postMessage({
        type: 'NEW_NOTIFICATION',
        title: notificationTitle,
        body: notificationOptions.body,
        notificationType: payload.data?.type || 'info',
        timestamp: Date.now()
      });
      console.log('[SW] 📢 Broadcast refetch signal sent to all clients');
      channel.close();
    } catch (error) {
      console.error('[SW] ❌ Broadcast Channel error:', error);
    }

    // Show browser notification
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  console.log('[firebase-messaging-sw.js] ✅ Firebase initialized successfully');
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Firebase initialization error:', error);
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 👆 Notification clicked:', event.notification.title);
  event.notification.close();
  
  // Focus on the window or open a new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
