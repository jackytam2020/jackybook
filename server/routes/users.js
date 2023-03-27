import express from 'express';
import {
  grabProfile,
  grabAllUsers,
  grabUserFriends,
  addNewFriend,
  deleteFriend,
  sendFriendRequest,
  grabAllFriendRequests,
  removeFriendRequest,
} from '../controllers/usersController.js';
const router = express.Router();

router.get('/', grabAllUsers);
router.get('/profile/:id', grabProfile);
router.get('/friends/:id', grabUserFriends);
router.get('/:id/grabAllFriendRequests', grabAllFriendRequests);
router.post('/:id/sendFriendRequest/:receiverID', sendFriendRequest);
router.patch('/:receiverID/addFriend/:senderID', addNewFriend);
router.patch('/:id/deleteFriend/:friendID', deleteFriend);
router.delete(
  '/:receiverID/removeFriendRequest/:senderID',
  removeFriendRequest
);

export default router;
