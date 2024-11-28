import { React, useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Api from "./Api";
import "./ListingDetail.css";
import { UserContext } from "./UserContext";
import ListingDetailBidForm from "./ListingDetailBidForm";

const fetchListing = async (user, id) => {
    console.log('fetching listing details');
    let res = await Api.getListing(id);
    console.log(res);
    let watchResult = await Api.isWatching(user.username, id);
    console.log(res);
    res.isWatching = watchResult.isWatching;
    let bids = await Api.getBidsForListing(id);
    res.bids = bids;
    return res;
};

const ListingDetail = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const { data, error, isLoading, refetch } = useQuery(
        ['listing', id], () => fetchListing(user, id), {
            enabled: !!user?.username
        }
    );

    const watchListing = async (id) => {
        console.log('watching listing');
        let res = await Api.watchListing(user.username, id);
        console.log(res);
        refetch();
    }

    const stopWatchingListing = async (id) => {
        console.log('stopping watching listing');
        let res = await Api.unwatchListing(user.username, id);
        console.log(res);
        refetch();
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
                    <div>{data.bids ? data.bids.length : 0} bids</div>
                </div>
            </div>
            <div className="listing-detail-description"><b>Item description from the seller</b></div>
            <div className="listing-detail-description">{data.description}</div>
            {!data.isWatching ? 
                <button onClick={() => watchListing(data.id)}>Watch</button>
            : 
                <button onClick={() => stopWatchingListing(data.id)}>Unwatch</button>
            }
            <ListingDetailBidForm listingId={data.id} updateListing={refetch} />
        </div>
    );
}

export default ListingDetail
