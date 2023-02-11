import express from 'express';
import User from '../models/Users.js';
import FriendRequest from '../models/FriendRequests.js';
import axios from 'axios';

export const grabProfile = async (req, res) => {
  try {
    User.find({ _id: req.params.id })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const grabUserFriends = (req, res) => {
  try {
    User.find({ _id: req.params.id }, 'friends', function (err, result) {
      if (err) res.status(404).json(err);
      const friendsArr = result[0].friends;

      User.find({ _id: { $in: friendsArr } }, function (err, result) {
        res.status(200).json(result);
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { firstName, lastName, picturePath } = req.body;
    const userID = req.params.id;
    const targetID = req.params.friendID;

    const user = await User.findById(req.params.id);
    if (!user.friendRequests.includes(targetID)) {
      user.friendRequests.push(targetID);
      await user.save();
    } else {
      return res.status(400).json({ message: 'already sent friend request' });
    }

    const newRequest = new FriendRequest({
      firstName,
      lastName,
      userID,
      targetID,
      picturePath,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFriendRequest = async (req, res) => {
  try {
    const userID = req.params.id;
    const requestSender = req.params.requestSenderID;

    const requestUser = await User.findById(requestSender);

    await User.updateOne(
      { _id: requestSender },
      {
        $pull: { friendRequests: userID },
      }
    );

    await FriendRequest.deleteOne({ userID: requestSender });
    res.status(200).json({
      message:
        'Deleted friend request and updated the friendRequests array in the User collection',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const grabAllFriendRequests = async (req, res) => {
  try {
    const userID = req.params.id;
    await FriendRequest.find({
      targetID: userID,
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addNewFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendID);

    if (!user.friends.includes(req.params.friendID)) {
      user.friends.push(req.params.friendID);
      friend.friends.push(req.params.id);
      res.status(200).json({ message: 'friend added' });
      await user.save();
      await friend.save();
    } else {
      res.status(400).json({ message: 'friend is already added' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendID);

    if (user.friends.includes(req.params.friendID)) {
      user.friends = user.friends.filter((id) => req.params.friendID !== id);
      friend.friends = friend.friends.filter((id) => req.params.id !== id);

      res.status(200).json({ message: 'deleted friend' });
      await user.save();
      await friend.save();
    } else {
      res.status(400).json({ message: 'not on your friend list' });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
