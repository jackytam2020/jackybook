import React, { useState, useEffect } from 'react';
import ProfileStyles from '../../styles/Profile.module.scss';

import { useRouter } from 'next/router';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

import { useSelector, useDispatch } from 'react-redux';
import { User, PostsArray, setUser, setPosts } from '../../state';

import { FriendRequestProps } from '../../utils/interfaces/FriendRequest';

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

import NewPostBar from '../../components/NewPostBar';
import Post from '../../components/Post';
import FriendStatus from '../../components/FriendStatus';
import FriendRequestRow from '../../components/FriendRequestRow';
import FriendsListRow from '../../components/FriendsListRow';

interface UserState {
  user: User;
}

interface PostState {
  posts: PostsArray;
}

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

  const user = useSelector((state: UserState) => state.user);
  const posts = useSelector((state: PostState) => state.posts);

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
    <div className={ProfileStyles.profile}>
      {profileData && user && (
        <div className={ProfileStyles.profile__profileContainer}>
          <section className={ProfileStyles.profile__left}>
            <div className={ProfileStyles.profile__userSection}>
              <div className={ProfileStyles.profile__user}>
                <img
                  src={`http://localhost:8080/assets/${profileData.picturePath}`}
                  className={ProfileStyles.profile__profilePic}
                  alt={profileData.picturePath}
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
                  grabProfileData={grabProfileData}
                  profileData={profileData}
                  grabFriendsList={grabFriendsList}
                  socket={socket}
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
                      <FriendRequestRow
                        key={request._id}
                        {...request}
                        socket={socket}
                        user={user}
                      />
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
