import React from 'react';
import navPopOutStyles from '../styles/NavPopOut.module.scss';
import Link from 'next/link';
import { Socket } from 'socket.io-client';

import { useSelector, useDispatch } from 'react-redux';
import { User, setLogout } from '../state';
import { NotificationProp } from '../utils/interfaces/notifications';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@mui/material';

interface UserRootState {
  user: User;
}

interface NavPopOutProps {
  isNavPopOutOpen: boolean;
  socket: Socket;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationProp[]>>;
  setIsNavPopOutOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavPopOut: React.FC<NavPopOutProps> = ({
  isNavPopOutOpen,
  socket,
  setNotifications,
  setIsNavPopOutOpen,
}) => {
  const user = useSelector((state: UserRootState) => state.user);
  const dispatch = useDispatch();
  return (
    <div
      className={
        isNavPopOutOpen
          ? navPopOutStyles.navPopOut
          : navPopOutStyles.navPopOutHidden
      }
    >
      <div className={navPopOutStyles.navPopOut__profileAndBackButton}>
        {user && (
          <Link
            href={`/profile/${user._id}`}
            onClick={() => {
              setIsNavPopOutOpen(false);
            }}
          >
            <div className={navPopOutStyles.navPopOut__profileHolder}>
              <img
                className={navPopOutStyles.navPopOut__profilePic}
                src={`http://localhost:8080/assets/${user.picturePath}`}
                alt={user.picturePath}
              />
              <div>
                <h3>{`${user.firstName} ${user.lastName}`}</h3>
                <p>View your profile</p>
              </div>
            </div>
          </Link>
        )}
        <ArrowForwardIosIcon
          onClick={() => {
            setIsNavPopOutOpen(false);
          }}
        />
      </div>
      <Link href={'/'}>
        <Button
          style={{ marginTop: '1rem' }}
          variant="outlined"
          onClick={() => {
            setIsNavPopOutOpen(false);
            dispatch(setLogout());
            socket.emit('logout');
            setNotifications([]);
          }}
        >
          Logout
        </Button>
      </Link>
    </div>
  );
};

export default NavPopOut;
