import React from 'react';
import newPostStyles from '../styles/NewPostBar.module.scss';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Typography, Button } from '@mui/material';

const NewPostBar = () => {
  return (
    <div className={newPostStyles.newPostBar}>
      <div className={newPostStyles.newPostBar__top}>
        <div className={newPostStyles.newPostBar__profilePic}></div>
        <input
          className={newPostStyles.newPostBar__postInput}
          type="text"
          placeholder={`What's on your mind?`}
        ></input>
      </div>
      <div className={newPostStyles.newPostBar__bottom}>
        <div className={newPostStyles.newPostBar__addMedia}>
          <AddPhotoAlternateIcon
            className={newPostStyles.newPostBar__mediaButton}
            fontSize="large"
            color="primary"
          ></AddPhotoAlternateIcon>
          <Typography variant="body1" color={'gray'}>
            Photo/Video
          </Typography>
        </div>
        <Button variant="contained">Post</Button>
      </div>
    </div>
  );
};

export default NewPostBar;
