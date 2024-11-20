import { React, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import './App.css';
import useLocalStorage from "./useLocalStorage";
import Api from "./Api";
import Home from './Home';
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

function App() {
  const [token, setToken] = useLocalStorage('token', null);
  
  useEffect(() => {
    if (token) {
      Api.token = token;
    }
  }, [token]);

  return (
    <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setToken={setToken}/>} />
          <Route path="/signup" element={<SignupPage setToken={setToken}/>} />
        </Routes>
    </div>
  );
}

export default App;
