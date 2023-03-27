import React, { useState, useEffect } from 'react';
import mobileSearchStyles from '../styles/MobileSearch.module.scss';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import SearchResults from './SearchResults';
import { User } from '../state';
import {
  searchUser,
  backspaceSearch,
  clearedSearch,
} from '../utils/searchUsers/searchUsers';
import {
  UserRootState,
  ModeRootState,
} from '../utils/interfaces/ReduxStateProps';

interface UsersRootState {
  users: User[];
}

interface MobileSearchProps {
  mobileSearchIsOpen: boolean;
  setMobileSearchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  mobileSearchIsOpen,
  setMobileSearchIsOpen,
}) => {
  const router = useRouter();

  let users = useSelector((state: UsersRootState) => state.users);
  const user = useSelector((state: UserRootState) => state.user);
  const mode = useSelector((state: ModeRootState) => state.mode);
  //remove logged in user from users array to display other users in search result
  if (user) users = users.filter((u) => u._id != user._id);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([...users]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    searchUser(setFilteredUsers, users, searchQuery);
  }, [searchQuery]);

  return (
    <div
      className={
        mobileSearchIsOpen
          ? mode === 'light'
            ? mobileSearchStyles.mobileSearch
            : mobileSearchStyles.mobileSearchDark
          : mode === 'light'
          ? mobileSearchStyles.mobileSearchHidden
          : mobileSearchStyles.mobileSearchHiddenDark
      }
    >
      <div className={mobileSearchStyles.mobileSearch__backAndSearch}>
        <ArrowBackIosIcon
          onClick={() => {
            setMobileSearchIsOpen(false);
            setSearchQuery('');
          }}
          sx={{
            color: mode === 'light' ? 'black' : 'white',
          }}
        />
        <input
          className={
            mode === 'light'
              ? mobileSearchStyles.mobileSearch__searchInput
              : mobileSearchStyles.mobileSearch__searchInputDark
          }
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            backspaceSearch(e, setFilteredUsers, users, searchQuery);
          }}
          onKeyUp={() => {
            clearedSearch(setFilteredUsers, users, searchQuery);
          }}
        ></input>
      </div>
      <SearchResults
        filteredUsers={filteredUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setMobileSearchIsOpen={setMobileSearchIsOpen}
      />
    </div>
  );
};

export default MobileSearch;
