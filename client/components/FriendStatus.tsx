import React from 'react';
import { useSelector } from 'react-redux';
import { User, PostsArray } from '../state';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import { FriendRequestProps } from '../pages/profile/[id]';

interface UserState {
  user: User;
}

interface FriendStatusProps {
  profileData: User;
  sendFriendRequest: (
    user: User,
    profileData: User,
    dispatch: Function
  ) => void;
  friendRequests: FriendRequestProps[];
}

const FriendStatus: React.FC<FriendStatusProps> = ({
  profileData,
  friendRequests,
  sendFriendRequest,
}) => {
  const user = useSelector<UserState, User>((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div style={{ marginTop: '1rem' }}>
      {profileData.friends.includes(user._id) && (
        <Button variant="outlined">Remove Friend</Button>
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
              } else {
                sendFriendRequest(user, profileData, dispatch);
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
