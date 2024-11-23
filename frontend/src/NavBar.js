import {React, useContext} from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import "./NavBar.css";
import { UserContext } from "./UserContext";

const NavBar = ({setToken}) => {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="md">
            <NavLink to="/">eBid</NavLink>
            <Nav className="ml-auto" navbar>
                { user ?
                    <>
                    <NavItem>
                        <Link to="/create_listing">Create Listing</Link>
                    </NavItem>
  
                    <NavItem>
                        <Link onClick={() => setToken(null)} to="/">Logout</Link>
                    </NavItem>
                    </>
                :
                    <>
                    <NavItem>
                        <NavLink to="/login">Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/signup">Signup</NavLink>
                    </NavItem>
                    </>
                }
            </Nav>
        </Navbar>
    );
};

export default NavBar;
