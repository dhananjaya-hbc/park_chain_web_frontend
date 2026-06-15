'use client';

import { useNotificationStore } from '@/lib/stores/notificationStore';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  const getIconAndColor = (type?: string) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          titleColor: 'text-green-900',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          titleColor: 'text-red-900',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-900',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          titleColor: 'text-blue-900',
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
      {notifications.map((notification) => {
        const { icon, bgColor, borderColor, textColor, titleColor } = getIconAndColor(notification.type);

        return (
          <div
            key={notification.id}
            className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 animate-in slide-in-from-right fade-in duration-300 pointer-events-auto`}
          >
            <div className="flex gap-3">
              <div className={`${textColor} flex-shrink-0 mt-0.5`}>{icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className={`${titleColor} font-semibold text-sm`}>{notification.title}</h3>
                {notification.body && (
                  <p className={`${textColor} text-sm mt-1`}>{notification.body}</p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className={`${textColor} flex-shrink-0 hover:opacity-70 transition-opacity`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
