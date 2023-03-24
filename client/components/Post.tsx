import React, { useState, useEffect } from 'react';
import postStyles from '../styles/Post.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import {
  UserRootState,
  ModeRootState,
} from '../utils/interfaces/ReduxStateProps';

import CommentSection from './CommentSection';
import LikeModal from './LikeModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { handleNotifications } from '../utils/notifications/handleNotification';
import { pressLikeButton } from '../utils/likes/pressLikeButton';
import { deletePost } from '../utils/posts/deletePost';

interface PostProps {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  description: string;
  picturePath: string;
  likes: object;
  comments: object;
  userID: string;
  loggedInUser: string;
  userPicturePath: string;
  grabFeedPosts?: () => void;
  grabProfileFeedPosts?: () => void;
  socket: Socket;
  selectedPostID: string;
  setSelectedPostID: React.Dispatch<React.SetStateAction<string>>;
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
  userID,
  loggedInUser,
  userPicturePath,
  grabFeedPosts,
  grabProfileFeedPosts,
  socket,
  selectedPostID,
  setSelectedPostID,
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<[]>([]);
  const [likedList, setLikedList] = useState<[]>([]);

  const user = useSelector((state: UserRootState) => state.user);
  const mode = useSelector((state: ModeRootState) => state.mode);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    mode === 'light' ? 'white' : 'rgb(58, 59, 61)'
  );
  const [textColor, setTextColor] = useState<string>(
    mode === 'light' ? 'black' : 'white'
  );

  const grabComments = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/posts/${_id}/grabPostComments`
    );

    setCommentsList(data.reverse());
  };

  const grabPostLikedList = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/posts/${_id}/likedList`
    );
    setLikedList(data);
  };

  const editPost = async (editedDesc: string) => {
    const { data } = await axios.patch(
      `${process.env.HOST}/posts/${_id}/editPost`,
      { newDescription: editedDesc }
    );
    setIsEditModalOpen(false);

    if (grabFeedPosts) {
      grabFeedPosts();
    } else if (grabProfileFeedPosts) {
      grabProfileFeedPosts();
    }
  };

  useEffect(() => {
    grabComments();
  }, []);

  //mark the post that was selected from the notifications menu and load the new content
  useEffect(() => {
    if (selectedPostID === _id && grabFeedPosts) {
      setBackgroundColor('#78B6E5');
      grabFeedPosts();
      grabComments();
      const timer = setTimeout(() => {
        if (mode === 'light') {
          setBackgroundColor('white');
        } else if (mode === 'dark') {
          setBackgroundColor('rgb(58, 59, 61)');
        }
        setSelectedPostID('');
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedPostID, socket]);

  useEffect(() => {
    if (mode === 'light') {
      setBackgroundColor('white');
      setTextColor('black');
    } else if (mode === 'dark') {
      setBackgroundColor('rgb(58, 59, 61)');
      setTextColor('white');
    }
  }, [mode]);

  dayjs.extend(relativeTime);

  return (
    <div
      // className={mode === 'light' ? postStyles.post : postStyles.postDark}
      className={postStyles.post}
      id={_id}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={postStyles.post__topButtons}>
        <Link href={`/profile/${userID}`}>
          <div className={postStyles.post__topButtonsLeft}>
            <img
              className={postStyles.post__profilePic}
              src={`${process.env.HOST}/assets/${userPicturePath}`}
              alt={userPicturePath}
            />
            <div>
              <p
                className={postStyles.post__user}
                style={{ color: textColor }}
              >{`${firstName} ${lastName}`}</p>
              <p className={postStyles.post__date} style={{ color: textColor }}>
                {dayjs(createdAt).fromNow().includes('minute') ||
                dayjs(createdAt).fromNow().includes('second') ||
                dayjs(createdAt).fromNow().includes('hour')
                  ? dayjs(createdAt).fromNow()
                  : dayjs(createdAt).format('MM/DD/YYYY')}
              </p>
            </div>
          </div>
        </Link>
        <div className={postStyles.post__topButtonsRight}>
          {/* only the owner of the post can delete or change the post */}
          {loggedInUser === userID ? (
            <>
              <EditIcon
                sx={{
                  color: mode === 'light' ? 'black' : 'white',
                  transition: '1s',
                }}
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
              />
              <DeleteIcon
                sx={{
                  color: mode === 'light' ? 'black' : 'white',
                  transition: '1s',
                }}
                onClick={() => {
                  setIsDeleteModalOpen(true);
                }}
              />
            </>
          ) : null}
          <EditModal
            open={isEditModalOpen}
            setIsModalOpen={setIsEditModalOpen}
            value={description}
            type={'post'}
            editPost={editPost}
          />
          <DeleteModal
            open={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            type={'post'}
            grabFeedPosts={grabFeedPosts}
            grabProfileFeedPosts={grabProfileFeedPosts}
            deletePost={deletePost}
            postID={_id}
          />
        </div>
      </div>

      <p className={postStyles.post__caption} style={{ color: textColor }}>
        {description}
      </p>
      {picturePath && (
        <>
          <img
            className={postStyles.post__image}
            src={`${process.env.HOST}/assets/${picturePath}`}
            alt={picturePath}
          />
        </>
      )}

      <div className={postStyles.post__postStats}>
        <p
          className={postStyles.post__likes}
          onClick={() => {
            setIsLikedModalOpen(true);
          }}
          style={{ color: textColor }}
        >{`${Object.keys(likes).length} Likes`}</p>
        <LikeModal
          open={isLikedModalOpen}
          setIsModalOpen={setIsLikedModalOpen}
          grabPostLikedList={grabPostLikedList}
          type={'post'}
          likedList={likedList}
          socket={socket}
        />
        <p
          className={postStyles.post__comments}
          style={{ color: textColor }}
          onClick={() => {
            setIsCommentsOpen(!isCommentsOpen);
          }}
        >
          {`${Object.keys(comments).length} Comments`}
        </p>
      </div>

      <div className={postStyles.post__actions}>
        <div className={postStyles.post__actionButton}>
          {Object.keys(likes).includes(loggedInUser) ? (
            <ThumbUpAltIcon
              color="primary"
              onClick={() => {
                if (grabProfileFeedPosts) {
                  pressLikeButton(_id, grabProfileFeedPosts, user);
                } else if (grabFeedPosts) {
                  pressLikeButton(_id, grabFeedPosts, user);
                }
              }}
            ></ThumbUpAltIcon>
          ) : (
            <ThumbUpOffAltOutlinedIcon
              sx={{
                color: mode === 'light' ? 'black' : 'white',
                transition: '1s',
              }}
              onClick={() => {
                if (grabProfileFeedPosts) {
                  pressLikeButton(_id, grabProfileFeedPosts, user);
                } else if (grabFeedPosts) {
                  pressLikeButton(_id, grabFeedPosts, user);
                }
                handleNotifications(socket, user, userID, 'like', _id);
              }}
            ></ThumbUpOffAltOutlinedIcon>
          )}

          <p style={{ color: textColor }}>Like</p>
        </div>
        <div
          className={postStyles.post__actionButton}
          onClick={() => {
            setIsCommentsOpen(!isCommentsOpen);
          }}
        >
          <InsertCommentOutlinedIcon
            sx={{
              color: mode === 'light' ? 'black' : 'white',
              transition: '1s',
            }}
          ></InsertCommentOutlinedIcon>
          <p style={{ color: textColor }}>Comment</p>
        </div>
      </div>

      <CommentSection
        isCommentsOpen={isCommentsOpen}
        commentsList={commentsList}
        postID={_id}
        userID={userID}
        grabComments={grabComments}
        grabFeedPosts={grabFeedPosts}
        grabProfileFeedPosts={grabProfileFeedPosts}
        socket={socket}
      />
    </div>
  );
};

export default Post;
