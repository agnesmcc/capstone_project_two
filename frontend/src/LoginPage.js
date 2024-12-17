import {React, useState} from "react";
import Api from "./Api";
import { useNavigate } from "react-router-dom";


/**
 * LoginPage component. Renders a login form. When the form is submitted,
 * sends the form data to the login API endpoint. If the login is successful,
 * sets the token in local storage and navigates to the root route.
 *
 * @param {function} setToken - function to set the token in local storage
 * @returns {JSX.Element} - a login form
 */
const LoginPage = ({setToken}) => {
    const initialFormState = {username: "", password: ""};
    const [formData, setFormData] = useState(initialFormState);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await Api.login(formData);
        setToken(token);
        navigate("/");
    }

    return (
        <>
        <h1 className="mb-3">Welcome back</h1>
        <form className="loginpage-form" onSubmit={handleSubmit}>
            <div className="form-group row mb-3">
                <label htmlFor="username" className="col-sm-3 col-form-label">Username</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="password" className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                /></div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
        </>
    );
};

export default LoginPage;
