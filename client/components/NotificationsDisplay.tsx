import React from 'react';
import notificationStyles from '../styles/Notifications.module.scss';
import NotificationRow from './NotificationRow';
import { NotificationProp } from './Layout';

interface NotificationsDisplayProp {
  notifications: NotificationProp[];
  deleteNotifications: () => void;
  setSelectedPostID: React.Dispatch<React.SetStateAction<string>>;
}

const NotificationsDisplay: React.FC<NotificationsDisplayProp> = ({
  notifications,
  deleteNotifications,
  setSelectedPostID,
}) => {
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
            <p style={{ marginLeft: '0.5rem' }}>No notifications to show</p>
          </>
        ) : (
          <>
            {notifications
              .slice()
              .reverse()
              .map((notification) => (
                <NotificationRow
                  key={notification._id}
                  {...notification}
                  setSelectedPostID={setSelectedPostID}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsDisplay;
