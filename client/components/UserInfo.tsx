import React from 'react';
import userInfoStyles from '../styles/UserInfo.module.scss';
import FriendStatus from './FriendStatus';
import Image from 'next/image';

import { User } from '../state';
import { Socket } from 'socket.io-client';

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

interface UserInfoProps {
  mode: string;
  profileData: User;
  user: User;
  grabProfileData: () => void;
  grabFriendsList: () => void;
  socket: Socket;
}

const UserInfo: React.FC<UserInfoProps> = ({
  mode,
  profileData,
  user,
  grabProfileData,
  grabFriendsList,
  socket,
}) => {
  return (
    <div
      className={
        mode === 'light' ? userInfoStyles.userInfo : userInfoStyles.userInfoDark
      }
    >
      <div className={userInfoStyles.userInfo__user}>
        <Image
          src={`${process.env.HOST}/assets/${profileData.picturePath}`}
          className={userInfoStyles.userInfo__profilePic}
          alt={profileData.picturePath}
          width="150"
          height="150"
        />
        <div className={userInfoStyles.userInfo__nameFriends}>
          <h2
            className={userInfoStyles.userInfo__name}
          >{`${profileData.firstName} ${profileData.lastName}`}</h2>
          <p
            className={userInfoStyles.userInfo__friendsCount}
          >{`${profileData.friends.length} friends`}</p>
        </div>
      </div>
      <div className={userInfoStyles.userInfo__locationAndJob}>
        <div className={userInfoStyles.userInfo__locationBox}>
          <LocationOnOutlinedIcon></LocationOnOutlinedIcon>
          <p
            className={userInfoStyles.userInfo__location}
          >{`${profileData.location}`}</p>
        </div>
        <div className={userInfoStyles.userInfo__occupationBox}>
          <WorkOutlineOutlinedIcon></WorkOutlineOutlinedIcon>
          <p
            className={userInfoStyles.userInfo__occupation}
          >{`${profileData.occupation}`}</p>
        </div>
      </div>
      {profileData._id !== user._id && (
        <FriendStatus
          grabProfileData={grabProfileData}
          profileData={profileData}
          grabFriendsList={grabFriendsList}
          socket={socket}
        />
      )}
    </div>
  );
};

export default UserInfo;
