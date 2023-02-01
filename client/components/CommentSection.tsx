import React, { useState } from 'react';
import commentStyles from '../styles/CommentSection.module.scss';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User } from '../state';

import Comment from './Comment';

interface CommentSectionProps {
  isCommentsOpen: boolean;
  commentsList: [];
  postID: string;
}

interface UserState {
  user: User;
}

const CommentSection = ({
  isCommentsOpen,
  commentsList,
  postID,
  grabComments,
}: CommentSectionProps) => {
  const [newCommentValue, setNewCommentValue] = useState('');
  const user = useSelector<UserState, User>((state) => state.user);

  const postComment = async () => {
    const response = await axios.post(
      `http://localhost:8080/posts/${postID}/addCommentToPost`,
      {
        userID: user._id,
        comment: newCommentValue,
        datePosted: new Date(),
      }
    );
    console.log(response);
    grabComments();
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
        <div className={commentStyles.commentSection__profilePic}></div>
        <div className={commentStyles.commentSection__inputHolder}>
          <input
            className={commentStyles.commentSection__postInput}
            type="text"
            placeholder={`Write a comment...`}
            value={newCommentValue}
            onChange={(e) => {
              setNewCommentValue(e.target.value);
            }}
          ></input>
          <SendIcon
            className={commentStyles.commentSection__sendIcon}
            color="primary"
            onClick={() => {
              postComment();
            }}
          ></SendIcon>
        </div>
      </div>

      <section className={commentStyles.commentSection__commentList}>
        {commentsList &&
          commentsList.map((comment) => (
            <Comment
              key={comment._id}
              likes={Object.keys(comment.likes).length}
              firstName={comment.firstName}
              lastName={comment.lastName}
              comment={comment.comment}
              likesList={Object.keys(comment.likes)}
              datePosted={comment.datePosted}
            />
          ))}
      </section>
    </div>
  );
};

export default CommentSection;
