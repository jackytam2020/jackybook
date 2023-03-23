import React, { useState } from 'react';
import newPostStyles from '../styles/NewPostBar.module.scss';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dropzone from 'react-dropzone';
import axios from 'axios';

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
          <img
            className={newPostStyles.newPostBar__profilePic}
            src={`${process.env.HOST}/assets/${user.picturePath}`}
            alt={user.picturePath}
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
        <div className={newPostStyles.newPostBar__addMedia}>
          <Dropzone
            multiple={false}
            onDrop={(acceptedFiles) => {
              setMediaFile(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} name="picture" />
                {!mediaFile.name ? (
                  <AddPhotoAlternateIcon fontSize="large" color="primary" />
                ) : (
                  <div>
                    <Typography>{mediaFile.name}</Typography>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          <Typography variant="body1" color={'gray'}>
            Photo/Video
          </Typography>
        </div>
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
  );
};

export default NewPostBar;
