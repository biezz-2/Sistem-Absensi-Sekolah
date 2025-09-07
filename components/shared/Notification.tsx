import React, { useMemo } from 'react';
import { Notification as NotificationType } from '../../types';
import { useNotifier } from '../../hooks/useNotifier';
import { CheckCircleIcon, XCircleIcon, InfoCircleIcon, AlertTriangleIcon } from '../icons/Icons';

interface NotificationProps {
  notification: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { removeNotification } = useNotifier();

  const notificationStyles = useMemo(() => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-100',
          border: 'border-green-400',
          icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
          text: 'text-green-800',
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          border: 'border-red-400',
          icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
          text: 'text-red-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-400',
          icon: <AlertTriangleIcon className="h-6 w-6 text-yellow-500" />,
          text: 'text-yellow-800',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-400',
          icon: <InfoCircleIcon className="h-6 w-6 text-blue-500" />,
          text: 'text-blue-800',
        };
    }
  }, [notification.type]);

  return (
    <div
      className={`relative w-full p-4 pr-10 border-l-4 rounded-md shadow-lg flex items-start space-x-3 animate-fade-in-right ${notificationStyles.bg} ${notificationStyles.border}`}
      role="alert"
    >
      <div className="flex-shrink-0">{notificationStyles.icon}</div>
      <div className={`flex-1 text-sm font-medium ${notificationStyles.text}`}>
        {notification.message}
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className={`absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 ${notificationStyles.text}`}
        aria-label="Close notification"
      >
        <XCircleIcon className="h-5 w-5" />
      </button>
      {/* FIX: Removed non-standard "jsx" prop from style tag. This syntax is for Next.js/styled-jsx, which is not used in this project. */}
      <style>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Notification;
