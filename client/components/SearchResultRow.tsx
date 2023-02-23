import React from 'react';
import searchResultRowStyles from '../styles/SearchResultRow.module.scss';
import Link from 'next/link';

interface SearchResultRowProps {
  _id: string;
  firstName: string;
  lastName: string;
  picturePath: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchResultRow: React.FC<SearchResultRowProps> = ({
  _id,
  firstName,
  lastName,
  picturePath,
  setSearchQuery,
}) => {
  return (
    <Link href={`/profile/${_id}`}>
      <div
        className={searchResultRowStyles.searchResultRow}
        onClick={() => {
          setSearchQuery('');
        }}
      >
        <img
          className={searchResultRowStyles.searchResultRow__profilePic}
          src={`http://localhost:8080/assets/${picturePath}`}
          alt={picturePath}
        />
        <p>{`${firstName} ${lastName}`}</p>
      </div>
    </Link>
  );
};

export default SearchResultRow;
