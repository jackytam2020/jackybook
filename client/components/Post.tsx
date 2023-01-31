import React, { useState } from 'react';
import postStyles from '../styles/Post.module.scss';
import { Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import CommentSection from './CommentSection';

const Post = () => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  return (
    <div className={postStyles.post}>
      <div className={postStyles.post__topButtons}>
        <div className={postStyles.post__topButtonsLeft}>
          <div className={postStyles.post__profilePic}></div>
          <div>
            <p className={postStyles.post__user}>Jacky Tam</p>
            <p className={postStyles.post__date}>26m</p>
          </div>
        </div>
        <div className={postStyles.post__topButtonsRight}>
          <EditIcon />
          <DeleteIcon />
        </div>
      </div>

      <p className={postStyles.post__caption}>This is a new post</p>
      <img
        className={postStyles.post__image}
        src={`/photo-1539571696357-5a69c17a67c6.jpg`}
        alt=""
      />

      <div className={postStyles.post__postStats}>
        <p className={postStyles.post__likes}>5 Likes</p>
        <p
          className={postStyles.post__comments}
          onClick={() => {
            setIsCommentsOpen(!isCommentsOpen);
          }}
        >
          5 Comments
        </p>
      </div>

      <div className={postStyles.post__actions}>
        <div className={postStyles.post__actionButton}>
          <ThumbUpOffAltOutlinedIcon></ThumbUpOffAltOutlinedIcon>
          <p>Like</p>
        </div>
        <div
          className={postStyles.post__actionButton}
          onClick={() => {
            setIsCommentsOpen(!isCommentsOpen);
          }}
        >
          <InsertCommentOutlinedIcon></InsertCommentOutlinedIcon>
          <p>Comment</p>
        </div>
      </div>

      <CommentSection isCommentsOpen={isCommentsOpen} />
    </div>
  );
};

export default Post;
