import { createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children, token, user}) => {
  return (
    <UserContext.Provider token={{token}} value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
