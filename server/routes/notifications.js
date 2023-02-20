import express from 'express';
import {
  newNotification,
  grabNotifications,
} from '../controllers/notificationsController.js';

const router = express.Router();

router.get('/:id/grabNotifications', grabNotifications);
router.post('/:senderID/sendNotification/:receiverID', newNotification);

export default router;
