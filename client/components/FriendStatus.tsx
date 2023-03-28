import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from '../state';
import { Socket } from 'socket.io-client';
import { UserRootState } from '../utils/interfaces/ReduxStateProps';

import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendRequest,
} from '../utils/friendRequest/friendRequest';
import { removeFriend } from '../utils/friends/removeFriend';

interface FriendStatusProps {
  profileData: User;
  grabFriendsList: () => void;
  socket: Socket;
  grabProfileData: () => void;
}

const FriendStatus: React.FC<FriendStatusProps> = ({
  profileData,
  grabFriendsList,
  socket,
  grabProfileData,
}) => {
  const user = useSelector((state: UserRootState) => state.user);
  const dispatch = useDispatch();
  const [buttonStatus, setButtonStatus] = useState<string>('Add Friend');

  useEffect(() => {
    if (profileData.friends.includes(user._id)) {
      setButtonStatus('Remove Friend');
    } else if (
      !profileData.friends.includes(user._id) &&
      user.friendRequests.includes(profileData._id)
    ) {
      setButtonStatus('Cancel Request');
    } else if (
      !user.friendRequests.includes(profileData._id) &&
      !profileData.friendRequests.includes(user._id)
    ) {
      setButtonStatus('Add Friend');
    } else if (profileData.friendRequests.includes(user._id)) {
      setButtonStatus('Accept Friend Request');
    }
  }, [user.friendRequests, profileData, user.friends]);

  const removeFriendError = () =>
    toast.error(`${profileData.firstName} is no longer on your friend's list`, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: 'colored',
    });
  const acceptFriendRequestError = () =>
    toast.error(`${profileData.firstName} is already in your friends list`, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: 'colored',
    });
  return (
    <div style={{ marginTop: '1rem' }}>
      <Button
        variant={buttonStatus === 'Remove Friend' ? 'outlined' : 'contained'}
        onClick={() => {
          if (buttonStatus === 'Remove Friend') {
            removeFriend(
              user._id,
              profileData._id,
              grabFriendsList,
              dispatch,
              grabProfileData,
              user,
              removeFriendError
            );
          } else if (buttonStatus === 'Add Friend') {
            sendFriendRequest(user, profileData._id, dispatch, socket);
          } else if (buttonStatus === 'Cancel Request') {
            removeFriendRequest(profileData._id, user._id, dispatch);
          } else if (buttonStatus === 'Accept Friend Request') {
            acceptFriendRequest(
              profileData._id,
              user._id,
              dispatch,
              socket,
              user,
              acceptFriendRequestError,
              grabProfileData,
              grabFriendsList
            );
          }
        }}
      >
        {buttonStatus}
        <ToastContainer />
      </Button>
    </div>
  );
};

export default FriendStatus;
