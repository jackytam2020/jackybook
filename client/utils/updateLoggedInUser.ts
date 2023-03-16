import axios from 'axios';
import { setUser } from '../state';

export const updateLoggedInUser = async (
  userID: string,
  dispatch: Function
) => {
  const { data } = await axios.get(
    `http://localhost:8080/users/profile/${userID}`
  );

  dispatch(
    setUser({
      user: data[0],
    })
  );
};
