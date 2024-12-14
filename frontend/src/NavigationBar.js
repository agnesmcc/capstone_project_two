import {React, useContext} from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
// import "./NavigationBar.css";
import { UserContext } from "./UserContext";

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
