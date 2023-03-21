import React from 'react';
import notificationStyles from '../styles/Notifications.module.scss';
import { useSelector } from 'react-redux';

import NotificationRow from './NotificationRow';
import { NotificationProp } from '../utils/interfaces/notifications';

interface NotificationsDisplayProp {
  notifications: NotificationProp[];
  deleteNotifications: () => void;
  setSelectedPostID: React.Dispatch<React.SetStateAction<string>>;
  isNotificationOpened: boolean;
  setIsNotificationOpened: React.Dispatch<React.SetStateAction<boolean>>;
  notificationRef: React.RefObject<HTMLDivElement>;
}

interface ModeRootState {
  mode: string;
}

const NotificationsDisplay: React.FC<NotificationsDisplayProp> = ({
  notifications,
  deleteNotifications,
  setSelectedPostID,
  isNotificationOpened,
  notificationRef,
  setIsNotificationOpened,
}) => {
  const mode = useSelector((state: ModeRootState) => state.mode);

  return (
    <div
      className={
        isNotificationOpened
          ? mode === 'light'
            ? notificationStyles.notificationDisplay
            : notificationStyles.notificationDisplayDark
          : notificationStyles.notificationDisplayClosed
      }
      ref={notificationRef}
    >
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
            <p
              className={
                notificationStyles.notificationDisplay__emptyNotificationUI
              }
            >
              No notifications to show
            </p>
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
                  setIsNotificationOpened={setIsNotificationOpened}
                  mode={mode}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsDisplay;
