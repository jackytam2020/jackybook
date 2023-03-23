import axios from 'axios';
import { setUser } from '../state';

export const updateLoggedInUser = async (
  userID: string,
  dispatch: Function
) => {
  const { data } = await axios.get(
    `${process.env.HOST}/users/profile/${userID}`
  );

  dispatch(
    setUser({
      user: data[0],
    })
  );
};
