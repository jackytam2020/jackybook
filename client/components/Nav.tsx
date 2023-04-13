import React, { useState, useEffect } from 'react';
import navStyles from '../styles/Nav.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { styled, alpha } from '@mui/material/styles';
import {
  Typography,
  AppBar,
  CssBaseline,
  Toolbar,
  InputBase,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

import { useSelector, useDispatch } from 'react-redux';
import { User } from '../state';
import { setLogout } from '../state/index';
import { UserRootState } from '../utils/interfaces/ReduxStateProps';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/router';

import {
  searchUser,
  backspaceSearch,
  clearedSearch,
} from '../utils/searchUsers/searchUsers';

import { NotificationProp } from '../utils/interfaces/notifications';
import SearchResults from './SearchResults';
import ModeToggle from './ModeToggle';

interface UsersRootState {
  users: User[];
}

interface NavProp {
  socket: Socket;
  notifications: NotificationProp[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationProp[]>>;
  setIsNotificationOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileSearchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavPopOutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getNotifications: () => void;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'block',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Nav: React.FC<NavProp> = ({
  socket,
  notifications,
  setNotifications,
  setIsNotificationOpened,
  setMobileSearchIsOpen,
  setIsNavPopOutOpen,
  getNotifications,
}) => {
  const user = useSelector((state: UserRootState) => state.user);
  let users = useSelector((state: UsersRootState) => state.users);
  //remove logged in user from users array to display other users in search result
  if (user) users = users.filter((u) => u._id != user._id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([...users]);
  const dispatch = useDispatch();

  //get real time updated notifications / socket array should be empty at first
  useEffect(() => {
    socket.on('getNotification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  useEffect(() => {
    searchUser(setFilteredUsers, users, searchQuery);
  }, [searchQuery]);

  const router = useRouter();
  const path = router.asPath;

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar className={navStyles.nav}>
          {/* <MobileSearch /> */}
          <div className={navStyles.nav__left}>
            <Link href={path === '/Register' ? '/' : `/home`}>
              <Typography variant="h5">JackyBook</Typography>
            </Link>
            {user !== null && (
              <>
                <div className={navStyles.nav__searchInput}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        backspaceSearch(
                          e as React.KeyboardEvent<HTMLInputElement>,
                          setFilteredUsers,
                          users,
                          searchQuery
                        );
                      }}
                      onKeyUp={() => {
                        clearedSearch(setFilteredUsers, users, searchQuery);
                      }}
                      value={searchQuery}
                    />
                    <SearchResults
                      filteredUsers={filteredUsers}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </Search>
                </div>
                <div className={navStyles.nav__mobileSearchIcon}>
                  <SearchIcon
                    onClick={() => {
                      setMobileSearchIsOpen(true);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          {user !== null && (
            <div className={navStyles.nav__right}>
              <div className={navStyles.nav__modeToggle}>
                <ModeToggle />
              </div>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => {
                  setIsNotificationOpened(true);
                  getNotifications();
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Link
                href={`/profile/${user._id}`}
                className={navStyles.nav__profilePicHolder}
              >
                <Image
                  className={navStyles.nav__profilePic}
                  src={`${process.env.HOST}/assets/${user.picturePath}`}
                  alt={user.picturePath}
                  height="32"
                  width="32"
                />
              </Link>
              <Link href={'/'} className={navStyles.nav__logoutButton}>
                <Button
                  style={{ color: 'white', border: '1px solid white' }}
                  variant="outlined"
                  onClick={() => {
                    dispatch(setLogout());
                    socket.emit('logout');
                    setNotifications([]);
                  }}
                >
                  Logout
                </Button>
              </Link>
              <div className={navStyles.nav__hamMenuIcon}>
                <MenuIcon
                  onClick={() => {
                    setIsNavPopOutOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
