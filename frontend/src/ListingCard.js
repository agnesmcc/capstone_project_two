import React from "react";
import "./ListingCard.css";

const ListingCard = ({ listing }) => {
    console.log(listing);

    return (
        <div className="listing-card">
            <div className="card-body">
                <img src={listing.image} alt={listing.title} className="card-img-top" />
                <div className="card-title">{listing.title}</div>
                <div className="card-text"><b>${listing.starting_bid}</b></div>
                <div>or best offer</div>
            </div>
        </div>
    );
}

export default ListingCard
