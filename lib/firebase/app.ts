// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlNrHD9EqEebJAvjzuQPW_SB5etsfGOg0",
  authDomain: "park-chain-2026.firebaseapp.com",
  projectId: "park-chain-2026",
  storageBucket: "park-chain-2026.firebasestorage.app",
  messagingSenderId: "798392656405",
  appId: "1:798392656405:web:5d96db31c38699ad81a41c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Messaging - only in browser with Service Worker support
let messaging: any = null;

const isMessagingSupported = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for Service Worker support
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  // Check for required APIs
  if (!('indexedDB' in window)) {
    return false;
  }
  
  return true;
};

try {
  if (isMessagingSupported()) {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized successfully');
  } else {
    console.log('📱 Firebase Messaging not supported in this environment (SSR or missing Service Worker)');
  }
} catch (error: any) {
  console.log('📱 Firebase Messaging initialization skipped:', error?.code || error?.message || error);
}

export { messaging, onMessage };