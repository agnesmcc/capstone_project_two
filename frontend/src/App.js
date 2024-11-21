import { React, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import './App.css';
import useLocalStorage from "./useLocalStorage";
import Api from "./Api";
import Home from './Home';
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CreateListing from "./CreateListing";

function App() {
  const [token, setToken] = useLocalStorage('token', null);
  
  useEffect(() => {
    Api.token = token;
  }, [token]);

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
