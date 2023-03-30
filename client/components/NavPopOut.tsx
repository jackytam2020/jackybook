import React from 'react';
import navPopOutStyles from '../styles/NavPopOut.module.scss';
import Link from 'next/link';
import Image from 'next/image';

// import { Socket } from 'socket.io-client';

import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../state';
import { NotificationProp } from '../utils/interfaces/notifications';
import {
  UserRootState,
  ModeRootState,
} from '../utils/interfaces/ReduxStateProps';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@mui/material';

import ModeToggle from './ModeToggle';

interface NavPopOutProps {
  isNavPopOutOpen: boolean;
  // socket: Socket;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationProp[]>>;
  setIsNavPopOutOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavPopOut: React.FC<NavPopOutProps> = ({
  isNavPopOutOpen,
  // socket,
  setNotifications,
  setIsNavPopOutOpen,
}) => {
  const user = useSelector((state: UserRootState) => state.user);
  const mode = useSelector((state: ModeRootState) => state.mode);
  const dispatch = useDispatch();
  return (
    <div
      className={
        isNavPopOutOpen
          ? mode === 'light'
            ? navPopOutStyles.navPopOut
            : navPopOutStyles.navPopOutDark
          : mode === 'light'
          ? navPopOutStyles.navPopOutHidden
          : navPopOutStyles.navPopOutHiddenDark
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
              <Image
                className={navPopOutStyles.navPopOut__profilePic}
                src={`${process.env.HOST}/assets/${user.picturePath}`}
                alt={user.picturePath}
                width="64"
                height="64"
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
      <div className={navPopOutStyles.navPopOut__ModeToggleHolder}>
        <div className={navPopOutStyles.navPopOut__ModeToggle}>
          <ModeToggle mobile={true} />
        </div>
        <h3>{`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`}</h3>
      </div>
      <Link href={'/'}>
        <Button
          style={{
            marginTop: '1rem',
          }}
          variant={mode === 'light' ? 'outlined' : 'contained'}
          onClick={() => {
            setIsNavPopOutOpen(false);
            dispatch(setLogout());
            // socket.emit('logout');
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
