"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Listing = require("./listing.js");
const Category = require("./category.js");
const User = require("./user.js");
const WatchedListing = require("./watchedListing.js");

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
    await db.query("DELETE FROM watched_listings");    
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

describe("WatchedListing", () => {
    test("getWatchedListingsByUsername", async () => {
        const listing = await Listing.addListing(testListing);
        await WatchedListing.addWatchedListing("testUser", listing.id);
        const result = await WatchedListing.getWatchedListingsByUsername("testUser");
        expect(result).toEqual([{"listing_id": listing.id, "username": "testUser"}]);
    })

    test("getWatchedListingsByListingId", async () => {
        const listing = await Listing.addListing(testListing);
        await WatchedListing.addWatchedListing("testUser", listing.id);
        const result = await WatchedListing.getWatchedListingsByListingId(listing.id);
        expect(result).toEqual([{"listing_id": listing.id, "username": "testUser"}]);
    })

    test("addWatchedListing", async () => {
        const listing = await Listing.addListing(testListing);
        const result = await WatchedListing.addWatchedListing("testUser", listing.id);
        expect(result).toEqual({"listing_id": listing.id, "username": "testUser"});
    })

    test("removeWatchedListing", async () => {
        const listing = await Listing.addListing(testListing);
        await WatchedListing.addWatchedListing("testUser", listing.id);
        const result = await WatchedListing.removeWatchedListing("testUser", listing.id);
        expect(result).toEqual({"listing_id": listing.id, "username": "testUser"});
        const allListings = await WatchedListing.getWatchedListingsByUsername("testUser");
        expect(allListings).toEqual([]);
    })
})