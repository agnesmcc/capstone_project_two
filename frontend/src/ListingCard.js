import React from "react";
import "./ListingCard.css";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/listings/${listing.id}`);
    };

    return (
        <div className="listing-card">
            <div className="listing-card-body" onClick={handleClick}>
                <img src={listing.image} alt={listing.title} className="listing-card-img-top" />
                <div className="listing-card-title">{listing.title}</div>
                <div className="listing-card-starting-bid"><b>${listing.starting_bid}</b></div>
                <div>or Best Offer</div>
            </div>
        </div>
    );
}

export default ListingCard
