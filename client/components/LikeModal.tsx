import React, { useState, useEffect } from 'react';
import likeModalStyles from '../styles/LikeModalStyles.module.scss';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { User } from '../state';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { sendFriendRequest } from '../pages/profile/[id]';
import { removeFriendRequest } from '../pages/profile/[id]';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
};

interface UserState {
  user: User;
}

interface LikedUserProps {
  _id: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  friends: string[];
  loggedInUser: string;
  likedUserID: string;
}

const LikedUser: React.FC<LikedUserProps> = ({
  picturePath,
  firstName,
  lastName,
  friends,
  loggedInUser,
  likedUserID,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const user = useSelector<UserState, User>((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className={likeModalStyles.likeModal__likedUser}>
      <Link href={`/profile/${likedUserID}`}>
        <div className={likeModalStyles.likeModal__user}>
          <img
            className={likeModalStyles.likeModal__profilePic}
            src={`http://localhost:8080/assets/${picturePath}`}
            alt={picturePath}
          />
          <p>{`${firstName} ${lastName}`}</p>
        </div>
      </Link>
      {friends.includes(loggedInUser) || likedUserID === loggedInUser ? null : (
        <Button
          variant="contained"
          onClick={() => {
            if (user.friendRequests.includes(likedUserID)) {
              //run delete friend request function
              removeFriendRequest(likedUserID, user._id, dispatch);
            } else {
              sendFriendRequest(user, likedUserID, dispatch);
            }
            console.log(user.friendRequests);
            console.log(likedUserID);
          }}
        >
          {user.friendRequests.includes(likedUserID)
            ? 'Cancel Request'
            : 'Add Friend'}
        </Button>
      )}
    </div>
  );
};

interface LikeModalProps {
  open: boolean;
  setIsModalOpen: Function;
  grabPostLikedList?: () => void;
  grabCommentLikedList?: () => void;
  type: string;
  likedList: Array<LikedUserProps>;
}

const LikeModal: React.FC<LikeModalProps> = ({
  open,
  setIsModalOpen,
  grabPostLikedList,
  likedList,
  type,
  grabCommentLikedList,
}) => {
  useEffect(() => {
    if (type === 'post' && grabPostLikedList) {
      grabPostLikedList();
    } else if (type === 'comment' && grabCommentLikedList) {
      grabCommentLikedList();
    }
  }, [open]);

  const user = useSelector<UserState, User>((state) => state.user);
  return (
    <div className={likeModalStyles.likeModal}>
      <Modal
        open={open}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <Box sx={style}>
          <div className={likeModalStyles.likeModal__header}>
            <h3>Likes</h3>
          </div>
          <div className={likeModalStyles.likeModal__likedList}>
            {Array.isArray(likedList) &&
              likedList.map((likedUser) => (
                <LikedUser
                  key={likedUser._id}
                  {...likedUser}
                  likedUserID={likedUser._id}
                  loggedInUser={user._id}
                />
              ))}
          </div>
          <CloseIcon
            className={likeModalStyles.likeModal__exitIcon}
            onClick={() => {
              setIsModalOpen(false);
            }}
          ></CloseIcon>
        </Box>
      </Modal>
    </div>
  );
};

export default LikeModal;
