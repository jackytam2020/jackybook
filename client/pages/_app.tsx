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
import sessionStorage from 'redux-persist/lib/storage/session';
import { PersistGate } from 'redux-persist/integration/react';
import { io } from 'socket.io-client';
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

export default function App({ Component, pageProps }: AppProps) {
  const [selectedPostID, setSelectedPostID] = useState<string>('');

  const socket = io('http://localhost:8080');

  return (
    <Provider store={store}>
      {socket && (
        <PersistGate
          loading={<div>loading...</div>}
          persistor={persistStore(store)}
        >
          <Layout socket={socket} setSelectedPostID={setSelectedPostID}>
            <Component
              {...pageProps}
              socket={socket}
              selectedPostID={selectedPostID}
              setSelectedPostID={setSelectedPostID}
            />
          </Layout>
        </PersistGate>
      )}
    </Provider>
  );
}
