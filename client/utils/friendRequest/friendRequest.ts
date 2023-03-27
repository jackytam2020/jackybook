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
  receiverID: string,
  dispatch: Function,
  socket: Socket
) => {
  const { data } = await axios.post(
    //user is sender
    `${process.env.HOST}/users/${user._id}/sendFriendRequest/${receiverID}`,
    {
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
    }
  );
  dispatch(
    setFriendRequests({
      requests: data.receiverID,
    })
  );

  handleNotifications(socket, user, receiverID, 'friendRequest');
};

export const acceptFriendRequest = async (
  senderID: string,
  receiverID: string,
  dispatch: Function,
  socket: Socket,
  user: User,
  acceptFriendRequestError: () => void
) => {
  try {
    await axios.patch(
      `${process.env.HOST}/users/${receiverID}/addFriend/${senderID}`
    );

    dispatch(
      setNewFriend({
        newFriend: senderID,
      })
    );

    removeFriendRequest(receiverID, senderID, dispatch);
    handleNotifications(socket, user, senderID, 'acceptedRequest');
  } catch {
    acceptFriendRequestError();
    removeFriendRequest(receiverID, senderID, dispatch);
  }
};

export const removeFriendRequest = async (
  receiverID: string,
  senderID: string,
  dispatch?: Function
) => {
  await axios.delete(
    `${process.env.HOST}/users/${receiverID}/removeFriendRequest/${senderID}`
  );

  if (dispatch) {
    dispatch(
      setRemoveFriendRequest({
        userID: receiverID,
      })
    );
  }
};
