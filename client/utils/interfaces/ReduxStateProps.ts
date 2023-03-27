import { User, PostsArray } from '../../state';

export interface UserRootState {
  user: User;
}

export interface PostRootState {
  posts: PostsArray;
}

export interface ModeRootState {
  mode: string;
}

export interface TokenRootState {
  token: string;
}
