import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FriendsPayload {
  friends: [];
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  friends: Array<FriendsPayload>;
  location: string;
  occupation: string;
  profileViews: number;
  impressions: number;
}

interface Post {
  _id: string;
}

type InitialState = {
  mode: string;
  user: User | null;
  token: String | null;
  posts: Post[];
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
    },
    setFriends: (state, action: PayloadAction<FriendsPayload>) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('user friends does not exist');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post: Post) => {
        if (post._id === action.payload.post._id) return action.payload;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
