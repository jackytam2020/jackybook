import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      max: 50,
    },
    targetID: {
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
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequest;
