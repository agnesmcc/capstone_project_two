import {React, useState} from "react";
import Api from "./Api";
import { useNavigate } from "react-router-dom";

/**
 * SignupPage is a component that renders a form to create a new user. When the form is
 * submitted, sends the form data to the register API endpoint. If the registration is
 * successful, sets the token in local storage and navigates to the root route.
 * 
 * @param {function} setToken - a function to set the token in local storage
 * @returns {JSX.Element} - a form to create a new user
 */
const SignupPage = ({setToken}) => {
    const initialFormState = {
        username: "", 
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    };
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
        const token = await Api.register(formData);
        setToken(token);
        navigate("/");
    }

    return (
        <>
        <h1 className="mb-3">Create an account!</h1>
        <form className="signuppage-form" onSubmit={handleSubmit}>
            <div className="form-group row mb-3">
                <label htmlFor="firstName" className="col-sm-3 col-form-label">First Name</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="lastName" className="col-sm-3 col-form-label">Last Name</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                /></div>
            </div>
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
            <button type="submit" className="btn btn-primary">Sign up</button>
        </form>
        </>
    );
};

export default SignupPage;
