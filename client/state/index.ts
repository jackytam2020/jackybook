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
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
    },
    // setFriends: (state, action: PayloadAction<FriendsPayload>) => {
    //   if (state.user) {
    //     state.user.friends = action.payload.friends;
    //   } else {
    //     console.error('user friends does not exist');
    //   }
    // },
    setFriendRequests: (state, action) => {
      if (state.user) {
        state.user.friendRequests.push(action.payload.requests);
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
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

export const { setMode, setLogin, setLogout, setPosts, setFriendRequests } =
  authSlice.actions;
export default authSlice.reducer;
