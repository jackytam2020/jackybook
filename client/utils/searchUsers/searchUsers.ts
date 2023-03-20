import { User } from '../../state';

export const backspaceSearch = (
  event: React.KeyboardEvent<HTMLInputElement>,
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>,
  users: User[],
  searchQuery: string
) => {
  if (event.key === 'Backspace') {
    setFilteredUsers(
      users.filter((user) =>
        (user.firstName.trim() + user.lastName.trim())
          .toLowerCase()
          .includes(searchQuery.toLowerCase().replace(/\s/g, ''))
      )
    );
  }
};

export const searchUser = (
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>,
  users: User[],
  searchQuery: string
) => {
  setFilteredUsers(
    users.filter((user) =>
      (user.firstName.trim() + user.lastName.trim())
        .toLowerCase()
        .includes(searchQuery.toLowerCase().replace(/\s/g, ''))
    )
  );
};

export const clearedSearch = (
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>,
  users: User[],
  searchQuery: string
) => {
  if (searchQuery === '') {
    setFilteredUsers([...users]);
  }
};
