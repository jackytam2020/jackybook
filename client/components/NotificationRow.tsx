import React, { useState, useEffect } from 'react';
import notificationRowStyles from '../styles/NotificationRow.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { UserRootState } from '../utils/interfaces/ReduxStateProps';

import { updateLoggedInUser } from '../utils/updateLoggedInUser';

interface NotificationRowProp {
  senderID: string;
  senderName: string;
  senderPicturePath: string;
  type: string;
  comment: string;
  createdAt: string;
  postID: string;
  _id: string;
  setIsNotificationOpened: React.Dispatch<React.SetStateAction<boolean>>;
  mode: string;
}

const NotificationRow: React.FC<NotificationRowProp> = ({
  senderID,
  senderName,
  senderPicturePath,
  type,
  comment,
  createdAt,
  postID,
  setIsNotificationOpened,
  mode,
  _id,
}) => {
  const [notificationType, setNotificationType] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: UserRootState) => state.user);

  useEffect(() => {
    if (type === 'like') {
      setNotificationType(`${senderName} liked your post`);
    } else if (type === 'comment') {
      setNotificationType(`${senderName} commented on your post: "${comment}"`);
    } else if (type === 'likedComment') {
      setNotificationType(`${senderName} liked your comment`);
    } else if (type === 'friendRequest') {
      setNotificationType(`${senderName} sent you a friend request`);
    } else if (type === 'acceptedRequest') {
      setNotificationType(`${senderName} accepted your friend request`);
    }
  }, [type, comment]);

  dayjs.extend(relativeTime);

  return (
    <div
      className={
        mode === 'light'
          ? notificationRowStyles.notificationRow
          : notificationRowStyles.notificationRowDark
      }
      onClick={() => {
        if (type === 'friendRequest' || type === 'acceptedRequest') {
          router.push(`/profile/${senderID}`);
          //need to update user redux state so it doesn't have old data for friend requests
          updateLoggedInUser(user._id, dispatch);
        } else if (
          type === 'like' ||
          type === 'comment' ||
          type === 'likedComment'
        ) {
          router.push(`/fromNotifications/${postID}?_id=${_id}`);
        }
        setIsNotificationOpened(false);
      }}
    >
      <Image
        className={notificationRowStyles.notificationRow__profilePic}
        src={`${process.env.HOST}/assets/${senderPicturePath}`}
        alt={senderName}
        width="50"
        height="50"
      />
      <div className={notificationRowStyles.notificationRow__notification}>
        <p>{notificationType}</p>
        <p className={notificationRowStyles.notificationRow__Date}>
          {dayjs(createdAt).fromNow().includes('minute') ||
          dayjs(createdAt).fromNow().includes('second') ||
          dayjs(createdAt).fromNow().includes('hour')
            ? dayjs(createdAt).fromNow()
            : dayjs(createdAt).format('MM/DD/YYYY')}
        </p>
      </div>
    </div>
  );
};

export default NotificationRow;
