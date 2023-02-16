import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, PostsArray } from '../state';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';

import { FriendRequestProps } from '../pages/profile/[id]';

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
}

const FriendStatus: React.FC<FriendStatusProps> = ({
  profileData,
  grabFriendsList,
}) => {
  const user = useSelector<UserState, User>((state) => state.user);
  const dispatch = useDispatch();
  const [buttonStatus, setButtonStatus] = useState<string>('Add Friend');

  useEffect(() => {
    if (user.friends.includes(profileData._id)) {
      setButtonStatus('Remove Friend');
    } else if (user.friendRequests.includes(profileData._id)) {
      setButtonStatus('Cancel Request');
    } else if (!user.friendRequests.includes(profileData._id)) {
      setButtonStatus('Add Friend');
    }
  }, [user.friendRequests, profileData._id, user.friends]);
  return (
    <div style={{ marginTop: '1rem' }}>
      <Button
        variant={buttonStatus === 'Remove Friend' ? 'outlined' : 'contained'}
        onClick={() => {
          if (buttonStatus === 'Remove Friend') {
            removeFriend(user._id, profileData._id, grabFriendsList, dispatch);
          } else if (buttonStatus === 'Add Friend') {
            sendFriendRequest(user, profileData._id, dispatch);
          } else if (buttonStatus === 'Cancel Request') {
            removeFriendRequest(profileData._id, user._id, dispatch);
          }
        }}
      >
        {buttonStatus}
      </Button>
    </div>
  );
};

export default FriendStatus;
