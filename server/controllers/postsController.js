import express from 'express';
import Post from '../models/Posts.js';
import User from '../models/Users.js';
import Comment from '../models/Comments.js';
import { ObjectId } from 'mongodb';

export const newPost = async (req, res) => {
  try {
    const { userID, description, picturePath } = req.body;
    const user = await User.findById(userID);

    const newPost = new Post({
      userID,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.picturePath,
      likes: {},
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//grab posts of only posts belonging to friends
export const grabFeedPosts = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID);

    Post.find()
      .then((result) => {
        const filteredFeed = result.filter(
          (post) => user.friends.includes(post.userID) || post.userID == userID
        );
        res.status(200).json(filteredFeed);
      })
      .catch((err) => {
        res.status(404).json({ message: 'no posts to show' });
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const grabPostsFromProfile = async (req, res) => {
  try {
    const userID = req.params.id;
    Post.find({ userID: userID })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => res.status(404).json({ message: 'no posts to show' }));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const grabSinglePost = async (req, res) => {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postID } = req.params;
    const { userID } = req.body;
    const post = await Post.findById(postID);
    const isLiked = post.likes.get(userID);

    if (isLiked) {
      post.likes.delete(userID);
    } else {
      post.likes.set(userID, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const likedList = async (req, res) => {
  try {
    const { postID } = req.params;
    const post = await Post.findById(postID);

    const likedUsers = [...post.likes.keys()];

    User.find({ _id: { $in: likedUsers } }, function (err, result) {
      if (err) {
        res.status(404).json({ message: 'No likes' });
      }
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postID } = req.params;
    const { newDescription } = req.body;
    Post.findOneAndUpdate(
      { _id: postID },
      { $set: { description: newDescription } },
      { new: true },
      function (err, result) {
        if (err) {
          res.status(400).json({ message: 'unable to edit post' });
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postID } = req.params;
    const post = await Post.findById(postID);
    Post.deleteOne({ _id: postID }, function (err, result) {
      if (err) {
        res.status(400).json({ message: 'Post was not deleted' });
      } else {
        res.status(200).json({ message: 'Deleted post' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postID } = req.params;
    const { userID, comment, datePosted } = req.body;
    const user = await User.findById(userID);

    const post = await Post.findById(postID);

    const newComment = new Comment({
      firstName: user.firstName,
      lastName: user.lastName,
      postID: postID,
      userID: userID,
      comment: comment,
      datePosted: datePosted,
      userPicturePath: user.picturePath,
      likes: {},
    });

    const savedNewComment = await newComment.save();
    //add newly generated comment's id to comments array in post collection
    post.comments.push(savedNewComment._id);
    await post.save();

    res.status(201).json(savedNewComment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const grabPostComments = async (req, res) => {
  try {
    const { postID } = req.params;

    const comments = await Comment.find({ postID: postID });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { userID } = req.body;
    const comment = await Comment.findById(commentID);
    const isLiked = comment.likes.get(userID);

    if (isLiked) {
      comment.likes.delete(userID);
    } else {
      comment.likes.set(userID, true);
    }

    const updateComment = await Comment.findByIdAndUpdate(
      commentID,
      {
        likes: comment.likes,
      },
      { new: true }
    );
    res.status(200).json(updateComment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const likedCommentList = async (req, res) => {
  try {
    const { commentID } = req.params;
    const comment = await Comment.findById(commentID);

    const likedUsers = [...comment.likes.keys()];

    User.find({ _id: { $in: likedUsers } }, function (err, result) {
      if (err) {
        res.status(404).json({ message: 'No likes' });
      }
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { newComment } = req.body;
    Comment.findOneAndUpdate(
      { _id: commentID },
      { $set: { comment: newComment } },
      { new: true },
      function (err, result) {
        if (err) {
          res.status(400).json({ message: 'unable to edit comment' });
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postID, commentID } = req.params;
    const comment = await Comment.findById(commentID);

    await Post.updateOne(
      { _id: postID },
      { $pull: { comments: ObjectId(commentID) } }
    );

    await Comment.deleteOne({ _id: commentID });
    res.status(200).json({ message: 'Deleted Comment' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
