import React from 'react';
import Link from 'next/link';
import friendRequestRowStyles from '../styles/friendRequestRow.module.scss';
import { useDispatch } from 'react-redux';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { FriendRequestProps } from '../utils/interfaces/FriendRequest';
import {
  acceptFriendRequest,
  removeFriendRequest,
} from '../utils/friendRequest/friendRequest';

const FriendRequestRow: React.FC<FriendRequestProps> = ({
  userID,
  receiverID,
  picturePath,
  firstName,
  lastName,
  socket,
  user,
  mode,
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
            style={{
              color: mode === 'light' ? 'black' : 'white',
              transition: '1s',
            }}
          >{`${firstName} ${lastName}`}</p>
        </div>
      </Link>
      <div className={friendRequestRowStyles.requestRow__requestActions}>
        <CheckOutlinedIcon
          onClick={() => {
            acceptFriendRequest(userID, receiverID, dispatch, socket, user);
          }}
        ></CheckOutlinedIcon>
        <CancelOutlinedIcon
          onClick={() => {
            removeFriendRequest(receiverID, userID, dispatch);
          }}
        ></CancelOutlinedIcon>
      </div>
    </div>
  );
};

export default FriendRequestRow;
