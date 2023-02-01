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

const Comment = ({
  likes,
  firstName,
  lastName,
  comment,
  likesList,
  datePosted,
}: CommentProp) => {
  return (
    <div className={commentStyles.commentContainer}>
      <div className={commentStyles.commentContainer__profilePic}></div>
      <div className={commentStyles.commentContainer__right}>
        <div className={commentStyles.commentContainer__commentBox}>
          <p
            className={commentStyles.commentContainer__user}
          >{`${firstName} ${lastName}`}</p>
          <p className={commentStyles.commentContainer__comment}>{comment}</p>
          {likes ? likeCounter(likes) : null}
        </div>
        <div className={commentStyles.commentContainer__likeDate}>
          <p className={commentStyles.commentContainer__like}>Like</p>
          <p className={commentStyles.commentContainer__datePosted}>
            {datePosted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
