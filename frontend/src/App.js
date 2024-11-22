import { jwtDecode } from "jwt-decode";
import { React, useCallback, useContext, useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import Api from "./Api";
import './App.css';
import CreateListing from "./CreateListing";
import Home from './Home';
import ListingDetail from "./ListingDetail";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { UserContext } from "./UserContext";
import useLocalStorage from "./useLocalStorage";

function App() {
  const [token, setToken] = useLocalStorage('token', null);
  
  const { setUser } = useContext(UserContext);

  const getUser = useCallback(() => {
    let user = jwtDecode(token);
    setUser(user);
  }, [token, setUser]);

  useEffect(() => {
    if (token) {
      Api.token = token;
      getUser();
    } else {
      setUser(null);
    }
  }, [token, getUser, setUser]);

  return (
    <div className="App">
        <Routes>
          <Route exact path="/" element={<Home setToken={setToken}/>} />
          <Route path="/login" element={<LoginPage setToken={setToken}/>} />
          <Route path="/signup" element={<SignupPage setToken={setToken}/>} />
          <Route path="/create_listing" element={<CreateListing/>} />
          <Route path="/listings/:id" element={<ListingDetail/>} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    </div>
  );
}

export default App;
