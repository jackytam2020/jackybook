import React, { useState } from 'react';
import uploadModalStyles from '../styles/UploadProfilePicModal.module.scss';
import { ModeRootState } from '../utils/interfaces/ReduxStateProps';
import { useSelector } from 'react-redux';
import Dropzone from 'react-dropzone';
import Image from 'next/image';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { User } from '../state';

import { Button, Box, Modal, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateLoggedInUser } from '../utils/updateLoggedInUser';

interface MediaFile {
  path?: string;
  lastModified: number;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface File {
  append: Function;
}

interface UploadProfilePicModalProps {
  open: boolean;
  setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  grabProfileData: () => void;
}

const UploadProfilePicModal: React.FC<UploadProfilePicModalProps> = ({
  open,
  setIsUploadModalOpen,
  user,
  grabProfileData,
}) => {
  const [mediaFile, setMediaFile] = useState<MediaFile>({
    path: '',
    lastModified: 0,
    lastModifiedDate: new Date(),
    name: '',
    size: 0,
    type: '',
    webkitRelativePath: '',
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const dispatch = useDispatch();

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

  const uploadProfilePicture = async () => {
    const formData: File = new FormData();
    formData.append('picturePath', mediaFile.name);
    formData.append('picture', mediaFile);

    await axios.patch(
      `${process.env.HOST}/${user._id}/addNewProfilePicture`,
      formData
    );
    grabProfileData();
    updateLoggedInUser(user._id, dispatch);
  };

  return (
    <div className={uploadModalStyles.uploadModal}>
      <Modal
        open={open}
        onClose={() => {
          setIsUploadModalOpen(false);
          setPreviewImage('');
          setMediaFile({
            path: '',
            lastModified: 0,
            lastModifiedDate: new Date(),
            name: '',
            size: 0,
            type: '',
            webkitRelativePath: '',
          });
        }}
      >
        <Box sx={style}>
          <CloseIcon
            className={uploadModalStyles.uploadModal__exitIcon}
            onClick={() => {
              setIsUploadModalOpen(false);
              setPreviewImage('');
              setMediaFile({
                path: '',
                lastModified: 0,
                lastModifiedDate: new Date(),
                name: '',
                size: 0,
                type: '',
                webkitRelativePath: '',
              });
            }}
          ></CloseIcon>
          <div className={uploadModalStyles.uploadModal__header}>
            <h2
              style={{
                color: mode === 'light' ? 'black' : 'white',
              }}
            >
              Upload Profile Picture
            </h2>
          </div>
          {previewImage !== '' && (
            <Image
              src={previewImage}
              alt={previewImage}
              width="0"
              height="0"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          )}

          {mediaFile.path === '' ? (
            <>
              <p className={uploadModalStyles.uploadModal__instructions}>
                Drag and drop or click Upload Photo
              </p>
              <Button
                variant="outlined"
                className={uploadModalStyles.uploadModal__postButton}
              >
                <Dropzone
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    setMediaFile(acceptedFiles[0]);
                    setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} name="picture" />
                      {<p>Upload Photo</p>}
                    </div>
                  )}
                </Dropzone>
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              className={uploadModalStyles.uploadModal__postButton}
              onClick={() => {
                setIsUploadModalOpen(false);
                uploadProfilePicture();
              }}
            >
              Upload
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default UploadProfilePicModal;
