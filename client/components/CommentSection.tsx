import React, { useState } from 'react';
import commentStyles from '../styles/CommentSection.module.scss';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User } from '../state';
import { Socket } from 'socket.io-client';

import Comment from './Comment';
import { handleNotifications } from '../utils/notifications/handleNotification';
import {
  UserRootState,
  ModeRootState,
} from '../utils/interfaces/ReduxStateProps';

interface CommentSectionProps {
  isCommentsOpen: boolean;
  commentsList: [];
  postID: string;
  userID: string;
  grabComments: () => void;
  grabFeedPosts?: () => void;
  grabProfileFeedPosts?: () => void;
  socket: Socket;
}

interface Comment {
  _id: string;
  likes: number;
  likesList: string[];
  firstName: string;
  lastName: string;
  comment: string;
  datePosted: string;
  userPicturePath: string;
  userID: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  isCommentsOpen,
  commentsList,
  postID,
  userID,
  grabComments,
  grabFeedPosts,
  grabProfileFeedPosts,
  socket,
}) => {
  const [newCommentValue, setNewCommentValue] = useState('');
  const user = useSelector((state: UserRootState) => state.user);
  const mode = useSelector((state: ModeRootState) => state.mode);

  const postComment = async () => {
    setNewCommentValue('');
    await axios.post(`${process.env.HOST}/posts/${postID}/addCommentToPost`, {
      userID: user._id,
      comment: newCommentValue,
      datePosted: new Date(),
    });
    grabComments();
    handleNotifications(
      socket,
      user,
      userID,
      'comment',
      postID,
      newCommentValue
    );

    if (grabFeedPosts) {
      grabFeedPosts();
    } else if (grabProfileFeedPosts) {
      grabProfileFeedPosts();
    }
  };

  const pressLikeCommentButton = async (commentID: string) => {
    await axios.patch(`${process.env.HOST}/posts/${commentID}/likeComment`, {
      userID: user._id,
    });
    grabComments();
  };

  const editComment = async (
    newComment: string,
    commentID: string,
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    await axios.patch(`${process.env.HOST}/posts/${commentID}/editComment`, {
      newComment: newComment,
    });
    setIsEditModalOpen(false);
    grabComments();
  };

  const deleteComment = async (commentID: string) => {
    await axios.delete(
      `${process.env.HOST}/posts/${postID}/deleteComment/${commentID}`
    );
    grabComments();
    if (grabFeedPosts) {
      grabFeedPosts();
    } else if (grabProfileFeedPosts) {
      grabProfileFeedPosts();
    }
  };
  return (
    <div
      className={
        isCommentsOpen
          ? commentStyles.commentSection
          : commentStyles.commentSectionClosed
      }
    >
      <div className={commentStyles.commentSection__newComment}>
        <img
          className={commentStyles.commentSection__profilePic}
          src={`${process.env.HOST}/assets/${user.picturePath}`}
          alt={user.picturePath}
        />
        <div className={commentStyles.commentSection__inputHolder}>
          <input
            className={
              mode === 'light'
                ? commentStyles.commentSection__postInput
                : commentStyles.commentSection__postInputDark
            }
            type="text"
            placeholder={`Write a comment...`}
            value={newCommentValue}
            onChange={(e) => {
              setNewCommentValue(e.target.value);
            }}
          ></input>
          {newCommentValue.length > 0 ? (
            <SendIcon
              className={commentStyles.commentSection__sendIcon}
              color="primary"
              onClick={() => {
                postComment();
              }}
            ></SendIcon>
          ) : (
            <SendIcon
              className={commentStyles.commentSection__sendIcon}
              sx={{ cursor: 'not-allowed' }}
              color="disabled"
            ></SendIcon>
          )}
        </div>
      </div>

      <section className={commentStyles.commentSection__commentList}>
        {commentsList &&
          commentsList.map((comment: Comment) => (
            <Comment
              key={comment._id}
              commentID={comment._id}
              likes={Object.keys(comment.likes).length}
              firstName={comment.firstName}
              lastName={comment.lastName}
              comment={comment.comment}
              likesList={Object.keys(comment.likes)}
              datePosted={comment.datePosted}
              userPicturePath={comment.userPicturePath}
              loggedInUser={user._id}
              pressLikeCommentButton={pressLikeCommentButton}
              userID={comment.userID}
              editComment={editComment}
              deleteComment={deleteComment}
              socket={socket}
              postID={postID}
            />
          ))}
      </section>
    </div>
  );
};

export default CommentSection;
