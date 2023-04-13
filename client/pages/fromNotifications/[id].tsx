import React, { useEffect, useState } from 'react';
import fromNotificationsStyles from '../../styles/FromNotifications.module.scss';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GetServerSidePropsContext } from 'next';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { PostProps } from '../../state';
import {
  ModeRootState,
  UserRootState,
} from '../../utils/interfaces/ReduxStateProps';

import Post from '../../components/Post';

interface fromNotificationsProps {
  socket: Socket;
  serverSelectedPost: PostProps;
  notificationID: string;
}

const FromNotifications: React.FC<fromNotificationsProps> = ({
  serverSelectedPost,
  notificationID,
  socket,
}) => {
  const router = useRouter();
  const mode = useSelector((state: ModeRootState) => state.mode);
  const user = useSelector((state: UserRootState) => state.user);

  const [selectedPost, setSelectedPost] = useState(serverSelectedPost);

  const unavailablePost = () =>
    toast.error('Post is no longer available', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: 'colored',
    });

  const grabSinglePost = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.HOST}/posts/${router.query.id}/grabSinglePost`
      );

      setSelectedPost(data);
    } catch {
      unavailablePost();
    }
  };

  useEffect(() => {
    grabSinglePost();
  }, [router.asPath, notificationID]);

  return (
    <>
      <Head>
        <title>Jackybook</title>
      </Head>
      <div
        className={
          mode === 'light'
            ? fromNotificationsStyles.fromNotifications
            : fromNotificationsStyles.fromNotificationsDark
        }
      >
        <main className={fromNotificationsStyles.fromNotifications__container}>
          <h3 className={fromNotificationsStyles.fromNotifications__header}>
            From Notifications
          </h3>
          {selectedPost ? (
            <Post
              {...selectedPost}
              fromNotification={true}
              grabSinglePost={grabSinglePost}
              loggedInUser={user._id}
              socket={socket}
            />
          ) : (
            <p>Post is no longer available</p>
          )}
          <div
            className={fromNotificationsStyles.fromNotifications__backOption}
          >
            <ArrowBackIosIcon
              sx={{
                color: mode === 'light' ? 'black' : 'white',
              }}
            ></ArrowBackIosIcon>
            <p
              onClick={() => {
                router.push('/home');
              }}
            >
              Go back
            </p>
          </div>
          <ToastContainer />
        </main>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    if (context.params) {
      const post = await axios.get(
        `${process.env.HOST}/posts/${context.params.id}/grabSinglePost`,
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );

      const notificationID = context.query._id;

      return {
        props: {
          serverSelectedPost: post.data,
          notificationID: notificationID,
        },
      };
    }
  } catch {
    return {
      props: {
        serverSelectedPost: null,
      },
    };
  }
};

export default FromNotifications;
