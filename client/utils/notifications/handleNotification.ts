import { User } from '../../state';
// import { Socket } from 'socket.io-client';
import axios from 'axios';

export const handleNotifications = async (
  // socket: Socket,
  user: User,
  receiverID: String,
  type: string,
  postID?: string,
  comment?: string
) => {
  //add notification to database unless if user is sending events to themselves
  if (user._id !== receiverID) {
    // socket.emit('sendNotification', {
    //   senderName: user.firstName,
    //   senderID: user._id,
    //   senderPicturePath: user.picturePath,
    //   comment: comment,
    //   postID: postID,
    //   receiverID: receiverID,
    //   type: type,
    //   createdAt: new Date(),
    // });

    await axios.post(
      `${process.env.HOST}/notifications/${user._id}/sendNotification/${receiverID}`,
      {
        type: type,
        senderPicturePath: user.picturePath,
        comment: comment,
        senderName: user.firstName,
        postID: postID,
      }
    );
  }
};
