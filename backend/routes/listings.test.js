"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Listing = require("../models/listing");
const User = require("../models/user");
const Category = require("../models/category");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
    testListing
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('Listing', () => {
    describe("POST /listings", () => {
        test("works with admin token", async () => {
            const res = await request(app).post("/listings")
                .send(testListing)
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toMatchObject({ listing: testListing });
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
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
            }).set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toMatchObject({ listing: {
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
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
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
            }).set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toMatchObject({ listing: {
                created_by: "u1",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
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
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
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
});
