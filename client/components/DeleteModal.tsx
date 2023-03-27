import React from 'react';
import deleteModalStyles from '../styles/DeleteModal.module.scss';

import { ModeRootState } from '../utils/interfaces/ReduxStateProps';

import { Button, Box, Modal, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

interface DeleteModalProps {
  open: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  grabFeedPosts?: () => void | null;
  grabProfileFeedPosts?: () => void | null;
  deletePost?: (postID: string, grabPosts: () => void) => void;
  commentID?: string;
  postID?: string;
  deleteComment?: (commentID: string) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  setIsDeleteModalOpen,
  type,
  grabFeedPosts,
  grabProfileFeedPosts,
  deletePost,
  postID,
  commentID,
  deleteComment,
}) => {
  const isMobile = useMediaQuery('(max-width:500px)');

  const mode = useSelector((state: ModeRootState) => state.mode);

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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  return (
    <div className={deleteModalStyles.deleteModal}>
      <Modal
        open={open}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
      >
        <Box sx={style}>
          <CloseIcon
            className={deleteModalStyles.deleteModal__exitIcon}
            onClick={() => {
              setIsDeleteModalOpen(false);
            }}
          ></CloseIcon>
          <div className={deleteModalStyles.deleteModal__header}>
            <h2
              style={{
                color: mode === 'light' ? 'black' : 'white',
              }}
            >
              {type === 'comment' ? 'Delete Comment' : 'Delete Post'}
            </h2>
          </div>
          <p
            className={deleteModalStyles.deleteModal__message}
          >{`Are you sure you want to delete this ${
            type === 'comment' ? 'comment?' : 'post?'
          }`}</p>
          <div className={deleteModalStyles.deleteModal__actionButtons}>
            <Button
              variant="outlined"
              onClick={() => {
                setIsDeleteModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (type === 'post' && deletePost && postID) {
                  if (grabFeedPosts) {
                    deletePost(postID, grabFeedPosts);
                  } else if (grabProfileFeedPosts) {
                    deletePost(postID, grabProfileFeedPosts);
                  }
                } else if (type === 'comment' && deleteComment && commentID) {
                  deleteComment(commentID);
                }
                setIsDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteModal;
