import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      max: 50,
    },
    receiverID: {
      type: String,
      required: true,
      max: 50,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    picturePath: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequest;
