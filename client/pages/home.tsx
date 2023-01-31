import React from 'react';
import homeStyles from '../styles/Home.module.scss';
import { useMediaQuery, Container, Box } from '@mui/material';

import NewPostBar from '../components/NewPostBar';
import Post from '../components/Post';

const home = () => {
  return (
    <div className={homeStyles.home}>
      <main className={homeStyles.home__container}>
        <article>
          <NewPostBar />
        </article>
        <section className={homeStyles.home__postsSection}>
          <Post />
          <Post />
        </section>
      </main>
    </div>
  );
};

export default home;
