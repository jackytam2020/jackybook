import React, { useState } from 'react';
import searchResultsStyles from '../styles/SearchResults.module.scss';
import SearchResultRow from './SearchResultRow';
import { useSelector } from 'react-redux';
import { User } from '../state';

interface SearchResultsProps {
  filteredUsers: User[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  filteredUsers,
  searchQuery,
  setSearchQuery,
}) => {
  const usersList = filteredUsers.map((user) => (
    <SearchResultRow key={user._id} {...user} setSearchQuery={setSearchQuery} />
  ));

  return (
    <div
      className={
        searchQuery !== ''
          ? searchResultsStyles.searchResults
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
