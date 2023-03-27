import React, { useState, useEffect } from 'react';
import likedUserListStyles from '../styles/LikedUserList.module.scss';

import { Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Button } from '@mui/material';
import { UserRootState } from '../utils/interfaces/ReduxStateProps';
import {
  sendFriendRequest,
  removeFriendRequest,
} from '../utils/friendRequest/friendRequest';

interface LikedUserProps {
  _id: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  friends: string[];
  loggedInUser: string;
  likedUserID: string;
  socket: Socket;
  mode: string;
}

const LikedUser: React.FC<LikedUserProps> = ({
  picturePath,
  firstName,
  lastName,
  friends,
  loggedInUser,
  likedUserID,
  socket,
  mode,
}) => {
  const [buttonStatus, setButtonStatus] = useState<string>('Add Friend');
  const user = useSelector((state: UserRootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.friendRequests.includes(likedUserID)) {
      setButtonStatus('Cancel Request');
    } else {
      setButtonStatus('Add Friend');
    }
  }, [user.friendRequests]);

  return (
    <div className={likedUserListStyles.likedUser}>
      <Link href={`/profile/${likedUserID}`}>
        <div className={likedUserListStyles.likedUser__user}>
          <img
            className={likedUserListStyles.likedUser__profilePic}
            src={`${process.env.HOST}/assets/${picturePath}`}
            alt={picturePath}
          />
          <p
            style={{
              color: mode === 'light' ? 'black' : 'white',
            }}
          >{`${firstName} ${lastName}`}</p>
        </div>
      </Link>
      {friends.includes(loggedInUser) || likedUserID === loggedInUser ? null : (
        <Button
          variant="contained"
          onClick={() => {
            if (buttonStatus === 'Add Friend') {
              sendFriendRequest(user, likedUserID, dispatch, socket);
            } else if (buttonStatus === 'Cancel Request') {
              removeFriendRequest(likedUserID, user._id, dispatch);
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
