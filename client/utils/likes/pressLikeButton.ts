import axios from 'axios';
import { User } from '../../state';

export const pressLikeButton = async (
  postID: string,
  user: User,
  grabFeedPosts?: () => void
) => {
  await axios.patch(`${process.env.HOST}/posts/${postID}/likePost`, {
    userID: user._id,
  });
  if (grabFeedPosts) grabFeedPosts();
};
