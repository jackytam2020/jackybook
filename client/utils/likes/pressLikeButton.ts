import axios from 'axios';
import { User } from '../../state';

export const pressLikeButton = async (
  postID: string,
  grabFeedPosts: () => void,
  user: User
) => {
  const response = await axios.patch(
    `http://localhost:8080/posts/${postID}/likePost`,
    { userID: user._id }
  );
  grabFeedPosts();
  console.log(response);
};
