import React from 'react';
import commentStyles from '../styles/CommentSection.module.scss';

interface CommentSectionProps {
  isCommentsOpen: boolean;
}

const CommentSection = ({ isCommentsOpen }: CommentSectionProps) => {
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
        <input
          className={commentStyles.commentSection__postInput}
          type="text"
          placeholder={`Write a comment...`}
        ></input>
      </div>
    </div>
  );
};

export default CommentSection;
