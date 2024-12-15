"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Listing = require("../models/listing");
const User = require("../models/user");
const Category = require("../models/category");
const Bidder = require("../models/bidder");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
    testListing
} = require("./_testCommon");

let listingId;

beforeAll(async () => {
    await commonBeforeAll();
    const listings = await Listing.getListingsByCreatedBy("u1");
    listingId = listings[0].id;
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('Bidders', () => {
    describe('POST /bidders/by-username/:username', () => {
        test('addBid using admin token', async () => {
            const res = await request(app)
                .post(`/bidders/u1/${listingId}`)
                .send({ bid: "500.00" })
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ bid: { id: res.body.bid.id, bidder: "u1", listing_id: listingId, bid: "500.00" } });
        });

        test('addBid using user token', async () => {
            const res = await request(app)
                .post(`/bidders/u1/${listingId}`)
                .send({ bid: "500.00" })
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ bid: { id: res.body.bid.id, bidder: "u1", listing_id: listingId, bid: "500.00" } });
        });

        test("unauth with no token", async () => {
            const res = await request(app)
                .post(`/bidders/u1/${listingId}`)
                .send({ bid: "500.00" });
            expect(res.statusCode).toEqual(401);
        });
    })
    
    describe('GET /bidders/by-username/:username', () => {
        test('getBidsByBidder with admin token', async () => {
            const res = await request(app)
                .get("/bidders/by-username/u1")
                .send()
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ bidders: [] });
        });

        test('getBidsByBidder with user token', async () => {
            const res = await request(app)
                .get("/bidders/by-username/u1")
                .send()
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ bidders: [] });
        })

        test("unauth with no token", async () => {
            const res = await request(app)
                .get("/bidders/by-username/u1");
            expect(res.statusCode).toEqual(401);
        });
    })
    
    describe('GET /bidders/by-listing-id/:listing_id', () => {
        test('getBidsByListingId with admin token', async () => {
            const res = await request(app)
                .get(`/bidders/by-listing-id/${listingId}`)
                .send()
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ bidders: [] });
        });

        test('getBidsByListingId with user token', async () => {
            const res = await request(app)
                .get(`/bidders/by-listing-id/${listingId}`)
                .send()
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ bidders: [] });
        });

        test("works with no token", async () => {
            const res = await request(app)
                .get(`/bidders/by-listing-id/${listingId}`);
            expect(res.statusCode).toEqual(200);
        });
    })
    
    describe('DELETE /bidders/:id', () => {
        test('removeBidder with admin token', async () => {
            const bid = await Bidder.addBid("u1", listingId, "500.00");
            const res = await request(app)
                .delete(`/bidders/u1/${bid.id}`)
                .send()
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ deleted_bid: { 
                id: bid.id, listing_id: listingId, bidder: "u1" } });
        });

        test('removeBidder with user token', async () => {
            const bid = await Bidder.addBid("u1", listingId, "500.00");
            const res = await request(app)
                .delete(`/bidders/u1/${bid.id}`)
                .send()
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ deleted_bid: { 
                id: bid.id, listing_id: listingId, bidder: "u1" } });
        });

        test("unauth with no token", async () => {
            const bid = await Bidder.addBid("u1", listingId, "500.00");
            const res = await request(app)
                .delete(`/bidders/u1/${bid.id}`);
            expect(res.statusCode).toEqual(401);
        });
    })
    
});