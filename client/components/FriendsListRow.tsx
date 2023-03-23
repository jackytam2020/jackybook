import React from 'react';
import Link from 'next/link';
import friendsListRowStyles from '../styles/FriendsListRow.module.scss';

interface FriendsRowProps {
  _id: string;
  firstName: string;
  lastName: string;
  picturePath: string;
  mode: string;
}

const FriendsListRow: React.FC<FriendsRowProps> = ({
  _id,
  firstName,
  lastName,
  picturePath,
  mode,
}) => {
  return (
    <Link href={`/profile/${_id}`}>
      <div className={friendsListRowStyles.friendsRow}>
        <img
          src={`${process.env.HOST}/assets/${picturePath}`}
          className={friendsListRowStyles.friendsRow__friendsPic}
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
  );
};

export default FriendsListRow;
