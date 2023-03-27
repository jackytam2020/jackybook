import React from 'react';
import searchResultsStyles from '../styles/SearchResults.module.scss';
import SearchResultRow from './SearchResultRow';

import { User } from '../state';
import { useSelector } from 'react-redux';
import { ModeRootState } from '../utils/interfaces/ReduxStateProps';

interface SearchResultsProps {
  filteredUsers: User[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setMobileSearchIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  filteredUsers,
  searchQuery,
  setSearchQuery,
  setMobileSearchIsOpen,
}) => {
  const mode = useSelector((state: ModeRootState) => state.mode);

  const usersList = filteredUsers.map((user) => (
    <SearchResultRow
      key={user._id}
      {...user}
      setSearchQuery={setSearchQuery}
      mode={mode}
      setMobileSearchIsOpen={
        setMobileSearchIsOpen ? setMobileSearchIsOpen : null
      }
    />
  ));

  return (
    <div
      className={
        searchQuery !== ''
          ? mode === 'light'
            ? searchResultsStyles.searchResults
            : searchResultsStyles.searchResultsDark
          : searchResultsStyles.searchResultsEmpty
      }
    >
      {filteredUsers.length > 0 ? (
        usersList
      ) : (
        <p style={{ padding: '1rem' }}>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
