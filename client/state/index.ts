import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  friends: string[];
  friendRequests: string[];
  location: string;
  occupation: string;
  profileViews: number;
  impressions: number;
  _id: string;
}

interface Post {
  comments: string[];
  createdAt: string;
  description: string;
  firstName: string;
  lastName: string;
  likes: { [key: string]: boolean };
  location: string;
  picturePath: string;
  updatedAt: string;
  userID: string;
}

export interface PostsArray {
  posts: Post[];
}

type InitialState = {
  mode: string;
  user: User | null;
  token: String | null;
  posts: PostsArray[];
};

const defaultInitialState: InitialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
};

let userState, tokenState, postState;

if (typeof window !== 'undefined') {
  const userStateString = localStorage.getItem('user');
  userState = userStateString !== null ? JSON.parse(userStateString) : null;

  const tokenStateString = localStorage.getItem('token');
  tokenState = tokenStateString !== null ? JSON.parse(tokenStateString) : null;

  const postStateString = localStorage.getItem('posts');
  postState = postStateString !== null ? JSON.parse(postStateString) : null;
}

const initialState: InitialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // localStorage.setItem('user', JSON.stringify(state.user));
      // localStorage.setItem('token', JSON.stringify(state.token));
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
    },
    setNewFriend: (state, action) => {
      if (state.user) {
        state.user.friends.push(action.payload.newFriend);
      } else {
        console.error('user friends does not exist');
      }
    },
    setFriendRequests: (state, action) => {
      if (state.user) {
        state.user.friendRequests.push(action.payload.requests);
      }
    },
    setRemoveFriendRequest: (state, action) => {
      if (state.user) {
        state.user.friendRequests = state.user.friendRequests.filter(
          (request) => !request.includes(action.payload.userID)
        );
      }
    },
    setRemoveFriend: (state, action) => {
      if (state.user) {
        state.user.friends = state.user.friends.filter(
          (request) => !request.includes(action.payload.friendID)
        );
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
      // localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    // setPost: (state, action) => {
    //   const updatedPosts = state.posts.map((post: Post) => {
    //     if (post._id === action.payload.post._id) return action.payload;
    //     return post;
    //   });
    //   state.posts = updatedPosts;
    // },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setPosts,
  setFriendRequests,
  setNewFriend,
  setRemoveFriendRequest,
  setRemoveFriend,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
