import {
  User,
  setFriendRequests,
  setNewFriend,
  setRemoveFriendRequest,
} from '../../state';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { handleNotifications } from '../notifications/handleNotification';

export const sendFriendRequest = async (
  user: User,
  targetUserID: string,
  dispatch: Function,
  socket: Socket
) => {
  const { data } = await axios.post(
    `http://localhost:8080/users/${user._id}/sendFriendRequest/${targetUserID}`,
    {
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
    }
  );
  dispatch(
    setFriendRequests({
      requests: data.targetID,
    })
  );

  handleNotifications(socket, user, targetUserID, 'friendRequest');
};

export const acceptFriendRequest = async (
  userID: string,
  targetID: string,
  dispatch: Function,
  socket: Socket,
  user: User
) => {
  await axios.patch(
    `http://localhost:8080/users/${targetID}/addFriend/${userID}`
  );

  dispatch(
    setNewFriend({
      newFriend: userID,
    })
  );

  removeFriendRequest(targetID, userID, dispatch);
  handleNotifications(socket, user, userID, 'acceptedRequest');
};

export const removeFriendRequest = async (
  userID: string,
  requestSenderID: string,
  dispatch?: Function
) => {
  const response = await axios.delete(
    `http://localhost:8080/users/${userID}/removeFriendRequest/${requestSenderID}`
  );

  if (dispatch) {
    dispatch(
      setRemoveFriendRequest({
        userID: userID,
      })
    );
  }
};
