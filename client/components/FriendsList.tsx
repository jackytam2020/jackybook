import React from 'react';
import friendsListStyles from '../styles/FriendsList.module.scss';
import FriendsListRow from './FriendsListRow';
import { User } from '../state';

interface FriendsListProps {
  friendsList: User[];
  mode: string;
}

const FriendsList: React.FC<FriendsListProps> = ({ friendsList, mode }) => {
  return (
    <div
      className={
        mode === 'light'
          ? friendsListStyles.friendsList
          : friendsListStyles.friendsListDark
      }
    >
      <h3
        style={{
          color: mode === 'light' ? 'black' : 'white',
          transition: '1s',
        }}
      >
        Friends List
      </h3>

      <div className={friendsListStyles.friendsList__friendsListContainer}>
        {friendsList.map((friend) => (
          <FriendsListRow key={friend._id} {...friend} mode={mode} />
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
