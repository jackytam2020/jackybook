import express from 'express';
import Notification from '../models/Notifications.js';
import Post from '../models/Posts.js';
import User from '../models/Users.js';

export const newNotification = async (req, res) => {
  try {
    const { type, senderPicturePath, senderName, postID, comment } = req.body;
    const senderID = req.params.senderID;
    const receiverID = req.params.receiverID;

    const newNotification = new Notification({
      senderID: senderID,
      senderName: senderName,
      senderPicturePath: senderPicturePath,
      receiverID: receiverID,
      comment: comment,
      postID: postID,
      type: type,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const grabNotifications = async (req, res) => {
  try {
    const userID = req.params.id;

    Notification.find({ receiverID: userID })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => res.status(404).json({ message: 'no notifications' }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userID = req.params.id;
    await Notification.deleteMany({ receiverID: userID });
    Notification.find({ receiverID: userID }).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
