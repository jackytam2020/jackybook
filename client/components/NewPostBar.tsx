import React, { useState } from 'react';
import newPostStyles from '../styles/NewPostBar.module.scss';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Image from 'next/image';
import Microlink from '@microlink/react';

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
  const [isLinkPreviewOpen, setIsLinkPreviewOpen] = useState<boolean>(false);

  const user = useSelector((state: UserRootState) => state.user);
  const token = useSelector((state: TokenRootState) => state.token);
  const mode = useSelector((state: ModeRootState) => state.mode);

  const submitPost = async () => {
    let picturePath = '';

    if (mediaFile.name !== '') {
      const hostData: File = new FormData();
      hostData.append('image', mediaFile);

      await axios
        .post(
          `https://api.imgbb.com/1/upload?key=${process.env.KEY}`,
          hostData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((response) => {
          picturePath = response.data.data.display_url;
        });
    }

    await axios.post(
      `${process.env.HOST}/posts`,
      {
        userID: user._id,
        description: post,
        picturePath: picturePath,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    setIsLinkPreviewOpen(false);

    if (grabFeedPosts) {
      grabFeedPosts();
    } else if (grabProfileFeedPosts) {
      grabProfileFeedPosts();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedContent = e.clipboardData.getData('text');
    const linkRegex = /https?:\/\/\S+/;
    if (linkRegex.test(pastedContent)) {
      setIsLinkPreviewOpen(true);
    }
  };

  const urlMatch = post.match(/https?:\/\/\S+/);
  const videoLinkPreview = ['image', 'logo', 'video'];
  const nonVideoPreview = ['image', 'logo'];

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
          {user && (
            <Image
              className={newPostStyles.newPostBar__profilePic}
              src={user.picturePath}
              alt={user.picturePath}
              width="50"
              height="50"
            />
          )}

          <input
            className={
              mode === 'light'
                ? newPostStyles.newPostBar__postInput
                : newPostStyles.newPostBar__postInputDark
            }
            onChange={(e) => {
              setPost(e.target.value);
              const linkRegex = /https?:\/\/\S+/;
              if (linkRegex.test(e.target.value)) {
                setIsLinkPreviewOpen(true);
              }
              if (e.target.value === '') {
                setIsLinkPreviewOpen(false);
              }
            }}
            onPaste={handlePaste}
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
        <div className={newPostStyles.newPostBar__linkPreview}>
          {isLinkPreviewOpen && post !== '' && urlMatch !== null && (
            <Microlink
              url={urlMatch[0]}
              media={
                urlMatch[0].includes('youtube')
                  ? videoLinkPreview
                  : nonVideoPreview
              }
            />
          )}
        </div>
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
