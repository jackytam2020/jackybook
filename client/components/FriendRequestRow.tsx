import React from 'react';
import Link from 'next/link';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import friendRequestRowStyles from '../styles/friendRequestRow.module.scss';
import { FriendRequestProps } from '../pages/profile/[id]';

import {
  acceptFriendRequest,
  removeFriendRequest,
} from '../pages/profile/[id]';
import { useDispatch } from 'react-redux';

const FriendRequestRow: React.FC<FriendRequestProps> = ({
  userID,
  targetID,
  picturePath,
  firstName,
  lastName,
  socket,
  user,
}) => {
  const dispatch = useDispatch();
  return (
    <div className={friendRequestRowStyles.requestRow}>
      <Link href={`/profile/${userID}`}>
        <div className={friendRequestRowStyles.requestRow__requestUser}>
          <img
            src={`http://localhost:8080/assets/${picturePath}`}
            className={friendRequestRowStyles.requestRow__requestPic}
            alt={picturePath}
          />

          <p
            className={friendRequestRowStyles.requestRow__requestName}
          >{`${firstName} ${lastName}`}</p>
        </div>
      </Link>
      <div className={friendRequestRowStyles.requestRow__requestActions}>
        <CheckOutlinedIcon
          onClick={() => {
            acceptFriendRequest(userID, targetID, dispatch, socket, user);
          }}
        ></CheckOutlinedIcon>
        <CancelOutlinedIcon
          onClick={() => {
            removeFriendRequest(targetID, userID, dispatch);
          }}
        ></CancelOutlinedIcon>
      </div>
    </div>
  );
};

export default FriendRequestRow;
