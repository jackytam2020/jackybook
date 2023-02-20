import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    senderID: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderPicturePath: {
      type: String,
    },
    postID: String,
    comment: String,
    receiverID: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
