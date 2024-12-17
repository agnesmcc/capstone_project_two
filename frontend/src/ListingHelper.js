import Api from "./Api";

/**
 * Fetch a listing by id. If a user is provided, it also fetches
 * whether the user is watching the listing and the bids for the
 * listing, and adds those to the returned object.
 * @param {object} user - The user object, or null if not logged in
 * @param {string} id - The id of the listing to fetch
 * @return {object} The listing object, with the following additional
 * properties:
 * - isWatching: whether the user is watching the listing
 * - bids: an array of bids for the listing
 * - currentBid: the highest bid for the listing, or undefined if there
 * are no bids
 */
const fetchListing = async (user, id) => {
    console.log('fetching listing details');
    let res = await Api.getListing(id);
    console.log(res);
    if (user && user.username) {
        let watchResult = await Api.isWatching(user.username, id);
        console.log(res);
        res.isWatching = watchResult.isWatching;
    }
    let bids = await Api.getBidsForListing(id);
    console.log(res);
    res.bids = bids;
    if (res.bids.length > 0) {
        res.currentBid = Math.max(...res.bids.map(bid => parseFloat(bid.bid)));
    }    
    return res;
};

export default fetchListing
