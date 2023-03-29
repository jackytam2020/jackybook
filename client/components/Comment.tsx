import React, { useState, useEffect } from 'react';
import commentStyles from '../styles/Comment.module.scss';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from 'next/link';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User } from '../state';
import { Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';

import LikeModal from './LikeModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { handleNotifications } from '../utils/notifications/handleNotification';
import { ModeRootState } from '../utils/interfaces/ReduxStateProps';

interface LikeCounterProps {
  likes: number;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  mode: string;
}

const LikeCounter: React.FC<LikeCounterProps> = ({ likes, onClick, mode }) => {
  return (
    <div onClick={onClick}>
      <div
        className={
          mode === 'light'
            ? commentStyles.commentContainer__likeCounter
            : commentStyles.commentContainer__likeCounterDark
        }
      >
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
  postID: string;
  editComment: (
    commentID: string,
    editValue: string,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  deleteComment: (commentID: string) => void;
  socket: Socket;
}

interface UserState {
  user: User;
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
  postID,
  socket,
  editComment,
  deleteComment,
}: CommentProp) => {
  const [isLikedModalOpen, setIsLikedModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [likedList, setLikedList] = useState<[]>([]);
  const [showMoreIcon, setShowMoreIcon] = useState<boolean>(false);
  const [isEditDeleteOpen, setIsEditDeleteOpen] = useState<boolean>(false);

  const user = useSelector((state: UserState) => state.user);
  const mode = useSelector((state: ModeRootState) => state.mode);

  const grabCommentLikedList = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/posts/${commentID}/likedCommentList`
    );
    setLikedList(data);
  };

  useEffect(() => {
    if (isEditDeleteOpen === false) {
      setShowMoreIcon(false);
    }
  }, [isEditDeleteOpen]);

  dayjs.extend(relativeTime);

  return (
    <div
      className={commentStyles.commentContainer}
      onMouseEnter={() => {
        setShowMoreIcon(true);
      }}
      onMouseLeave={() => {
        if (isEditDeleteOpen === false) setShowMoreIcon(false);
      }}
    >
      <Link href={`/profile/${userID}`}>
        <Image
          className={commentStyles.commentContainer__profilePic}
          src={`${process.env.HOST}/assets/${userPicturePath}`}
          alt={userPicturePath}
          width="40"
          height="40"
        />
      </Link>
      <div className={commentStyles.commentContainer__right}>
        <div className={commentStyles.commentContainer__rightRow}>
          <div
            className={
              mode === 'light'
                ? commentStyles.commentContainer__commentBox
                : commentStyles.commentContainer__commentBoxDark
            }
          >
            <Link href={`/profile/${userID}`}>
              <p
                className={commentStyles.commentContainer__user}
                style={{
                  color: mode === 'light' ? 'black' : 'white',
                }}
              >{`${firstName} ${lastName}`}</p>
            </Link>
            <p
              className={commentStyles.commentContainer__comment}
              style={{
                color: mode === 'light' ? 'black' : 'white',
              }}
            >
              {comment}
            </p>
            {likes ? (
              <LikeCounter
                likes={likes}
                onClick={() => {
                  setIsLikedModalOpen(true);
                }}
                mode={mode}
              />
            ) : null}

            <LikeModal
              open={isLikedModalOpen}
              setIsModalOpen={setIsLikedModalOpen}
              type={'comment'}
              likedList={likedList}
              grabCommentLikedList={grabCommentLikedList}
              socket={socket}
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
                sx={{
                  color: mode === 'light' ? 'black' : 'white',
                  transition: '1s',
                }}
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
                onMouseLeave={() => {
                  setIsEditDeleteOpen(false);
                }}
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
                    setIsEditDeleteOpen(false);
                    setIsDeleteModalOpen(true);
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
              <DeleteModal
                open={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                type={'comment'}
                commentID={commentID}
                deleteComment={deleteComment}
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
              style={{
                color: mode === 'light' ? 'black' : 'white',
              }}
              onClick={() => {
                pressLikeCommentButton(commentID);
                handleNotifications(
                  socket,
                  user,
                  userID,
                  'likedComment',
                  postID,
                  comment
                );
              }}
            >
              Like
            </p>
          )}
          <p
            className={commentStyles.commentContainer__datePosted}
            style={{
              color: mode === 'light' ? 'black' : 'white',
            }}
          >
            {dayjs(datePosted).fromNow().includes('minute') ||
            dayjs(datePosted).fromNow().includes('second') ||
            dayjs(datePosted).fromNow().includes('hour')
              ? dayjs(datePosted).fromNow()
              : dayjs(datePosted).format('MM/DD/YYYY')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
