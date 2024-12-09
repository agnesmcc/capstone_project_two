"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError.js");
const User = require("./user.js");
const WatchedListing = require("./watchedListing.js");
const Listing = require("./listing.js");
const Category = require("./category.js");
const Bidder = require("./bidder.js");

beforeEach(async () => {
    await db.query("DELETE FROM bidders");
    await db.query("DELETE FROM watched_listings");    
    await db.query("DELETE FROM listings");
    await db.query("DELETE FROM categories");
    await db.query("DELETE FROM users");
    await Category.addCategory("furniture");
});

afterAll(async () => {
    await db.end();
});

describe("User", () => {
    test("works: no users", async () => {
        const result = await User.getAllUsers();
        expect(result).toEqual([]);
    });

    test("can register a user", async () => {
        const result = await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        expect(result).toEqual({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            email: "test@test"
        });
    });

    test("can authenticate a user", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test",
            isAdmin: false
        });
        const result = await User.authenticate("testUser", "p@ssword");
        expect(result).toEqual({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            email: "test@test",
            isAdmin: false
        });
    });

    test("fails to authenticate a user with wrong password", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        expect(async () => {
            await User.authenticate("testUser", "wrongPassword");
        }).rejects.toThrow(UnauthorizedError);
    });

    test("fails to authenticate a user that doesn't exist", async () => {
        expect(async () => {
            await User.authenticate("testUser", "p@ssword");
        }).rejects.toThrow(UnauthorizedError);
    });

    test("can delete a user", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        await User.delete("testUser");
        const result = await User.getAllUsers();
        expect(result).toEqual([]);
    });

    test("fails to delete a user that doesn't exist", async () => {
        expect(async () => {
            await User.delete("testUser");
        }).rejects.toThrow(NotFoundError);
    });

    test("can get a user", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        const result = await User.getUser("testUser");
        expect(result).toEqual({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            email: "test@test"
        });
    });

    test("isWatching", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        const result = await User.isWatching("testUser", 1);
        expect(result).toEqual(false);
    })

    test("isWatching returns true", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        const listing = await Listing.addListing({ 
            title: "testListing", 
            description: "testDescription", 
            image: "testImage",
            category: "furniture",
            created_by: "testUser",
            end_datetime: new Date()
        });
        await WatchedListing.addWatchedListing("testUser", listing.id);
        const result = await User.isWatching("testUser", listing.id);
        expect(result).toEqual(true);
    })

    test("isBiddingOn", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        const listing = await Listing.addListing({ 
            title: "testListing", 
            description: "testDescription", 
            image: "testImage",
            category: "furniture",
            created_by: "testUser",
            end_datetime: new Date()
        });
        await Bidder.addBid("testUser", listing.id, 100);
        const result = await User.isBiddingOn("testUser");
        expect(result[0].id).toEqual(listing.id);
    })
})