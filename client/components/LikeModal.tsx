import React, { useState, useEffect } from 'react';
import likeModalStyles from '../styles/LikeModalStyles.module.scss';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { User } from '../state';
import Link from 'next/link';

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
  likeID: string;
}

const LikedUser: React.FC<LikedUserProps> = ({
  picturePath,
  firstName,
  lastName,
  friends,
  loggedInUser,
  likeID,
}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  return (
    <div className={likeModalStyles.likeModal__likedUser}>
      <Link href={`/profile/${likeID}`}>
        <div className={likeModalStyles.likeModal__user}>
          <img
            className={likeModalStyles.likeModal__profilePic}
            src={`http://localhost:8080/assets/${picturePath}`}
            alt={picturePath}
          />
          <p>{`${firstName} ${lastName}`}</p>
        </div>
      </Link>
      {friends.includes(loggedInUser) || likeID === loggedInUser ? null : (
        <Button
          variant="contained"
          onClick={() => {
            setIsClicked(!isClicked);
          }}
        >
          {isClicked === true ? 'Cancel Request' : 'Add Friend'}
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
                  likeID={likedUser._id}
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
