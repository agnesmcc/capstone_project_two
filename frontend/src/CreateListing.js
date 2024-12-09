import {React, useState} from "react";
import Api from "./Api";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const initialFormState = {
        title: "", 
        description: "",
        image: "",
        starting_bid: "",
        category: "",
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
        await Api.createListing(formData);
        navigate("/");
    }

    return (
        <>
        <h3 className="mb-3">Let's list your item.</h3>
        <form className="loginpage-form" onSubmit={handleSubmit}>
            <div className="form-group row mb-3">
                <label htmlFor="title" className="col-sm-3 col-form-label">Title</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="description" className="col-sm-3 col-form-label">Description</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="image" className="col-sm-3 col-form-label">Image</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="starting_bid" className="col-sm-3 col-form-label">Starting Bid</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="starting_bid"
                    value={formData.starting_bid}
                    onChange={handleChange}
                /></div>
            </div>
            <div className="form-group row mb-3">
                <label htmlFor="category" className="col-sm-3 col-form-label">Category</label>
                <div className="col-sm-8"><input
                    className="form-control"
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                /></div>
            </div>
            
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </>
    );
};

export default CreateListing
