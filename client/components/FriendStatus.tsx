import React from 'react';
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
  friendRequests: FriendRequestProps[];
}

const FriendStatus: React.FC<FriendStatusProps> = ({
  profileData,
  friendRequests,
}) => {
  const user = useSelector<UserState, User>((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div style={{ marginTop: '1rem' }}>
      {profileData.friends.includes(user._id) && (
        <Button
          variant="outlined"
          onClick={() => {
            removeFriend(user._id, profileData._id, dispatch);
          }}
        >
          Remove Friend
        </Button>
      )}
      {friendRequests.some((request) =>
        request.userID.includes(profileData._id)
      ) ? (
        <Button variant="contained">Accept Friend Request</Button>
      ) : (
        !profileData.friends.includes(user._id) && (
          <Button
            variant="contained"
            onClick={() => {
              if (user.friendRequests.includes(profileData._id)) {
                //run delete friend request function
                removeFriendRequest(profileData._id, user._id, dispatch);
              } else {
                sendFriendRequest(user, profileData._id, dispatch);
              }
            }}
          >
            {user.friendRequests.includes(profileData._id)
              ? 'Cancel Request'
              : 'Send Friend Request'}
          </Button>
        )
      )}
    </div>
  );
};

export default FriendStatus;
