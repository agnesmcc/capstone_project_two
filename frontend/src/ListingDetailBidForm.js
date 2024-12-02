import { useState, useContext } from "react";
import Api from "./Api";
import { UserContext } from "./UserContext";

const ListingDetailBidForm = ({ listingId, updateListing }) => {
    const { user } = useContext(UserContext);
    const initialFormState = {
        bid: "",
    }

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting bid', formData);
        await Api.addBid(user.username, listingId, formData.bid);
        setFormData(initialFormState);
        updateListing();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="input-group col-sm-6">
                    <input type="text" className="form-control" 
                        onChange={handleChange} 
                        name="bid" 
                        placeholder="Bid Amount" 
                        value={formData.bid} />
                    <span className="input-group-btn">
                        <button type="submit" className="btn btn-primary">Bid</button>
                    </span>
                </div>
            </form>
        </div>
    );
}

export default ListingDetailBidForm
