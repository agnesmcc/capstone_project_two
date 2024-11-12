"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Listing = require("./listing.js");
const Category = require("./category.js");
const User = require("./user.js");
const Bidder = require("./bidder.js");

const testListing = {
    created_by: "testUser",
    title: "My Test Listing",
    description: "a nice couch",
    image: "couch.jpg",
    starting_bid: "500.00",
    category: "furniture",
    end_datetime: new Date('2022-01-01T05:00:00.000Z')
}

beforeEach(async () => {
    await db.query("DELETE FROM listings");
    await db.query("DELETE FROM categories");
    await db.query("DELETE FROM users");
    await Category.addCategory("furniture");
    await User.register({
        username: "testUser",
        firstName: "Test",
        lastName: "User",
        password: "testUser",
        email: "a@b.com"
    })
});

afterAll(async () => {
    await db.end();
});

describe('Bidder', () => {
    test("getBidsByListingId", async () => {
        const listing = await Listing.addListing(testListing);
        const result = await Bidder.getBidsByListingId(listing.id);
        expect(result).toEqual([]);
    });

    test("getBidsByBidder", async () => {
        const listing = await Listing.addListing(testListing);
        await Bidder.addBid("testUser", listing.id, "100.00");
        const result = await Bidder.getBidsByBidder("testUser");
        expect(result).toMatchObject([{"bidder": "testUser", "listing_id": listing.id, "bid": "100.00"}]);
    });

    test("addBidder fails with no bid", async () => {    
        const listing = await Listing.addListing(testListing);
        expect(async () => {
            await Bidder.addBid("testUser", listing.id, null)
        }).rejects.toThrow();
    });

    test("addBidder", async () => {
        const listing = await Listing.addListing(testListing);
        const result = await Bidder.addBid("testUser", listing.id, "100.00");
        expect(result).toEqual({id: result.id, "bidder": "testUser", "listing_id": listing.id, "bid": "100.00"});
    })

    test("removeBidder", async () => {
        const listing = await Listing.addListing(testListing);
        const bid = await Bidder.addBid("testUser", listing.id, "100.00");
        const result = await Bidder.removeBid(bid.id);
        expect(result).toEqual({id: bid.id, "bidder": "testUser", "listing_id": listing.id});
        const allBidders = await Bidder.getBidsByListingId(listing.id);
        expect(allBidders).toEqual([]);
    }) 
});
