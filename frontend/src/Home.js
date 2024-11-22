import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Listings from "./Listings";

const Home = ({setToken}) => {
    const { user } = useContext(UserContext);
    console.log(user);

    return (
        <div>
            { !user ? <>
                <div><Link to="/login">Login</Link></div>
                <div><Link to="/signup">Signup</Link></div>
            </> : <>
                <div><Link to="/create_listing">Create Listing</Link></div>
                <div><Link onClick={() => setToken(null)} to="/">Logout</Link></div>
            </>}
            <Listings />
        </div>
    );
};

export default Home;
