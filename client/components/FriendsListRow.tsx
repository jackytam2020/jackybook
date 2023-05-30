import React from 'react';
import Link from 'next/link';
import friendsListRowStyles from '../styles/FriendsListRow.module.scss';

import Image from 'next/image';

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
        {picturePath && (
          <Image
            src={picturePath}
            className={friendsListRowStyles.friendsRow__friendsPic}
            alt={picturePath}
            width="30"
            height="30"
          />
        )}
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
