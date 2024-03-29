import React, { useEffect, useRef } from 'react';
import homeStyles from '../styles/Home.module.scss';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from '../state/index';
import { User, setAllUsers } from '../state';
import {
  UserRootState,
  PostRootState,
  ModeRootState,
} from '../utils/interfaces/ReduxStateProps';
import { Socket } from 'socket.io-client';

import NewPostBar from '../components/NewPostBar';
import Post from '../components/Post';

interface HomeProp {
  socket: Socket;
  users: User[];
}

const home: React.FC<HomeProp> = ({ socket, users }) => {
  const user = useSelector((state: UserRootState) => state.user);
  const posts = useSelector((state: PostRootState) => state.posts);
  const mode = useSelector((state: ModeRootState) => state.mode);
  const dispatch = useDispatch();
  const router = useRouter();

  const grabFeedPosts = async () => {
    const { data } = await axios.get(
      `${process.env.HOST}/posts/${user._id}/grabFeedPosts`
    );
    dispatch(
      setPosts({
        posts: data.reverse(),
      })
    );
  };

  useEffect(() => {
    //if user is not logged in, redirect to login page
    if (!user) {
      router.push('/');
      return;
    }
    grabFeedPosts();

    //grab all users from database and assign it to redux state
    dispatch(
      setAllUsers({
        users: users,
      })
    );
  }, []);

  const isConnected = useRef(true);

  //add new online user to socket
  useEffect(() => {
    if (isConnected.current) {
      isConnected.current = false;
      if (user) {
        socket?.emit('newUser', user._id);
      }
    }
  }, [socket]);

  return (
    <>
      <Head>
        <title>Jackybook</title>
      </Head>
      <div className={mode === 'light' ? homeStyles.home : homeStyles.homeDark}>
        <main className={homeStyles.home__container}>
          <article>
            <NewPostBar grabFeedPosts={grabFeedPosts} />
          </article>
          <section className={homeStyles.home__postsSection}>
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  loggedInUser={user._id}
                  grabFeedPosts={grabFeedPosts}
                  socket={socket}
                />
              ))
            ) : (
              <p style={{ color: 'grey' }}>No posts to show</p>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default home;

//grab all users and send it home page as prop
export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.HOST}/users`);
  return {
    props: {
      users: data,
    },
  };
};
