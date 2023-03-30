import React, { useState } from 'react';
import newPostStyles from '../styles/NewPostBar.module.scss';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Image from 'next/image';

import { useSelector } from 'react-redux';
import {
  UserRootState,
  ModeRootState,
  TokenRootState,
} from '../utils/interfaces/ReduxStateProps';

interface MediaFile {
  path?: string;
  lastModified: number;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface NewPostBarProps {
  grabFeedPosts?: () => void;
  grabProfileFeedPosts?: () => void;
}

interface File {
  append: Function;
}

const NewPostBar: React.FC<NewPostBarProps> = ({
  grabFeedPosts,
  grabProfileFeedPosts,
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
  const [post, setPost] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');

  const user = useSelector((state: UserRootState) => state.user);
  const token = useSelector((state: TokenRootState) => state.token);
  const mode = useSelector((state: ModeRootState) => state.mode);

  const submitPost = async () => {
    const formData: File = new FormData();
    formData.append('userID', user._id);
    formData.append('description', post);
    formData.append('picturePath', mediaFile.name);
    formData.append('picture', mediaFile);

    await axios.post(`${process.env.HOST}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPost('');
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

    if (grabFeedPosts) {
      grabFeedPosts();
    } else if (grabProfileFeedPosts) {
      grabProfileFeedPosts();
    }
  };

  return (
    <div
      className={
        mode === 'light'
          ? newPostStyles.newPostBar
          : newPostStyles.newPostBarDark
      }
    >
      {
        <div className={newPostStyles.newPostBar__top}>
          <Image
            className={newPostStyles.newPostBar__profilePic}
            src={`${process.env.HOST}/assets/${user && user.picturePath}`}
            alt={user && user.picturePath}
            width="50"
            height="50"
          />

          <input
            className={
              mode === 'light'
                ? newPostStyles.newPostBar__postInput
                : newPostStyles.newPostBar__postInputDark
            }
            onChange={(e) => {
              setPost(e.target.value);
            }}
            type="text"
            placeholder={`What's on your mind?`}
            value={post}
          ></input>
        </div>
      }
      <div className={newPostStyles.newPostBar__bottom}>
        {previewImage !== '' && (
          <div className={newPostStyles.newPostBar__imagePreview}>
            <div
              className={newPostStyles.newPostBar__deleteIconContainer}
              onClick={() => {
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
              <CloseIcon
                className={newPostStyles.newPostBar__deleteIcon}
                sx={{ color: 'white' }}
              ></CloseIcon>
            </div>
            <Image
              src={previewImage}
              alt={previewImage}
              width="0"
              height="0"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
        <div className={newPostStyles.newPostBar__addMedia}>
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
                {!mediaFile.name ? (
                  <div className={newPostStyles.newPostBar__addPhotoButton}>
                    <AddPhotoAlternateIcon fontSize="large" color="primary" />
                    <Typography variant="body1" color={'gray'}>
                      Add Photo
                    </Typography>
                  </div>
                ) : null}
              </div>
            )}
          </Dropzone>

          {post.length > 0 ? (
            <Button
              variant="contained"
              onClick={() => {
                submitPost();
              }}
            >
              Post
            </Button>
          ) : (
            <span style={{ cursor: 'not-allowed' }}>
              <Button
                disabled
                variant="contained"
                className={newPostStyles.newPostBar__disabledButton}
              >
                Post
              </Button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPostBar;
