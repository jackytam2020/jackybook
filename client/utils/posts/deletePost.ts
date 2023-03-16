import axios from 'axios';

export const deletePost = async (postID: string, grabFeedPosts: () => void) => {
  const response = await axios.delete(
    `http://localhost:8080/posts/${postID}/deletePost`
  );
  grabFeedPosts();
};
