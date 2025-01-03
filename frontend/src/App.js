import { jwtDecode } from "jwt-decode";
import { React } from "react";
import { useQuery } from "react-query";
import { Route, Routes } from 'react-router-dom';
import Api from "./Api";
import CreateListing from "./CreateListing";
import Home from './Home';
import ListingDetail from "./ListingDetail";
import LoginPage from "./LoginPage";
import NavigationBar from "./NavigationBar";
import SignupPage from "./SignupPage";
import useLocalStorage from "./useLocalStorage";
import { UserProvider } from "./UserContext";
import UserDashboard from "./UserDashboard";
import EditProfile from "./EditProfile";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [token, setToken] = useLocalStorage('token', null);
  Api.token = token;

  // If a token is provided fetch information about the user
  const { data, isLoading, refetch } = useQuery(
    ['user', token],
    () => {
      console.log('fetching user');
      return jwtDecode(token) ? Api.getUser(jwtDecode(token).username) : null
    },
    {
      enabled: !!token,
      cacheTime: 1000 * 60 * 60, // 1 hour cache time,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
  
  if (isLoading) return <div>Loading...</div>;
  
  console.log(data);
  const user = data ? data : null;

  return (
    // Update the UserProvider with information about the user
    <UserProvider token={token} user={user}>
    <div>
        <NavigationBar setToken={setToken}/>
        <Routes>
          <Route exact path="/" element={<Home setToken={setToken}/>} />
          <Route path="/login" element={<LoginPage setToken={setToken}/>} />
          <Route path="/signup" element={<SignupPage setToken={setToken}/>} />
          <Route path="/edit_profile" element={<EditProfile updateUser={refetch}/>} />
          <Route path="/create_listing" element={<CreateListing/>} />
          <Route path="/listings/:id" element={<ListingDetail/>} />
          <Route path="/user_dashboard" element={<UserDashboard/>} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    </div>
    </UserProvider>
  );
}

export default App;
