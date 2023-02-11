import React, { useState, useEffect } from 'react';
import commentStyles from '../styles/Comment.module.scss';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from 'next/link';

import LikeModal from './LikeModal';
import EditModal from './EditModal';
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
  userID: string;
  isEditDeleteOpen: boolean;
  setIsEditDeleteOpen: (arg0: boolean) => void;
  editDeleteMenuRef: React.RefObject<HTMLInputElement>;
  editComment: (
    commentID: string,
    editValue: string,
    setIsModalOpen: Function
  ) => void;
  deleteComment: (commentID: string) => void;
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
  userID,
  isEditDeleteOpen,
  setIsEditDeleteOpen,
  editDeleteMenuRef,
  editComment,
  deleteComment,
}: CommentProp) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [likedList, setLikedList] = useState<[]>([]);
  const [showMoreIcon, setShowMoreIcon] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const grabCommentLikedList = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${commentID}/likedCommentList`
    );
    setLikedList(data);
  };

  useEffect(() => {
    if (isEditDeleteOpen === false) {
      setShowMoreIcon(false);
    }
  }, [isEditDeleteOpen]);

  return (
    <div
      className={commentStyles.commentContainer}
      onMouseEnter={() => {
        setShowMoreIcon(true);
        console.log(userID);
      }}
      onMouseLeave={() => {
        if (isEditDeleteOpen === false) setShowMoreIcon(false);
      }}
    >
      <Link href={`/profile/${userID}`}>
        <img
          className={commentStyles.commentContainer__profilePic}
          src={`http://localhost:8080/assets/${userPicturePath}`}
          alt={userPicturePath}
        />
      </Link>
      <div className={commentStyles.commentContainer__right}>
        <div className={commentStyles.commentContainer__rightRow}>
          <div className={commentStyles.commentContainer__commentBox}>
            <Link href={`/profile/${userID}`}>
              <p
                className={commentStyles.commentContainer__user}
              >{`${firstName} ${lastName}`}</p>
            </Link>
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
          {userID === loggedInUser && (
            <div
              className={
                showMoreIcon
                  ? commentStyles.commentContainer__MoreOptions
                  : commentStyles.commentContainer__MoreOptionsHidden
              }
            >
              <MoreHorizIcon
                onClick={() => {
                  setIsEditDeleteOpen(true);
                }}
              ></MoreHorizIcon>
              <div
                className={
                  isEditDeleteOpen
                    ? commentStyles.commentContainer__editDeleteMenu
                    : commentStyles.commentContainer__editDeleteMenuHidden
                }
                ref={editDeleteMenuRef}
              >
                <p
                  className={commentStyles.commentContainer__editButton}
                  onClick={() => {
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </p>
                <p
                  className={commentStyles.commentContainer__deleteButton}
                  onClick={() => {
                    deleteComment(commentID);
                  }}
                >
                  Delete
                </p>
              </div>
              <EditModal
                open={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                value={comment}
                type={'comment'}
                editComment={editComment}
                commentID={commentID}
              />
            </div>
          )}
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
