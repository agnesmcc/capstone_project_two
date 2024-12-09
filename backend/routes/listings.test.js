"use strict";

const request = require("supertest");

const app = require("../app");
const Listing = require("../models/listing");
const Bidder = require("../models/bidder");
const WatchedListing = require("../models/watchedListing");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
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

describe('Listing', () => {
    describe("POST /listings", () => {
        test("works with admin token", async () => {
            const res = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${adminToken}` });
            let adminListing = {...testListing};
            adminListing.created_by = "admin";
            expect(res.body).toMatchObject({ listing: adminListing });
        });

        test("works with user token", async () => {
            const res = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listing: testListing });
        });

        test("unauth with no token", async () => {
            const res = await request(app).post("/listings").send(testListing);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /listings", () => {
        test("works with admin token", async () => {
            const res = await request(app)
                .get("/listings")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toMatchObject({ listings: [testListing] });
        });

        test("works with user token", async () => {
            const res = await request(app)
                .get("/listings")
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listings: [testListing] });
        });

        test("works when not logged in", async () => {
            const res = await request(app)
                .get("/listings");
            expect(res.body).toMatchObject({ listings: [testListing] });
        });
    });

    describe("DELETE /listings", () => {
        test("works with admin token", async () => {
            const newListing = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            const newListingId = newListing.body.listing.id;
            const res = await request(app).delete("/listings/u1")
                .send({ id: newListingId })
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({ deleted: newListingId });
            const result = await Listing.getAllListings();
            expect(result.length).toEqual(1); // one created by commonBeforeAll
        });

        test("works with matching user token", async () => {
            const newListing = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            const newListingId = newListing.body.listing.id;
            const res = await request(app).delete("/listings/u1")
                .send({ id: newListingId })
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toEqual({ deleted: newListingId });
            const result = await Listing.getAllListings();
            expect(result.length).toEqual(1); // one created by commonBeforeAll
        });

        test("unauth with no token", async () => {
            const newListing = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            const newListingId = newListing.body.listing.id;
            const res = await request(app).delete("/listings/u1")
                .send({ id: newListingId });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("PUT /listings", () => {
        test("works with admin token", async () => {
            const newListing = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            const newListingId = newListing.body.listing.id;
            const res = await request(app).put("/listings/u1").send({
                id: newListingId,
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                category: "furniture"
            }).set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toMatchObject({ listing: {
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                category: "furniture"
            } });
        });

        test("works with matching user token", async () => {
            const newListing = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            const newListingId = newListing.body.listing.id;
            const res = await request(app).put("/listings/u1").send({
                id: newListingId,
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                category: "furniture"
            }).set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listing: {
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                category: "furniture"
            } });
        })

        test("unauth with no token", async () => {
            const newListing = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${u1Token}` });
            const newListingId = newListing.body.listing.id;
            const res = await request(app).put("/listings/u1").send({
                id: newListingId,
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                category: "furniture"
            });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /listings/created_by/:username", () => {
        test("works when logged in", async () => {
            const res = await request(app)
                .get(`/listings/created_by/u1`)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listings: [testListing] });
        });

        test("works when not logged in", async () => {
            const res = await request(app)
                .get(`/listings/created_by/u1`);
            expect(res.body).toMatchObject({ listings: [testListing] });
        });
    });

    describe("GET /listings/:id", () => {
        test("works when logged in", async () => {
            const res = await request(app)
                .get(`/listings/${listingId}`)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listing: testListing });
        });

        test("works when not logged in", async () => {
            const res = await request(app)
                .get(`/listings/${listingId}`);
            expect(res.body).toMatchObject({ listing: testListing });
        });
    });

    describe("GET /listings/watched_by/:username", () => {
        test("works when logged in as matching user", async () => {
            await WatchedListing.addWatchedListing("u1", listingId);
            const res = await request(app)
                .get(`/listings/watched_by/u1`)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listings: [testListing] });
        });

        test("does not work when logged in as non-matching user", async () => {
            const res = await request(app)
                .get(`/listings/watched_by/u1`)
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        });

        test("does not work when not logged in", async () => {
            const res = await request(app)
                .get(`/listings/watched_by/u1`);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /won_by/:username", () => {
        test("works when logged in as matching user", async () => {
            await Bidder.addBid("u1", listingId, "100.00");
            await Listing.determineWinner(listingId);
            const res = await request(app)
                .get(`/listings/won_by/u1`)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listings: [testListing] });
        });

        test("does not work when logged in as non-matching user", async () => {
            const res = await request(app)
                .get(`/listings/won_by/u1`)
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /sold_by/:username", () => {
        test("works when logged in as matching user", async () => {
            await Bidder.addBid("u2", listingId, "100.00");
            await Listing.determineWinner(listingId);
            const res = await request(app)
                .get(`/listings/sold_by/u1`)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listings: [testListing] });
        });

        test("does not work when logged in as non-matching user", async () => {
            const res = await request(app)
                .get(`/listings/sold_by/u1`)
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        });
    });
});
