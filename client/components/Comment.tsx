import React from 'react';
import commentStyles from '../styles/Comment.module.scss';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const likeCounter = (likes: number) => {
  return (
    <div>
      <div className={commentStyles.commentContainer__likeCounter}>
        <ThumbUpIcon color="primary" fontSize="small"></ThumbUpIcon>
        <p>{likes}</p>
      </div>
    </div>
  );
};

interface CommentProp {
  likes: number;
}

const Comment = ({ likes }: CommentProp) => {
  return (
    <div className={commentStyles.commentContainer}>
      <div className={commentStyles.commentContainer__profilePic}></div>
      <div className={commentStyles.commentContainer__right}>
        <div className={commentStyles.commentContainer__commentBox}>
          <p className={commentStyles.commentContainer__user}>Jacky Tam</p>
          <p className={commentStyles.commentContainer__comment}>
            This is a comment
          </p>
          {likes ? likeCounter(likes) : null}
        </div>
        <p className={commentStyles.commentContainer__like}>Like</p>
      </div>
    </div>
  );
};

export default Comment;
