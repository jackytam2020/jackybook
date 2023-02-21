import React, { useState, useEffect } from 'react';
import notificationRowStyles from '../styles/NotificationRow.module.scss';

const NotificationRow = ({
  senderName,
  senderPicturePath,
  type,
  comment,
  createdAt,
}) => {
  const [notificationType, setNotificationType] = useState('');

  useEffect(() => {
    if (type === 'like') {
      setNotificationType(`${senderName} liked your post`);
    } else if (type === 'comment') {
      setNotificationType(`${senderName} commented on your post: "${comment}"`);
    } else if (type === 'likedComment') {
      setNotificationType(`${senderName} liked your post`);
    } else if (type === 'friendRequest') {
      setNotificationType(`${senderName} sent you a friend request`);
    } else if (type === 'acceptedRequest') {
      setNotificationType(`${senderName} accepted your friend request`);
    }
  }, [type, comment]);

  return (
    <div className={notificationRowStyles.notificationRow}>
      <img
        className={notificationRowStyles.notificationRow__profilePic}
        src={`http://localhost:8080/assets/${senderPicturePath}`}
        alt={senderName}
      />
      <div className={notificationRowStyles.notificationRow__notification}>
        <p>{notificationType}</p>
        <p className={notificationRowStyles.notificationRow__Date}>
          {createdAt}
        </p>
      </div>
    </div>
  );
};

export default NotificationRow;
