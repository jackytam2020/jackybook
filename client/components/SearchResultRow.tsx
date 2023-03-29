import React from 'react';
import searchResultRowStyles from '../styles/SearchResultRow.module.scss';
import Link from 'next/link';
import Image from 'next/image';

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
        <Image
          className={searchResultRowStyles.searchResultRow__profilePic}
          src={`${process.env.HOST}/assets/${picturePath}`}
          alt={picturePath}
          width="50"
          height="50"
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
