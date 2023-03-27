import express from 'express';
import {
  grabFeedPosts,
  grabPostsFromProfile,
  grabSinglePost,
  likePost,
  likedList,
  deletePost,
  editPost,
  addComment,
  grabPostComments,
  likeComment,
  likedCommentList,
  editComment,
  deleteComment,
} from '../controllers/postsController.js';
const router = express.Router();

router.get('/:id/grabFeedPosts', grabFeedPosts);
router.get('/:id/grabPostsFromProfile', grabPostsFromProfile);
router.get('/:postID/grabSinglePost', grabSinglePost);
router.get('/:postID/likedList', likedList);
router.get('/:postID/grabPostComments', grabPostComments);
router.get('/:commentID/likedCommentList', likedCommentList);
router.post('/:postID/addCommentToPost', addComment);
router.patch('/:commentID/likeComment', likeComment);
router.patch('/:postID/likePost', likePost);
router.patch('/:postID/editPost', editPost);
router.patch('/:commentID/editComment', editComment);
router.delete('/:postID/deletePost', deletePost);
router.delete('/:postID/deleteComment/:commentID', deleteComment);
export default router;
