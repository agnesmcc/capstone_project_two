"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const User = require("./user.js");
const Listing = require("./listing.js");
const Category = require("./category.js");
const WatchedListing = require("./watchedListing.js");
const Bidder = require("./bidder.js");
const { LISTING_DURATION_SECONDS } = require("../config");

const testListing = {
    created_by: "testUser",
    title: "My Test Listing",
    description: "a nice couch",
    image: "couch.jpg",
    starting_bid: "500.00",
    category: "furniture"
};

beforeEach(async () => {
    await db.query("DELETE FROM bidders");
    await db.query("DELETE FROM watched_listings");
    await db.query("DELETE FROM listings");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM categories");

    await User.register({
        username: "testUser",
        firstName: "Test",
        lastName: "User",
        password: "testUser",
        email: "a@b.com"
    });
});

afterAll(async () => {
    await db.end();
});

describe("Listing", () => {
    test("works: no listings", async () => {
        const result = await Listing.getAllListings();
        expect(result).toEqual([]);
    });
    
    test("can add a listing", async () => {
        await Category.addCategory("furniture");
        let result = await Listing.addListing(testListing);
        result = await Listing.getAllListings();
        expect(result).toMatchObject([testListing]);
        const expectedSeconds = LISTING_DURATION_SECONDS;
        const actualSeconds = (result[0].end_datetime.getTime() - new Date().getTime()) / 1000;
        expect(actualSeconds).toBeCloseTo(expectedSeconds, 0);
    });

    test("can add a listing with a custom listing duration", async () => {
        await Category.addCategory("furniture");
        let result = await Listing.addListing(testListing, 60 * 1000);
        result = await Listing.getAllListings();
        expect(result).toMatchObject([testListing]);
        const expectedSeconds = 60 * 1000;
        const actualSeconds = (result[0].end_datetime.getTime() - new Date().getTime()) / 1000;
        expect(actualSeconds).toBeCloseTo(expectedSeconds, 0);
    });

    test("can get a listing", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        const result = await Listing.getListing(listing.id);
        expect(result).toMatchObject(testListing);
    });

    test("can delete a listing", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        await Listing.deleteListing("testUser", listing.id);
        const result = await Listing.getAllListings();
        expect(result).toEqual([]);
    });

    test("fails to delete a listing that doesn't exist", async () => {
        expect(async () => {
            await Listing.deleteListing(0);
        }).rejects.toThrow(NotFoundError);
    });

    test("can update a listing", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        const result = await Listing.updateListing("testUser", listing.id, {
            created_by: "testUser",
            title: "My Updated Test Listing",
            description: "a nice couch",
            image: "couch.jpg",
            starting_bid: "500.00",
            category: "furniture"
        });
        expect(result).toMatchObject({
            created_by: "testUser",
            title: "My Updated Test Listing",
            description: "a nice couch",
            image: "couch.jpg",
            starting_bid: "500.00",
            category: "furniture"
        });
    });

    test("fails to update a listing that doesn't exist", async () => {
        expect(async () => {
            await Listing.updateListing("testUser", 0, {
                created_by: "testUser",
                title: "My Updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                starting_bid: "500.00",
                category: "furniture"
            });
        }).rejects.toThrow(NotFoundError);
    });

    test("can get a listing by created_by", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        const result = await Listing.getListingsByCreatedBy(listing.created_by);
        expect(result).toMatchObject([testListing]);
    });

    test("can get watched listings by username", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        await WatchedListing.addWatchedListing("testUser", listing.id);
        const result = await Listing.getWatchedListingsByUsername("testUser");
        expect(result).toMatchObject([testListing]);
    });

    describe("determineWinner", () => {
        test("can determine a winner", async () => {
            await Category.addCategory("furniture");
            const listing = await Listing.addListing(testListing);
            await Bidder.addBid("testUser", listing.id, "100.00");
            const result = await Listing.determineWinner(listing.id);
            expect(result).toMatchObject(testListing);
            expect(result.winner).toBe("testUser");
            expect(result.ended).toBe(true);
        });

        test("the highest bidder is declared the winner", async () => {
            await User.register({
                username: "testUser2",
                firstName: "Test2",
                lastName: "User2",
                password: "testUser2",
                email: "a@b2.com"
            });
            await Category.addCategory("furniture");
            const listing = await Listing.addListing(testListing);
            await Bidder.addBid("testUser", listing.id, "100.00");
            await Bidder.addBid("testUser2", listing.id, "200.00");
            const result = await Listing.determineWinner(listing.id);
            expect(result).toMatchObject(testListing);
            expect(result.winner).toBe("testUser2");
            expect(result.ended).toBe(true);
        });

        test("works if two users bid the same amount", async () => {
            await User.register({
                username: "testUser2",
                firstName: "Test2",
                lastName: "User2",
                password: "testUser2",
                email: "a@b2.com"
            });
            await Category.addCategory("furniture");
            const listing = await Listing.addListing(testListing);
            await Bidder.addBid("testUser", listing.id, "100.00");
            await Bidder.addBid("testUser2", listing.id, "100.00");
            const result = await Listing.determineWinner(listing.id);
            expect(result).toMatchObject(testListing);
            expect(result.winner).toBe("testUser");
            expect(result.ended).toBe(true);
        });

        test("if there are no bids, the listing is still ended", async () => {
            await Category.addCategory("furniture");
            const listing = await Listing.addListing(testListing);
            const result = await Listing.determineWinner(listing.id);
            expect(result).toMatchObject(testListing);
            expect(result.winner).toBe(null);
            expect(result.ended).toBe(true);
        });
    });

    describe("getListingsWonByUser", () => {
        test("can get listings won by user", async () => {
            await Category.addCategory("furniture");
            const listing = await Listing.addListing(testListing);
            await Bidder.addBid("testUser", listing.id, "100.00");
            await Listing.determineWinner(listing.id);
            const result = await Listing.getListingsWonByUser("testUser");
            expect(result).toMatchObject([testListing]);
        });
    });

    describe("getListingsSoldByUser", () => {
        test("can get listings sold by user", async () => {
            await User.register({
                username: "testUser2",
                firstName: "Test2",
                lastName: "User2",
                password: "testUser2",
                email: "a@b2.com"
            });
            await Category.addCategory("furniture");
            const listing = await Listing.addListing(testListing);
            await Bidder.addBid("testUser2", listing.id, "100.00");
            await Listing.determineWinner(listing.id);
            const result = await Listing.getListingsSoldByUser("testUser");
            expect(result).toMatchObject([testListing]);
        });
    });
});