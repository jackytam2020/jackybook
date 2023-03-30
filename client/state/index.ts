import { createSlice } from '@reduxjs/toolkit';
// import { Socket } from 'socket.io-client';

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

export interface PostProps {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  description: string;
  picturePath: string;
  likes: object;
  comments: object;
  userID: string;
  loggedInUser: string;
  userPicturePath: string;
  grabFeedPosts?: () => void;
  grabProfileFeedPosts?: () => void;
  // socket: Socket;
  fromNotification?: boolean;
}

export interface PostsArray {
  posts: PostProps[];
}

type InitialState = {
  mode: string;
  user: User | null;
  token: String | null;
  posts: PostsArray[];
  users: User[];
};

const initialState: InitialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  users: [],
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
    setAllUsers: (state, action) => {
      state.users = action.payload.users;
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
    },
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
  setAllUsers,
} = authSlice.actions;
export default authSlice.reducer;
