import React, { useState, useEffect } from 'react';
import postStyles from '../styles/Post.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User } from '../state';
import Link from 'next/link';
import { Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import CommentSection from './CommentSection';
import LikeModal from './LikeModal';
import EditModal from './EditModal';
import { handleNotifications } from '../utils/notifications/handleNotification';
import { pressLikeButton } from '../utils/likes/pressLikeButton';
import { deletePost } from '../utils/posts/deletePost';

interface UserState {
  user: User;
}

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<[]>([]);
  const [likedList, setLikedList] = useState<[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>('white');

  const user = useSelector((state: UserState) => state.user);

  const grabComments = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${_id}/grabPostComments`
    );

    setCommentsList(data.reverse());
  };

  const grabPostLikedList = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${_id}/likedList`
    );
    setLikedList(data);
  };

  const editPost = async (editedDesc: string) => {
    const { data } = await axios.patch(
      `http://localhost:8080/posts/${_id}/editPost`,
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
        setBackgroundColor('white');
        setSelectedPostID('');
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedPostID, socket]);

  dayjs.extend(relativeTime);

  return (
    <div
      className={postStyles.post}
      id={_id}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={postStyles.post__topButtons}>
        <Link href={`/profile/${userID}`}>
          <div className={postStyles.post__topButtonsLeft}>
            <img
              className={postStyles.post__profilePic}
              src={`http://localhost:8080/assets/${userPicturePath}`}
              alt={userPicturePath}
            />
            <div>
              <p
                className={postStyles.post__user}
              >{`${firstName} ${lastName}`}</p>
              <p className={postStyles.post__date}>
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
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
              />
              <DeleteIcon
                onClick={() => {
                  if (grabFeedPosts) {
                    deletePost(_id, grabFeedPosts);
                  } else if (grabProfileFeedPosts) {
                    deletePost(_id, grabProfileFeedPosts);
                  }
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
        </div>
      </div>

      <p className={postStyles.post__caption}>{description}</p>
      {picturePath && (
        <>
          <img
            className={postStyles.post__image}
            src={`http://localhost:8080/assets/${picturePath}`}
            alt={picturePath}
          />
        </>
      )}

      <div className={postStyles.post__postStats}>
        <p
          className={postStyles.post__likes}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >{`${Object.keys(likes).length} Likes`}</p>
        <LikeModal
          open={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          grabPostLikedList={grabPostLikedList}
          type={'post'}
          likedList={likedList}
          socket={socket}
        />
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
