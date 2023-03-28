export const addNewUser = (userID, socketID, onlineUsers) => {
  !onlineUsers.some((user) => user.userID === userID) &&
    onlineUsers.push({
      userID,
      socketID,
    });
};

export const removeUser = (socketID, onlineUsers) => {
  onlineUsers = onlineUsers.filter((user) => user.socketID !== socketID);
};

export const getUser = (userID, onlineUsers) => {
  return onlineUsers.find((user) => user.userID === userID);
};
