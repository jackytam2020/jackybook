import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, PostsArray } from '../state';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { Socket } from 'socket.io-client';
import { acceptFriendRequest } from '../pages/profile/[id]';

import {
  sendFriendRequest,
  removeFriend,
  removeFriendRequest,
} from '../pages/profile/[id]';

interface UserState {
  user: User;
}

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
  const user = useSelector<UserState, User>((state) => state.user);
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
              grabProfileData
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
              user
            );
          }
        }}
      >
        {buttonStatus}
      </Button>
    </div>
  );
};

export default FriendStatus;
