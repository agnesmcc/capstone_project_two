import {React, useState, useEffect} from "react";
import Api from "./Api";
import ListingCard from "./ListingCard";
import "./Listings.css";

    /**
     * Renders a list of listings.
     * 
     * Fetches the list of listings from the server on mount.
     * 
     * @returns {JSX.Element}
     */
const Listings = () => {
    const [listings, setListings] = useState([]);

    // Gets all active listings
    const fetchListings = async () => {
        let res = await Api.getListings();
        setListings(res.listings);
    }

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        <div>
            <div className="listings">
            {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
            </div>
        </div>
    )   
}

export default Listings
