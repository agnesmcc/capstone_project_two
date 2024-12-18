import {React, useState, useEffect} from "react";
import Api from "./Api";
import { useNavigate } from "react-router-dom";

/**
 * Renders a form to create a new listing. The form includes fields for title,
 * description, image, and category. When the form is submitted, sends the form
 * data to the create listing API endpoint. If the listing is successfully
 * created, navigates to the root route.
 *
 * @returns {JSX.Element} - a form to create a new listing
 */
const CreateListing = () => {
    const initialFormState = {
        title: "", 
        description: "",
        image: "",
        category: "",
    };
    const [formData, setFormData] = useState(initialFormState);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await Api.getCategories();
            setCategories(res.categories);
        };
        fetchCategories();
    }, []);

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
        <h1 className="mb-3">Let's list your item.</h1>
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
                <label htmlFor="category" className="col-sm-3 col-form-label">Category</label>
                <div className="col-sm-8">
                    <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.title} value={category.title}>{category.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </>
    );
};

export default CreateListing
