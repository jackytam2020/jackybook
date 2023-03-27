import express from 'express';
import {
  newNotification,
  grabNotifications,
  deleteNotifications,
} from '../controllers/notificationsController.js';

const router = express.Router();

router.get('/:id/grabNotifications', grabNotifications);
router.post('/:senderID/sendNotification/:receiverID', newNotification);
router.delete('/:id/deleteNotifications', deleteNotifications);

export default router;
