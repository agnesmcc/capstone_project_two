import { React, useEffect, useCallback, useContext } from "react";
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { UserContext } from "./UserContext";
import useLocalStorage from "./useLocalStorage";
import { jwtDecode } from "jwt-decode";
import Api from "./Api";
import Home from './Home';
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CreateListing from "./CreateListing";

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
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    </div>
  );
}

export default App;
