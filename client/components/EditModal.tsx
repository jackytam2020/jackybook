import React, { useState } from 'react';
import editModalStyles from '../styles/EditModal.module.scss';
import { ModeRootState } from '../utils/interfaces/ReduxStateProps';

import { Button, Box, Modal, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

interface EditModalProps {
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  editPost?: (editValue: string) => void;
  type: string;
  editComment?: (
    commentID: string,
    editValue: string,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  commentID?: string;
}

const EditModal: React.FC<EditModalProps> = ({
  open,
  setIsModalOpen,
  value,
  editPost,
  editComment,
  type,
  commentID,
}) => {
  const [editValue, setEditValue] = useState<string>(value);
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
  };

  return (
    <div className={editModalStyles.editModal}>
      <Modal
        open={open}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <Box sx={style}>
          <CloseIcon
            className={editModalStyles.editModal__exitIcon}
            onClick={() => {
              setIsModalOpen(false);
            }}
          ></CloseIcon>
          <div className={editModalStyles.editModal__header}>
            <h2
              style={{
                color: mode === 'light' ? 'black' : 'white',
              }}
            >
              {type === 'comment' ? 'Edit Comment' : 'Edit Post'}
            </h2>
          </div>
          <textarea
            placeholder={editValue}
            autoFocus={true}
            onChange={(e) => {
              setEditValue(e.target.value);
            }}
            className={
              mode === 'light'
                ? editModalStyles.editModal__textField
                : editModalStyles.editModal__textFieldDark
            }
          ></textarea>
          {editValue === '' || editValue === value ? (
            <span
              style={{
                cursor: 'not-allowed',
                gridColumn: 'span 4',
              }}
            >
              <Button variant="contained" sx={{ width: '100%' }} disabled>
                Submit
              </Button>
            </span>
          ) : (
            <Button
              variant="contained"
              className={editModalStyles.editModal__postButton}
              onClick={() => {
                if (type === 'post' && editPost) {
                  editPost(editValue);
                } else if (type === 'comment' && editComment && commentID) {
                  editComment(editValue, commentID, setIsModalOpen);
                }
              }}
            >
              Post
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default EditModal;
