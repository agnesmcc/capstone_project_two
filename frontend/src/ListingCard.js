import React from "react";
import "./ListingCard.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import fetchListing from "./ListingHelper";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const ListingCard = ({ listing }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { data, error, isLoading } = useQuery(
        ['listing', listing.id], () => fetchListing(user, listing.id), {});

    const handleClick = () => {
        navigate(`/listings/${listing.id}`);
    };

    if (isLoading) return;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="listing-card">
            <div className="listing-card-body" onClick={handleClick}>
                <img src={data.image} alt={data.title} className="listing-card-img-top" />
                <div className="listing-card-title">{data.title}</div>
                <div>{data.currentBid ? `Current bid: $${data.currentBid}` : "No bids yet"}</div>
            </div>
        </div>
    );
}

export default ListingCard
