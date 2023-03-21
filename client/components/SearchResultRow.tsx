import React from 'react';
import searchResultRowStyles from '../styles/SearchResultRow.module.scss';
import Link from 'next/link';

interface SearchResultRowProps {
  _id: string;
  firstName: string;
  lastName: string;
  picturePath: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  setMobileSearchIsOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
}

const SearchResultRow: React.FC<SearchResultRowProps> = ({
  _id,
  firstName,
  lastName,
  picturePath,
  setSearchQuery,
  mode,
  setMobileSearchIsOpen,
}) => {
  return (
    <Link href={`/profile/${_id}`}>
      <div
        className={searchResultRowStyles.searchResultRow}
        onClick={() => {
          setSearchQuery('');
          if (setMobileSearchIsOpen) {
            setMobileSearchIsOpen(false);
          }
        }}
      >
        <img
          className={searchResultRowStyles.searchResultRow__profilePic}
          src={`http://localhost:8080/assets/${picturePath}`}
          alt={picturePath}
        />
        <p
          style={{
            color: mode === 'light' ? 'black' : 'white',
            transition: '1s',
          }}
        >{`${firstName} ${lastName}`}</p>
      </div>
    </Link>
  );
};

export default SearchResultRow;
