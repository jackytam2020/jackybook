import React from 'react';
import fromNotificationsStyles from '../../styles/FromNotifications.module.scss';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import Head from 'next/head';

import { GetServerSidePropsContext } from 'next';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { PostProps } from '../../state';
import { ModeRootState } from '../../utils/interfaces/ReduxStateProps';

import Post from '../../components/Post';

interface fromNotificationsProps {
  selectedPost: PostProps;
  socket: Socket;
}

const fromNotifications: React.FC<fromNotificationsProps> = ({
  selectedPost,
  socket,
}) => {
  const router = useRouter();
  const mode = useSelector((state: ModeRootState) => state.mode);

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
          <Post {...selectedPost} fromNotification={true} socket={socket} />
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
        </main>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.params) {
    const post = await axios.get(
      `${process.env.HOST}/posts/${context.params.id}/grabSinglePost`
    );

    return {
      props: {
        selectedPost: post.data,
      },
    };
  }
};

export default fromNotifications;
