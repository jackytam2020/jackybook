import React, { useState } from 'react';
import commentStyles from '../styles/Comment.module.scss';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import LikeModal from './LikeModal';
import axios from 'axios';

interface LikeCounterProps {
  likes: number;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const LikeCounter: React.FC<LikeCounterProps> = ({ likes, onClick }) => {
  return (
    <div onClick={onClick}>
      <div className={commentStyles.commentContainer__likeCounter}>
        <ThumbUpIcon color="primary" fontSize="small"></ThumbUpIcon>
        <p>{likes}</p>
      </div>
    </div>
  );
};

interface CommentProp {
  commentID: string;
  likes: number;
  likesList: string[];
  firstName: string;
  lastName: string;
  comment: string;
  datePosted: string;
  pressLikeCommentButton: (commentID: string) => void;
  loggedInUser: string;
  userPicturePath: string;
}

const Comment = ({
  commentID,
  likes,
  firstName,
  lastName,
  comment,
  likesList,
  datePosted,
  pressLikeCommentButton,
  loggedInUser,
  userPicturePath,
}: CommentProp) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [likedList, setLikedList] = useState<[]>([]);

  const grabCommentLikedList = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${commentID}/likedCommentList`
    );
    setLikedList(data);
  };

  return (
    <div className={commentStyles.commentContainer}>
      <img
        className={commentStyles.commentContainer__profilePic}
        src={`http://localhost:8080/assets/${userPicturePath}`}
        alt={userPicturePath}
      />
      <div className={commentStyles.commentContainer__right}>
        <div className={commentStyles.commentContainer__commentBox}>
          <p
            className={commentStyles.commentContainer__user}
          >{`${firstName} ${lastName}`}</p>
          <p className={commentStyles.commentContainer__comment}>{comment}</p>
          {likes ? (
            <LikeCounter
              likes={likes}
              onClick={() => {
                setIsModalOpen(true);
              }}
            />
          ) : null}
          <LikeModal
            open={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            type={'comment'}
            likedList={likedList}
            grabCommentLikedList={grabCommentLikedList}
          />
        </div>
        <div className={commentStyles.commentContainer__likeDate}>
          {likesList.includes(loggedInUser) ? (
            <p
              className={commentStyles.commentContainer__liked}
              onClick={() => {
                pressLikeCommentButton(commentID);
              }}
            >
              Like
            </p>
          ) : (
            <p
              className={commentStyles.commentContainer__like}
              onClick={() => {
                pressLikeCommentButton(commentID);
              }}
            >
              Like
            </p>
          )}
          <p className={commentStyles.commentContainer__datePosted}>
            {datePosted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
