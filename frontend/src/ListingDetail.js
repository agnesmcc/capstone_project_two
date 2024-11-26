import { React, useContext } from "react";
import { useParams } from "react-router-dom";
import Api from "./Api";
import { useQuery } from "react-query";
import "./ListingDetail.css";
import { UserContext } from "./UserContext";

const fetchListing = async (id) => {
    console.log('fetching listing details');
    let res = await Api.getListing(id);
    console.log(res);
    return res;
};

const ListingDetail = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const { data, error, isLoading } = useQuery(
        ['listing', id], () => fetchListing(id), {staleTime: 5000});

    const watchListing = async (id) => {
        console.log('watching listing');
        let res = await Api.watchListing(user.username, id);
        console.log(res);
        return res;
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="listing-detail">
            <div className="listing-detail-body">
                <img src={data.image} alt={data.title} className="listing-detail-img" />
                <div className="listing-detail-data">
                    <div className="listing-detail-title">{data.title}</div>
                    <hr></hr>                
                    <div className="listing-detail-starting-bid"><b>${data.starting_bid}</b></div>
                    <div>or Best Offer</div>
                </div>
            </div>
            <div className="listing-detail-description"><b>Item description from the seller</b></div>
            <div className="listing-detail-description">{data.description}</div>
            <button onClick={() => watchListing(data.id)}>Watch</button>
        </div>
    );
}

export default ListingDetail
