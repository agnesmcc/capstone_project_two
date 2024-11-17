"use strict";

const request = require("supertest");
const app = require("../app");
const Listing = require("../models/listing");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken
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

async function postTestWatchedListing() {
    const res = await request(app).post("/watched-listings/by-username/u1").send({
        listing_id: listingId
    }).set({ Authorization: `Bearer ${adminToken}` });
    return res
}

describe('WatchedListings', () => {
    describe("POST /watched-listings/by-username/:username", () => {
        test("works with admin token", async () => {
            const res = await postTestWatchedListing();
            expect(res.body).toEqual({ watchedListing: { 
                listing_id: listingId, username: "u1" } });
        });

        test("works with matching user token", async () => {
            const res = await postTestWatchedListing();
            expect(res.body).toEqual({ watchedListing: { 
                listing_id: listingId, username: "u1" } });
        });

        test("unauth with no token", async () => {
            const res = await request(app).post("/watched-listings/by-username/u1").send({
                listing_id: listingId
            });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /watched-listings/by-username/:username", () => {
        test("works with admin token", async () => {
            await postTestWatchedListing();
            const res = await request(app)
                .get("/watched-listings/by-username/u1")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({ watchedListings: [{
                "listing_id": listingId, "username": "u1" }] });
        });

        test("works with matching user token", async () => {
            await postTestWatchedListing();
            const res = await request(app)
                .get("/watched-listings/by-username/u1")
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toEqual({ watchedListings: [{
                "listing_id": listingId, "username": "u1" }] });
        })

        test("unauth with no token", async () => {
            const res = await request(app).get("/watched-listings/by-username/u1");
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("DELETE /watched-listings/by-username/:username", () => {
        test("works with admin token", async () => {
            await postTestWatchedListing();
            const res = await request(app).delete("/watched-listings/by-username/u1")
                .send({ listing_id: listingId })
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({ deleted: { 
                "listing_id": listingId, "username": "u1" } });
        });

        test("works with matching user token", async () => {
            await postTestWatchedListing();
            const res = await request(app).delete("/watched-listings/by-username/u1")
                .send({ listing_id: listingId })
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toEqual({ deleted: { 
                "listing_id": listingId, "username": "u1" } });
        });

        test("unauth with no token", async () => {
            const res = await request(app).delete("/watched-listings/by-username/u1")
                .send({ listing_id: listingId });
            expect(res.statusCode).toEqual(401);
        });
    });
});