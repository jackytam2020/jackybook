import React from 'react';
import Link from 'next/link';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import friendRequestRowStyles from '../styles/friendRequestRow.module.scss';

interface FriendRequestRowProps {
  userID: string;
  picturePath: string;
  firstName: string;
  lastName: string;
}

const FriendRequestRow: React.FC<FriendRequestRowProps> = ({
  userID,
  picturePath,
  firstName,
  lastName,
}) => {
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
        <CheckOutlinedIcon></CheckOutlinedIcon>
        <CancelOutlinedIcon></CancelOutlinedIcon>
      </div>
    </div>
  );
};

export default FriendRequestRow;
