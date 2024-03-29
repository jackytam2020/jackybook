import React, { useEffect } from 'react';
import likeModalStyles from '../styles/LikeModalStyles.module.scss';

import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, useMediaQuery } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import {
  UserRootState,
  ModeRootState,
} from '../utils/interfaces/ReduxStateProps';

import { Socket } from 'socket.io-client';

import LikedUser from './LikedUser';
import { updateLoggedInUser } from '../utils/updateLoggedInUser';

interface LikedUserProps {
  _id: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  friends: string[];
  friendRequests: string[];
  loggedInUser: string;
  likedUserID: string;
  socket: Socket;
}

interface LikeModalProps {
  open: boolean;
  setIsModalOpen: Function;
  grabPostLikedList?: () => void;
  grabCommentLikedList?: () => void;
  type: string;
  likedList: Array<LikedUserProps>;
  socket: Socket;
}

const LikeModal: React.FC<LikeModalProps> = ({
  open,
  setIsModalOpen,
  grabPostLikedList,
  likedList,
  type,
  grabCommentLikedList,
  socket,
}) => {
  useEffect(() => {
    if (type === 'post' && grabPostLikedList && open) {
      grabPostLikedList();
    } else if (type === 'comment' && grabCommentLikedList && open) {
      grabCommentLikedList();
    }
    //update logged in user data whenever modal opens
    updateLoggedInUser(user._id, dispatch);
  }, [open]);

  const user = useSelector((state: UserRootState) => state.user);
  const mode = useSelector((state: ModeRootState) => state.mode);
  const dispatch = useDispatch();

  const isMobile = useMediaQuery('(max-width:500px)');

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 400,
    backgroundColor: mode === 'light' ? 'background.paper' : 'rgb(58, 59, 61)',
    boxShadow: 24,
    borderRadius: 2,
    p: 2,
  };

  return (
    <div className={likeModalStyles.likeModal}>
      <Modal
        open={open}
        onClose={() => {
          setIsModalOpen(false);
        }}
        sx={{ width: '100%' }}
      >
        <Box sx={style}>
          <>
            <div className={likeModalStyles.likeModal__header}>
              <h3
                style={{
                  color: mode === 'light' ? 'black' : 'white',
                }}
              >
                Likes
              </h3>
            </div>
            <div className={likeModalStyles.likeModal__likedList}>
              {Array.isArray(likedList) &&
                likedList.map((likedUser) => (
                  <LikedUser
                    key={likedUser._id}
                    {...likedUser}
                    likedUserID={likedUser._id}
                    loggedInUser={user._id}
                    socket={socket}
                    mode={mode}
                  />
                ))}
            </div>
            <CloseIcon
              className={likeModalStyles.likeModal__exitIcon}
              sx={{
                color: mode === 'light' ? 'black' : 'white',
                transition: '1s',
              }}
              onClick={() => {
                setIsModalOpen(false);
              }}
            ></CloseIcon>
          </>
        </Box>
      </Modal>
    </div>
  );
};

export default LikeModal;
