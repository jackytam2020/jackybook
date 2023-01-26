import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  postID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  likes: {
    type: Map,
    of: Boolean,
  },
  datePosted: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
