import axios from 'axios';
import { User, setRemoveFriend } from '../../state';
import { updateLoggedInUser } from '../updateLoggedInUser';

export const removeFriend = async (
  userID: string,
  friendID: string,
  grabFriendsList: () => void,
  dispatch: Function,
  grabProfileData: () => void,
  user: User,
  removeFriendError: () => void
) => {
  try {
    await axios.patch(
      `${process.env.HOST}/users/${userID}/deleteFriend/${friendID}`
    );
    await updateLoggedInUser(user._id, dispatch);

    await dispatch(
      setRemoveFriend({
        friendID: friendID,
      })
    );
    grabProfileData();
    grabFriendsList();
  } catch {
    removeFriendError();
    grabProfileData();
    grabFriendsList();
  }
};
