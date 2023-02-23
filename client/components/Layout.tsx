import React, { useState, useEffect, useRef } from 'react';
import Nav from './Nav';
import { Socket } from 'socket.io-client';
import layoutStyles from '../styles/Layout.module.scss';
import NotificationsDisplay from './NotificationsDisplay';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User } from '../state';

interface LayoutProps {
  children: React.ReactNode;
  socket: Socket;
  setSelectedPostID: React.Dispatch<React.SetStateAction<string>>;
}

interface UserState {
  user: User;
}

export interface NotificationProp {
  createdAt: string;
  postID: string;
  receiverID: string;
  senderID: string;
  senderName: string;
  senderPicturePath: string;
  type: string;
  _id: string;
  comment: string;
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  socket,
  setSelectedPostID,
}) => {
  const [notifications, setNotifications] = useState<NotificationProp[]>([]);
  const [isNotificationOpened, setIsNotificationOpened] =
    useState<boolean>(false);
  const user = useSelector<UserState, User>((state) => state.user);

  //get request to get all notifications
  const getNotifications = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/notifications/${user._id}/grabNotifications`
    );
    setNotifications(data);
  };

  const deleteNotifications = async () => {
    const { data } = await axios.delete(
      `http://localhost:8080/notifications/${user._id}/deleteNotifications`
    );
    setNotifications(data);
  };

  //call function to get notifications on component mount
  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      // if()
      if (!notificationRef.current?.contains(e.target as Node)) {
        setIsNotificationOpened(false);
      }
    });
  }, []);

  return (
    <div className={layoutStyles.layout}>
      <Nav
        socket={socket}
        notifications={notifications}
        setNotifications={setNotifications}
        setIsNotificationOpened={setIsNotificationOpened}
        isNotificationOpened={isNotificationOpened}
      />
      <div className={layoutStyles.layout__main}>
        <NotificationsDisplay
          notifications={notifications}
          isNotificationOpened={isNotificationOpened}
          setIsNotificationOpened={setIsNotificationOpened}
          deleteNotifications={deleteNotifications}
          setSelectedPostID={setSelectedPostID}
          notificationRef={notificationRef}
        />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
