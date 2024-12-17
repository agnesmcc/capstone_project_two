import {React, useContext} from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
// import "./NavigationBar.css";
import { UserContext } from "./UserContext";

/**
 * NavigationBar is a component that renders a navigation bar at the top of the page.
 * The content of the bar depends on whether the user is logged in or not.
 * If the user is logged in, there are links to create a listing, see their dashboard, edit their profile, and logout.
 * If the user is not logged in, there are links to login and signup.
 * @param {function} setToken - a function to set the token in the UserContext
 * @returns {React.ReactElement} - A React element representing the navigation bar
 */
const NavigationBar = ({setToken}) => {
    const { user } = useContext(UserContext);

    return (
        <div>
        <Navbar>
        <NavLink to="/" replace>
            <NavbarBrand>eBid</NavbarBrand>
        </NavLink>
            <Nav>
            { user ?
                <>
                <NavItem><NavLink className="nav-link" to="/create_listing">Create Listing</NavLink></NavItem>
                <NavItem><NavLink className="nav-link" to="/user_dashboard">My Dashboard</NavLink></NavItem>
                <NavItem><NavLink className="nav-link" to="/edit_profile">Edit Profile</NavLink></NavItem>
                <NavItem><NavLink className="nav-link" onClick={() => setToken(null)} to="/">Logout</NavLink></NavItem>
                </>
            :
                <>
                <NavItem><NavLink className="nav-link" to="/login">Login</NavLink></NavItem>
                <NavItem><NavLink className="nav-link" to="/signup">Signup</NavLink></NavItem>
                </>
            }
            </Nav>
        </Navbar>
        </div>
    );
};

export default NavigationBar;
