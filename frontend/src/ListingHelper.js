import Api from "./Api";

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
