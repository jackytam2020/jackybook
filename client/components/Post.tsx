import React, { useState, useEffect } from 'react';
import postStyles from '../styles/Post.module.scss';
import { Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';

import CommentSection from './CommentSection';

interface PostProps {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  description: string;
  picturePath: string;
  likes: object;
  comments: object;
  deletePost: Promise<void>;
  userID: string;
  loggedInUser: string;
}

const Post: React.FC<PostProps> = ({
  _id,
  firstName,
  lastName,
  createdAt,
  description,
  picturePath,
  likes,
  comments,
  deletePost,
  userID,
  loggedInUser,
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState([]);

  const grabComments = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${_id}/grabPostComments`
    );

    setCommentsList(data.reverse());
  };

  useEffect(() => {
    grabComments();
  }, []);

  return (
    <div className={postStyles.post}>
      <div className={postStyles.post__topButtons}>
        <div className={postStyles.post__topButtonsLeft}>
          <div className={postStyles.post__profilePic}></div>
          <div>
            <p
              className={postStyles.post__user}
            >{`${firstName} ${lastName}`}</p>
            <p className={postStyles.post__date}>{createdAt}</p>
          </div>
        </div>
        <div className={postStyles.post__topButtonsRight}>
          {/* only the owner of the post can delete or change the post */}
          {loggedInUser === userID ? (
            <>
              <EditIcon />
              <DeleteIcon
                onClick={() => {
                  deletePost(_id);
                }}
              />
            </>
          ) : null}
        </div>
      </div>

      <p className={postStyles.post__caption}>{description}</p>
      {picturePath && (
        <>
          <img
            className={postStyles.post__image}
            src={`http://localhost:8080/assets/${picturePath}`}
            alt=""
          />
        </>
      )}

      <div className={postStyles.post__postStats}>
        <p className={postStyles.post__likes}>{`${
          Object.keys(likes).length
        } Likes`}</p>
        <p
          className={postStyles.post__comments}
          onClick={() => {
            setIsCommentsOpen(!isCommentsOpen);
          }}
        >
          {`${Object.keys(comments).length} Comments`}
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

      <CommentSection
        isCommentsOpen={isCommentsOpen}
        commentsList={commentsList}
        postID={_id}
        grabComments={grabComments}
      />
    </div>
  );
};

export default Post;
