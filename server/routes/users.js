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
router.post('/:id/sendFriendRequest/:friendID', sendFriendRequest);
router.patch('/:id/addFriend/:friendID', addNewFriend);
router.patch('/:id/deleteFriend/:friendID', deleteFriend);
router.delete('/:id/removeFriendRequest/:requestSenderID', removeFriendRequest);

export default router;
