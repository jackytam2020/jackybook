import React, { useState, useEffect, useRef } from 'react';
import layoutStyles from '../styles/Layout.module.scss';

import { Socket } from 'socket.io-client';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { NotificationProp } from '../utils/interfaces/notifications';
import { UserRootState } from '../utils/interfaces/ReduxStateProps';
import { useRouter } from 'next/router';

import Nav from './Nav';
import NotificationsDisplay from './NotificationsDisplay';
import MobileSearch from './MobileSearch';
import NavPopOut from './NavPopOut';

interface LayoutProps {
  children: React.ReactNode;
  socket: Socket;
  setSelectedPostID: React.Dispatch<React.SetStateAction<string>>;
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  socket,
  setSelectedPostID,
}) => {
  const [notifications, setNotifications] = useState<NotificationProp[]>([]);
  const [isNotificationOpened, setIsNotificationOpened] =
    useState<boolean>(false);
  const [mobileSearchIsOpen, setMobileSearchIsOpen] = useState(false);
  const [isNavPopOutOpen, setIsNavPopOutOpen] = useState(false);
  const user = useSelector((state: UserRootState) => state.user);

  //get request to get all notifications
  const getNotifications = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/notifications/${user._id}/grabNotifications`
    );
    setNotifications(data);
  };

  const deleteNotifications = async () => {
    const { data } = await axios.delete(
      `${process.env.HOST}/notifications/${user._id}/deleteNotifications`
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
      if (!notificationRef.current?.contains(e.target as Node)) {
        setIsNotificationOpened(false);
      }
    });
  }, []);

  const router = useRouter();
  const path = router.asPath;

  return (
    <div className={layoutStyles.layout}>
      <MobileSearch
        mobileSearchIsOpen={mobileSearchIsOpen}
        setMobileSearchIsOpen={setMobileSearchIsOpen}
      />
      <NavPopOut
        isNavPopOutOpen={isNavPopOutOpen}
        setIsNavPopOutOpen={setIsNavPopOutOpen}
        setNotifications={setNotifications}
        socket={socket}
      />
      <div style={{ display: path === '/MobileSearch' ? 'none' : 'block' }}>
        <Nav
          socket={socket}
          notifications={notifications}
          setNotifications={setNotifications}
          setIsNotificationOpened={setIsNotificationOpened}
          setMobileSearchIsOpen={setMobileSearchIsOpen}
          setIsNavPopOutOpen={setIsNavPopOutOpen}
        />
      </div>

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
