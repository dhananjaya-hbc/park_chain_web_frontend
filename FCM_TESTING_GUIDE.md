# FCM userId Implementation - Quick Testing Guide

## ✅ What's Been Set Up

The frontend is now ready to receive userId from the FCM payload:

1. **Service Worker** (`/public/firebase-messaging-sw.js`)
   - Extracts userId from `data.userId` or `data.user_id`
   - Logs exact status to Service Worker console
   - Saves notification with userId to IndexDB

2. **NotificationProvider** (`/components/providers/NotificationProvider.tsx`)
   - Extracts userId from foreground message payload
   - Passes userId to IndexDB save function
   - Logs extraction in browser console

3. **useNotifications Hook** (`/hooks/useNotifications.ts`)
   - Prioritizes userId from FCM payload
   - Falls back to role/session userId
   - Logs which source was used

4. **Backend Guide** (`/BACKEND_FCM_INTEGRATION.md`)
   - Complete specification for sending notifications
   - Example implementations (Python, Node.js, cURL)
   - Troubleshooting section

## 🧪 How to Test

### Test 1: Verify Payload Format

When backend sends FCM notification, it must include:

```json
{
  "notification": {
    "title": "Test Title",
    "body": "Test Body"
  },
  "data": {
    "userId": "admin_wallet_address_or_seller_wallet",
    "type": "success"
  }
}
```

### Test 2: Check Foreground Message (App Open)

1. **Open app in browser**
2. **Open DevTools → Console**
3. **Send notification from backend**
4. **Look for these logs:**

```
📬 Foreground message received: { ... }
🔑 Extracted userId from FCM payload: admin_wallet_12345
💾 Saving notification: { title: "...", userIdFromPayload: "admin_wallet_12345" }
✅ Notification added to IndexDB with userId: admin_wallet_12345
```

❌ **Problem:** If you see `null` or `undefined`:
- Backend not sending `data.userId` field
- Check backend code sends the field correctly

### Test 3: Check Background Message (App Closed)

1. **Close the app completely**
2. **Open DevTools → Application → Service Workers**
3. **Send notification from backend**
4. **Check Service Worker console for:**

```
[SW] 📬 ===== BACKGROUND MESSAGE RECEIVED =====
[SW] 📬 Full FCM Payload: { ... }
[SW] 🔑 Extracted userId from FCM payload: admin_wallet_12345
[SW] ✅ Using userId from FCM payload: admin_wallet_12345
[SW] ✅ IndexDB Record Structure: { id: "admin_wallet_12345_...", userId: "admin_wallet_12345" }
[SW] 💾 Notification saved to IndexDB successfully
```

❌ **Problem:** If you see `[SW] ❌ FALLBACK: Setting userId to "unknown"`:
- Backend not sending `data.userId`
- userId field is null/empty in payload
- Check backend implementation

### Test 4: Verify IndexDB Storage

1. **Open DevTools → Storage → IndexedDB → park_chain_db → notifications**
2. **Click on a notification record**
3. **Verify structure:**

```
✅ id: "admin_wallet_12345_1704067200000_abc123"
✅ userId: "admin_wallet_12345"
✅ title: "Test Title"
✅ body: "Test Body"
✅ type: "success"
✅ isRead: false
✅ timestamp: 1704067200000
```

❌ **Problem:** If you see `userId: "unknown"`:
- Backend not sending userId in notification data
- See backend guide at `/BACKEND_FCM_INTEGRATION.md`

### Test 5: Check Navbar Update

1. **Open app (foreground notification)**
2. **Send notification from backend**
3. **Navbar notification dropdown should show:**
   - New notification appears instantly (no refresh needed)
   - Unread count increments
   - Correct title and body

## 📋 Backend Checklist

Your backend must:

- [ ] Extract user's wallet address (admin_wallet or seller_wallet)
- [ ] Send it in notification `data.userId` field
- [ ] Use valid FCM token from `/api/notifications/tokens` endpoint
- [ ] Include `notification.title` and `notification.body`
- [ ] Optionally include `data.type` ('success'|'error'|'info'|'warning')

Example:
```python
send_notification(
    fcm_token="e_abc123...",
    title="Order Confirmed",
    body="Your order #123 is confirmed",
    user_id="0x123abc...",  # ← THIS IS KEY
    notification_type="success"
)
```

## 🔧 Debugging Commands

### View all notifications in IndexDB

Open browser console and run:
```javascript
const db = await new Promise(resolve => {
  const req = indexedDB.open('park_chain_db');
  req.onsuccess = () => resolve(req.result);
});
const tx = db.transaction(['notifications']);
const store = tx.objectStore('notifications');
const all = await new Promise(resolve => {
  const req = store.getAll();
  req.onsuccess = () => resolve(req.result);
});
console.table(all);
```

### View notifications by userId

```javascript
const userId = "admin_wallet_12345";
const db = await new Promise(resolve => {
  const req = indexedDB.open('park_chain_db');
  req.onsuccess = () => resolve(req.result);
});
const tx = db.transaction(['notifications']);
const store = tx.objectStore('notifications');
const index = store.index('userId');
const notifs = await new Promise(resolve => {
  const req = index.getAll(userId);
  req.onsuccess = () => resolve(req.result);
});
console.table(notifs);
```

## 📚 Documentation Files

- **[BACKEND_FCM_INTEGRATION.md](BACKEND_FCM_INTEGRATION.md)** - Complete backend integration guide
- **[NOTIFICATION_QUICK_START.md](NOTIFICATION_QUICK_START.md)** - 5-minute overview
- **[NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md)** - Architecture details
- **[NOTIFICATION_TROUBLESHOOTING.md](NOTIFICATION_TROUBLESHOOTING.md)** - 30+ solutions

## ✅ Next Steps

1. **Implement backend** - Send userId in FCM payload
2. **Send test notification** - From backend to your wallet address
3. **Verify logs** - Check browser console for correct userId extraction
4. **Check IndexDB** - Confirm notification saved with correct userId
5. **Test navbar** - Click and interact with notifications

Once backend is sending userId, the system will work end-to-end! 🚀
