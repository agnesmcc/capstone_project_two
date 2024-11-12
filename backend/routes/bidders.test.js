"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Listing = require("../models/listing");
const User = require("../models/user");
const Category = require("../models/category");
const Bidder = require("../models/bidder");

const testListing = {
    created_by: "testUser",
    title: "My Test Listing",
    description: "a nice couch",
    image: "couch.jpg",
    starting_bid: "500.00",
    category: "furniture",
    end_datetime: "2022-01-01T00:00:00.000Z"
}

let testUser
let listing

describe('WatchedListings', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM bidders");
        try {
            await Category.addCategory("furniture");
        } catch (err) {
            console.log(err);
        }
        try {
            testUser = await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
        } catch (err) {
            testUser = await User.getUser("testUser");
            console.log(testUser);
            console.log(err);
        }
        listing = await Listing.addListing(testListing);
        console.log(listing);
    });

    afterAll(async () => {
        await db.end();
    });

    test('addBid', async () => {
        const res = await request(app)
            .post("/bidders")
            .send({
                username: "testUser",
                listing_id: listing.id,
                bid: "500.00"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ bid: { id: res.body.bid.id, bidder: "testUser", listing_id: listing.id, bid: "500.00" } });
    });

    test('getBidsByBidder', async () => {
        const res = await request(app)
            .get("/bidders/by-username/testUser")
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ bidders: [] });
    });

    test('getBidsByListingId', async () => {
        const res = await request(app)
            .get(`/bidders/by-listing-id/${listing.id}`)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ bidders: [] });
    });

    test('removeBidder', async () => {
        const bid = await Bidder.addBid("testUser", listing.id, "500.00");
        console.log(bid);
        const res = await request(app)
            .delete(`/bidders/${bid.id}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ deleted_bid: { 
            id: bid.id, listing_id: listing.id, bidder: testUser.username } });
    });
});