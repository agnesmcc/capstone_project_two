"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Listing = require("../models/listing");
const User = require("../models/user");
const Category = require("../models/category");

const testListing = {
    created_by: "testUser",
    title: "My Test Listing",
    description: "a nice couch",
    image: "couch.jpg",
    starting_bid: "500.00",
    category: "furniture",
    end_datetime: "2022-01-01T00:00:00.000Z"
}

describe('Listing', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM listings");
        try {
            await Category.addCategory("furniture");
        } catch (err) {
            console.log(err);
        }
        try {
            await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
        } catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {
        await db.end();
    });

    describe("POST /listings", () => {
        test("works", async () => {
            const res = await request(app).post("/listings").send(testListing);
            console.log(res.body);
            expect(res.body).toMatchObject({ listing: testListing });
        });
    });

    describe("GET /listings", () => {
        test("works", async () => {
            await Listing.addListing(testListing);
            const res = await request(app).get("/listings");
            expect(res.body).toMatchObject({ listings: [testListing] });
        });
    });

    describe("DELETE /listings", () => {
        test("works", async () => {
            const listing = await Listing.addListing(testListing);
            const res = await request(app).delete("/listings").send({ id: listing.id });
            expect(res.body).toEqual({ deleted: listing.id });
            const result = await Listing.getAllListings();
            expect(result).toEqual([]);
        });
    });

    describe("PUT /listings", () => {
        test("works", async () => {
            const listing = await Listing.addListing(testListing);
            const res = await request(app).put("/listings").send({
                id: listing.id,
                created_by: "testUser",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
            });
            expect(res.body).toMatchObject({ listing: {
                created_by: "testUser",
                title: "My updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01T00:00:00.000Z"
            } });
        });
    });

    describe("GET /listings/created_by", () => {
        test("works", async () => {
            const listing = await Listing.addListing(testListing);
            const res = await request(app).get(`/listings/created_by/${listing.created_by}`);
            expect(res.body).toMatchObject({ listings: [testListing] });
        });
    });
});
