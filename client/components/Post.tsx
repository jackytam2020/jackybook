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

import CommentSection from './CommentSection';
import LikeModal from './LikeModal';
import EditModal from './EditModal';

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
  deletePost: (_id: string, grabFeedPosts: () => void) => void;
  pressLikeButton: (_id: string, grabFeedPosts: () => void, user: User) => void;
  userID: string;
  loggedInUser: string;
  userPicturePath: string;
  grabFeedPosts?: () => void;
  // isEditDeleteOpen: boolean;
  // setIsEditDeleteOpen: (arg0: boolean) => void;
  // editDeleteMenuRef: React.RefObject<HTMLInputElement>;
  grabProfileFeedPosts?: () => void;
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
  pressLikeButton,
  userPicturePath,
  grabFeedPosts,
  // isEditDeleteOpen,
  // setIsEditDeleteOpen,
  // editDeleteMenuRef,
  grabProfileFeedPosts,
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<[]>([]);
  const [likedList, setLikedList] = useState<[]>([]);

  const user = useSelector<UserState, User>((state) => state.user);

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
    console.log(data);
  };

  useEffect(() => {
    grabComments();
  }, []);

  return (
    <div className={postStyles.post}>
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
              <p className={postStyles.post__date}>{createdAt}</p>
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
        grabComments={grabComments}
        // isEditDeleteOpen={isEditDeleteOpen}
        // setIsEditDeleteOpen={setIsEditDeleteOpen}
        // editDeleteMenuRef={editDeleteMenuRef}
        grabFeedPosts={grabFeedPosts}
        grabProfileFeedPosts={grabProfileFeedPosts}
      />
    </div>
  );
};

export default Post;
