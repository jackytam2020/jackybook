import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import editModalStyles from '../styles/EditModal.module.scss';

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

interface EditModalProps {
  open: boolean;
  setIsModalOpen: (arg0: boolean) => void;
  value: string;
  editPost?: (editValue: string) => void;
  type: string;
  editComment?: (
    commentID: string,
    editValue: string,
    setIsModalOpen: Function
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
            <h2>{type === 'comment' ? 'Edit Comment' : 'Edit Post'}</h2>
          </div>
          <textarea
            placeholder={editValue}
            autoFocus={true}
            onChange={(e) => {
              setEditValue(e.target.value);
            }}
            className={editModalStyles.editModal__textField}
          ></textarea>
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
        </Box>
      </Modal>
    </div>
  );
};

export default EditModal;
