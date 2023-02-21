import React, { useEffect, useState, useRef } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import authReducer from '../state';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import { PersistGate } from 'redux-persist/integration/react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { User } from '../state';

import Layout from '../components/Layout';

const persistConfig = {
  timeout: 100,
  key: 'root',
  storage: sessionStorage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// const store = configureStore({ reducer: authReducer });

export const handleNotifications = async (
  socket: Socket,
  user: User,
  receiverID: String,
  type: string,
  postID?: string,
  comment?: string
) => {
  //add notification to database unless if user is sending events to themselves
  if (user._id !== receiverID) {
    socket.emit('sendNotification', {
      senderName: user.firstName,
      senderID: user._id,
      senderPicturePath: user.picturePath,
      comment: comment,
      postID: postID,
      receiverID: receiverID,
      type: type,
      createdAt: new Date(),
    });

    await axios.post(
      `http://localhost:8080/notifications/${user._id}/sendNotification/${receiverID}`,
      {
        type: type,
        senderPicturePath: user.picturePath,
        comment: comment,
        senderName: user.firstName,
        postID: postID,
      }
    );
  }
};

export default function App({ Component, pageProps }: AppProps) {
  // const [socket, setSocket] = useState<Socket | null>(null);

  // const isConnected = useRef(true);
  // useEffect(() => {
  //   if (isConnected.current) {
  //     isConnected.current = false;
  //     setSocket(io('http://localhost:8080'));
  //   }
  // }, []);

  const socket = io('http://localhost:8080');

  return (
    <Provider store={store}>
      {socket && (
        <PersistGate
          loading={<div>loading...</div>}
          persistor={persistStore(store)}
        >
          <Layout socket={socket}>
            <Component {...pageProps} socket={socket} />
          </Layout>
        </PersistGate>
      )}
    </Provider>
  );
}
