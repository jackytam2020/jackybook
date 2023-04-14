import React, { useState, useEffect } from 'react';
import ProfileStyles from '../../styles/Profile.module.scss';

import { useRouter } from 'next/router';
// import { Socket } from 'socket.io-client';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector, useDispatch } from 'react-redux';
import { User, PostsArray, setPosts } from '../../state';
import {
  UserRootState,
  PostRootState,
  ModeRootState,
} from '../../utils/interfaces/ReduxStateProps';

import { updateLoggedInUser } from '../../utils/updateLoggedInUser';
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
  // socket: Socket;
}

const Profile: React.FC<ProfileProps> = ({
  serverProfileData,
  serverFriendsData,
  serverPostData,
  // socket,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const posts = useSelector((state: PostRootState) => state.posts);
  const mode = useSelector((state: ModeRootState) => state.mode);
  const user = useSelector((state: UserRootState) => state.user);

  const [profileData, setProfileData] = useState<User>(serverProfileData);
  const [friendsList, setFriendsList] = useState<User[]>(serverFriendsData);
  const [friendRequests, setFriendRequests] = useState<FriendRequestProps[]>(
    []
  );

  useEffect(() => {
    //if the current profile page is the logged in user, update the redux user state
    if (user) {
      if (router.query.id === user._id) {
        updateLoggedInUser(user._id, dispatch);
      }
    } else if (!user) {
      router.push('/');
      return;
    }

    dispatch(
      setPosts({
        posts: serverPostData,
      })
    );
    grabFriendRequests();
    grabProfileData();
    grabFriendsList();
  }, [router.asPath]);

  //the current page's profile - client side http requests
  const grabProfileData = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/users/profile/${router.query.id}`
    );
    setProfileData(data[0]);
  };

  const grabFriendsList = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/users/friends/${router.query.id}`
    );
    setFriendsList(data);
  };

  const grabProfileFeedPosts = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/posts/${router.query.id}/grabPostsFromProfile`
    );
    dispatch(
      setPosts({
        posts: data,
      })
    );
  };

  const grabFriendRequests = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/users/${user._id}/grabAllFriendRequests`
    );
    setFriendRequests(data);
  };

  return (
    <>
      <Head>
        <title>Jackybook - Profile</title>
      </Head>
      <div
        className={
          mode === 'light' ? ProfileStyles.profile : ProfileStyles.profileDark
        }
      >
        {profileData && user && (
          <div className={ProfileStyles.profile__profileContainer}>
            {/* <section className={ProfileStyles.profile__left}>
              <UserInfo
                mode={mode}
                profileData={profileData}
                user={user}
                grabProfileData={grabProfileData}
                grabFriendsList={grabFriendsList}
                // socket={socket}
              />
              <FriendsList friendsList={friendsList} mode={mode} />
            </section> */}

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
                        // socket={socket}
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

            {/* {user._id === profileData._id && (
              <FriendRequests
                friendRequests={friendRequests}
                // socket={socket}
                user={user}
                mode={mode}
                grabProfileData={grabProfileData}
                grabFriendsList={grabFriendsList}
                grabFriendRequests={grabFriendRequests}
              />
            )} */}
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.params) {
    const [serverProfileData, serverPostData, serverFriendsData] =
      await Promise.all([
        axios.get(`${process.env.HOST}/users/profile/${context.params.id}`),
        axios.get(
          `${process.env.HOST}/posts/${context.params.id}/grabPostsFromProfile`
        ),
        axios.get(`${process.env.HOST}/users/friends/${context.params.id}`),
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
