import { jwtDecode } from "jwt-decode";
import { React } from "react";
import { useQuery } from "react-query";
import { Route, Routes } from 'react-router-dom';
import Api from "./Api";
import './App.css';
import CreateListing from "./CreateListing";
import Home from './Home';
import ListingDetail from "./ListingDetail";
import LoginPage from "./LoginPage";
import NavBar from "./NavBar";
import SignupPage from "./SignupPage";
import useLocalStorage from "./useLocalStorage";
import { UserProvider } from "./UserContext";

function App() {
  const [token, setToken] = useLocalStorage('token', null);
  Api.token = token;

  const { data } = useQuery(
    ['user', token],
    () => {
      console.log('fetching user');
      return jwtDecode(token) ? Api.getUser(jwtDecode(token).username) : null
    },
    {
      enabled: !!token,
      cacheTime: 1000 * 60 * 60, // 1 hour cache time
    }
  );
  console.log(data);
  const user = data ? data : null;

  return (
    <UserProvider token={token} user={user}>
    <div className="App">
        <NavBar setToken={setToken}/>
        <Routes>
          <Route exact path="/" element={<Home setToken={setToken}/>} />
          <Route path="/login" element={<LoginPage setToken={setToken}/>} />
          <Route path="/signup" element={<SignupPage setToken={setToken}/>} />
          <Route path="/create_listing" element={<CreateListing/>} />
          <Route path="/listings/:id" element={<ListingDetail/>} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    </div>
    </UserProvider>
  );
}

export default App;
