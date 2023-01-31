import React from 'react';
import commentStyles from '../styles/CommentSection.module.scss';
import SendIcon from '@mui/icons-material/Send';

import Comment from './Comment';

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
        <div className={commentStyles.commentSection__inputHolder}>
          <input
            className={commentStyles.commentSection__postInput}
            type="text"
            placeholder={`Write a comment...`}
          ></input>
          <SendIcon
            className={commentStyles.commentSection__sendIcon}
            color="primary"
          ></SendIcon>
        </div>
      </div>

      <section className={commentStyles.commentSection__commentList}>
        <Comment likes={0} />
        <Comment likes={5} />
      </section>
    </div>
  );
};

export default CommentSection;
