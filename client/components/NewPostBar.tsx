import React, { useState } from 'react';
import newPostStyles from '../styles/NewPostBar.module.scss';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Typography, Button } from '@mui/material';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';
import axios from 'axios';

//type imports
import { User } from '../state';

interface MediaFile {
  path: string;
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface UserState {
  user: User;
}

interface TokenState {
  token: string;
}

interface NewPostBarProps {
  grabFeedPosts: () => Promise<void>;
}

const NewPostBar: React.FC<NewPostBarProps> = ({ grabFeedPosts }) => {
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

  const user = useSelector<UserState, User>((state) => state.user);
  const token = useSelector<TokenState, string>((state) => state.token);

  const submitPost = async () => {
    const formData = new FormData();
    formData.append('userID', user._id);
    formData.append('description', post);
    formData.append('picturePath', mediaFile.name);
    formData.append('picture', mediaFile);

    const response = await axios.post('http://localhost:8080/posts', formData, {
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

    grabFeedPosts();
    console.log(response);
  };

  return (
    <div className={newPostStyles.newPostBar}>
      {user !== null && (
        <div className={newPostStyles.newPostBar__top}>
          <img
            className={newPostStyles.newPostBar__profilePic}
            src={`http://localhost:8080/assets/${user.picturePath}`}
            alt={user.picturePath}
          />
          <input
            className={newPostStyles.newPostBar__postInput}
            onChange={(e) => {
              setPost(e.target.value);
            }}
            type="text"
            placeholder={`What's on your mind?`}
            value={post}
          ></input>
        </div>
      )}
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
                    {/* <AddPhotoAlternateIcon /> */}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          <Typography variant="body1" color={'gray'}>
            Photo/Video
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            submitPost();
            // console.log(user.picturePath);
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default NewPostBar;
