import { React, useState, useContext } from "react";
import Api from "./Api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const SignupPage = ({updateUser}) => {
    const { user } = useContext(UserContext);
    const initialFormState = {
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
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
        await Api.updateProfile(user.username, formData);
        await Api.changePassword(user.username, {password: formData.password});
        updateUser();
        navigate("/");
    }

    return (
        <>
        <h1 className="mb-3">Update your profile</h1>
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
            <div><b>Enter a new password:</b></div>
            <div className="form-group row mb-3">
                <label htmlFor="password" className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-8"><input
                    required
                    className="form-control"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                /></div>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
        </form>
        </>
    );
};

export default SignupPage;
