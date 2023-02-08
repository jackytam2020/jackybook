import React, { useState, useEffect } from 'react';
import ProfileStyles from '../../styles/Profile.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User, PostsArray } from '../../state';
import { useDispatch } from 'react-redux';
import { setPosts, setFriendRequests } from '../../state';

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Button } from '@mui/material';

import NewPostBar from '../../components/NewPostBar';
import Post from '../../components/Post';
import FriendStatus from '../../components/FriendStatus';
import FriendRequestRow from '../../components/FriendRequestRow';
import FriendsListRow from '../../components/FriendsListRow';

//functions
import { pressLikeButton, deletePost } from '../home';

interface UserState {
  user: User;
}

interface PostState {
  posts: PostsArray;
}

export interface FriendRequestProps {
  _id: string;
  userID: string;
  targetID: string;
  picturePath: string;
  firstName: string;
  lastName: string;
}

//exportable functions
export const sendFriendRequest = async (
  user: User,
  targetUser: User,
  dispatch: Function
) => {
  const { data } = await axios.post(
    `http://localhost:8080/users/${user._id}/sendFriendRequest/${targetUser._id}`,
    {
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
    }
  );
  dispatch(
    setFriendRequests({
      requests: data.targetID,
    })
  );
};

const Profile = () => {
  const user = useSelector<UserState, User>((state) => state.user);
  const posts = useSelector<PostState, PostsArray>((state) => state.posts);
  const router = useRouter();
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState<User>();
  const [friendsList, setFriendsList] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestProps[]>(
    []
  );

  //the current page's profile
  const grabProfileData = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/users/profile/${router.query.id}`
    );
    setProfileData(data[0]);
    // console.log(data);
  };

  const grabFriendsList = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/users/friends/${router.query.id}`
    );
    setFriendsList(data);
  };

  const grabProfileFeedPosts = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${router.query.id}/grabPostsFromProfile`
    );
    dispatch(
      setPosts({
        posts: data.reverse(),
      })
    );
  };

  const grabFriendRequests = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/users/${user._id}/grabAllFriendRequests`
    );
    console.log(data);
    setFriendRequests(data);
  };

  useEffect(() => {
    grabProfileData();
    grabFriendsList();
    grabProfileFeedPosts();
  }, [router.query.id]);

  useEffect(() => {
    grabFriendRequests();
  }, []);

  return (
    <div className={ProfileStyles.profile}>
      {profileData && user && (
        <div className={ProfileStyles.profile__profileContainer}>
          <section className={ProfileStyles.profile__left}>
            <div className={ProfileStyles.profile__userSection}>
              <div className={ProfileStyles.profile__user}>
                <img
                  src={`http://localhost:8080/assets/${profileData.picturePath}`}
                  className={ProfileStyles.profile__profilePic}
                  alt={user.picturePath}
                />
                <div className={ProfileStyles.profile__nameFriends}>
                  <h2
                    className={ProfileStyles.profile__name}
                  >{`${profileData.firstName} ${profileData.lastName}`}</h2>
                  <p
                    className={ProfileStyles.profile__friendsCount}
                  >{`${profileData.friends.length} friends`}</p>
                </div>
              </div>
              <div className={ProfileStyles.profile__userInfo}>
                <div className={ProfileStyles.profile__locationBox}>
                  <LocationOnOutlinedIcon></LocationOnOutlinedIcon>
                  <p
                    className={ProfileStyles.profile__location}
                  >{`${profileData.location}`}</p>
                </div>
                <div className={ProfileStyles.profile__occupationBox}>
                  <WorkOutlineOutlinedIcon></WorkOutlineOutlinedIcon>
                  <p
                    className={ProfileStyles.profile__occupation}
                  >{`${profileData.occupation}`}</p>
                </div>
              </div>
              {profileData._id !== user._id && (
                <FriendStatus
                  profileData={profileData}
                  friendRequests={friendRequests}
                  sendFriendRequest={sendFriendRequest}
                />
              )}
            </div>

            <div className={ProfileStyles.profile__friendsList}>
              <h3>Friends List</h3>

              <div className={ProfileStyles.profile__friendsListContainer}>
                {friendsList.map((friend) => (
                  <FriendsListRow key={friend._id} {...friend} />
                ))}
              </div>
            </div>
          </section>

          <main className={ProfileStyles.profile__feed}>
            {user._id === profileData._id && (
              <div style={{ marginBottom: '2rem' }}>
                <NewPostBar grabProfileFeedPosts={grabProfileFeedPosts} />
              </div>
            )}

            <h2 className={ProfileStyles.profile__feedHeader}>Posts</h2>
            <section className={ProfileStyles.profile__postsSection}>
              {Array.isArray(posts) &&
                posts.map((post) => (
                  <Post
                    key={post._id}
                    {...post}
                    loggedInUser={user._id}
                    pressLikeButton={pressLikeButton}
                    grabProfileFeedPosts={grabProfileFeedPosts}
                    deletePost={deletePost}
                  />
                ))}
            </section>
          </main>

          {user._id === profileData._id &&
            (friendRequests.length > 0 ? (
              <section className={ProfileStyles.profile__friendRequests}>
                <h3>Friend Requests</h3>

                <div className={ProfileStyles.profile__requestList}>
                  {Array.isArray(friendRequests) &&
                    friendRequests.map((request) => (
                      <FriendRequestRow key={request._id} {...request} />
                    ))}
                </div>
              </section>
            ) : (
              <section className={ProfileStyles.profile__friendRequestsEmpty}>
                <h3>Friend Requests</h3>
                <p>No Friend Requests</p>
              </section>
            ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
