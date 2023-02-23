import React, { useState, useEffect } from 'react';
import navStyles from '../styles/Nav.module.scss';
import Link from 'next/link';
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
import { useSelector } from 'react-redux';
import { User } from '../state';
import { useDispatch } from 'react-redux';
import { setLogout } from '../state/index';
import { Socket } from 'socket.io-client';
// import { socket } from '../service/socket';
import { NotificationProp } from './Layout';
import SearchResults from './SearchResults';

interface UserState {
  user: User;
}

interface UsersState {
  users: User[];
}

interface NavProp {
  socket: Socket;
  notifications: NotificationProp[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationProp[]>>;
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
}) => {
  const user = useSelector<UserState, User>((state) => state.user);
  let users = useSelector<UsersState, User[]>((state) => state.users);
  //remove logged in user from users array to display other users in search result
  users = users.filter((u) => u._id != user._id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([...users]);
  const dispatch = useDispatch();

  //get real time updated notifications / socket array should be empty at first
  useEffect(() => {
    socket.on('getNotification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      setFilteredUsers(
        users.filter((user) =>
          (user.firstName.trim() + user.lastName.trim())
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())
        )
      );
    }
  };

  const searchUser = () => {
    setFilteredUsers(
      users.filter((user) =>
        (user.firstName.trim() + user.lastName.trim())
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      )
    );
  };

  const handleKeyUp = () => {
    if (searchQuery === '') {
      setFilteredUsers([...users]);
    }
  };

  useEffect(() => {
    searchUser();
  }, [searchQuery]);

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar className={navStyles.nav}>
          <div className={navStyles.nav__left}>
            <Link href={`/home`}>
              <Typography variant="h5">JackyBook</Typography>
            </Link>
            {user !== null && (
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
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  value={searchQuery}
                />
                <SearchResults
                  filteredUsers={filteredUsers}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Search>
            )}
          </div>
          {user !== null && (
            <div className={navStyles.nav__right}>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Link href={`/profile/${user._id}`}>
                <img
                  className={navStyles.nav__profilePic}
                  src={`http://localhost:8080/assets/${user.picturePath}`}
                  alt={user.picturePath}
                />
              </Link>
              <Link href={'/'}>
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
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
