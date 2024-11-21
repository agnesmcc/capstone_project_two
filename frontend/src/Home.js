import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const Home = ({setToken}) => {
    const { user } = useContext(UserContext);
    console.log(user);

    return (
        <div>
            <h1>Home</h1>
            { !user ? <>
                <div><Link to="/login">Login</Link></div>
                <div><Link to="/signup">Signup</Link></div>
            </> : <>
                <div><Link to="/create_listing">Create Listing</Link></div>
                <div><Link onClick={() => setToken(null)} to="/">Logout</Link></div>
            </>}
        </div>
    );
};

export default Home;
