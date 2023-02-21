import React from 'react';
import notificationStyles from '../styles/Notifications.module.scss';
import NotificationRow from './NotificationRow';

const NotificationsDisplay = ({ notifications, deleteNotifications }) => {
  return (
    <div className={notificationStyles.notificationDisplay}>
      <div className={notificationStyles.notificationDisplay__headers}>
        <h2>Notifications</h2>
        <p
          className={notificationStyles.notificationDisplay__markRead}
          onClick={() => {
            deleteNotifications();
          }}
        >
          Mark all as read
        </p>
      </div>

      <div className={notificationStyles.notificationDisplay__notificationList}>
        {notifications.length === 0 ? (
          <>
            <p>No notifications to show</p>
          </>
        ) : (
          <>
            {notifications
              .slice()
              .reverse()
              .map((notification) => (
                <NotificationRow key={notification._id} {...notification} />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsDisplay;
