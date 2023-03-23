import axios from 'axios';

export const deletePost = async (postID: string, grabFeedPosts: () => void) => {
  const response = await axios.delete(
    `${process.env.HOST}/posts/${postID}/deletePost`
  );
  grabFeedPosts();
};
