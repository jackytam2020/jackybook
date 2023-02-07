import React, { useState, useEffect } from 'react';
import ProfileStyles from '../../styles/Profile.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User, PostsArray } from '../../state';
import { useDispatch } from 'react-redux';
import { setPosts } from '../../state';

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import NewPostBar from '../../components/NewPostBar';
import Post from '../../components/Post';

//functions
import { pressLikeButton, deletePost } from '../home';

interface UserState {
  user: User;
}

interface PostState {
  posts: PostsArray;
}

interface FriendsRowProps {
  _id: string;
  firstName: string;
  lastName: string;
  picturePath: string;
}

//components
export const RequestsRow = () => {
  const user = useSelector<UserState, User>((state) => state.user);
  return (
    <div className={ProfileStyles.profile__requestRow}>
      <div className={ProfileStyles.profile__requestUser}>
        <img
          src={`http://localhost:8080/assets/${user.picturePath}`}
          className={ProfileStyles.profile__requestPic}
          alt={user.picturePath}
        />
        <p
          className={ProfileStyles.profile__requestName}
        >{`${user.firstName} ${user.lastName}`}</p>
      </div>
      <div className={ProfileStyles.profile__requestActions}>
        <CheckOutlinedIcon></CheckOutlinedIcon>
        <CancelOutlinedIcon></CancelOutlinedIcon>
      </div>
    </div>
  );
};

export const FriendsRow: React.FC<FriendsRowProps> = ({
  _id,
  firstName,
  lastName,
  picturePath,
}) => {
  return (
    <Link href={`/profile/${_id}`}>
      <div className={ProfileStyles.profile__friendsRow}>
        <img
          src={`http://localhost:8080/assets/${picturePath}`}
          className={ProfileStyles.profile__friendsPic}
          alt={picturePath}
        />
        <p
          className={ProfileStyles.profile__friendsName}
        >{`${firstName} ${lastName}`}</p>
      </div>
    </Link>
  );
};

const Profile = () => {
  const user = useSelector<UserState, User>((state) => state.user);
  const posts = useSelector<PostState, PostsArray>((state) => state.posts);
  const router = useRouter();
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState<User>();
  const [friendsList, setFriendsList] = useState<User[]>([]);

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
    console.log(data);
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

  useEffect(() => {
    grabProfileData();
    grabFriendsList();
    grabProfileFeedPosts();
  }, [router.query.id]);

  return (
    <div className={ProfileStyles.profile}>
      {profileData && (
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
            </div>

            <div className={ProfileStyles.profile__friendsList}>
              <h3>Friends List</h3>

              <div className={ProfileStyles.profile__friendsListContainer}>
                {friendsList.map((friend) => (
                  <FriendsRow key={friend._id} {...friend} />
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
            (profileData.friendRequests.length > 0 ? (
              <section className={ProfileStyles.profile__friendRequests}>
                <h3>Friend Requests</h3>
                {
                  <div className={ProfileStyles.profile__requestList}>
                    <RequestsRow />
                  </div>
                }
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
