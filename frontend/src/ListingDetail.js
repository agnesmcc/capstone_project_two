import { React, useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Api from "./Api";
import "./ListingDetail.css";
import { UserContext } from "./UserContext";
import ListingDetailBidForm from "./ListingDetailBidForm";
import fetchListing from "./ListingHelper";
import ListingCountdown from "./ListingCountdown";

/**
 * A component that displays a listing detail page, including the title, image,
 * and description of the listing, as well as the current bid, number of bids,
 * and buttons to watch/unwatch the listing. If the user is logged in and the
 * listing has not ended, it also displays a countdown and a form to place a
 * bid.
 */
const ListingDetail = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const { data, error, isLoading, refetch } = useQuery(
        ['listing', id], () => fetchListing(user, id), {});

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
                    <h5 className="listing-detail-title">{data.title}</h5>
                    <hr></hr>
                    <div><b>Seller:</b> {data.created_by}</div>
                    <div>{data.currentBid ? `Current bid: $${data.currentBid}` : "No bids yet"}</div>
                    <div>{data.bids ? data.bids.length : 0} bids</div>
                    {user && !data.isWatching ?
                        <button className="btn btn-primary" onClick={() => watchListing(data.id)}>Watch</button>
                    :
                        user && <button className="btn btn-secondary" onClick={() => stopWatchingListing(data.id)}>Unwatch</button>
                    }
                    <ListingCountdown end_datetime={data.end_datetime} updateListing={refetch} />
                    {user && !data.ended && <ListingDetailBidForm listingId={data.id} updateListing={refetch} />}
                </div>
            </div>
            <div className="listing-detail-description"><b>Item description from the seller</b></div>
            <div className="listing-detail-description">{data.description}</div>
        </div>
    );
}

export default ListingDetail
