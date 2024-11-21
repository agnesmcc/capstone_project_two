import { Link } from "react-router-dom";

const Home = ({setToken}) => {
    return (
        <div>
            <h1>Home</h1>
            <div><Link to="/login">Login</Link></div>
            <div><Link to="/signup">Signup</Link></div>
            <div><Link to="/create_listing">Create Listing</Link></div>
            <div><Link onClick={() => setToken(null)} to="/">Logout</Link></div>
        </div>
    );
};

export default Home;
