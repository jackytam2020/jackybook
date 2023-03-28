import { User } from '../../state';
import { Socket } from 'socket.io-client';

export interface FriendRequestProps {
  _id: string;
  userID: string;
  receiverID: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  socket: Socket;
  user: User;
  mode?: string;
  grabProfileData: () => void;
  grabFriendsList: () => void;
  grabFriendRequests: () => void;
}
