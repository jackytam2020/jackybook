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
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const persistConfig = { timeout: 100, key: 'root', storage, version: 1 };
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

export default function App({ Component, pageProps }: AppProps) {
  // const mode = useSelector((state) => state.mode);
  const router = useRouter();

  return (
    <Provider store={store}>
      <PersistGate
        loading={<div>loading...</div>}
        persistor={persistStore(store)}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}
