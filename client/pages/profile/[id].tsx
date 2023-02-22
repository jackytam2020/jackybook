import React, { useState, useEffect } from 'react';
import ProfileStyles from '../../styles/Profile.module.scss';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User, PostsArray } from '../../state';
import { useDispatch } from 'react-redux';
import {
  setPosts,
  setFriendRequests,
  setNewFriend,
  setRemoveFriendRequest,
  setRemoveFriend,
  setUser,
} from '../../state';
import { GetServerSidePropsContext } from 'next';
import { Socket } from 'socket.io-client';
import { handleNotifications } from '../_app';

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

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

interface ProfileProps {
  serverProfileData: User;
  serverFriendsData: User[];
  serverPostData: PostsArray;
  socket: Socket;
}

export interface FriendRequestProps {
  _id: string;
  userID: string;
  targetID: string;
  picturePath: string;
  firstName: string;
  lastName: string;
  socket: Socket;
  user: User;
}

//exportable functions
export const sendFriendRequest = async (
  user: User,
  targetUserID: string,
  dispatch: Function,
  socket: Socket
) => {
  const { data } = await axios.post(
    `http://localhost:8080/users/${user._id}/sendFriendRequest/${targetUserID}`,
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

  handleNotifications(socket, user, targetUserID, 'friendRequest');
};

export const acceptFriendRequest = async (
  userID: string,
  targetID: string,
  dispatch: Function,
  socket: Socket,
  user: User
) => {
  await axios.patch(
    `http://localhost:8080/users/${targetID}/addFriend/${userID}`
  );

  dispatch(
    setNewFriend({
      newFriend: userID,
    })
  );

  removeFriendRequest(targetID, userID, dispatch);
  handleNotifications(socket, user, userID, 'acceptedRequest');
};

export const removeFriendRequest = async (
  userID: string,
  requestSenderID: string,
  dispatch?: Function
) => {
  const response = await axios.delete(
    `http://localhost:8080/users/${userID}/removeFriendRequest/${requestSenderID}`
  );

  if (dispatch) {
    dispatch(
      setRemoveFriendRequest({
        userID: userID,
      })
    );
  }

  console.log(response);
};

export const removeFriend = async (
  userID: string,
  friendID: string,
  grabFriendsList: () => void,
  // grabProfileData: () => void,
  dispatch: Function
) => {
  const { data } = await axios.patch(
    `http://localhost:8080/users/${userID}/deleteFriend/${friendID}`
  );

  dispatch(
    setRemoveFriend({
      friendID: friendID,
    })
  );
  grabFriendsList();
  console.log(data);
};

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

  const user = useSelector<UserState, User>((state) => state.user);
  const posts = useSelector<PostState, PostsArray>((state) => state.posts);

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
