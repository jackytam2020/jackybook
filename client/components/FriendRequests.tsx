import React from 'react';
import friendRequestStyles from '../styles/FriendRequests.module.scss';
import FriendRequestRow from './FriendRequestRow';

import { Socket } from 'socket.io-client';
import { User } from '../state';
import { FriendRequestProps } from '../utils/interfaces/FriendRequest';

interface FriendRequestsProps {
  socket: Socket;
  user: User;
  mode: string;
  friendRequests: FriendRequestProps[];
}

const FriendRequests: React.FC<FriendRequestsProps> = ({
  friendRequests,
  socket,
  user,
  mode,
}) => {
  return (
    <>
      {friendRequests.length > 0 ? (
        <section
          className={
            mode === 'light'
              ? friendRequestStyles.friendRequests
              : friendRequestStyles.friendRequestsDark
          }
        >
          <h3>Friend Requests</h3>

          <div className={friendRequestStyles.friendRequests__requestList}>
            {Array.isArray(friendRequests) &&
              friendRequests.map((request) => (
                <FriendRequestRow
                  key={request._id}
                  {...request}
                  socket={socket}
                  user={user}
                  mode={mode}
                />
              ))}
          </div>
        </section>
      ) : (
        <section
          className={
            mode === 'light'
              ? friendRequestStyles.friendRequestsEmpty
              : friendRequestStyles.friendRequestsEmptyDark
          }
        >
          <h3>Friend Requests</h3>
          <p>No Friend Requests</p>
        </section>
      )}
    </>
  );
};

export default FriendRequests;
