import React, { useEffect, useState, useRef } from 'react';
import homeStyles from '../styles/Home.module.scss';
import { useMediaQuery, Container, Box } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User } from '../state';
import { useDispatch } from 'react-redux';
import state, { setPosts } from '../state/index';
import { PostsArray } from '../state';

import NewPostBar from '../components/NewPostBar';
import Post from '../components/Post';
import { ObjectBindingPattern } from 'typescript';

interface UserState {
  user: User;
}

interface PostState {
  posts: PostsArray;
}

const home = () => {
  const user = useSelector<UserState, User>((state) => state.user);
  const posts = useSelector<PostState, PostsArray>((state) => state.posts);
  const dispatch = useDispatch();

  const grabFeedPosts = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/posts/${user._id}/grabFeedPosts`
    );
    dispatch(
      setPosts({
        posts: data.reverse(),
      })
    );
  };

  const pressLikeButton = async (postID: string) => {
    const response = await axios.patch(
      `http://localhost:8080/posts/${postID}/likePost`,
      { userID: user._id }
    );
    grabFeedPosts();
    console.log(response);
  };

  const deletePost = async (postID: string) => {
    const response = await axios.delete(
      `http://localhost:8080/posts/${postID}/deletePost`
    );
    console.log(response);
    grabFeedPosts();
  };

  useEffect(() => {
    grabFeedPosts();
  }, []);

  const [isEditDeleteOpen, setIsEditDeleteOpen] = useState<boolean>(false);
  let editDeleteMenuRef = useRef<HTMLInputElement>();

  //close edit delete comment menu by clicking anywhere on the homepage
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
  }, []);

  //close cart popout when clicked outside
  const handleClickOutside = (e: MouseEvent) => {
    if (!editDeleteMenuRef.current?.contains(e.target as HTMLElement)) {
      setIsEditDeleteOpen(false);
    }
  };

  return (
    <div className={homeStyles.home}>
      <main className={homeStyles.home__container}>
        <article>
          <NewPostBar grabFeedPosts={grabFeedPosts} />
        </article>
        <section className={homeStyles.home__postsSection}>
          {Array.isArray(posts) &&
            posts.map((post) => (
              <Post
                key={post._id}
                {...post}
                deletePost={deletePost}
                pressLikeButton={pressLikeButton}
                loggedInUser={user._id}
                grabFeedPosts={grabFeedPosts}
                isEditDeleteOpen={isEditDeleteOpen}
                setIsEditDeleteOpen={setIsEditDeleteOpen}
                editDeleteMenuRef={editDeleteMenuRef}
              />
            ))}
        </section>
      </main>
    </div>
  );
};

export default home;
