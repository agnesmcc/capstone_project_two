"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Listing = require("../models/listing");
const User = require("../models/user");
const Category = require("../models/category");
const WatchedListing = require("../models/watchedListing");

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
        await db.query("DELETE FROM watched_listings");
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

    describe("POST /watchedListings", () => {
        test("works", async () => {
            const res = await request(app).post("/watched-listings").send({
                listing_id: listing.id,
                username: testUser.username
            });
            expect(res.body).toEqual({ watchedListing: { 
                listing_id: listing.id, username: testUser.username } });
        });
    });

    describe("GET /watchedListings/by-username/:username", () => {
        test("works", async () => {
            await request(app).post("/watched-listings").send({
                listing_id: listing.id,
                username: testUser.username
            });
            const res = await request(app).get("/watched-listings/by-username/testUser");
            expect(res.body).toEqual({ watchedListings: [{"listing_id": listing.id, "username": "testUser"}] });
        });
    });

    describe("GET /watchedListings/by-listing-id/:listing_id", () => {
        test("works", async () => {
            await request(app).post("/watched-listings").send({
                listing_id: listing.id,
                username: testUser.username
            });
            const res = await request(app).get(`/watched-listings/by-listing-id/${listing.id}`);
            expect(res.body).toEqual({ watchedListings: [{"listing_id": listing.id, "username": "testUser"}] });
        });
    });

    describe("DELETE /watchedListings", () => {
        test("works", async () => {
            const res = await request(app).delete("/watched-listings").send({
                listing_id: listing.id,
                username: testUser.username
            });
            expect(res.body).toEqual({ deleted: { 
                listing_id: listing.id, username: testUser.username } });
        });
    });
});