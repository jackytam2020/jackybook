import React, { useState, useEffect } from 'react';
import likedUserListStyles from '../styles/LikedUserList.module.scss';

// import { Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Button } from '@mui/material';
import Image from 'next/image';

import { UserRootState } from '../utils/interfaces/ReduxStateProps';
import {
  sendFriendRequest,
  removeFriendRequest,
  acceptFriendRequest,
} from '../utils/friendRequest/friendRequest';

interface LikedUserProps {
  _id: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  friends: string[];
  friendRequests: string[];
  loggedInUser: string;
  likedUserID: string;
  // socket: Socket;
  mode: string;
}

const LikedUser: React.FC<LikedUserProps> = ({
  picturePath,
  firstName,
  lastName,
  friends,
  friendRequests,
  loggedInUser,
  likedUserID,
  // socket,
  mode,
}) => {
  const [buttonStatus, setButtonStatus] = useState<string>('Add Friend');
  const user = useSelector((state: UserRootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.friendRequests.includes(likedUserID)) {
      setButtonStatus('Cancel Request');
    } else if (
      !user.friendRequests.includes(likedUserID) &&
      !user.friends.includes(likedUserID) &&
      !friendRequests.includes(user._id)
    ) {
      setButtonStatus('Add Friend');
    } else if (friendRequests.includes(user._id)) {
      setButtonStatus('Accept Friend Request');
    }
  }, [user.friendRequests]);

  return (
    <div className={likedUserListStyles.likedUser}>
      <Link href={`/profile/${likedUserID}`}>
        <div className={likedUserListStyles.likedUser__user}>
          <Image
            className={likedUserListStyles.likedUser__profilePic}
            src={`${process.env.HOST}/assets/${picturePath}`}
            alt={picturePath}
            width="30"
            height="30"
          />
          <p
            style={{
              color: mode === 'light' ? 'black' : 'white',
            }}
          >{`${firstName} ${lastName}`}</p>
        </div>
      </Link>
      {user.friends.includes(likedUserID) ||
      likedUserID === loggedInUser ? null : (
        <Button
          variant="contained"
          onClick={() => {
            if (buttonStatus === 'Add Friend') {
              sendFriendRequest(user, likedUserID, dispatch);
            } else if (buttonStatus === 'Cancel Request') {
              removeFriendRequest(likedUserID, user._id, dispatch);
            } else if (buttonStatus === 'Accept Friend Request') {
              acceptFriendRequest(likedUserID, user._id, dispatch, user);
            }
          }}
        >
          {buttonStatus}
        </Button>
      )}
    </div>
  );
};

export default LikedUser;
