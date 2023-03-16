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
  firstName: string
) => {
  // const { data } = await axios.patch(
  //   `http://localhost:8080/users/${userID}/deleteFriend/${friendID}`
  // );

  try {
    await axios.patch(
      `http://localhost:8080/users/${userID}/deleteFriend/${friendID}`
    );
  } catch {
    alert(`${firstName} is no longer on your friend's list`);
  }

  updateLoggedInUser(user._id, dispatch);

  dispatch(
    setRemoveFriend({
      friendID: friendID,
    })
  );
  grabProfileData();
  grabFriendsList();
};
