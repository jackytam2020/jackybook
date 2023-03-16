import { User } from '../../state';
import { Socket } from 'socket.io-client';

export interface FriendRequestProps {
  _id: string;
  userID: string;
  targetID: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  socket: Socket;
  user: User;
}
