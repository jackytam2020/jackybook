import React, { useState } from 'react';
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
import MessageIcon from '@mui/icons-material/Message';
import { useSelector } from 'react-redux';
import { User } from '../state';
import { useDispatch } from 'react-redux';
import state, { setPosts, setLogout } from '../state/index';

interface UserState {
  user: User;
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

function Nav() {
  const user = useSelector<UserState, User>((state) => state.user);
  const dispatch = useDispatch();

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
                  placeholder="Search???"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
                />
              </Search>
            )}
          </div>
          {user !== null && (
            <div className={navStyles.nav__right}>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={2} color="error">
                  <MessageIcon />
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
}

export default Nav;
