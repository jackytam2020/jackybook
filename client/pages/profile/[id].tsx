import React, { useState, useEffect } from 'react';
import ProfileStyles from '../../styles/Profile.module.scss';

import { useRouter } from 'next/router';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

import { useSelector, useDispatch } from 'react-redux';
import { User, PostsArray, setUser, setPosts } from '../../state';
import {
  UserRootState,
  PostRootState,
  ModeRootState,
} from '../../utils/interfaces/ReduxStateProps';

import { FriendRequestProps } from '../../utils/interfaces/FriendRequest';

import NewPostBar from '../../components/NewPostBar';
import Post from '../../components/Post';
import FriendRequests from '../../components/FriendRequests';
import UserInfo from '../../components/UserInfo';
import FriendsList from '../../components/FriendsList';

interface ProfileProps {
  serverProfileData: User;
  serverFriendsData: User[];
  serverPostData: PostsArray;
  socket: Socket;
}

const Profile: React.FC<ProfileProps> = ({
  serverProfileData,
  serverFriendsData,
  serverPostData,
  socket,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(
      setPosts({
        posts: serverPostData,
      })
    );
    grabFriendRequests();
    grabProfileData();
    grabFriendsList();
  }, [router.asPath]);

  const user = useSelector((state: UserRootState) => state.user);
  const posts = useSelector((state: PostRootState) => state.posts);
  const mode = useSelector((state: ModeRootState) => state.mode);

  const [profileData, setProfileData] = useState<User>(serverProfileData);
  const [friendsList, setFriendsList] = useState<User[]>(serverFriendsData);
  const [friendRequests, setFriendRequests] = useState<FriendRequestProps[]>(
    []
  );

  //the current page's profile - client side http requests
  const grabProfileData = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/users/profile/${router.query.id}`
    );
    setProfileData(data[0]);
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
        posts: data,
      })
    );
  };

  const grabFriendRequests = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/users/${user._id}/grabAllFriendRequests`
    );
    setFriendRequests(data);
  };

  useEffect(() => {
    if (user) {
      grabFriendRequests();
      grabProfileData();
      grabFriendsList();

      //if the current profile page is the logged in user, update the redux user state
      if (router.query.id === user._id) {
        dispatch(
          setUser({
            user: profileData,
          })
        );
      }
    }
  }, [user]);

  return (
    <div
      className={
        mode === 'light' ? ProfileStyles.profile : ProfileStyles.profileDark
      }
    >
      {profileData && user && (
        <div className={ProfileStyles.profile__profileContainer}>
          <section className={ProfileStyles.profile__left}>
            <UserInfo
              mode={mode}
              profileData={profileData}
              user={user}
              grabProfileData={grabProfileData}
              grabFriendsList={grabFriendsList}
              socket={socket}
            />
            <FriendsList friendsList={friendsList} mode={mode} />
          </section>

          <main className={ProfileStyles.profile__feed}>
            {user._id === profileData._id && (
              <div style={{ marginBottom: '2rem' }}>
                <NewPostBar grabProfileFeedPosts={grabProfileFeedPosts} />
              </div>
            )}

            <h2
              className={
                mode === 'light'
                  ? ProfileStyles.profile__feedHeader
                  : ProfileStyles.profileDark__feedHeader
              }
            >
              Posts
            </h2>
            <section className={ProfileStyles.profile__postsSection}>
              {Array.isArray(posts) && posts.length > 0 ? (
                posts
                  .slice()
                  .reverse()
                  .map((post) => (
                    <Post
                      key={post._id}
                      {...post}
                      loggedInUser={user._id}
                      grabProfileFeedPosts={grabProfileFeedPosts}
                    />
                  ))
              ) : (
                <p style={{ color: 'grey' }}>
                  {profileData._id === user._id
                    ? `No posts to show`
                    : `${profileData.firstName} has not made a post yet`}
                </p>
              )}
            </section>
          </main>

          {user._id === profileData._id && (
            <FriendRequests
              friendRequests={friendRequests}
              socket={socket}
              user={user}
              mode={mode}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.params) {
    const [serverProfileData, serverPostData, serverFriendsData] =
      await Promise.all([
        axios.get(`http://localhost:8080/users/profile/${context.params.id}`),
        axios.get(
          `http://localhost:8080/posts/${context.params.id}/grabPostsFromProfile`
        ),
        axios.get(`http://localhost:8080/users/friends/${context.params.id}`),
      ]);

    return {
      props: {
        serverProfileData: serverProfileData.data[0],
        serverPostData: serverPostData.data,
        serverFriendsData: serverFriendsData.data,
      },
    };
  }
};

export default Profile;
