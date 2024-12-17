import { createContext } from "react";

export const UserContext = createContext();

/**
 * The UserProvider component is responsible for providing the user information to the
 * components that request it. It expects a children prop which is the JSX that will be
 * wrapped by the UserProvider component, and a user prop which is an object with all the
 * user information.
 *
 * @param {Object} children the JSX that will be wrapped
 * @param {String} token the user token
 * @param {Object} user the user object
 * @returns {React.Component} The UserProvider component
 */
export const UserProvider = ({ children, token, user}) => {
  return (
    <UserContext.Provider token={{token}} value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
