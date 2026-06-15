# Backend FCM Integration Guide

## Overview

The frontend expects FCM notifications to include the **userId** in the notification payload. This allows the Service Worker to properly attribute notifications to the correct user, even when the app is closed.

## FCM Payload Format

Your backend must send notifications in this exact format:

```javascript
{
  "token": "FCM_TOKEN_FROM_FRONTEND",
  "notification": {
    "title": "Your Notification Title",
    "body": "Your notification message body"
  },
  "data": {
    "userId": "admin_wallet_or_seller_wallet",  // ← REQUIRED
    "type": "success|error|info|warning",       // ← OPTIONAL, defaults to 'info'
    "actionUrl": "/path/to/action"              // ← OPTIONAL, custom data
  }
}
```

## Required Fields

| Field | Location | Required | Description | Example |
|-------|----------|----------|-------------|---------|
| token | root | ✅ Yes | FCM token from `/api/notifications/tokens` | `e_123...` |
| title | notification | ✅ Yes | Notification title | `"Order Confirmed"` |
| body | notification | ✅ Yes | Notification body/message | `"Your order #123 is confirmed"` |
| **userId** | data | ✅ Yes | User identifier (wallet address) | `"0x123abc..."` |

## Optional Fields

| Field | Location | Optional | Description | Example |
|-------|----------|----------|-------------|---------|
| type | data | ✅ Optional | Notification type for UI styling | `"success"`, `"error"`, `"info"`, `"warning"` |
| Custom fields | data | ✅ Optional | Any custom data you need | `"orderId": "123"` |

## Example Backend Implementation

### Python (Flask/FastAPI)

```python
import firebase_admin
from firebase_admin import messaging

def send_notification_to_user(fcm_token, title, body, user_id, notification_type="info"):
    """Send notification with userId in payload"""
    
    message = messaging.Message(
        token=fcm_token,
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data={
            "userId": user_id,           # ← CRITICAL: Include userId
            "type": notification_type,
            "timestamp": str(int(time.time() * 1000))
        }
    )
    
    response = messaging.send(message)
    print(f"✅ Message sent: {response}")
    return response
```

### Node.js (Firebase Admin SDK)

```javascript
const admin = require('firebase-admin');

async function sendNotification(fcmToken, title, body, userId, type = 'info') {
  const message = {
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
    data: {
      userId: userId,              // ← CRITICAL: Include userId
      type: type,
      timestamp: Date.now().toString()
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Message sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending message:', error);
  }
}
```

### cURL (for testing)

```bash
curl -X POST https://fcm.googleapis.com/v1/projects/park-chain-2026/messages:send \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "YOUR_FCM_TOKEN",
      "notification": {
        "title": "Test Notification",
        "body": "This is a test notification"
      },
      "data": {
        "userId": "admin_wallet_12345",
        "type": "success"
      }
    }
  }'
```

## Frontend Reception

### Foreground (App Open)

When the user has the app open:
1. ✅ Service Worker receives message
2. ✅ Extracts `userId` from `data.userId`
3. ✅ Saves to IndexDB with userId
4. ✅ Shows toast notification (5 seconds)
5. ✅ Broadcasts to navbar → instant update

### Background (App Closed)

When the app is closed:
1. ✅ Service Worker receives message
2. ✅ Extracts `userId` from `data.userId`
3. ✅ Saves to IndexDB with userId
4. ✅ Shows system notification
5. ✅ When user opens app → navbar shows all persisted notifications

## Debugging Service Worker

To see if backend is sending userId correctly:

1. **Open DevTools → Application → Service Workers**
2. **Send a test notification**
3. **Check Service Worker console for:**
   ```
   [SW] 📬 Full FCM Payload: { ... }
   [SW] 🔑 Extracted userId from FCM: admin_wallet_12345
   [SW] ✅ Using userId from FCM payload: admin_wallet_12345
   [SW] ✅ IndexDB Record Structure: { id: "...", userId: "admin_wallet_12345" }
   ```

## Common Issues

### ❌ "userId is null/undefined"

**Cause:** Backend not sending `userId` in notification data  
**Fix:** Add `"userId": user_id` to the `data` object

```javascript
// ❌ WRONG
data: {
  "type": "success"
}

// ✅ CORRECT
data: {
  "userId": "0x123abc...",
  "type": "success"
}
```

### ❌ "Setting userId to unknown"

**Cause:** Backend sent notification but `data.userId` was missing  
**Fix:** Ensure every notification includes the userId field

### ❌ "Extracted userId from FCM: null"

**Cause:** Notification sent but userId field is empty/null  
**Fix:** Validate userId before sending:

```python
if not user_id or user_id.strip() == "":
    raise ValueError("userId cannot be empty")
```

## Testing

### Step 1: Get Active FCM Tokens

```bash
GET /api/notifications/tokens
```

Response:
```json
{
  "tokens": [
    {
      "fcm_token": "e_abc123...",
      "device_type": "web",
      "device_label": "Chrome on Windows",
      "registered_at": "2026-04-28T10:00:00Z"
    }
  ]
}
```

### Step 2: Send Test Notification

```python
from backend_service import send_notification_to_user

send_notification_to_user(
    fcm_token="e_abc123...",
    title="Test Notification",
    body="This is a test",
    user_id="admin_wallet_123",  # ← Use actual wallet address
    notification_type="success"
)
```

### Step 3: Verify in IndexDB

1. **Open DevTools → Storage → IndexedDB → park_chain_db → notifications**
2. **Check that notification appears with correct userId:**
   ```
   id: "admin_wallet_123_1704067200000_abc123"
   userId: "admin_wallet_123"
   title: "Test Notification"
   body: "This is a test"
   isRead: false
   timestamp: 1704067200000
   ```

## Frontend Notification Structure

Notifications saved to IndexDB have this structure:

```typescript
interface StoredNotification {
  id: string;                    // Format: ${userId}_${timestamp}_${random}
  userId: string;                // From FCM data.userId
  title: string;                 // From notification.title
  body: string;                  // From notification.body
  icon?: string;                 // From notification.icon
  data?: Record<string, any>;    // From data object
  timestamp: number;             // Milliseconds since epoch
  isRead: boolean;               // false when received, true when user clicks
  type?: 'success'|'error'|'info'|'warning';  // For UI styling
}
```

## Storage Cleanup

Frontend automatically:
- ✅ Stores notifications per user (indexed by userId)
- ✅ Keeps last 100 notifications per user
- ✅ Auto-deletes old notifications
- ✅ Allows manual deletion

No backend cleanup needed for notifications.

## Support

If notifications aren't appearing:

1. **Check Service Worker logs** (see Debugging section above)
2. **Verify userId is in notification data** (most common issue)
3. **Confirm FCM token is valid** (from `/api/notifications/tokens`)
4. **Test with cURL first** to isolate backend issues

