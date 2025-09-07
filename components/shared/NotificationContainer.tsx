
import React from 'react';
import { useNotifier } from '../../hooks/useNotifier';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifier();

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
      {notifications.map(notification => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
