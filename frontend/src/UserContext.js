import { createContext, useState } from "react";
import Api from "./Api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  const setUser = async (newUser) => {
    if (newUser === null) {
      setUserState(null);
    } else if (!user || (newUser && newUser.username !== user.username)) {
      const userData = await Api.getUser(newUser.username);
      setUserState({ ...newUser, ...userData });
    }
  };

  const refreshUser = async () => {
    if (user) {
      const userData = await Api.getUser(user.username);
      setUserState({ ...user, ...userData });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};