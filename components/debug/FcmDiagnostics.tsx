'use client';

import { useEffect, useState } from 'react';
import { messaging } from '@/lib/firebase/app';

export function FcmDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: Record<string, any> = {};

      // 1. Check environment variables
      results.environment = {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? '✅ Configured' : '❌ Missing',
        nodeEnv: process.env.NODE_ENV,
      };

      // 2. Check Firebase messaging
      results.firebase = {
        messagingAvailable: messaging ? '✅ Yes' : '❌ No',
        messagingType: messaging ? typeof messaging : 'undefined',
      };

      // 3. Check browser capabilities
      results.browser = {
        serviceWorkersSupported: 'serviceWorker' in navigator ? '✅ Yes' : '❌ No',
        notificationsSupported: 'Notification' in window ? '✅ Yes' : '❌ No',
        https:
          window.location.protocol === 'https:'
            ? '✅ Yes'
            : window.location.hostname === 'localhost'
              ? '⚠️ HTTP (localhost - OK for development)'
              : '❌ No (HTTPS required)',
      };

      // 4. Check service worker registrations
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          results.serviceWorkers = {
            registrationCount: registrations.length,
            registrations: registrations.map((reg) => ({
              scope: reg.scope,
              active: reg.active ? '✅ Active' : '❌ Not active',
              installing: reg.installing ? '⏳ Installing' : 'N/A',
              waiting: reg.waiting ? '⏳ Waiting' : 'N/A',
            })),
          };
        } catch (err) {
          results.serviceWorkers = { error: String(err) };
        }
      }

      // 5. Check notification permission
      results.notifications = {
        permission: Notification.permission,
        permissionString:
          Notification.permission === 'granted'
            ? '✅ Granted'
            : Notification.permission === 'denied'
              ? '❌ Denied'
              : '⚠️ Default (not asked yet)',
      };

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-gray-900 text-gray-100 rounded-lg shadow-2xl border border-gray-700 overflow-hidden flex flex-col z-[999]">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 sticky top-0">
        <h3 className="font-bold text-sm">🔧 FCM Diagnostics</h3>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-4 space-y-2 text-xs">
        {Object.entries(diagnostics).map(([section, data]) => (
          <div key={section} className="border border-gray-700 rounded">
            <button
              onClick={() => toggleSection(section)}
              className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 transition-colors text-left font-semibold capitalize flex items-center justify-between"
            >
              <span>{section}</span>
              <span>{expandedSections.has(section) ? '▼' : '▶'}</span>
            </button>

            {expandedSections.has(section) && (
              <div className="px-3 py-2 bg-gray-950 space-y-1">
                {typeof data === 'object' ? (
                  <pre className="text-gray-400 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-400">{String(data)}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-900 border border-blue-700 rounded text-blue-100 text-xs space-y-1">
          <p className="font-semibold">📋 Troubleshooting:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>If VAPID Key is Missing → Add to .env.local</li>
            <li>If Service Workers = 0 → Reload page</li>
            <li>If Permission = Default → Close and reopen this dialog</li>
            <li>Check browser console (F12) for detailed logs</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 text-xs text-gray-400">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

// Development-only component - only show in development
export function FcmDiagnosticsWrapper() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    // Add keyboard shortcut to toggle diagnostics (Ctrl+Shift+D)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        setShowDiagnostics((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {showDiagnostics && <FcmDiagnostics />}

      {/* Toggle button */}
      <button
        onClick={() => setShowDiagnostics((prev) => !prev)}
        className="fixed bottom-4 left-4 z-[999] bg-gray-800 hover:bg-gray-700 text-gray-100 px-3 py-1 rounded text-xs font-mono border border-gray-700"
        title="Press Ctrl+Shift+D to toggle"
      >
        🔧 FCM Debug
      </button>
    </>
  );
}
